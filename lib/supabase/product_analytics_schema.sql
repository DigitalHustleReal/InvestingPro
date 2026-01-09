-- Product Analytics & Intelligence Schema
-- Tracks product views, engagement, and performance metrics

-- 1. Product Views (individual page impressions)
CREATE TABLE IF NOT EXISTS product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    product_slug TEXT NOT NULL,
    
    -- Session & User
    session_id TEXT,
    user_id UUID,
    
    -- Source Attribution
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Device & Location
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    browser TEXT,
    country TEXT,
    city TEXT,
    
    -- Engagement
    time_on_page INTEGER, -- seconds (updated via beacon)
    scroll_depth INTEGER, -- percentage 0-100
    
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for product_views
CREATE INDEX IF NOT EXISTS idx_product_views_product ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_slug ON product_views(product_slug);
CREATE INDEX IF NOT EXISTS idx_product_views_date ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_product_views_session ON product_views(session_id);

-- 2. Product Analytics Daily Aggregates
CREATE TABLE IF NOT EXISTS product_analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    product_slug TEXT NOT NULL,
    category TEXT,
    date DATE NOT NULL,
    
    -- Traffic Metrics
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    
    -- Engagement Metrics  
    avg_time_on_page NUMERIC(8,2) DEFAULT 0,
    avg_scroll_depth NUMERIC(5,2) DEFAULT 0,
    bounce_rate NUMERIC(5,2) DEFAULT 0,
    
    -- Conversion Metrics (from affiliate tables)
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue NUMERIC(12,2) DEFAULT 0,
    
    -- Computed
    ctr NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN views > 0 THEN (clicks::NUMERIC / views) * 100 ELSE 0 END
    ) STORED,
    conversion_rate NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN clicks > 0 THEN (conversions::NUMERIC / clicks) * 100 ELSE 0 END
    ) STORED,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, date)
);

-- Indexes for daily analytics
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product ON product_analytics_daily(product_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_category ON product_analytics_daily(category);

-- 3. Comparison Analytics (which products are compared together)
CREATE TABLE IF NOT EXISTS comparison_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    products UUID[] NOT NULL,
    product_slugs TEXT[] NOT NULL,
    category TEXT,
    winner_product_id UUID, -- if user clicked apply on one
    session_id TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comparison_date ON comparison_analytics(viewed_at);

-- 4. Product Intelligence Scores (computed metrics)
CREATE TABLE IF NOT EXISTS product_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL UNIQUE,
    product_slug TEXT NOT NULL,
    
    -- Performance Scores (0-100)
    popularity_score INTEGER DEFAULT 50,
    engagement_score INTEGER DEFAULT 50,
    conversion_score INTEGER DEFAULT 50,
    overall_score INTEGER DEFAULT 50,
    
    -- Trends
    views_trend TEXT CHECK (views_trend IN ('rising', 'stable', 'falling')),
    clicks_trend TEXT CHECK (clicks_trend IN ('rising', 'stable', 'falling')),
    
    -- Insights (AI-generated later)
    ai_insights JSONB,
    
    -- Rankings
    category_rank INTEGER,
    overall_rank INTEGER,
    
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_intel_product ON product_intelligence(product_id);
CREATE INDEX IF NOT EXISTS idx_product_intel_score ON product_intelligence(overall_score DESC);

-- 5. RLS Policies
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_intelligence ENABLE ROW LEVEL SECURITY;

-- Allow public to insert views (anonymous tracking)
CREATE POLICY "Allow public view tracking" ON product_views
    FOR INSERT WITH CHECK (true);

-- Only admins can read views
CREATE POLICY "Admins can view analytics" ON product_views
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view daily analytics" ON product_analytics_daily
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow public comparison tracking" ON comparison_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view comparisons" ON comparison_analytics
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage intelligence" ON product_intelligence
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 6. Function to aggregate daily stats
CREATE OR REPLACE FUNCTION aggregate_product_analytics(target_date DATE)
RETURNS void AS $$
BEGIN
    INSERT INTO product_analytics_daily (product_id, product_slug, category, date, views, unique_views)
    SELECT 
        pv.product_id,
        pv.product_slug,
        p.category,
        target_date,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_views
    FROM product_views pv
    LEFT JOIN products p ON p.id = pv.product_id
    WHERE DATE(pv.viewed_at) = target_date
    GROUP BY pv.product_id, pv.product_slug, p.category
    ON CONFLICT (product_id, date) 
    DO UPDATE SET 
        views = EXCLUDED.views,
        unique_views = EXCLUDED.unique_views,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
