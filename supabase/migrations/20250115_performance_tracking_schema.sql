-- Performance Tracking & Strategy Weights Schema
-- Enables self-learning and adaptation for the agentic CMS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CONTENT PERFORMANCE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Metrics
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'views', 'engagement', 'rankings', 'conversions', 
        'revenue', 'quality_score', 'seo_score', 'bounce_rate',
        'time_on_page', 'social_shares', 'comments', 'backlinks'
    )),
    metric_value NUMERIC NOT NULL,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Context
    context JSONB, -- Additional context data (rankings array, keyword, etc.)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_performance_article ON content_performance(article_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_date ON content_performance(metric_date);
CREATE INDEX IF NOT EXISTS idx_content_performance_type ON content_performance(metric_type);
CREATE INDEX IF NOT EXISTS idx_content_performance_article_date ON content_performance(article_id, metric_date);

-- ============================================================================
-- 2. STRATEGY WEIGHTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_strategy_weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identifiers
    category TEXT NOT NULL,
    keyword TEXT NOT NULL,
    
    -- Performance Data
    performance_score NUMERIC DEFAULT 0, -- 0-100
    weight_multiplier NUMERIC DEFAULT 1.0, -- How much to weight in future (0.5x to 2.0x)
    sample_size INTEGER DEFAULT 0, -- Number of articles analyzed
    
    -- Trends
    trend TEXT CHECK (trend IN ('increasing', 'decreasing', 'stable')),
    
    -- Metadata
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(category, keyword)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_strategy_weights_category ON content_strategy_weights(category);
CREATE INDEX IF NOT EXISTS idx_strategy_weights_keyword ON content_strategy_weights(keyword);
CREATE INDEX IF NOT EXISTS idx_strategy_weights_performance ON content_strategy_weights(performance_score DESC);
CREATE INDEX IF NOT EXISTS idx_strategy_weights_multiplier ON content_strategy_weights(weight_multiplier DESC);

-- ============================================================================
-- 3. AGENT EXECUTION LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Agent Info
    agent_name TEXT NOT NULL,
    execution_type TEXT NOT NULL, -- 'trend_detection', 'content_generation', etc.
    
    -- Execution Data
    input_data JSONB,
    output_data JSONB,
    execution_time_ms INTEGER,
    
    -- Status
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    -- Context
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    cycle_id UUID, -- Links executions in same cycle
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent ON agent_executions(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_executions_type ON agent_executions(execution_type);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created ON agent_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_executions_cycle ON agent_executions(cycle_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_success ON agent_executions(success);

-- ============================================================================
-- 4. STRATEGY HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS strategy_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Strategy Data
    strategy_data JSONB NOT NULL, -- Complete strategy snapshot
    
    -- Performance Metrics
    performance_before NUMERIC, -- Performance before strategy
    performance_after NUMERIC, -- Performance after strategy
    
    -- Context
    strategy_type TEXT, -- 'content_selection', 'keyword_prioritization', etc.
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_strategy_history_type ON strategy_history(strategy_type);
CREATE INDEX IF NOT EXISTS idx_strategy_history_created ON strategy_history(created_at DESC);

-- ============================================================================
-- 5. CONTENT GENERATION CYCLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_generation_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Cycle Info
    cycle_type TEXT NOT NULL CHECK (cycle_type IN ('fully-automated', 'semi-automated', 'manual')),
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'paused')),
    
    -- Goals
    target_articles INTEGER,
    target_quality NUMERIC,
    target_revenue NUMERIC,
    
    -- Results
    articles_generated INTEGER DEFAULT 0,
    articles_published INTEGER DEFAULT 0,
    average_performance_score NUMERIC,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Errors
    errors JSONB DEFAULT '[]'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cycles_status ON content_generation_cycles(status);
CREATE INDEX IF NOT EXISTS idx_cycles_started ON content_generation_cycles(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_cycles_type ON content_generation_cycles(cycle_type);

-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

-- Content Performance
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view performance data" 
ON content_performance FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage performance data" 
ON content_performance FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- Strategy Weights
ALTER TABLE content_strategy_weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage strategy weights" 
ON content_strategy_weights FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- Agent Executions
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage agent executions" 
ON agent_executions FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view agent executions" 
ON agent_executions FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Strategy History
ALTER TABLE strategy_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage strategy history" 
ON strategy_history FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view strategy history" 
ON strategy_history FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Content Generation Cycles
ALTER TABLE content_generation_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage cycles" 
ON content_generation_cycles FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view cycles" 
ON content_generation_cycles FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 7. HELPER FUNCTIONS
-- ============================================================================

-- Function to update strategy weights based on performance
CREATE OR REPLACE FUNCTION update_strategy_weights()
RETURNS void AS $$
BEGIN
    -- This will be called by FeedbackLoopAgent
    -- Updates weight_multiplier based on performance_score
    UPDATE content_strategy_weights
    SET weight_multiplier = CASE
        WHEN performance_score >= 80 THEN 1.5
        WHEN performance_score >= 60 THEN 1.0
        WHEN performance_score >= 40 THEN 0.7
        ELSE 0.5
    END,
    last_updated = NOW()
    WHERE performance_score IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to get average performance for category/keyword
CREATE OR REPLACE FUNCTION get_average_performance(
    p_category TEXT,
    p_keyword TEXT,
    p_days INTEGER DEFAULT 90
)
RETURNS NUMERIC AS $$
DECLARE
    avg_perf NUMERIC;
BEGIN
    SELECT AVG(cp.metric_value) INTO avg_perf
    FROM content_performance cp
    JOIN articles a ON cp.article_id = a.id
    WHERE a.category = p_category
      AND (a.tags @> ARRAY[p_keyword] OR a.title ILIKE '%' || p_keyword || '%')
      AND cp.metric_type = 'views'
      AND cp.metric_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL;
    
    RETURN COALESCE(avg_perf, 0);
END;
$$ LANGUAGE plpgsql;
