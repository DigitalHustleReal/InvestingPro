-- Image Search Cache Table
-- Stores image search results to reduce API calls and improve performance

CREATE TABLE IF NOT EXISTS image_search_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT UNIQUE NOT NULL,
    results JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast query lookup
CREATE INDEX IF NOT EXISTS idx_image_cache_query ON image_search_cache(query);

-- Index for cache expiry checks
CREATE INDEX IF NOT EXISTS idx_image_cache_cached_at ON image_search_cache(cached_at);

-- Enable RLS
ALTER TABLE image_search_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for image data
DROP POLICY IF EXISTS "Public can read image cache" ON image_search_cache;
CREATE POLICY "Public can read image cache" ON image_search_cache
    FOR SELECT USING (true);

-- Policy: Service role can write
DROP POLICY IF EXISTS "Service can manage image cache" ON image_search_cache;
CREATE POLICY "Service can manage image cache" ON image_search_cache
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Comment
COMMENT ON TABLE image_search_cache IS 'Caches image search results from stock photo APIs to reduce costs and improve performance';
