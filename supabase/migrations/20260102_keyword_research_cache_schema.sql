-- Keyword Research Cache Table
-- Stores keyword research data to avoid repeated API calls

CREATE TABLE IF NOT EXISTS keyword_research_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast keyword lookup
CREATE INDEX IF NOT EXISTS idx_keyword_research_keyword ON keyword_research_cache(keyword);

-- Index for cache expiry checks
CREATE INDEX IF NOT EXISTS idx_keyword_research_cached_at ON keyword_research_cache(cached_at);

-- Enable RLS
ALTER TABLE keyword_research_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for keyword data
DROP POLICY IF EXISTS "Public can read keyword cache" ON keyword_research_cache;
CREATE POLICY "Public can read keyword cache" ON keyword_research_cache
    FOR SELECT USING (true);

-- Policy: Service role can write
DROP POLICY IF EXISTS "Service can manage keyword cache" ON keyword_research_cache;
CREATE POLICY "Service can manage keyword cache" ON keyword_research_cache
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Comment
COMMENT ON TABLE keyword_research_cache IS 'Caches keyword research data including difficulty, volume, and opportunity scores';
