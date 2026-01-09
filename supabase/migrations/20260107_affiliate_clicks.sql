-- =============================================
-- AFFILIATE CLICK TRACKING TABLE
-- Purpose: Track affiliate link clicks for revenue attribution
-- =============================================

-- Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What was clicked
    product_id UUID REFERENCES public.products(id),
    product_slug TEXT,
    product_name TEXT NOT NULL,
    category TEXT,
    provider_name TEXT,
    
    -- Where it was clicked
    source_page TEXT NOT NULL,
    source_url TEXT,
    source_component TEXT,
    -- e.g., 'product_card', 'comparison_table', 'article_cta', 'sidebar'
    
    -- Who clicked
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id),
    user_agent TEXT,
    ip_hash TEXT,
    -- Store hashed IP for fraud detection, not raw IP
    
    -- Affiliate details
    affiliate_link TEXT,
    affiliate_network TEXT,
    -- e.g., 'direct', 'cuelinks', 'vcommission', 'admitad'
    
    -- Attribution
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    
    -- Revenue tracking (updated via webhook or manual)
    conversion_status TEXT DEFAULT 'pending',
    -- 'pending', 'converted', 'rejected', 'expired'
    commission_amount DECIMAL(10,2),
    commission_currency TEXT DEFAULT 'INR',
    conversion_date TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Geo info
    country TEXT,
    region TEXT,
    city TEXT
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product ON public.affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_category ON public.affiliate_clicks(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_date ON public.affiliate_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_source ON public.affiliate_clicks(source_page);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_status ON public.affiliate_clicks(conversion_status);

-- RLS Policies
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Allow insert from anyone (public tracking)
CREATE POLICY "affiliate_clicks_insert_policy" ON public.affiliate_clicks
    FOR INSERT
    WITH CHECK (true);

-- Allow read only to admins
CREATE POLICY "affiliate_clicks_read_policy" ON public.affiliate_clicks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- =============================================
-- ANALYTICS VIEWS
-- =============================================

-- Daily clicks summary
CREATE OR REPLACE VIEW public.affiliate_clicks_daily AS
SELECT 
    DATE(created_at) as date,
    category,
    COUNT(*) as total_clicks,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(CASE WHEN conversion_status = 'converted' THEN 1 END) as conversions,
    SUM(CASE WHEN conversion_status = 'converted' THEN commission_amount ELSE 0 END) as revenue
FROM public.affiliate_clicks
GROUP BY DATE(created_at), category
ORDER BY date DESC;

-- Top products by clicks
CREATE OR REPLACE VIEW public.affiliate_top_products AS
SELECT 
    product_name,
    product_slug,
    category,
    COUNT(*) as total_clicks,
    COUNT(CASE WHEN conversion_status = 'converted' THEN 1 END) as conversions,
    ROUND(
        COUNT(CASE WHEN conversion_status = 'converted' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(*), 0) * 100, 
        2
    ) as conversion_rate,
    SUM(CASE WHEN conversion_status = 'converted' THEN commission_amount ELSE 0 END) as total_revenue
FROM public.affiliate_clicks
GROUP BY product_name, product_slug, category
ORDER BY total_clicks DESC;

-- Click source attribution
CREATE OR REPLACE VIEW public.affiliate_source_attribution AS
SELECT 
    source_component,
    source_page,
    COUNT(*) as clicks,
    COUNT(CASE WHEN conversion_status = 'converted' THEN 1 END) as conversions,
    SUM(CASE WHEN conversion_status = 'converted' THEN commission_amount ELSE 0 END) as revenue
FROM public.affiliate_clicks
GROUP BY source_component, source_page
ORDER BY clicks DESC;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to record a click
CREATE OR REPLACE FUNCTION record_affiliate_click(
    p_product_name TEXT,
    p_product_slug TEXT,
    p_category TEXT,
    p_source_page TEXT,
    p_source_component TEXT,
    p_session_id TEXT DEFAULT NULL,
    p_affiliate_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    click_id UUID;
BEGIN
    INSERT INTO public.affiliate_clicks (
        product_name,
        product_slug,
        category,
        source_page,
        source_component,
        session_id,
        affiliate_link
    ) VALUES (
        p_product_name,
        p_product_slug,
        p_category,
        p_source_page,
        p_source_component,
        p_session_id,
        p_affiliate_link
    )
    RETURNING id INTO click_id;
    
    RETURN click_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue summary
CREATE OR REPLACE FUNCTION get_revenue_summary(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    total_clicks BIGINT,
    total_conversions BIGINT,
    total_revenue DECIMAL,
    conversion_rate DECIMAL,
    avg_commission DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_clicks,
        COUNT(CASE WHEN conversion_status = 'converted' THEN 1 END)::BIGINT as total_conversions,
        COALESCE(SUM(CASE WHEN conversion_status = 'converted' THEN commission_amount ELSE 0 END), 0) as total_revenue,
        ROUND(
            COUNT(CASE WHEN conversion_status = 'converted' THEN 1 END)::DECIMAL / 
            NULLIF(COUNT(*), 0) * 100, 
            2
        ) as conversion_rate,
        ROUND(
            AVG(CASE WHEN conversion_status = 'converted' THEN commission_amount END),
            2
        ) as avg_commission
    FROM public.affiliate_clicks
    WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;
