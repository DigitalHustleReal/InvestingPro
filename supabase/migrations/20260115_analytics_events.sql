-- Analytics Event Tracking System
-- Enables funnel analysis: impression → click → outbound → conversion

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'click', 'outbound', 'conversion')),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_article ON analytics_events(article_id) WHERE article_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_product ON analytics_events(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id) WHERE user_id IS NOT NULL;

-- Composite index for funnel analysis
CREATE INDEX IF NOT EXISTS idx_analytics_funnel ON analytics_events(session_id, event_type, created_at);

-- Function to get funnel conversion rate
CREATE OR REPLACE FUNCTION get_funnel_conversion_rate(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_views BIGINT,
  total_clicks BIGINT,
  total_outbound BIGINT,
  total_conversions BIGINT,
  click_rate DECIMAL(5,2),
  outbound_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) FILTER (WHERE event_type = 'page_view') AS views,
      COUNT(*) FILTER (WHERE event_type = 'click') AS clicks,
      COUNT(*) FILTER (WHERE event_type = 'outbound') AS outbound,
      COUNT(*) FILTER (WHERE event_type = 'conversion') AS conversions
    FROM analytics_events
    WHERE created_at BETWEEN start_date AND end_date
  )
  SELECT
    views,
    clicks,
    outbound,
    conversions,
    CASE WHEN views > 0 THEN ROUND((clicks::DECIMAL / views) * 100, 2) ELSE 0 END,
    CASE WHEN clicks > 0 THEN ROUND((outbound::DECIMAL / clicks) * 100, 2) ELSE 0 END,
    CASE WHEN outbound > 0 THEN ROUND((conversions::DECIMAL / outbound) * 100, 2) ELSE 0 END
  FROM stats;
END;
$$ LANGUAGE plpgsql;

-- Function to get top performing articles by revenue
CREATE OR REPLACE FUNCTION get_top_articles_by_engagement(
  limit_count INT DEFAULT 10,
  days_back INT DEFAULT 30
)
RETURNS TABLE (
  article_id UUID,
  article_title TEXT,
  page_views BIGINT,
  clicks BIGINT,
  outbound_clicks BIGINT,
  engagement_score DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    COUNT(*) FILTER (WHERE e.event_type = 'page_view') AS views,
    COUNT(*) FILTER (WHERE e.event_type = 'click') AS clicks,
    COUNT(*) FILTER (WHERE e.event_type = 'outbound') AS outbound,
    (
      COUNT(*) FILTER (WHERE e.event_type = 'page_view') * 1.0 +
      COUNT(*) FILTER (WHERE e.event_type = 'click') * 5.0 +
      COUNT(*) FILTER (WHERE e.event_type = 'outbound') * 10.0
    ) AS score
  FROM articles a
  LEFT JOIN analytics_events e ON e.article_id = a.id
  WHERE e.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY a.id, a.title
  ORDER BY score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE analytics_events IS 'Event-based analytics for funnel tracking and revenue attribution';
COMMENT ON FUNCTION get_funnel_conversion_rate IS 'Calculate conversion rates across the entire funnel';
COMMENT ON FUNCTION get_top_articles_by_engagement IS 'Get top performing articles by engagement score';
