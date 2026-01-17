-- Web Vitals Tracking Table
-- Stores Core Web Vitals metrics for performance monitoring

CREATE TABLE IF NOT EXISTS web_vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metric Information
    metric_name TEXT NOT NULL CHECK (metric_name IN ('LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP')),
    metric_value NUMERIC NOT NULL,
    metric_id TEXT, -- Unique ID for the metric instance
    rating TEXT NOT NULL CHECK (rating IN ('good', 'needs-improvement', 'poor')),
    delta NUMERIC, -- Change from previous value
    
    -- Context
    url TEXT, -- Page URL
    user_agent TEXT, -- Browser user agent
    viewport_width INTEGER, -- Viewport width
    viewport_height INTEGER, -- Viewport height
    
    -- Metadata
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT, -- Optional session ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_web_vitals_name ON web_vitals(metric_name);
CREATE INDEX IF NOT EXISTS idx_web_vitals_rating ON web_vitals(rating);
CREATE INDEX IF NOT EXISTS idx_web_vitals_timestamp ON web_vitals(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_web_vitals_url ON web_vitals(url);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_web_vitals_name_timestamp ON web_vitals(metric_name, timestamp DESC);

-- RLS Policies
ALTER TABLE web_vitals ENABLE ROW LEVEL SECURITY;

-- Public can insert metrics (non-authenticated)
CREATE POLICY "Public can insert web vitals"
ON web_vitals FOR INSERT
WITH CHECK (true);

-- Admins can view all metrics
CREATE POLICY "Admins can view web vitals"
ON web_vitals FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Function to get average metrics by name
CREATE OR REPLACE FUNCTION get_web_vitals_average(
    p_metric_name TEXT,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS TABLE (
    metric_name TEXT,
    avg_value NUMERIC,
    min_value NUMERIC,
    max_value NUMERIC,
    good_count BIGINT,
    needs_improvement_count BIGINT,
    poor_count BIGINT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        wv.metric_name,
        AVG(wv.metric_value)::NUMERIC as avg_value,
        MIN(wv.metric_value)::NUMERIC as min_value,
        MAX(wv.metric_value)::NUMERIC as max_value,
        COUNT(*) FILTER (WHERE wv.rating = 'good')::BIGINT as good_count,
        COUNT(*) FILTER (WHERE wv.rating = 'needs-improvement')::BIGINT as needs_improvement_count,
        COUNT(*) FILTER (WHERE wv.rating = 'poor')::BIGINT as poor_count,
        COUNT(*)::BIGINT as total_count
    FROM web_vitals wv
    WHERE wv.metric_name = p_metric_name
    AND (p_start_date IS NULL OR wv.timestamp >= p_start_date)
    AND (p_end_date IS NULL OR wv.timestamp <= p_end_date)
    GROUP BY wv.metric_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE web_vitals IS 'Stores Core Web Vitals metrics for performance monitoring';
COMMENT ON FUNCTION get_web_vitals_average IS 'Get average Web Vitals metrics for a specific metric name';
