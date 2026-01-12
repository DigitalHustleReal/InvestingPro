-- Scraper Management & Data Update Tracking Schema
-- Tracks all scrapers, their runs, and data updates

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SCRAPER REGISTRY
-- ============================================================================

CREATE TABLE IF NOT EXISTS scrapers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Scraper Identity
    name TEXT NOT NULL UNIQUE, -- e.g., 'credit-cards-hdfc', 'loans-paisabazaar'
    display_name TEXT NOT NULL, -- e.g., 'HDFC Credit Cards Scraper'
    category TEXT NOT NULL CHECK (category IN ('credit-cards', 'loans', 'insurance', 'mutual-funds', 'reviews', 'rates', 'other')),
    
    -- Configuration
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('bank-website', 'aggregator', 'api', 'rss', 'other')),
    script_path TEXT, -- Path to scraper script
    
    -- Scheduling
    schedule_type TEXT DEFAULT 'manual' CHECK (schedule_type IN ('manual', 'daily', 'weekly', 'monthly', 'continuous')),
    schedule_config JSONB, -- { "interval": "24h", "time": "02:00", "timezone": "Asia/Kolkata" }
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    description TEXT,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scrapers_category ON scrapers(category);
CREATE INDEX IF NOT EXISTS idx_scrapers_active ON scrapers(is_active);
CREATE INDEX IF NOT EXISTS idx_scrapers_next_run ON scrapers(next_run_at) WHERE is_active = TRUE;

-- ============================================================================
-- 2. SCRAPER RUNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS scraper_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scraper_id UUID REFERENCES scrapers(id) ON DELETE CASCADE,
    
    -- Run Info
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Results
    items_scraped INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_created INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    
    -- Errors
    error_message TEXT,
    error_stack TEXT,
    
    -- Execution Data
    execution_time_ms INTEGER,
    memory_usage_mb NUMERIC,
    
    -- Metadata
    run_config JSONB, -- Configuration used for this run
    logs JSONB DEFAULT '[]'::jsonb, -- Array of log entries
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scraper_runs_scraper ON scraper_runs(scraper_id);
CREATE INDEX IF NOT EXISTS idx_scraper_runs_status ON scraper_runs(status);
CREATE INDEX IF NOT EXISTS idx_scraper_runs_started ON scraper_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraper_runs_completed ON scraper_runs(completed_at DESC);

-- ============================================================================
-- 3. DATA UPDATES TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scraper_run_id UUID REFERENCES scraper_runs(id) ON DELETE CASCADE,
    
    -- Product Reference
    product_type TEXT NOT NULL, -- 'credit_card', 'loan', 'insurance', 'mutual_fund', etc.
    product_id UUID, -- Reference to product table (can be null for new products)
    product_slug TEXT, -- Slug for identification
    
    -- Update Info
    update_type TEXT NOT NULL CHECK (update_type IN ('created', 'updated', 'deleted', 'no_change')),
    fields_updated TEXT[], -- Array of field names that were updated
    
    -- Data Changes
    old_data JSONB, -- Previous data (for updates)
    new_data JSONB, -- New/updated data
    
    -- Validation
    validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'warning')),
    validation_errors TEXT[],
    
    -- Metadata
    source_url TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_data_updates_run ON data_updates(scraper_run_id);
CREATE INDEX IF NOT EXISTS idx_data_updates_product_type ON data_updates(product_type);
CREATE INDEX IF NOT EXISTS idx_data_updates_product_id ON data_updates(product_id);
CREATE INDEX IF NOT EXISTS idx_data_updates_type ON data_updates(update_type);
CREATE INDEX IF NOT EXISTS idx_data_updates_validation ON data_updates(validation_status);
CREATE INDEX IF NOT EXISTS idx_data_updates_scraped_at ON data_updates(scraped_at DESC);

-- ============================================================================
-- 4. SCRAPER HEALTH MONITORING
-- ============================================================================

CREATE TABLE IF NOT EXISTS scraper_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scraper_id UUID REFERENCES scrapers(id) ON DELETE CASCADE,
    
    -- Health Metrics
    health_status TEXT NOT NULL CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
    last_successful_run TIMESTAMP WITH TIME ZONE,
    consecutive_failures INTEGER DEFAULT 0,
    success_rate NUMERIC DEFAULT 0, -- 0-100
    
    -- Performance Metrics
    avg_execution_time_ms INTEGER,
    avg_items_per_run INTEGER,
    last_run_items INTEGER,
    
    -- Issues
    issues JSONB DEFAULT '[]'::jsonb, -- Array of issues
    last_issue_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scraper_health_scraper ON scraper_health(scraper_id);
CREATE INDEX IF NOT EXISTS idx_scraper_health_status ON scraper_health(health_status);
CREATE INDEX IF NOT EXISTS idx_scraper_health_checked ON scraper_health(checked_at DESC);

-- ============================================================================
-- 5. RLS POLICIES
-- ============================================================================

-- Scrapers
ALTER TABLE scrapers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage scrapers" 
ON scrapers FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view scrapers" 
ON scrapers FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Scraper Runs
ALTER TABLE scraper_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage scraper runs" 
ON scraper_runs FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view scraper runs" 
ON scraper_runs FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Data Updates
ALTER TABLE data_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage data updates" 
ON data_updates FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view data updates" 
ON data_updates FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Scraper Health
ALTER TABLE scraper_health ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage scraper health" 
ON scraper_health FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view scraper health" 
ON scraper_health FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to update scraper health
CREATE OR REPLACE FUNCTION update_scraper_health(p_scraper_id UUID)
RETURNS void AS $$
DECLARE
    v_success_rate NUMERIC;
    v_avg_execution_time INTEGER;
    v_avg_items INTEGER;
    v_consecutive_failures INTEGER;
    v_last_success TIMESTAMP WITH TIME ZONE;
    v_health_status TEXT;
BEGIN
    -- Calculate success rate (last 10 runs)
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) * 100
            ELSE 0
        END,
        AVG(execution_time_ms)::INTEGER,
        AVG(items_scraped)::INTEGER,
        COUNT(*) FILTER (WHERE status = 'failed' ORDER BY started_at DESC)::INTEGER,
        MAX(completed_at) FILTER (WHERE status = 'completed')
    INTO v_success_rate, v_avg_execution_time, v_avg_items, v_consecutive_failures, v_last_success
    FROM scraper_runs
    WHERE scraper_id = p_scraper_id
      AND started_at >= NOW() - INTERVAL '30 days';
    
    -- Determine health status
    v_health_status := CASE
        WHEN v_success_rate >= 90 AND v_consecutive_failures = 0 THEN 'healthy'
        WHEN v_success_rate >= 70 OR v_consecutive_failures <= 2 THEN 'degraded'
        ELSE 'unhealthy'
    END;
    
    -- Upsert health record
    INSERT INTO scraper_health (
        scraper_id,
        health_status,
        last_successful_run,
        consecutive_failures,
        success_rate,
        avg_execution_time_ms,
        avg_items_per_run,
        checked_at,
        updated_at
    ) VALUES (
        p_scraper_id,
        v_health_status,
        v_last_success,
        v_consecutive_failures,
        v_success_rate,
        v_avg_execution_time,
        v_avg_items,
        NOW(),
        NOW()
    )
    ON CONFLICT (scraper_id) DO UPDATE SET
        health_status = EXCLUDED.health_status,
        last_successful_run = EXCLUDED.last_successful_run,
        consecutive_failures = EXCLUDED.consecutive_failures,
        success_rate = EXCLUDED.success_rate,
        avg_execution_time_ms = EXCLUDED.avg_execution_time_ms,
        avg_items_per_run = EXCLUDED.avg_items_per_run,
        checked_at = EXCLUDED.checked_at,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- Function to get scraper statistics
CREATE OR REPLACE FUNCTION get_scraper_stats(p_scraper_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_runs BIGINT,
    successful_runs BIGINT,
    failed_runs BIGINT,
    success_rate NUMERIC,
    total_items_scraped BIGINT,
    total_items_updated BIGINT,
    avg_execution_time_ms NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        COUNT(*) FILTER (WHERE status = 'completed')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'failed')::BIGINT,
        CASE 
            WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) * 100
            ELSE 0
        END,
        SUM(items_scraped)::BIGINT,
        SUM(items_updated)::BIGINT,
        AVG(execution_time_ms)
    FROM scraper_runs
    WHERE scraper_id = p_scraper_id
      AND started_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;
