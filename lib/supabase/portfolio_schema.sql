-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Portfolio Table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL, -- In a real app, you might reference auth.users(email) or id
    
    -- Asset Details
    asset_type TEXT NOT NULL CHECK (asset_type IN ('mutual-fund', 'stock', 'etf', 'bond')),
    asset_name TEXT NOT NULL,
    asset_category TEXT NOT NULL CHECK (asset_category IN ('equity', 'debt', 'hybrid', 'gold', 'international')),
    
    -- Financials
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    purchase_price NUMERIC NOT NULL CHECK (purchase_price >= 0),
    current_price NUMERIC NOT NULL DEFAULT 0,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Calculated Fields (Optional: Can be computed on fly, but storing for caching)
    invested_amount NUMERIC GENERATED ALWAYS AS (quantity * purchase_price) STORED,
    current_value NUMERIC GENERATED ALWAYS AS (quantity * current_price) STORED,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Indexes for Performance
CREATE INDEX idx_portfolio_user ON portfolios(user_email);
CREATE INDEX idx_portfolio_asset_type ON portfolios(asset_type);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own portfolio
-- (Assuming Supabase Auth is used and email matches. If using custom auth, adjust logic)
CREATE POLICY "Users can view own assets" 
ON portfolios FOR SELECT 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own assets" 
ON portfolios FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own assets" 
ON portfolios FOR UPDATE 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own assets" 
ON portfolios FOR DELETE 
USING (auth.jwt() ->> 'email' = user_email);
