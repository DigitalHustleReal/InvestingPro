-- Database Query Optimization & Monitoring
-- Creates tables and functions for query performance tracking

-- Query Performance Log Table
CREATE TABLE IF NOT EXISTS query_performance_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash TEXT NOT NULL,
    query_text TEXT NOT NULL,
    query_type TEXT, -- SELECT, INSERT, UPDATE, DELETE
    table_name TEXT,
    execution_time_ms NUMERIC NOT NULL,
    rows_returned INTEGER,
    rows_affected INTEGER,
    connection_id TEXT,
    application_name TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for query performance log
CREATE INDEX IF NOT EXISTS idx_query_perf_hash ON query_performance_log(query_hash);
CREATE INDEX IF NOT EXISTS idx_query_perf_time ON query_performance_log(execution_time_ms DESC);
CREATE INDEX IF NOT EXISTS idx_query_perf_created ON query_performance_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_perf_table ON query_performance_log(table_name);
CREATE INDEX IF NOT EXISTS idx_query_perf_type ON query_performance_log(query_type);

-- Slow Query Summary Table (aggregated)
CREATE TABLE IF NOT EXISTS slow_query_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash TEXT NOT NULL UNIQUE,
    query_text TEXT NOT NULL,
    query_type TEXT,
    table_name TEXT,
    avg_execution_time_ms NUMERIC NOT NULL,
    max_execution_time_ms NUMERIC NOT NULL,
    min_execution_time_ms NUMERIC NOT NULL,
    call_count INTEGER NOT NULL DEFAULT 1,
    total_execution_time_ms NUMERIC NOT NULL,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for slow query summary
CREATE INDEX IF NOT EXISTS idx_slow_query_avg_time ON slow_query_summary(avg_execution_time_ms DESC);
CREATE INDEX IF NOT EXISTS idx_slow_query_last_seen ON slow_query_summary(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_slow_query_table ON slow_query_summary(table_name);

-- Table Size Tracking Table
CREATE TABLE IF NOT EXISTS table_size_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    table_size_bytes BIGINT NOT NULL,
    index_size_bytes BIGINT NOT NULL,
    total_size_bytes BIGINT NOT NULL,
    row_count BIGINT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(table_name, recorded_at)
);

-- Index for table size history
CREATE INDEX IF NOT EXISTS idx_table_size_history_table ON table_size_history(table_name);
CREATE INDEX IF NOT EXISTS idx_table_size_history_recorded ON table_size_history(recorded_at DESC);

-- Function to log query performance
CREATE OR REPLACE FUNCTION log_query_performance(
    p_query_hash TEXT,
    p_query_text TEXT,
    p_query_type TEXT,
    p_table_name TEXT,
    p_execution_time_ms NUMERIC,
    p_rows_returned INTEGER DEFAULT NULL,
    p_rows_affected INTEGER DEFAULT NULL,
    p_connection_id TEXT DEFAULT NULL,
    p_application_name TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO query_performance_log (
        query_hash,
        query_text,
        query_type,
        table_name,
        execution_time_ms,
        rows_returned,
        rows_affected,
        connection_id,
        application_name,
        user_id
    )
    VALUES (
        p_query_hash,
        p_query_text,
        p_query_type,
        p_table_name,
        p_execution_time_ms,
        p_rows_returned,
        p_rows_affected,
        p_connection_id,
        p_application_name,
        p_user_id
    )
    RETURNING id INTO log_id;

    -- Update slow query summary if query is slow (>1000ms)
    IF p_execution_time_ms > 1000 THEN
        INSERT INTO slow_query_summary (
            query_hash,
            query_text,
            query_type,
            table_name,
            avg_execution_time_ms,
            max_execution_time_ms,
            min_execution_time_ms,
            call_count,
            total_execution_time_ms,
            first_seen,
            last_seen
        )
        VALUES (
            p_query_hash,
            p_query_text,
            p_query_type,
            p_table_name,
            p_execution_time_ms,
            p_execution_time_ms,
            p_execution_time_ms,
            1,
            p_execution_time_ms,
            NOW(),
            NOW()
        )
        ON CONFLICT (query_hash) DO UPDATE SET
            avg_execution_time_ms = (slow_query_summary.total_execution_time_ms + p_execution_time_ms) / (slow_query_summary.call_count + 1),
            max_execution_time_ms = GREATEST(slow_query_summary.max_execution_time_ms, p_execution_time_ms),
            min_execution_time_ms = LEAST(slow_query_summary.min_execution_time_ms, p_execution_time_ms),
            call_count = slow_query_summary.call_count + 1,
            total_execution_time_ms = slow_query_summary.total_execution_time_ms + p_execution_time_ms,
            last_seen = NOW();
    END IF;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to record table sizes
CREATE OR REPLACE FUNCTION record_table_sizes()
RETURNS TABLE (
    table_name TEXT,
    table_size_bytes BIGINT,
    index_size_bytes BIGINT,
    total_size_bytes BIGINT,
    row_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname || '.' || tablename::TEXT as table_name,
        pg_total_relation_size(schemaname || '.' || tablename) as table_size_bytes,
        pg_indexes_size(schemaname || '.' || tablename) as index_size_bytes,
        pg_total_relation_size(schemaname || '.' || tablename) as total_size_bytes,
        (SELECT reltuples::BIGINT FROM pg_class WHERE relname = tablename) as row_count
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get connection pool stats
CREATE OR REPLACE FUNCTION get_connection_pool_stats()
RETURNS TABLE (
    database_name TEXT,
    active_connections INTEGER,
    max_connections INTEGER,
    connection_usage_percent NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        datname::TEXT as database_name,
        (SELECT count(*) FROM pg_stat_activity WHERE datname = d.datname)::INTEGER as active_connections,
        (SELECT setting::INTEGER FROM pg_settings WHERE name = 'max_connections')::INTEGER as max_connections,
        ROUND(
            (SELECT count(*)::NUMERIC FROM pg_stat_activity WHERE datname = d.datname) /
            (SELECT setting::NUMERIC FROM pg_settings WHERE name = 'max_connections') * 100,
            2
        ) as connection_usage_percent
    FROM pg_database d
    WHERE d.datname = current_database();
END;
$$ LANGUAGE plpgsql;

-- Function to get slow queries (last 24 hours)
CREATE OR REPLACE FUNCTION get_slow_queries(threshold_ms NUMERIC DEFAULT 1000)
RETURNS TABLE (
    query_hash TEXT,
    query_text TEXT,
    query_type TEXT,
    table_name TEXT,
    avg_execution_time_ms NUMERIC,
    max_execution_time_ms NUMERIC,
    call_count INTEGER,
    last_seen TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.query_hash,
        s.query_text,
        s.query_type,
        s.table_name,
        s.avg_execution_time_ms,
        s.max_execution_time_ms,
        s.call_count,
        s.last_seen
    FROM slow_query_summary s
    WHERE s.avg_execution_time_ms >= threshold_ms
        AND s.last_seen >= NOW() - INTERVAL '24 hours'
    ORDER BY s.avg_execution_time_ms DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Function to get table size growth (last 7 days)
CREATE OR REPLACE FUNCTION get_table_size_growth()
RETURNS TABLE (
    table_name TEXT,
    current_size_bytes BIGINT,
    size_7_days_ago_bytes BIGINT,
    growth_bytes BIGINT,
    growth_percent NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH current_sizes AS (
        SELECT
            table_name,
            total_size_bytes,
            recorded_at
        FROM table_size_history
        WHERE recorded_at >= NOW() - INTERVAL '1 day'
    ),
    old_sizes AS (
        SELECT
            table_name,
            total_size_bytes,
            recorded_at
        FROM table_size_history
        WHERE recorded_at >= NOW() - INTERVAL '8 days'
            AND recorded_at < NOW() - INTERVAL '6 days'
    )
    SELECT
        c.table_name,
        c.total_size_bytes as current_size_bytes,
        COALESCE(o.total_size_bytes, 0) as size_7_days_ago_bytes,
        c.total_size_bytes - COALESCE(o.total_size_bytes, 0) as growth_bytes,
        CASE
            WHEN COALESCE(o.total_size_bytes, 0) > 0 THEN
                ROUND(((c.total_size_bytes - o.total_size_bytes)::NUMERIC / o.total_size_bytes) * 100, 2)
            ELSE 0
        END as growth_percent
    FROM current_sizes c
    LEFT JOIN old_sizes o ON c.table_name = o.table_name
    WHERE c.total_size_bytes > COALESCE(o.total_size_bytes, 0)
    ORDER BY growth_percent DESC;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE query_performance_log IS 'Logs all query performance metrics';
COMMENT ON TABLE slow_query_summary IS 'Aggregated summary of slow queries';
COMMENT ON TABLE table_size_history IS 'Historical tracking of table sizes';
COMMENT ON FUNCTION log_query_performance IS 'Logs query performance and updates slow query summary';
COMMENT ON FUNCTION record_table_sizes IS 'Records current table sizes for growth tracking';
COMMENT ON FUNCTION get_connection_pool_stats IS 'Returns connection pool usage statistics';
COMMENT ON FUNCTION get_slow_queries IS 'Returns slow queries from the last 24 hours';
COMMENT ON FUNCTION get_table_size_growth IS 'Returns table size growth over the last 7 days';

-- Enable RLS
ALTER TABLE query_performance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE slow_query_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_size_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can read monitoring data
CREATE POLICY "Admin users can read query performance log"
    ON query_performance_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin users can read slow query summary"
    ON slow_query_summary
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin users can read table size history"
    ON table_size_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Service role can insert (for monitoring scripts)
CREATE POLICY "Service role can insert query performance log"
    ON query_performance_log
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can insert table size history"
    ON table_size_history
    FOR INSERT
    WITH CHECK (true);
