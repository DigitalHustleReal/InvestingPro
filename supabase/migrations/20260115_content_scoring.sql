-- Content Scoring System
-- Tracks SEO, intent match, monetization, and quality scores for articles

CREATE TABLE IF NOT EXISTS content_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE UNIQUE,
  seo_score DECIMAL(5,2) DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  intent_match DECIMAL(5,2) DEFAULT 0 CHECK (intent_match >= 0 AND intent_match <= 100),
  monetization_score DECIMAL(5,2) DEFAULT 0 CHECK (monetization_score >= 0 AND monetization_score <= 100),
  quality_score DECIMAL(5,2) DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  overall_score DECIMAL(5,2) DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intent Classification
ALTER TABLE articles ADD COLUMN IF NOT EXISTS user_intent TEXT CHECK (user_intent IN ('informational', 'navigational', 'transactional', 'commercial'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS target_keywords TEXT[];
ALTER TABLE articles ADD COLUMN IF NOT EXISTS keyword_density JSONB DEFAULT '{}'::jsonb;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_scores_overall ON content_scores(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_content_scores_article ON content_scores(article_id);
CREATE INDEX IF NOT EXISTS idx_articles_intent ON articles(user_intent) WHERE user_intent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_keywords ON articles USING GIN(target_keywords) WHERE target_keywords IS NOT NULL;

-- Function to get low-performing content
CREATE OR REPLACE FUNCTION get_low_performing_content(
  score_threshold DECIMAL DEFAULT 40,
  days_back INT DEFAULT 30,
  limit_count INT DEFAULT 50
)
RETURNS TABLE (
  article_id UUID,
  article_title TEXT,
  overall_score DECIMAL(5,2),
  page_views BIGINT,
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    cs.overall_score,
    COUNT(ae.id) FILTER (WHERE ae.event_type = 'page_view') AS views,
    a.updated_at
  FROM articles a
  INNER JOIN content_scores cs ON cs.article_id = a.id
  LEFT JOIN analytics_events ae ON ae.article_id = a.id 
    AND ae.created_at >= NOW() - (days_back || ' days')::INTERVAL
  WHERE cs.overall_score < score_threshold
    AND a.status = 'published'
  GROUP BY a.id, a.title, cs.overall_score, a.updated_at
  HAVING COUNT(ae.id) FILTER (WHERE ae.event_type = 'page_view') < 10
  ORDER BY cs.overall_score ASC, views ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update content score
CREATE OR REPLACE FUNCTION update_content_score(
  p_article_id UUID,
  p_seo_score DECIMAL,
  p_intent_match DECIMAL,
  p_monetization_score DECIMAL,
  p_quality_score DECIMAL
)
RETURNS void AS $$
DECLARE
  v_overall_score DECIMAL;
BEGIN
  -- Calculate weighted average (SEO 30%, Intent 20%, Monetization 30%, Quality 20%)
  v_overall_score := (p_seo_score * 0.3) + (p_intent_match * 0.2) + 
                     (p_monetization_score * 0.3) + (p_quality_score * 0.2);
  
  INSERT INTO content_scores (
    article_id,
    seo_score,
    intent_match,
    monetization_score,
    quality_score,
    overall_score,
    last_calculated,
    updated_at
  ) VALUES (
    p_article_id,
    p_seo_score,
    p_intent_match,
    p_monetization_score,
    p_quality_score,
    v_overall_score,
    NOW(),
    NOW()
  )
  ON CONFLICT (article_id) DO UPDATE SET
    seo_score = EXCLUDED.seo_score,
    intent_match = EXCLUDED.intent_match,
    monetization_score = EXCLUDED.monetization_score,
    quality_score = EXCLUDED.quality_score,
    overall_score = EXCLUDED.overall_score,
    last_calculated = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE content_scores IS 'Tracks content quality scores for automated cleanup and optimization';
COMMENT ON FUNCTION get_low_performing_content IS 'Identifies articles with low scores and low traffic for cleanup';
COMMENT ON FUNCTION update_content_score IS 'Updates or inserts content score with weighted average calculation';
