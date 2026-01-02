-- AI Image Generation Cache Table
-- Stores AI-generated images to avoid regenerating the same prompt

CREATE TABLE IF NOT EXISTS ai_image_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT UNIQUE NOT NULL,
    result JSONB NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast prompt lookup
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_prompt ON ai_image_cache(prompt);

-- Index for cache expiry checks
CREATE INDEX IF NOT EXISTS idx_ai_image_cache_cached_at ON ai_image_cache(cached_at);

-- Enable RLS
ALTER TABLE ai_image_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for AI images
DROP POLICY IF EXISTS "Public can read ai image cache" ON ai_image_cache;
CREATE POLICY "Public can read ai image cache" ON ai_image_cache
    FOR SELECT USING (true);

-- Policy: Service role can write
DROP POLICY IF EXISTS "Service can manage ai image cache" ON ai_image_cache;
CREATE POLICY "Service can manage ai image cache" ON ai_image_cache
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Comment
COMMENT ON TABLE ai_image_cache IS 'Caches AI-generated images to reduce API costs ($0.04-0.08 per image)';
