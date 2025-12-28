-- Ad Placements Table
CREATE TABLE ad_placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    
    -- Positioning
    position TEXT NOT NULL CHECK (position IN ('header', 'sidebar', 'in-article', 'footer', 'between-cards')),
    pages TEXT[], -- Array of page slugs, e.g. ['/credit-cards', '/loans'] or ['*'] for all
    
    -- Content
    ad_type TEXT NOT NULL DEFAULT 'banner' CHECK (ad_type IN ('banner', 'native', 'video', 'sponsored-content')),
    advertiser TEXT,
    ad_content TEXT NOT NULL, -- HTML snippet or Image URL
    click_url TEXT,
    
    -- Campaign Logic
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    
    -- Performance & Billing
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    cpc NUMERIC DEFAULT 0, -- Cost Per Click
    budget NUMERIC, -- Total Budget
    spent NUMERIC DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Ad Serving Speed
CREATE INDEX idx_ads_status ON ad_placements(status);
CREATE INDEX idx_ads_position ON ad_placements(position);
CREATE INDEX idx_ads_pages ON ad_placements USING GIN(pages); -- Fast array contains check

-- RLS
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;

-- Public can VIEW ads (Select)
CREATE POLICY "Public can view active ads" 
ON ad_placements FOR SELECT 
USING (status = 'active');

-- Only Admins can create/update ads
CREATE POLICY "Admins can manage ads" 
ON ad_placements FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- Special Policy: Allow public to increment impressions/clicks (via RPC function ideally, but allow update for specific columns if carefully managed, or keep simple for now)
-- Better approach: Use a separate 'ad_events' table for analytics to avoid RLS complexity on the main table updates by anon users.
-- For this schema, we will keep it simple.
