-- =====================================================
-- QUALITY GATES SCHEMA
-- =====================================================
-- Adds tracking for content quality, uniqueness, and SEO scores
-- Date: 2026-01-02

-- 1. Add Quality Score columns to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS quality_score INTEGER;      -- Overall 0-100
ALTER TABLE articles ADD COLUMN IF NOT EXISTS uniqueness_score INTEGER;   -- Plagiarism check 0-100
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_score INTEGER;          -- SEO optimization 0-100
ALTER TABLE articles ADD COLUMN IF NOT EXISTS readability_score INTEGER;  -- Flesch-Kincaid 0-100

-- 2. Add validation flags
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_verified_quality BOOLEAN DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_plagiarism_checked BOOLEAN DEFAULT FALSE;

-- 3. Add Image SEO & Schema columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_alt_text TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS schema_markup JSONB;     -- For AI SEO (JSON-LD)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS shareable_assets JSONB;  -- Links to gen infographics

-- 4. Log quality history (optional, for detailed audit trail)
CREATE TABLE IF NOT EXISTS article_quality_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    checked_at TIMESTAMPTZ DEFAULT NOW(),
    
    overall_score INTEGER,
    grammar_score INTEGER,
    readability_score INTEGER,
    seo_score INTEGER,
    uniqueness_score INTEGER,
    
    issues JSONB,        -- Detailed issues list
    suggestions JSONB,   -- AI suggestions
    report_text TEXT     -- Full formatted report
);

CREATE INDEX IF NOT EXISTS idx_quality_logs_article ON article_quality_logs(article_id);
