-- ============================================================================
-- SECURITY CONSTRAINTS MIGRATION
-- Adds unique constraints, check constraints, and database-level validations
-- Date: 2026-01-29
-- ============================================================================

-- ============================================================================
-- UNIQUE CONSTRAINTS
-- ============================================================================

-- Ensure unique slugs for categories (if not already enforced)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'categories_slug_key' 
    AND conrelid = 'categories'::regclass
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'categories'
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Ensure unique slugs for tags (if not already enforced)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tags_slug_key' 
    AND conrelid = 'tags'::regclass
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tags'
  ) THEN
    ALTER TABLE tags ADD CONSTRAINT tags_slug_key UNIQUE (slug);
  END IF;
END $$;

-- ============================================================================
-- CHECK CONSTRAINTS
-- ============================================================================

-- Category level must be non-negative
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'level'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'categories_level_check' 
    AND conrelid = 'categories'::regclass
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT categories_level_check 
      CHECK (level >= 0);
  END IF;
END $$;

-- Tag usage count must be non-negative
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tags' 
    AND column_name = 'usage_count'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tags_usage_count_check' 
    AND conrelid = 'tags'::regclass
  ) THEN
    ALTER TABLE tags ADD CONSTRAINT tags_usage_count_check 
      CHECK (usage_count >= 0);
  END IF;
END $$;

-- ============================================================================
-- NOT NULL CONSTRAINTS
-- ============================================================================

-- Ensure category name and slug are NOT NULL
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'categories'
  ) THEN
    -- Check if name can be null, then alter
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'categories' 
      AND column_name = 'name' 
      AND is_nullable = 'YES'
    ) THEN
      ALTER TABLE categories ALTER COLUMN name SET NOT NULL;
    END IF;
    
    -- Check if slug can be null, then alter
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'categories' 
      AND column_name = 'slug' 
      AND is_nullable = 'YES'
    ) THEN
      ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
    END IF;
  END IF;
END $$;

-- Ensure tag name and slug are NOT NULL
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tags'
  ) THEN
    -- Check if name can be null, then alter
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'tags' 
      AND column_name = 'name' 
      AND is_nullable = 'YES'
    ) THEN
      ALTER TABLE tags ALTER COLUMN name SET NOT NULL;
    END IF;
    
    -- Check if slug can be null, then alter
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'tags' 
      AND column_name = 'slug' 
      AND is_nullable = 'YES'
    ) THEN
      ALTER TABLE tags ALTER COLUMN slug SET NOT NULL;
    END IF;
  END IF;
END $$;

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Index on category name for search
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'categories'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'categories' 
    AND indexname = 'idx_categories_name'
  ) THEN
    CREATE INDEX idx_categories_name ON categories(name);
  END IF;
END $$;

-- Index on tag name for search
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tags'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'tags' 
    AND indexname = 'idx_tags_name'
  ) THEN
    CREATE INDEX idx_tags_name ON tags(name);
  END IF;
END $$;

-- ============================================================================
-- AUTO-SLUG GENERATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_slug_from_title(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- SLUG UNIQUENESS CHECK FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION check_slug_uniqueness(
  table_name TEXT,
  slug_value TEXT,
  exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  count_result INTEGER;
BEGIN
  EXECUTE format(
    'SELECT COUNT(*) FROM %I WHERE slug = $1 AND ($2::uuid IS NULL OR id != $2)',
    table_name
  ) INTO count_result USING slug_value, exclude_id;
  
  RETURN count_result = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION generate_slug_from_title IS 'Generates URL-friendly slug from title';
COMMENT ON FUNCTION check_slug_uniqueness IS 'Checks if slug is unique in a table';
