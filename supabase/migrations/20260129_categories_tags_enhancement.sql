-- ============================================================================
-- CATEGORIES AND TAGS ENHANCEMENT MIGRATION
-- Adds support for hierarchical categories and tags system
-- Date: 2026-01-29
-- ============================================================================

-- ============================================================================
-- ENHANCE CATEGORIES TABLE (Add hierarchical support)
-- ============================================================================

-- Add parent_id column if it doesn't exist (for self-referencing foreign key)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'parent_id'
  ) THEN
    -- First add the column
    ALTER TABLE categories ADD COLUMN parent_id UUID;
    
    -- Then add the foreign key constraint
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_name = 'categories' 
      AND constraint_name = 'categories_parent_id_fkey'
    ) THEN
      ALTER TABLE categories
        ADD CONSTRAINT categories_parent_id_fkey 
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Add other columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'level'
  ) THEN
    ALTER TABLE categories ADD COLUMN level INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'order_index'
  ) THEN
    ALTER TABLE categories ADD COLUMN order_index INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE categories ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE categories ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create indexes
DO $$ 
BEGIN
  -- Index on parent_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'parent_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'categories' AND indexname = 'idx_categories_parent_id'
  ) THEN
    CREATE INDEX idx_categories_parent_id ON categories(parent_id);
  END IF;
  
  -- Index on level
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'level'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'categories' AND indexname = 'idx_categories_level'
  ) THEN
    CREATE INDEX idx_categories_level ON categories(level);
  END IF;
END $$;

-- ============================================================================
-- TAGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for tags
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);

-- ============================================================================
-- CONTENT_TAGS JUNCTION TABLE
-- Links content (articles/content_drafts) to tags
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, tag_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag_id ON content_tags(tag_id);

-- ============================================================================
-- ADD category_id TO ARTICLES/CONTENT_DRAFTS (if exists)
-- ============================================================================

DO $$ 
BEGIN
  -- Check if articles table exists and add category_id
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'articles'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'articles' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
  END IF;
  
  -- Check if content_drafts table exists and add category_id
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'content_drafts'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'content_drafts' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE content_drafts ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_content_drafts_category_id ON content_drafts(category_id);
  END IF;
END $$;

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tag usage count
DROP TRIGGER IF EXISTS trigger_update_tag_usage_count ON content_tags;
CREATE TRIGGER trigger_update_tag_usage_count
  AFTER INSERT OR DELETE ON content_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Function to update category level based on parent
CREATE OR REPLACE FUNCTION update_category_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.level := 0;
  ELSE
    SELECT level + 1 INTO NEW.level
    FROM categories
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for category level
DROP TRIGGER IF EXISTS trigger_update_category_level ON categories;
CREATE TRIGGER trigger_update_category_level
  BEFORE INSERT OR UPDATE OF parent_id ON categories
  FOR EACH ROW EXECUTE FUNCTION update_category_level();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_tags_updated_at ON tags;
CREATE TRIGGER trigger_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES (Basic - can be enhanced later)
-- ============================================================================

-- Enable RLS on tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read tags
DROP POLICY IF EXISTS "Tags are viewable by authenticated users" ON tags;
CREATE POLICY "Tags are viewable by authenticated users"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to manage tags
DROP POLICY IF EXISTS "Tags are manageable by authenticated users" ON tags;
CREATE POLICY "Tags are manageable by authenticated users"
  ON tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Enable RLS on content_tags
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage content_tags
DROP POLICY IF EXISTS "Content tags are manageable by authenticated users" ON content_tags;
CREATE POLICY "Content tags are manageable by authenticated users"
  ON content_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE categories IS 'Hierarchical categories for content organization';
COMMENT ON TABLE tags IS 'Tags for flexible content labeling';
COMMENT ON TABLE content_tags IS 'Junction table linking content to tags';
COMMENT ON COLUMN categories.parent_id IS 'Parent category for hierarchical structure';
COMMENT ON COLUMN categories.level IS 'Depth level in category hierarchy (0 = root)';
COMMENT ON COLUMN tags.usage_count IS 'Number of times this tag is used';
