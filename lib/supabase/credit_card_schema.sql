-- Credit Cards Table
CREATE TABLE credit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    bank TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Cashback', 'Rewards', 'Travel', 'Premium', 'Shopping', 'Fuel')),
    description TEXT,
    
    -- Fees & Eligibility (Stored as Text to allow "Free" or "₹500 + GST")
    annual_fee TEXT,
    joining_fee TEXT,
    min_income TEXT,
    interest_rate TEXT,
    
    -- Features (Postgres Arrays)
    rewards TEXT[],
    pros TEXT[],
    cons TEXT[],
    
    -- Metadata
    rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    apply_link TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_credit_cards_slug ON credit_cards(slug);
CREATE INDEX idx_credit_cards_bank ON credit_cards(bank);
CREATE INDEX idx_credit_cards_type ON credit_cards(type);

-- RLS (Public Read, Private Write)
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view credit cards" 
ON credit_cards FOR SELECT 
USING (true);

-- Only service role (scraper) or admins can insert
CREATE POLICY "Admins can insert credit cards" 
ON credit_cards FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');
