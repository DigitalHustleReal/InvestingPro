-- AI Costs Per Article Tracking
-- Tracks AI costs per article for cost attribution and budgeting

-- Create ai_costs table
CREATE TABLE IF NOT EXISTS ai_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Article Reference (optional - for content generation)
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    
    -- Provider Information
    provider TEXT NOT NULL, -- 'openai', 'anthropic', 'groq', 'mistral', 'google'
    model TEXT NOT NULL, -- 'gpt-4', 'claude-3-opus', 'llama-3-70b', etc.
    
    -- Operation Details
    operation TEXT NOT NULL CHECK (operation IN ('generate', 'proofread', 'translate', 'summarize', 'analyze', 'image', 'other')),
    
    -- Token Usage
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
    
    -- Cost Information
    cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    cost_inr NUMERIC(10, 2) GENERATED ALWAYS AS (cost_usd * 83.0) STORED, -- Approx USD to INR rate
    
    -- Request Metadata
    request_id TEXT, -- Optional tracking ID
    prompt_template_id UUID, -- Optional reference to prompt template used
    duration_ms INTEGER, -- Request duration in milliseconds
    
    -- Additional Context
    metadata JSONB DEFAULT '{}', -- Additional metadata about the request
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_costs_article_id ON ai_costs(article_id);
CREATE INDEX IF NOT EXISTS idx_ai_costs_provider ON ai_costs(provider);
CREATE INDEX IF NOT EXISTS idx_ai_costs_operation ON ai_costs(operation);
CREATE INDEX IF NOT EXISTS idx_ai_costs_created_at ON ai_costs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_costs_provider_model ON ai_costs(provider, model);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_ai_costs_article_provider ON ai_costs(article_id, provider) WHERE article_id IS NOT NULL;

-- RLS Policies
ALTER TABLE ai_costs ENABLE ROW LEVEL SECURITY;

-- Admins can view all costs
CREATE POLICY "Admins can view all AI costs"
ON ai_costs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

-- Service role can insert costs
CREATE POLICY "Service role can insert AI costs"
ON ai_costs FOR INSERT
WITH CHECK (true);

-- Function to log AI cost
CREATE OR REPLACE FUNCTION log_ai_cost(
    p_article_id UUID DEFAULT NULL,
    p_provider TEXT,
    p_model TEXT,
    p_operation TEXT,
    p_input_tokens INTEGER DEFAULT 0,
    p_output_tokens INTEGER DEFAULT 0,
    p_cost_usd NUMERIC DEFAULT 0,
    p_request_id TEXT DEFAULT NULL,
    p_prompt_template_id UUID DEFAULT NULL,
    p_duration_ms INTEGER DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    v_cost_id UUID;
BEGIN
    INSERT INTO ai_costs (
        article_id,
        provider,
        model,
        operation,
        input_tokens,
        output_tokens,
        cost_usd,
        request_id,
        prompt_template_id,
        duration_ms,
        metadata
    ) VALUES (
        p_article_id,
        p_provider,
        p_model,
        p_operation,
        p_input_tokens,
        p_output_tokens,
        p_cost_usd,
        p_request_id,
        p_prompt_template_id,
        p_duration_ms,
        p_metadata
    )
    RETURNING id INTO v_cost_id;
    
    RETURN v_cost_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cost breakdown by article
CREATE OR REPLACE FUNCTION get_article_cost_breakdown(
    p_article_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS TABLE (
    provider TEXT,
    operation TEXT,
    total_tokens BIGINT,
    total_cost_usd NUMERIC,
    total_cost_inr NUMERIC,
    request_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ac.provider,
        ac.operation,
        SUM(ac.total_tokens) as total_tokens,
        SUM(ac.cost_usd) as total_cost_usd,
        SUM(ac.cost_inr) as total_cost_inr,
        COUNT(*) as request_count
    FROM ai_costs ac
    WHERE ac.article_id = p_article_id
    AND (p_start_date IS NULL OR ac.created_at >= p_start_date)
    AND (p_end_date IS NULL OR ac.created_at <= p_end_date)
    GROUP BY ac.provider, ac.operation
    ORDER BY total_cost_usd DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total cost for an article
CREATE OR REPLACE FUNCTION get_article_total_cost(
    p_article_id UUID
) RETURNS NUMERIC AS $$
DECLARE
    v_total_cost NUMERIC;
BEGIN
    SELECT COALESCE(SUM(cost_usd), 0)
    INTO v_total_cost
    FROM ai_costs
    WHERE article_id = p_article_id;
    
    RETURN v_total_cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE ai_costs IS 'Tracks AI costs per article for cost attribution and budgeting';
COMMENT ON FUNCTION log_ai_cost IS 'Logs an AI cost entry';
COMMENT ON FUNCTION get_article_cost_breakdown IS 'Returns cost breakdown for a specific article';
COMMENT ON FUNCTION get_article_total_cost IS 'Returns total cost for a specific article';
