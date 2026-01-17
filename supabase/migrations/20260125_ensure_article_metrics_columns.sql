-- =====================================================
-- Ensure All Article Metrics Columns Exist
-- This migration ensures all required columns for the admin article table are present
-- Run this in Supabase SQL Editor if columns are missing
-- =====================================================

-- Quality & SEO Scores
ALTER TABLE articles ADD COLUMN IF NOT EXISTS quality_score INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_score INTEGER;

-- Editorial & Research Fields
ALTER TABLE articles ADD COLUMN IF NOT EXISTS editorial_notes JSONB;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS primary_keyword TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[];
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_intent TEXT CHECK (search_intent IN ('informational', 'commercial', 'transactional'));

-- Additional Metadata
ALTER TABLE articles ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS verified_by_expert BOOLEAN DEFAULT FALSE;

-- Add published_at if it doesn't exist (some schemas use published_date)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'published_at'
    ) THEN
        ALTER TABLE articles ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        -- Copy data from published_date if it exists
        UPDATE articles 
        SET published_at = published_date 
        WHERE published_date IS NOT NULL AND published_at IS NULL;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_quality_score ON articles(quality_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_seo_score ON articles(seo_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_primary_keyword ON articles(primary_keyword);

-- Add comments for documentation
COMMENT ON COLUMN articles.quality_score IS 'Overall content quality score (0-100)';
COMMENT ON COLUMN articles.seo_score IS 'SEO optimization score (0-100)';
COMMENT ON COLUMN articles.editorial_notes IS 'Editorial notes and research brief (JSONB)';
COMMENT ON COLUMN articles.primary_keyword IS 'Primary target keyword for SEO';
COMMENT ON COLUMN articles.secondary_keywords IS 'Array of secondary keywords';
COMMENT ON COLUMN articles.search_intent IS 'Search intent: informational, commercial, or transactional';
