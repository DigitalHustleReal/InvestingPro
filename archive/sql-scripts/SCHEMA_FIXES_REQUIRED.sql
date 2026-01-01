-- ============================================
-- Schema Fixes Required - Execute in Order
-- ============================================

-- ============================================
-- 1. CRITICAL: Add update_updated_at_column() Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. CRITICAL: Remove Dangerous RLS Policies
-- ============================================

-- Drop dangerous permissive policies
DROP POLICY IF EXISTS "Allow all inserts" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
DROP POLICY IF EXISTS "Admins can update all articles" ON articles;

-- ============================================
-- 3. CRITICAL: Add Secure RLS Policies for Articles
-- ============================================

-- Secure INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create articles" ON articles;
CREATE POLICY "Authenticated users can create articles"
ON articles FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' OR
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Secure SELECT policy (replaces dangerous "true" policy)
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
USING (
    (status = 'published' AND submission_status = 'approved') OR
    auth.uid() = author_id OR
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Secure UPDATE policy
DROP POLICY IF EXISTS "Users can update own drafts or admins can update all" ON articles;
CREATE POLICY "Users can update own drafts or admins can update all"
ON articles FOR UPDATE
USING (
    (auth.uid() = author_id AND status = 'draft') OR
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Service role bypass (for API routes using service role key)
DROP POLICY IF EXISTS "Service role has full access" ON articles;
CREATE POLICY "Service role has full access"
ON articles FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- 4. HIGH PRIORITY: Add Missing Columns to Articles
-- ============================================

-- Schema-driven fields (from schema_driven_fields.sql)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS primary_keyword TEXT,
ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS search_intent TEXT CHECK (search_intent IN ('informational', 'commercial', 'transactional'));

-- Pillar page fields (from pillar_page_schema.sql)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'pillar', 'category-page')),
ADD COLUMN IF NOT EXISTS pillar_related_articles UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pillar_hub_content JSONB,
ADD COLUMN IF NOT EXISTS pillar_primary_topic TEXT,
ADD COLUMN IF NOT EXISTS pillar_subtopics TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pillar_related_categories TEXT[] DEFAULT '{}';

-- Additional missing fields
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ, -- Standardize on published_at
ADD COLUMN IF NOT EXISTS meta_title TEXT, -- Alternative to seo_title
ADD COLUMN IF NOT EXISTS meta_description TEXT, -- Alternative to seo_description
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS citations JSONB,
ADD COLUMN IF NOT EXISTS data_sources JSONB,
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}', -- Legacy/compatibility field
ADD COLUMN IF NOT EXISTS body_markdown TEXT, -- Alternative content format
ADD COLUMN IF NOT EXISTS body_html TEXT; -- Rendered HTML

-- ============================================
-- 5. HIGH PRIORITY: Add Missing Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_articles_primary_keyword ON articles(primary_keyword) WHERE primary_keyword IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_search_intent ON articles(search_intent) WHERE search_intent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON articles(content_type);
CREATE INDEX IF NOT EXISTS idx_articles_pillar_topic ON articles(pillar_primary_topic) WHERE content_type = 'pillar';
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC) WHERE status = 'published';

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_articles_status_category ON articles(status, category) WHERE status = 'published';

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, ''))
);

-- ============================================
-- 6. MEDIUM PRIORITY: Fix Foreign Key Constraints
-- ============================================

-- Add foreign key constraint for category_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_articles_category' 
        AND conrelid = 'articles'::regclass
    ) THEN
        ALTER TABLE articles 
        ADD CONSTRAINT fk_articles_category 
        FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================
-- 7. NOTE: CMS Automation Tables Must Be Added Separately
-- ============================================
-- You MUST run the following schema files in order:
-- 1. lib/supabase/keyword_research_schema.sql
-- 2. lib/supabase/rss_import_schema.sql
-- 3. lib/supabase/seo_integrations_schema.sql
-- 4. lib/supabase/social_automation_schema.sql
-- 5. lib/supabase/visual_content_schema.sql
-- 6. lib/supabase/pipeline_runs_schema.sql
--
-- These tables are CRITICAL for CMS automation features to work!





