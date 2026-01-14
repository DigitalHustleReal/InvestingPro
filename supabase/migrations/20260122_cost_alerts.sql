-- Cost Alerts & Budget Management Enhancements
-- Adds alert tracking, monthly budgets, and enhanced cost reporting

-- Add alert tracking to daily_budgets
ALTER TABLE daily_budgets
ADD COLUMN IF NOT EXISTS alerts_sent TEXT[] DEFAULT '{}', -- Track which alerts have been sent
ADD COLUMN IF NOT EXISTS last_alert_at TIMESTAMP WITH TIME ZONE;

-- Create monthly budgets table
CREATE TABLE IF NOT EXISTS monthly_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_month DATE NOT NULL UNIQUE, -- First day of month (YYYY-MM-01)
    
    -- Budget Limits
    max_cost_usd NUMERIC NOT NULL DEFAULT 1500.00, -- Monthly budget in USD
    
    -- Current Usage
    cost_spent_usd NUMERIC DEFAULT 0,
    
    -- Alert Thresholds
    alert_50_percent_sent BOOLEAN DEFAULT FALSE,
    alert_80_percent_sent BOOLEAN DEFAULT FALSE,
    alert_100_percent_sent BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_paused BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month ON monthly_budgets(budget_month DESC);

-- RLS Policies
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view monthly budgets"
ON monthly_budgets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "Service role can manage monthly budgets"
ON monthly_budgets FOR ALL
USING (true)
WITH CHECK (true);

-- Create cost alerts table
CREATE TABLE IF NOT EXISTS cost_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Alert Information
    alert_type TEXT NOT NULL CHECK (alert_type IN ('daily_50', 'daily_80', 'daily_100', 'monthly_50', 'monthly_80', 'monthly_100', 'auto_pause')),
    budget_type TEXT NOT NULL CHECK (budget_type IN ('daily', 'monthly')),
    threshold_percent INTEGER NOT NULL, -- 50, 80, 100
    
    -- Budget Context
    budget_date DATE, -- For daily budgets
    budget_month DATE, -- For monthly budgets
    
    -- Cost Information
    budget_limit NUMERIC NOT NULL,
    cost_spent NUMERIC NOT NULL,
    cost_percent NUMERIC NOT NULL, -- Percentage of budget used
    
    -- Status
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notification_channels TEXT[], -- ['email', 'slack', 'webhook']
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cost_alerts_type ON cost_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_date ON cost_alerts(budget_date DESC);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_month ON cost_alerts(budget_month DESC);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_sent_at ON cost_alerts(sent_at DESC);

-- RLS Policies
ALTER TABLE cost_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view cost alerts"
ON cost_alerts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "Service role can manage cost alerts"
ON cost_alerts FOR ALL
USING (true)
WITH CHECK (true);

-- Function to check and trigger cost alerts
CREATE OR REPLACE FUNCTION check_and_trigger_cost_alerts()
RETURNS TABLE (
    alerts_triggered INTEGER,
    auto_paused BOOLEAN
) AS $$
DECLARE
    v_daily_budget RECORD;
    v_monthly_budget RECORD;
    v_cost_percent NUMERIC;
    v_alerts_triggered INTEGER := 0;
    v_auto_paused BOOLEAN := FALSE;
    v_today DATE := CURRENT_DATE;
    v_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
BEGIN
    -- Get today's daily budget
    SELECT * INTO v_daily_budget
    FROM daily_budgets
    WHERE budget_date = v_today;
    
    -- Get current month's budget
    SELECT * INTO v_monthly_budget
    FROM monthly_budgets
    WHERE budget_month = v_month_start;
    
    -- Create monthly budget if doesn't exist
    IF v_monthly_budget IS NULL THEN
        INSERT INTO monthly_budgets (budget_month, max_cost_usd)
        VALUES (v_month_start, 1500.00)
        ON CONFLICT (budget_month) DO NOTHING
        RETURNING * INTO v_monthly_budget;
    END IF;
    
    -- Check daily budget alerts
    IF v_daily_budget IS NOT NULL AND v_daily_budget.max_cost_usd > 0 THEN
        v_cost_percent := (v_daily_budget.cost_spent_usd / v_daily_budget.max_cost_usd) * 100;
        
        -- 50% alert
        IF v_cost_percent >= 50 AND NOT ('daily_50' = ANY(v_daily_budget.alerts_sent)) THEN
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_date, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'daily_50', 'daily', 50,
                v_today, v_daily_budget.max_cost_usd, v_daily_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            UPDATE daily_budgets
            SET alerts_sent = array_append(COALESCE(alerts_sent, '{}'), 'daily_50'),
                last_alert_at = NOW()
            WHERE budget_date = v_today;
            
            v_alerts_triggered := v_alerts_triggered + 1;
        END IF;
        
        -- 80% alert
        IF v_cost_percent >= 80 AND NOT ('daily_80' = ANY(v_daily_budget.alerts_sent)) THEN
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_date, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'daily_80', 'daily', 80,
                v_today, v_daily_budget.max_cost_usd, v_daily_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            UPDATE daily_budgets
            SET alerts_sent = array_append(COALESCE(alerts_sent, '{}'), 'daily_80'),
                last_alert_at = NOW()
            WHERE budget_date = v_today;
            
            v_alerts_triggered := v_alerts_triggered + 1;
        END IF;
        
        -- 100% alert and auto-pause
        IF v_cost_percent >= 100 AND NOT ('daily_100' = ANY(v_daily_budget.alerts_sent)) THEN
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_date, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'daily_100', 'daily', 100,
                v_today, v_daily_budget.max_cost_usd, v_daily_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            -- Auto-pause
            UPDATE daily_budgets
            SET is_paused = TRUE,
                alerts_sent = array_append(COALESCE(alerts_sent, '{}'), 'daily_100'),
                last_alert_at = NOW()
            WHERE budget_date = v_today;
            
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_date, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'auto_pause', 'daily', 100,
                v_today, v_daily_budget.max_cost_usd, v_daily_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            v_auto_paused := TRUE;
            v_alerts_triggered := v_alerts_triggered + 2;
        END IF;
    END IF;
    
    -- Check monthly budget alerts
    IF v_monthly_budget IS NOT NULL AND v_monthly_budget.max_cost_usd > 0 THEN
        v_cost_percent := (v_monthly_budget.cost_spent_usd / v_monthly_budget.max_cost_usd) * 100;
        
        -- 50% alert
        IF v_cost_percent >= 50 AND NOT v_monthly_budget.alert_50_percent_sent THEN
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_month, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'monthly_50', 'monthly', 50,
                v_month_start, v_monthly_budget.max_cost_usd, v_monthly_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            UPDATE monthly_budgets
            SET alert_50_percent_sent = TRUE
            WHERE budget_month = v_month_start;
            
            v_alerts_triggered := v_alerts_triggered + 1;
        END IF;
        
        -- 80% alert
        IF v_cost_percent >= 80 AND NOT v_monthly_budget.alert_80_percent_sent THEN
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_month, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'monthly_80', 'monthly', 80,
                v_month_start, v_monthly_budget.max_cost_usd, v_monthly_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            UPDATE monthly_budgets
            SET alert_80_percent_sent = TRUE
            WHERE budget_month = v_month_start;
            
            v_alerts_triggered := v_alerts_triggered + 1;
        END IF;
        
        -- 100% alert and auto-pause
        IF v_cost_percent >= 100 AND NOT v_monthly_budget.alert_100_percent_sent THEN
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_month, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'monthly_100', 'monthly', 100,
                v_month_start, v_monthly_budget.max_cost_usd, v_monthly_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            -- Auto-pause monthly budget
            UPDATE monthly_budgets
            SET is_paused = TRUE,
                alert_100_percent_sent = TRUE
            WHERE budget_month = v_month_start;
            
            INSERT INTO cost_alerts (
                alert_type, budget_type, threshold_percent,
                budget_month, budget_limit, cost_spent, cost_percent,
                notification_channels
            ) VALUES (
                'auto_pause', 'monthly', 100,
                v_month_start, v_monthly_budget.max_cost_usd, v_monthly_budget.cost_spent_usd, v_cost_percent,
                ARRAY['email', 'axiom']
            );
            
            v_auto_paused := TRUE;
            v_alerts_triggered := v_alerts_triggered + 2;
        END IF;
    END IF;
    
    RETURN QUERY SELECT v_alerts_triggered, v_auto_paused;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update monthly budget from daily costs
CREATE OR REPLACE FUNCTION update_monthly_budget_from_daily_costs()
RETURNS void AS $$
DECLARE
    v_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
    v_month_end DATE := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    v_total_cost NUMERIC;
BEGIN
    -- Calculate total cost for current month from content_costs
    SELECT COALESCE(SUM(total_cost), 0) INTO v_total_cost
    FROM content_costs
    WHERE generation_date >= v_month_start
    AND generation_date <= v_month_end;
    
    -- Update or insert monthly budget
    INSERT INTO monthly_budgets (budget_month, cost_spent_usd)
    VALUES (v_month_start, v_total_cost)
    ON CONFLICT (budget_month)
    DO UPDATE SET
        cost_spent_usd = v_total_cost,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function to record cost with alert checking
CREATE OR REPLACE FUNCTION record_content_cost_with_alerts(
    p_article_id UUID,
    p_tokens INTEGER,
    p_cost NUMERIC,
    p_provider TEXT,
    p_model TEXT,
    p_images INTEGER DEFAULT 0,
    p_image_cost NUMERIC DEFAULT 0
)
RETURNS TABLE (
    cost_recorded BOOLEAN,
    alerts_triggered INTEGER,
    auto_paused BOOLEAN
) AS $$
DECLARE
    v_total_cost NUMERIC;
    v_alerts_result RECORD;
BEGIN
    -- Record the cost (existing logic)
    PERFORM record_content_cost(
        p_article_id,
        p_tokens,
        p_cost,
        p_provider,
        p_model,
        p_images,
        p_image_cost
    );
    
    -- Update monthly budget
    PERFORM update_monthly_budget_from_daily_costs();
    
    -- Check and trigger alerts
    SELECT * INTO v_alerts_result
    FROM check_and_trigger_cost_alerts();
    
    RETURN QUERY SELECT TRUE, v_alerts_result.alerts_triggered, v_alerts_result.auto_paused;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cost breakdown by provider
CREATE OR REPLACE FUNCTION get_cost_breakdown_by_provider(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    provider TEXT,
    total_cost NUMERIC,
    total_tokens INTEGER,
    total_images INTEGER,
    operation_count BIGINT,
    avg_cost_per_operation NUMERIC
) AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    v_start_date := COALESCE(p_start_date, DATE_TRUNC('month', CURRENT_DATE)::DATE);
    v_end_date := COALESCE(p_end_date, CURRENT_DATE);
    
    RETURN QUERY
    SELECT
        COALESCE(cc.ai_provider, 'unknown') as provider,
        SUM(cc.total_cost) as total_cost,
        SUM(cc.ai_tokens_used)::INTEGER as total_tokens,
        SUM(cc.images_generated)::INTEGER as total_images,
        COUNT(*) as operation_count,
        AVG(cc.total_cost) as avg_cost_per_operation
    FROM content_costs cc
    WHERE cc.generation_date >= v_start_date
    AND cc.generation_date <= v_end_date
    GROUP BY cc.ai_provider
    ORDER BY total_cost DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cost breakdown by operation type
CREATE OR REPLACE FUNCTION get_cost_breakdown_by_operation(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    operation_type TEXT,
    total_cost NUMERIC,
    operation_count BIGINT,
    avg_cost_per_operation NUMERIC
) AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    v_start_date := COALESCE(p_start_date, DATE_TRUNC('month', CURRENT_DATE)::DATE);
    v_end_date := COALESCE(p_end_date, CURRENT_DATE);
    
    -- Infer operation type from model name
    RETURN QUERY
    SELECT
        CASE
            WHEN cc.ai_model LIKE '%gpt-4%' OR cc.ai_model LIKE '%claude-3%' THEN 'premium_content'
            WHEN cc.ai_model LIKE '%gpt-3.5%' OR cc.ai_model LIKE '%gemini%' THEN 'standard_content'
            WHEN cc.ai_model LIKE '%groq%' OR cc.ai_model LIKE '%mistral%' THEN 'budget_content'
            WHEN cc.images_generated > 0 THEN 'image_generation'
            ELSE 'other'
        END as operation_type,
        SUM(cc.total_cost) as total_cost,
        COUNT(*) as operation_count,
        AVG(cc.total_cost) as avg_cost_per_operation
    FROM content_costs cc
    WHERE cc.generation_date >= v_start_date
    AND cc.generation_date <= v_end_date
    GROUP BY operation_type
    ORDER BY total_cost DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get projected monthly cost
CREATE OR REPLACE FUNCTION get_projected_monthly_cost()
RETURNS TABLE (
    current_month_cost NUMERIC,
    days_elapsed INTEGER,
    days_in_month INTEGER,
    projected_monthly_cost NUMERIC,
    budget_limit NUMERIC,
    budget_remaining NUMERIC,
    projected_over_budget BOOLEAN
) AS $$
DECLARE
    v_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
    v_month_end DATE := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    v_current_cost NUMERIC;
    v_days_elapsed INTEGER;
    v_days_in_month INTEGER;
    v_projected_cost NUMERIC;
    v_budget_limit NUMERIC;
    v_budget_remaining NUMERIC;
    v_over_budget BOOLEAN;
BEGIN
    -- Get current month cost
    SELECT COALESCE(SUM(total_cost), 0) INTO v_current_cost
    FROM content_costs
    WHERE generation_date >= v_month_start
    AND generation_date <= CURRENT_DATE;
    
    -- Calculate days
    v_days_elapsed := EXTRACT(DAY FROM CURRENT_DATE)::INTEGER;
    v_days_in_month := EXTRACT(DAY FROM v_month_end)::INTEGER;
    
    -- Project monthly cost (linear projection)
    IF v_days_elapsed > 0 THEN
        v_projected_cost := (v_current_cost / v_days_elapsed) * v_days_in_month;
    ELSE
        v_projected_cost := 0;
    END IF;
    
    -- Get budget limit
    SELECT max_cost_usd INTO v_budget_limit
    FROM monthly_budgets
    WHERE budget_month = v_month_start;
    
    IF v_budget_limit IS NULL THEN
        v_budget_limit := 1500.00; -- Default
    END IF;
    
    v_budget_remaining := GREATEST(0, v_budget_limit - v_current_cost);
    v_over_budget := v_projected_cost > v_budget_limit;
    
    RETURN QUERY SELECT
        v_current_cost,
        v_days_elapsed,
        v_days_in_month,
        v_projected_cost,
        v_budget_limit,
        v_budget_remaining,
        v_over_budget;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE monthly_budgets IS 'Monthly budget tracking for AI costs';
COMMENT ON TABLE cost_alerts IS 'Tracks all cost-related alerts sent to admins';
COMMENT ON FUNCTION check_and_trigger_cost_alerts IS 'Checks budget thresholds and triggers alerts automatically';
COMMENT ON FUNCTION record_content_cost_with_alerts IS 'Records cost and automatically checks for alerts';
COMMENT ON FUNCTION get_cost_breakdown_by_provider IS 'Returns cost breakdown by AI provider';
COMMENT ON FUNCTION get_cost_breakdown_by_operation IS 'Returns cost breakdown by operation type';
COMMENT ON FUNCTION get_projected_monthly_cost IS 'Calculates projected monthly cost based on current spending';
