-- Add SEO and Keyword metrics to tables

-- Add keyword metrics to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS keyword_difficulty INTEGER CHECK (keyword_difficulty >= 0 AND keyword_difficulty <= 100);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_volume INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS serp_features JSONB DEFAULT '{}'::jsonb;

-- Add plagiarism score to content_scores table
ALTER TABLE content_scores ADD COLUMN IF NOT EXISTS plagiarism_score DECIMAL(5,2) DEFAULT 0 CHECK (plagiarism_score >= 0 AND plagiarism_score <= 100);
ALTER TABLE content_scores ADD COLUMN IF NOT EXISTS plagiarism_data JSONB DEFAULT '{}'::jsonb;

-- Update the scoring function to include plagiarism
CREATE OR REPLACE FUNCTION update_content_score_v2(
  p_article_id UUID,
  p_seo_score DECIMAL,
  p_intent_match DECIMAL,
  p_monetization_score DECIMAL,
  p_quality_score DECIMAL,
  p_plagiarism_score DECIMAL DEFAULT 0
)
RETURNS void AS $$
DECLARE
  v_overall_score DECIMAL;
BEGIN
  -- New Weighted Schema:
  -- SEO: 25%
  -- Intent: 20%
  -- Monetization: 25%
  -- Quality: 20%
  -- Plagiarism: 10% (Inverted: Lower plagiarism is better, so logical calculation needs handling)
  
  -- Simple calculation for now: 
  v_overall_score := (p_seo_score * 0.25) + (p_intent_match * 0.2) + 
                     (p_monetization_score * 0.25) + (p_quality_score * 0.2) +
                     ((100 - p_plagiarism_score) * 0.1);

  INSERT INTO content_scores (
    article_id,
    seo_score,
    intent_match,
    monetization_score,
    quality_score,
    plagiarism_score,
    overall_score,
    last_calculated,
    updated_at
  ) VALUES (
    p_article_id,
    p_seo_score,
    p_intent_match,
    p_monetization_score,
    p_quality_score,
    p_plagiarism_score,
    v_overall_score,
    NOW(),
    NOW()
  )
  ON CONFLICT (article_id) DO UPDATE SET
    seo_score = EXCLUDED.seo_score,
    intent_match = EXCLUDED.intent_match,
    monetization_score = EXCLUDED.monetization_score,
    quality_score = EXCLUDED.quality_score,
    plagiarism_score = EXCLUDED.plagiarism_score,
    overall_score = EXCLUDED.overall_score,
    last_calculated = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
