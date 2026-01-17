-- API Timing Tracking Table
-- Stores API response time metrics for performance monitoring

CREATE TABLE IF NOT EXISTS api_timing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Request Information
    method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD')),
    path TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    status_code INTEGER NOT NULL,
    
    -- Optional Context
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_agent TEXT,
    ip_address TEXT,
    
    -- Metadata
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_api_timing_method ON api_timing(method);
CREATE INDEX IF NOT EXISTS idx_api_timing_path ON api_timing(path);
CREATE INDEX IF NOT EXISTS idx_api_timing_timestamp ON api_timing(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_timing_duration ON api_timing(duration_ms DESC);
CREATE INDEX IF NOT EXISTS idx_api_timing_status ON api_timing(status_code);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_api_timing_path_timestamp ON api_timing(path, timestamp DESC);

-- Partial index for slow requests (helps with performance analysis)
CREATE INDEX IF NOT EXISTS idx_api_timing_slow ON api_timing(path, duration_ms DESC) 
WHERE duration_ms >= 2000;

-- RLS Policies
ALTER TABLE api_timing ENABLE ROW LEVEL SECURITY;

-- Service role can insert timing metrics (from API middleware)
CREATE POLICY "Service can insert API timing"
ON api_timing FOR INSERT
WITH CHECK (true);

-- Admins can view all timing metrics
CREATE POLICY "Admins can view API timing"
ON api_timing FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Function to get average response times by path
CREATE OR REPLACE FUNCTION get_api_timing_average(
    p_path TEXT DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS TABLE (
    method TEXT,
    path TEXT,
    avg_duration_ms NUMERIC,
    min_duration_ms NUMERIC,
    max_duration_ms NUMERIC,
    p50_duration_ms NUMERIC,
    p95_duration_ms NUMERIC,
    p99_duration_ms NUMERIC,
    request_count BIGINT,
    error_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT
            at.method,
            at.path,
            at.duration_ms,
            CASE WHEN at.status_code >= 400 THEN 1 ELSE 0 END as is_error
        FROM api_timing at
        WHERE (p_path IS NULL OR at.path = p_path)
        AND (p_start_date IS NULL OR at.timestamp >= p_start_date)
        AND (p_end_date IS NULL OR at.timestamp <= p_end_date)
    )
    SELECT
        stats.method,
        stats.path,
        AVG(stats.duration_ms)::NUMERIC as avg_duration_ms,
        MIN(stats.duration_ms)::NUMERIC as min_duration_ms,
        MAX(stats.duration_ms)::NUMERIC as max_duration_ms,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY stats.duration_ms)::NUMERIC as p50_duration_ms,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY stats.duration_ms)::NUMERIC as p95_duration_ms,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY stats.duration_ms)::NUMERIC as p99_duration_ms,
        COUNT(*)::BIGINT as request_count,
        SUM(stats.is_error)::BIGINT as error_count
    FROM stats
    GROUP BY stats.method, stats.path
    ORDER BY avg_duration_ms DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE api_timing IS 'Stores API response time metrics for performance monitoring';
COMMENT ON FUNCTION get_api_timing_average IS 'Get average API response times with percentiles';
