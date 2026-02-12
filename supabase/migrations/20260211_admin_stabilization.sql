-- ============================================================================
-- ADMIN STABILIZATION MIGRATION
-- Date: 2026-02-11
-- Description: Adds indices for performance, fixes permissions, and adds
--              an optimized RPC for the revenue dashboard to prevent timeouts.
-- ============================================================================

-- 1. Performance Indices
-- ============================================================================

-- Health Monitor uses created_at for 24h filtering
DROP INDEX IF EXISTS idx_agent_executions_created_at;
CREATE INDEX idx_agent_executions_created_at ON agent_executions(created_at DESC);

-- CMS Dashboard uses status and triggered_at
DROP INDEX IF EXISTS idx_pipeline_runs_triggered_at;
CREATE INDEX idx_pipeline_runs_triggered_at ON pipeline_runs(triggered_at DESC);
DROP INDEX IF EXISTS idx_pipeline_runs_status_triggered;
CREATE INDEX idx_pipeline_runs_status_triggered ON pipeline_runs(status, triggered_at DESC);

-- Scrapers dashboard likely queries by status/last_run
CREATE TABLE IF NOT EXISTS scrapers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT,
    last_run_at TIMESTAMPTZ
); 
DROP INDEX IF EXISTS idx_scrapers_last_run_at;
CREATE INDEX idx_scrapers_last_run_at ON scrapers(last_run_at DESC);

-- Revenue queries
DROP INDEX IF EXISTS idx_affiliate_clicks_conversion_date;
CREATE INDEX idx_affiliate_clicks_conversion_date ON affiliate_clicks(conversion_date);
DROP INDEX IF EXISTS idx_affiliate_clicks_converted;
CREATE INDEX idx_affiliate_clicks_converted ON affiliate_clicks(converted) WHERE converted = true;


-- 2. Permission Fixes for Revenue Tables
-- ============================================================================

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Allow admins full access
DROP POLICY IF EXISTS "Admins full access to affiliate_clicks" ON affiliate_clicks;
CREATE POLICY "Admins full access to affiliate_clicks" ON affiliate_clicks
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow service role full access (redundant but safe)
DROP POLICY IF EXISTS "Service role full access to affiliate_clicks" ON affiliate_clicks;
CREATE POLICY "Service role full access to affiliate_clicks" ON affiliate_clicks
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);


-- 3. Optimized Revenue Dashboard RPC (Replaces 50+ DB calls)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_revenue_dashboard_metrics(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() - INTERVAL '30 days'),
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_month_start TIMESTAMP WITH TIME ZONE;
    v_previous_month_start TIMESTAMP WITH TIME ZONE;
    v_previous_month_end TIMESTAMP WITH TIME ZONE;
    
    v_current_revenue NUMERIC;
    v_previous_revenue NUMERIC;
    v_growth NUMERIC;
    
    v_category_stats JSONB;
    v_conversion_stats JSONB;
    v_daily_trends JSONB;
    v_weekly_trends JSONB;
    v_monthly_trends JSONB;
BEGIN
    -- Calculate dates
    v_current_month_start := date_trunc('month', NOW());
    v_previous_month_start := date_trunc('month', NOW() - INTERVAL '1 month');
    v_previous_month_end := date_trunc('month', NOW()) - INTERVAL '1 millisecond';
    
    -- 1. Total Revenue (Current vs Previous Month)
    SELECT COALESCE(SUM(commission_earned), 0)
    INTO v_current_revenue
    FROM affiliate_clicks
    WHERE converted = true
    AND conversion_date >= v_current_month_start;

    SELECT COALESCE(SUM(commission_earned), 0)
    INTO v_previous_revenue
    FROM affiliate_clicks
    WHERE converted = true
    AND conversion_date >= v_previous_month_start
    AND conversion_date <= v_previous_month_end;

    IF v_previous_revenue > 0 THEN
        v_growth := ((v_current_revenue - v_previous_revenue) / v_previous_revenue) * 100;
    ELSE
        v_growth := 0;
    END IF;

    -- 2. Revenue by Category (Current Month)
    SELECT jsonb_object_agg(cat, rev)
    INTO v_category_stats
    FROM (
        SELECT 
            CASE 
                WHEN product_type ILIKE '%credit%' THEN 'creditCards'
                WHEN product_type ILIKE '%mutual%' OR product_type ILIKE '%stock%' THEN 'mutualFunds'
                WHEN product_type ILIKE '%insurance%' THEN 'insurance'
                ELSE 'others'
            END as cat,
            SUM(commission_earned) as rev
        FROM affiliate_clicks
        WHERE converted = true
        AND conversion_date >= v_current_month_start
        GROUP BY 1
    ) t;

    -- 3. Conversion Rates (Current Month)
    SELECT jsonb_build_object(
        'overall', CASE WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE converted = true)::NUMERIC / COUNT(*)) * 100 ELSE 0 END,
        'creditCards', CASE WHEN COUNT(*) FILTER (WHERE product_type ILIKE '%credit%') > 0 THEN (COUNT(*) FILTER (WHERE converted = true AND product_type ILIKE '%credit%')::NUMERIC / COUNT(*) FILTER (WHERE product_type ILIKE '%credit%')) * 100 ELSE 0 END,
        'mutualFunds', CASE WHEN COUNT(*) FILTER (WHERE product_type ILIKE '%mutual%' OR product_type ILIKE '%stock%') > 0 THEN (COUNT(*) FILTER (WHERE converted = true AND (product_type ILIKE '%mutual%' OR product_type ILIKE '%stock%'))::NUMERIC / COUNT(*) FILTER (WHERE product_type ILIKE '%mutual%' OR product_type ILIKE '%stock%')) * 100 ELSE 0 END
    )
    INTO v_conversion_stats
    FROM affiliate_clicks
    WHERE created_at >= v_current_month_start;

    -- 4. Daily Trends (Last 30 days based on input or default)
    SELECT jsonb_agg(jsonb_build_object('date', day, 'revenue', COALESCE(rev, 0)))
    INTO v_daily_trends
    FROM (
        SELECT 
            d.day::DATE,
            SUM(ac.commission_earned) as rev
        FROM generate_series(p_start_date, p_end_date, '1 day'::interval) d(day)
        LEFT JOIN affiliate_clicks ac 
            ON ac.conversion_date::DATE = d.day::DATE 
            AND ac.converted = true
        GROUP BY 1
        ORDER BY 1
    ) t;

    -- 5. Weekly Trends (Last 12 weeks)
    SELECT jsonb_agg(jsonb_build_object('week', week_label, 'revenue', COALESCE(rev, 0)))
    INTO v_weekly_trends
    FROM (
        SELECT 
            to_char(d.week, '"Week" W') as week_label,
            SUM(ac.commission_earned) as rev
        FROM generate_series(date_trunc('week', NOW() - INTERVAL '11 weeks'), date_trunc('week', NOW()), '1 week'::interval) d(week)
        LEFT JOIN affiliate_clicks ac 
            ON date_trunc('week', ac.conversion_date) = d.week
            AND ac.converted = true
        GROUP BY 1, d.week
        ORDER BY d.week
    ) t;

    -- 6. Monthly Trends (Last 12 months)
    SELECT jsonb_agg(jsonb_build_object('month', month_label, 'revenue', COALESCE(rev, 0)))
    INTO v_monthly_trends
    FROM (
        SELECT 
            to_char(d.month, 'Mon YYYY') as month_label,
            SUM(ac.commission_earned) as rev
        FROM generate_series(date_trunc('month', NOW() - INTERVAL '11 months'), date_trunc('month', NOW()), '1 month'::interval) d(month)
        LEFT JOIN affiliate_clicks ac 
            ON date_trunc('month', ac.conversion_date) = d.month
            AND ac.converted = true
        GROUP BY 1, d.month
        ORDER BY d.month
    ) t;

    -- Construct Final JSON
    RETURN jsonb_build_object(
        'totalRevenue', jsonb_build_object(
            'current', COALESCE(v_current_revenue, 0),
            'previous', COALESCE(v_previous_revenue, 0),
            'growth', COALESCE(v_growth, 0)
        ),
        'revenueByCategory', COALESCE(v_category_stats, '{"creditCards": 0, "mutualFunds": 0, "insurance": 0, "others": 0}'::jsonb),
        'conversionRates', COALESCE(v_conversion_stats, '{"overall": 0, "creditCards": 0, "mutualFunds": 0}'::jsonb),
        'trends', jsonb_build_object(
            'daily', COALESCE(v_daily_trends, '[]'::jsonb),
            'weekly', COALESCE(v_weekly_trends, '[]'::jsonb),
            'monthly', COALESCE(v_monthly_trends, '[]'::jsonb)
        )
    );
END;
$$;

-- Grant access
REVOKE EXECUTE ON FUNCTION get_revenue_dashboard_metrics FROM public;
GRANT EXECUTE ON FUNCTION get_revenue_dashboard_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_dashboard_metrics TO service_role;
