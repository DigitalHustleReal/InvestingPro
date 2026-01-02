-- AI Usage Analytics Table
-- Tracks AI provider usage, costs, and performance metrics

CREATE TABLE IF NOT EXISTS ai_usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    task_type TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    cost_usd DECIMAL(10, 6) NOT NULL,
    latency_ms INTEGER NOT NULL,
    quality_score INTEGER,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_provider ON ai_usage_analytics(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_usage_task_type ON ai_usage_analytics(task_type);

-- Enable RLS
ALTER TABLE ai_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can manage
DROP POLICY IF EXISTS "Service can manage ai usage" ON ai_usage_analytics;
CREATE POLICY "Service can manage ai usage" ON ai_usage_analytics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin read policy
DROP POLICY IF EXISTS "Admins can read ai usage" ON ai_usage_analytics;
CREATE POLICY "Admins can read ai usage" ON ai_usage_analytics
    FOR SELECT USING (auth.jwt() ->> 'role' = 'authenticated');

-- Comment
COMMENT ON TABLE ai_usage_analytics IS 'Tracks AI provider usage for cost monitoring and performance optimization';
