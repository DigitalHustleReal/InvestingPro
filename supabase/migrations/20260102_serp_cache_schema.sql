-- SERP Cache Table for Research Data
-- Stores competitive intelligence to reduce API costs and improve speed

CREATE TABLE IF NOT EXISTS serp_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast keyword lookup
CREATE INDEX IF NOT EXISTS idx_serp_cache_keyword ON serp_cache(keyword);

-- Index for cache expiry checks
CREATE INDEX IF NOT EXISTS idx_serp_cache_cached_at ON serp_cache(cached_at);

-- Enable RLS
ALTER TABLE serp_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for research data
DROP POLICY IF EXISTS "Public can read serp cache" ON serp_cache;
CREATE POLICY "Public can read serp cache" ON serp_cache
    FOR SELECT USING (true);

-- Policy: Service role can write
DROP POLICY IF EXISTS "Service can manage serp cache" ON serp_cache;
CREATE POLICY "Service can manage serp cache" ON serp_cache
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Comment
COMMENT ON TABLE serp_cache IS 'Caches SERP analysis results to reduce API costs and improve performance';
