-- ================================================
-- AFFILIATE MONETIZATION SCHEMA - SAFE MIGRATION
-- Handles existing tables with missing columns
-- ================================================

-- 1. Create affiliate_partners if not exists
CREATE TABLE IF NOT EXISTS affiliate_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    slug TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all columns to affiliate_partners
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'logo_url') THEN
        ALTER TABLE affiliate_partners ADD COLUMN logo_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'base_url') THEN
        ALTER TABLE affiliate_partners ADD COLUMN base_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'commission_type') THEN
        ALTER TABLE affiliate_partners ADD COLUMN commission_type TEXT DEFAULT 'cpa';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'commission_rate') THEN
        ALTER TABLE affiliate_partners ADD COLUMN commission_rate NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'category') THEN
        ALTER TABLE affiliate_partners ADD COLUMN category TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'tracking_param') THEN
        ALTER TABLE affiliate_partners ADD COLUMN tracking_param TEXT DEFAULT 'ref';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'updated_at') THEN
        ALTER TABLE affiliate_partners ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Create affiliate_links if not exists
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all columns to affiliate_links
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'partner_id') THEN
        ALTER TABLE affiliate_links ADD COLUMN partner_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'name') THEN
        ALTER TABLE affiliate_links ADD COLUMN name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'destination_url') THEN
        ALTER TABLE affiliate_links ADD COLUMN destination_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'short_code') THEN
        ALTER TABLE affiliate_links ADD COLUMN short_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'slug') THEN
        ALTER TABLE affiliate_links ADD COLUMN slug TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'campaign') THEN
        ALTER TABLE affiliate_links ADD COLUMN campaign TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'placement') THEN
        ALTER TABLE affiliate_links ADD COLUMN placement TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'clicks') THEN
        ALTER TABLE affiliate_links ADD COLUMN clicks INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'conversions') THEN
        ALTER TABLE affiliate_links ADD COLUMN conversions INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'revenue') THEN
        ALTER TABLE affiliate_links ADD COLUMN revenue NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 3. Create affiliate_clicks if not exists
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    converted BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all columns to affiliate_clicks
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'link_id') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN link_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'product_id') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN product_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'entity_type') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN entity_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'destination_url') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN destination_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'article_id') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN article_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'user_agent') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN user_agent TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'referrer') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN referrer TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'ip_hash') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN ip_hash TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'conversion_status') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN conversion_status TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'conversion_type') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN conversion_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'transaction_id') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN transaction_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'commission_earned') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN commission_earned NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'converted_at') THEN
        ALTER TABLE affiliate_clicks ADD COLUMN converted_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 4. Create affiliate_conversions if not exists
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all columns to affiliate_conversions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'click_id') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN click_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'transaction_id') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN transaction_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'product_id') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN product_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'partner_slug') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN partner_slug TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'amount') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN amount NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'commission') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN commission NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'status') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN status TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'conversion_type') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN conversion_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_conversions' AND column_name = 'raw_payload') THEN
        ALTER TABLE affiliate_conversions ADD COLUMN raw_payload JSONB;
    END IF;
END $$;

-- ================================================
-- INDEXES (wrapped to handle missing columns)
-- ================================================
DO $$
BEGIN
    -- Partners indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'slug') THEN
        CREATE INDEX IF NOT EXISTS idx_partners_slug ON affiliate_partners(slug);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'category') THEN
        CREATE INDEX IF NOT EXISTS idx_partners_category ON affiliate_partners(category);
    END IF;
    
    -- Links indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'short_code') THEN
        CREATE INDEX IF NOT EXISTS idx_links_short_code ON affiliate_links(short_code);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'partner_id') THEN
        CREATE INDEX IF NOT EXISTS idx_links_partner ON affiliate_links(partner_id);
    END IF;
    
    -- Clicks indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'link_id') THEN
        CREATE INDEX IF NOT EXISTS idx_clicks_link ON affiliate_clicks(link_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'product_id') THEN
        CREATE INDEX IF NOT EXISTS idx_clicks_product ON affiliate_clicks(product_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'clicked_at') THEN
        CREATE INDEX IF NOT EXISTS idx_clicks_date ON affiliate_clicks(clicked_at DESC);
    END IF;
END $$;

-- ================================================
-- RPC FUNCTIONS
-- ================================================
-- Drop existing functions first to allow parameter name changes
DROP FUNCTION IF EXISTS increment_affiliate_clicks(UUID);
DROP FUNCTION IF EXISTS increment_affiliate_conversions(UUID, NUMERIC);

CREATE OR REPLACE FUNCTION increment_affiliate_clicks(p_link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE affiliate_links SET clicks = COALESCE(clicks, 0) + 1 WHERE id = p_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_affiliate_conversions(p_link_id UUID, p_revenue_amount NUMERIC)
RETURNS void AS $$
BEGIN
    UPDATE affiliate_links 
    SET conversions = COALESCE(conversions, 0) + 1,
        revenue = COALESCE(revenue, 0) + p_revenue_amount
    WHERE id = p_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================
ALTER TABLE affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them (ignore errors)
DO $$ BEGIN DROP POLICY IF EXISTS "Public can read active partners" ON affiliate_partners; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Admins can manage partners" ON affiliate_partners; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Public can read active links" ON affiliate_links; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Admins can manage links" ON affiliate_links; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Public can insert clicks" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Admins can view clicks" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "System can update clicks" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "System can insert conversions" ON affiliate_conversions; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Admins can view conversions" ON affiliate_conversions; EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Recreate policies
CREATE POLICY "Public can read active partners" ON affiliate_partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active links" ON affiliate_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public can insert clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view clicks" ON affiliate_clicks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can update clicks" ON affiliate_clicks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert conversions" ON affiliate_conversions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can view conversions" ON affiliate_conversions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ================================================
-- GRANT SERVICE ROLE ACCESS
-- ================================================
GRANT ALL ON affiliate_partners TO service_role;
GRANT ALL ON affiliate_links TO service_role;
GRANT ALL ON affiliate_clicks TO service_role;
GRANT ALL ON affiliate_conversions TO service_role;
GRANT EXECUTE ON FUNCTION increment_affiliate_clicks TO service_role;
GRANT EXECUTE ON FUNCTION increment_affiliate_conversions TO service_role;

-- Success message
DO $$ BEGIN RAISE NOTICE 'Affiliate schema migration complete!'; END $$;
