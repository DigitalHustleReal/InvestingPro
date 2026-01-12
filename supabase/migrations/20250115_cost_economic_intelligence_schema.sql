-- Cost & Economic Intelligence Schema
-- Tracks costs, revenue, and ROI for all content generation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. COST TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- AI Costs
    ai_tokens_used INTEGER DEFAULT 0,
    ai_cost NUMERIC DEFAULT 0, -- In USD or INR
    ai_provider TEXT, -- 'openai', 'deepseek', 'groq', etc.
    ai_model TEXT,
    
    -- Image Costs
    images_generated INTEGER DEFAULT 0,
    image_cost NUMERIC DEFAULT 0,
    
    -- Total Costs
    total_cost NUMERIC DEFAULT 0,
    
    -- Metadata
    generation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_costs_article ON content_costs(article_id);
CREATE INDEX IF NOT EXISTS idx_content_costs_date ON content_costs(generation_date);
CREATE INDEX IF NOT EXISTS idx_content_costs_provider ON content_costs(ai_provider);

-- ============================================================================
-- 2. ECONOMIC INTELLIGENCE (ROI)
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_economics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Costs
    total_cost NUMERIC DEFAULT 0,
    
    -- Revenue
    affiliate_revenue NUMERIC DEFAULT 0,
    ad_revenue NUMERIC DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0,
    
    -- ROI Metrics
    roi_percentage NUMERIC DEFAULT 0, -- (revenue - cost) / cost * 100
    profit NUMERIC DEFAULT 0, -- revenue - cost
    profit_per_view NUMERIC DEFAULT 0,
    profit_per_click NUMERIC DEFAULT 0,
    
    -- Performance
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    -- Time Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Metadata
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_economics_article ON content_economics(article_id);
CREATE INDEX IF NOT EXISTS idx_content_economics_roi ON content_economics(roi_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_content_economics_profit ON content_economics(profit DESC);
CREATE INDEX IF NOT EXISTS idx_content_economics_period ON content_economics(period_start, period_end);

-- ============================================================================
-- 3. BUDGET TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
    
    -- Budget Limits
    max_tokens INTEGER DEFAULT 1000000, -- Max tokens per day
    max_images INTEGER DEFAULT 100, -- Max images per day
    max_cost_usd NUMERIC DEFAULT 50.00, -- Max cost in USD per day
    
    -- Current Usage
    tokens_used INTEGER DEFAULT 0,
    images_used INTEGER DEFAULT 0,
    cost_spent_usd NUMERIC DEFAULT 0,
    
    -- Status
    is_paused BOOLEAN DEFAULT FALSE, -- Pause if limits reached
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_budgets_date ON daily_budgets(budget_date DESC);

-- ============================================================================
-- 4. RISK & COMPLIANCE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    
    -- Risk Assessment
    risk_score INTEGER DEFAULT 0, -- 0-100 (higher = more risky)
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Risk Flags
    has_guaranteed_returns BOOLEAN DEFAULT FALSE,
    has_tax_claims BOOLEAN DEFAULT FALSE,
    has_investment_advice BOOLEAN DEFAULT FALSE,
    has_regulatory_sensitive BOOLEAN DEFAULT FALSE,
    
    -- Verification
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'flagged', 'rejected')),
    verification_model_1 TEXT, -- First model used
    verification_model_2 TEXT, -- Second model if conflict
    verification_conflict BOOLEAN DEFAULT FALSE,
    
    -- Compliance
    requires_manual_review BOOLEAN DEFAULT FALSE,
    can_auto_publish BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_risk_article ON content_risk_scores(article_id);
CREATE INDEX IF NOT EXISTS idx_content_risk_level ON content_risk_scores(risk_level);
CREATE INDEX IF NOT EXISTS idx_content_risk_verification ON content_risk_scores(verification_status);
CREATE INDEX IF NOT EXISTS idx_content_risk_auto_publish ON content_risk_scores(can_auto_publish);

-- ============================================================================
-- 5. STRATEGIC DIVERSITY TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_diversity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content Type Distribution
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Content Types
    authority_content_count INTEGER DEFAULT 0, -- Long-term, evergreen
    trend_content_count INTEGER DEFAULT 0, -- Trend-based
    commercial_content_count INTEGER DEFAULT 0, -- High-ROI affiliate
    
    -- Diversity Score
    diversity_score NUMERIC DEFAULT 0, -- 0-100 (higher = more diverse)
    meets_diversity_constraint BOOLEAN DEFAULT TRUE, -- At least 20% authority
    
    -- Metadata
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_diversity_period ON content_diversity(period_start, period_end);

-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

-- Content Costs
ALTER TABLE content_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage content costs" 
ON content_costs FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view content costs" 
ON content_costs FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Content Economics
ALTER TABLE content_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage content economics" 
ON content_economics FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view content economics" 
ON content_economics FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Daily Budgets
ALTER TABLE daily_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage daily budgets" 
ON daily_budgets FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view daily budgets" 
ON daily_budgets FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Content Risk Scores
ALTER TABLE content_risk_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage risk scores" 
ON content_risk_scores FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view risk scores" 
ON content_risk_scores FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Content Diversity
ALTER TABLE content_diversity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage diversity" 
ON content_diversity FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view diversity" 
ON content_diversity FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 7. HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate ROI
CREATE OR REPLACE FUNCTION calculate_content_roi(p_article_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_cost NUMERIC,
    total_revenue NUMERIC,
    profit NUMERIC,
    roi_percentage NUMERIC
) AS $$
DECLARE
    v_cost NUMERIC;
    v_revenue NUMERIC;
    v_profit NUMERIC;
    v_roi NUMERIC;
BEGIN
    -- Get total cost
    SELECT COALESCE(SUM(total_cost), 0) INTO v_cost
    FROM content_costs
    WHERE article_id = p_article_id;
    
    -- Get total revenue (affiliate + ads)
    SELECT 
        COALESCE(SUM(commission_earned), 0) INTO v_revenue
    FROM affiliate_clicks
    WHERE article_id = p_article_id
      AND converted = TRUE
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
    
    -- Calculate profit and ROI
    v_profit := v_revenue - v_cost;
    v_roi := CASE 
        WHEN v_cost > 0 THEN ((v_revenue - v_cost) / v_cost) * 100
        ELSE 0
    END;
    
    RETURN QUERY SELECT v_cost, v_revenue, v_profit, v_roi;
END;
$$ LANGUAGE plpgsql;

-- Function to check daily budget
CREATE OR REPLACE FUNCTION check_daily_budget()
RETURNS TABLE (
    can_generate BOOLEAN,
    tokens_remaining INTEGER,
    images_remaining INTEGER,
    cost_remaining NUMERIC,
    is_paused BOOLEAN
) AS $$
DECLARE
    v_budget RECORD;
BEGIN
    SELECT * INTO v_budget
    FROM daily_budgets
    WHERE budget_date = CURRENT_DATE
    LIMIT 1;
    
    IF NOT FOUND THEN
        -- Create default budget for today
        INSERT INTO daily_budgets (budget_date) VALUES (CURRENT_DATE)
        ON CONFLICT (budget_date) DO NOTHING
        RETURNING * INTO v_budget;
    END IF;
    
    RETURN QUERY SELECT
        NOT v_budget.is_paused AND
        v_budget.tokens_used < v_budget.max_tokens AND
        v_budget.images_used < v_budget.max_images AND
        v_budget.cost_spent_usd < v_budget.max_cost_usd,
        GREATEST(0, v_budget.max_tokens - v_budget.tokens_used),
        GREATEST(0, v_budget.max_images - v_budget.images_used),
        GREATEST(0, v_budget.max_cost_usd - v_budget.cost_spent_usd),
        v_budget.is_paused;
END;
$$ LANGUAGE plpgsql;

-- Function to record cost
CREATE OR REPLACE FUNCTION record_content_cost(
    p_article_id UUID,
    p_tokens INTEGER,
    p_cost NUMERIC,
    p_provider TEXT,
    p_model TEXT,
    p_images INTEGER DEFAULT 0,
    p_image_cost NUMERIC DEFAULT 0
)
RETURNS void AS $$
DECLARE
    v_total_cost NUMERIC;
BEGIN
    v_total_cost := p_cost + p_image_cost;
    
    INSERT INTO content_costs (
        article_id,
        ai_tokens_used,
        ai_cost,
        ai_provider,
        ai_model,
        images_generated,
        image_cost,
        total_cost
    ) VALUES (
        p_article_id,
        p_tokens,
        p_cost,
        p_provider,
        p_model,
        p_images,
        p_image_cost,
        v_total_cost
    )
    ON CONFLICT DO NOTHING;
    
    -- Update daily budget
    UPDATE daily_budgets
    SET 
        tokens_used = tokens_used + p_tokens,
        images_used = images_used + p_images,
        cost_spent_usd = cost_spent_usd + v_total_cost,
        updated_at = NOW()
    WHERE budget_date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
