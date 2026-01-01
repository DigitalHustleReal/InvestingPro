-- =====================================================
-- MONETIZATION SCHEMA: Affiliate Tracking & Revenue
-- =====================================================
-- Run this migration to enable affiliate link tracking

-- Affiliate Partners Table
-- Stores information about affiliate partners/programs
CREATE TABLE IF NOT EXISTS affiliate_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    base_url TEXT NOT NULL,
    commission_type VARCHAR(20) CHECK (commission_type IN ('cpc', 'cpa', 'revenue_share')) DEFAULT 'cpc',
    commission_rate DECIMAL(10,2) DEFAULT 0,
    category VARCHAR(50),
    tracking_param VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Links Table
-- Stores individual trackable affiliate links
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES affiliate_partners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    destination_url TEXT NOT NULL,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    campaign VARCHAR(100),
    placement VARCHAR(100),
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Click Events Table
-- Stores individual click events for detailed analytics
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES affiliate_links(id) ON DELETE CASCADE,
    article_id UUID,
    referrer TEXT,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_links_partner ON affiliate_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_shortcode ON affiliate_links(short_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link ON affiliate_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_date ON affiliate_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_category ON affiliate_partners(category);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE affiliate_links
    SET clicks = clicks + 1, updated_at = NOW()
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql;

-- Sample Partner Data (for development)
INSERT INTO affiliate_partners (name, slug, base_url, commission_type, commission_rate, category)
VALUES 
    ('Groww', 'groww', 'https://groww.in', 'cpa', 200, 'mutual-funds'),
    ('Zerodha', 'zerodha', 'https://zerodha.com', 'cpa', 300, 'stocks'),
    ('ICICI Prudential', 'icici-pru', 'https://icicipruamc.com', 'cpa', 150, 'mutual-funds'),
    ('HDFC Bank', 'hdfc-bank', 'https://hdfcbank.com', 'cpa', 500, 'credit-cards'),
    ('Bajaj Finserv', 'bajaj-finserv', 'https://bajajfinserv.in', 'cpa', 400, 'loans')
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies (if using Supabase RLS)
ALTER TABLE affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Admin can read all
CREATE POLICY "Admin read affiliate_partners" ON affiliate_partners
    FOR SELECT USING (true);

CREATE POLICY "Admin read affiliate_links" ON affiliate_links
    FOR SELECT USING (true);

-- Click tracking is public (for redirect API)
CREATE POLICY "Public insert affiliate_clicks" ON affiliate_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read affiliate_clicks" ON affiliate_clicks
    FOR SELECT USING (true);

-- Grant update for increment function
CREATE POLICY "Service role update affiliate_links" ON affiliate_links
    FOR UPDATE USING (true);
