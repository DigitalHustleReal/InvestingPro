-- AFFILIATE SYSTEM SCHEMA

DROP TABLE IF EXISTS affiliate_clicks CASCADE;
DROP TABLE IF EXISTS affiliate_links CASCADE;

CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- e.g. 'hdfc-regalia'
    destination_url TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    clicks INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_clicked_at TIMESTAMPTZ
);

-- Click Tracking Log (Optional, for detailed analytics)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID REFERENCES affiliate_links(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    referer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_affiliate_slug ON affiliate_links(slug);

-- RLS
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Public can read links (to redirect)
CREATE POLICY "Public read links" ON affiliate_links FOR SELECT USING (true);
-- Only service role checks clicks usually, but we can allow insert from public API
CREATE POLICY "Public insert clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);
