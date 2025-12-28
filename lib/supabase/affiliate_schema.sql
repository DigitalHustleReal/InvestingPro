-- Affiliate Clicks Tracking Table
CREATE TABLE affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source Context
    product_id UUID NOT NULL, -- Generic reference to credit_cards.id or mutual_funds.id
    product_type TEXT, -- Optional: 'credit_card', 'loan', etc. to help join later
    
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL, -- If clicked from a blog post
    
    -- User Metadata (Privacy Friendly if needed, or hash IPs)
    user_ip TEXT, 
    user_agent TEXT,
    referrer TEXT,
    
    -- Conversion Tracking (Postback update)
    converted BOOLEAN DEFAULT FALSE,
    conversion_date TIMESTAMP WITH TIME ZONE,
    commission_earned NUMERIC DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Analytics
CREATE INDEX idx_affiliate_product ON affiliate_clicks(product_id);
CREATE INDEX idx_affiliate_created ON affiliate_clicks(created_at DESC);
CREATE INDEX idx_affiliate_converted ON affiliate_clicks(converted) WHERE converted = TRUE;

-- RLS
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Public can INSERT clicks (via API)
CREATE POLICY "Public can track clicks" 
ON affiliate_clicks FOR INSERT 
WITH CHECK (true);

-- Only Admins can VIEW analytics
CREATE POLICY "Admins can view clicks" 
ON affiliate_clicks FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Only Admins (or Conversion Webhook) can UPDATE conversions
CREATE POLICY "Admins can update conversions" 
ON affiliate_clicks FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');
