-- 6. Content Quality Features
-- Adds columns for quality scoring, readability, and fact-checking

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS quality_score INTEGER,
ADD COLUMN IF NOT EXISTS quality_metrics JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS fact_check_result JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS readability_metrics JSONB DEFAULT '{}'::jsonb;

-- Add indexes for filtering by quality
CREATE INDEX IF NOT EXISTS idx_articles_quality_score ON articles(quality_score);

-- Comment on columns
COMMENT ON COLUMN articles.quality_score IS 'Overall quality score (0-100)';
COMMENT ON COLUMN articles.quality_metrics IS 'Detailed quality metrics (depth, structure, readability, etc.)';
COMMENT ON COLUMN articles.fact_check_result IS 'Results from automated fact-checking';
COMMENT ON COLUMN articles.readability_metrics IS 'Readability analysis (Flesch-Kincaid, etc.)';
