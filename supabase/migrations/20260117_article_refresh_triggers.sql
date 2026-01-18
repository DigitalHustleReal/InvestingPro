-- Article Refresh Triggers Table
-- Tracks automatic refresh triggers for audit and monitoring

CREATE TABLE IF NOT EXISTS article_refresh_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('ranking_drop', 'data_change', 'age')),
    reason TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
    trigger_data JSONB,
    refreshed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_refresh_triggers_article ON article_refresh_triggers(article_id);
CREATE INDEX IF NOT EXISTS idx_refresh_triggers_type ON article_refresh_triggers(trigger_type);
CREATE INDEX IF NOT EXISTS idx_refresh_triggers_severity ON article_refresh_triggers(severity);
CREATE INDEX IF NOT EXISTS idx_refresh_triggers_created ON article_refresh_triggers(created_at);

-- RLS Policies
ALTER TABLE article_refresh_triggers ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all triggers
CREATE POLICY "Admins can read all refresh triggers"
    ON article_refresh_triggers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Allow system to insert triggers (via service role)
-- Service role bypasses RLS, so no policy needed for inserts

-- Comments
COMMENT ON TABLE article_refresh_triggers IS 'Tracks automatic refresh triggers for articles (ranking drops, data changes)';
COMMENT ON COLUMN article_refresh_triggers.trigger_type IS 'Type of trigger: ranking_drop, data_change, or age';
COMMENT ON COLUMN article_refresh_triggers.severity IS 'Severity of trigger: high, medium, or low';
COMMENT ON COLUMN article_refresh_triggers.trigger_data IS 'JSON data with trigger-specific information (keyword, rankings, changed data, etc.)';
