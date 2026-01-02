-- =====================================================
-- COMPARISON CACHE SCHEMA
-- =====================================================
-- Caches AI-generated verdicts for product comparisons
-- Prevents re-generating content for every visit (SEO optimization)
-- Date: 2026-01-02

-- 1. Create Cache Table
CREATE TABLE IF NOT EXISTS comparison_cache (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug_key text NOT NULL UNIQUE, -- Sorted key: "product-a:product-b"
    p1_slug text NOT NULL,
    p2_slug text NOT NULL,
    verdict_content text NOT NULL, -- The Full AI Markdown response
    provider text DEFAULT 'gemini',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_comparison_slug_key ON comparison_cache(slug_key);
CREATE INDEX IF NOT EXISTS idx_comparison_p1 ON comparison_cache(p1_slug);
CREATE INDEX IF NOT EXISTS idx_comparison_p2 ON comparison_cache(p2_slug);

-- 3. Row Level Security
ALTER TABLE comparison_cache ENABLE ROW LEVEL SECURITY;

-- Public can view cached comparisons
DROP POLICY IF EXISTS "Public can view cached comparisons" ON comparison_cache;
CREATE POLICY "Public can view cached comparisons"
    ON comparison_cache FOR SELECT
    USING (true);

-- Service role can manage cache
DROP POLICY IF EXISTS "Service role can manage comparison cache" ON comparison_cache;
CREATE POLICY "Service role can manage comparison cache"
    ON comparison_cache FOR ALL
    USING (true);

-- 4. Auto-update Trigger
CREATE OR REPLACE TRIGGER update_comparison_cache_modtime
    BEFORE UPDATE ON comparison_cache
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
