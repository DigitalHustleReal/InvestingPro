-- Affiliate Products (Central Inventory for Monetizable Items)
CREATE TABLE affiliate_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Identity
    name TEXT NOT NULL,
    company TEXT NOT NULL, -- e.g. "Zerodha", "HDFC Life"
    type TEXT NOT NULL CHECK (type IN ('mutual-fund', 'stock-broker', 'insurance', 'loan', 'credit-card', 'demat-account', 'banking')),
    description TEXT,
    
    -- Affiliate Logic
    affiliate_link TEXT NOT NULL,
    commission_rate NUMERIC,
    commission_type TEXT DEFAULT 'cpa' CHECK (commission_type IN ('percentage', 'fixed', 'cpa')),
    
    -- Content/Display
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    features TEXT[], -- Array of strings
    pricing JSONB, -- { "amount": "₹200", "period": "yearly" }
    image_url TEXT,
    
    -- Analytics (Aggregated)
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_aff_prod_type ON affiliate_products(type);
CREATE INDEX idx_aff_prod_status ON affiliate_products(status);
CREATE INDEX idx_aff_prod_company ON affiliate_products(company);

-- RLS
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

-- Public can VIEW active products
CREATE POLICY "Public can view active affiliate products" 
ON affiliate_products FOR SELECT 
USING (status = 'active');

-- Service Role / Admin can manage
CREATE POLICY "Admins can manage affiliate products" 
ON affiliate_products FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
