-- =====================================================
-- KEYWORD DIFFICULTY & PLATFORM METRICS SCHEMA
-- =====================================================
-- Optional enhancement for tracking keyword difficulty and platform authority
-- This migration is NON-BREAKING and can be run anytime

-- 1. Create platform_metrics table (track domain authority over time)
CREATE TABLE IF NOT EXISTS platform_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    domain_authority INTEGER, -- 0-100 (from Moz/Ahrefs or estimated)
    page_authority INTEGER,   -- 0-100
    backlinks INTEGER,
    referring_domains INTEGER,
    organic_traffic INTEGER,
    indexed_pages INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON platform_metrics(date DESC);

-- 2. Add difficulty_score to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS difficulty_score INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS target_authority INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS primary_keyword TEXT;

-- 3. Create keyword_difficulty_cache table (cache SERP analysis results)
CREATE TABLE IF NOT EXISTS keyword_difficulty_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT UNIQUE NOT NULL,
    difficulty_score INTEGER NOT NULL,
    difficulty_level VARCHAR(20), -- easy, medium, hard, very-hard
    confidence NUMERIC(3,2), -- 0.00-1.00
    competitors JSONB, -- Top competitors data
    analyzed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_keyword_difficulty_keyword ON keyword_difficulty_cache(keyword);
CREATE INDEX IF NOT EXISTS idx_keyword_difficulty_expires ON keyword_difficulty_cache(expires_at);

-- 4. Create article_performance table (track rankings over time)
CREATE TABLE IF NOT EXISTS article_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    google_position INTEGER, -- 1-100
    impressions INTEGER,
    clicks INTEGER,
    ctr NUMERIC(5,2), -- Click-through rate
    avg_position NUMERIC(5,2),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    recorded_date DATE DEFAULT CURRENT_DATE, -- Simple date column for uniqueness
    UNIQUE(article_id, keyword, recorded_date)
);

CREATE INDEX IF NOT EXISTS idx_article_performance_article ON article_performance(article_id);
CREATE INDEX IF NOT EXISTS idx_article_performance_date ON article_performance(recorded_at DESC);

-- 5. RLS Policies (Admin only for now)
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_difficulty_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_performance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access platform_metrics" ON platform_metrics;
CREATE POLICY "Admin full access platform_metrics" ON platform_metrics
    FOR ALL USING (true); -- Restrict to admin role in production

DROP POLICY IF EXISTS "Public read difficulty cache" ON keyword_difficulty_cache;
CREATE POLICY "Public read difficulty cache" ON keyword_difficulty_cache
    FOR SELECT USING (expires_at > NOW());

DROP POLICY IF EXISTS "Admin manage difficulty cache" ON keyword_difficulty_cache;
CREATE POLICY "Admin manage difficulty cache" ON keyword_difficulty_cache
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access performance" ON article_performance;
CREATE POLICY "Admin full access performance" ON article_performance
    FOR ALL USING (true);

-- 6. Function to clean expired cache
CREATE OR REPLACE FUNCTION clean_keyword_difficulty_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM keyword_difficulty_cache
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Seed initial platform metrics (optional - run manually with real data)
-- INSERT INTO platform_metrics (date, domain_authority, organic_traffic, indexed_pages)
-- VALUES (CURRENT_DATE, 15, 1000, 50);
