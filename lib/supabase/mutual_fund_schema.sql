-- Mutual Funds Table
CREATE TABLE mutual_funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    fund_house TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index Fund', 'Debt', 'Hybrid')),
    description TEXT,
    
    -- Numerical Data
    nav NUMERIC NOT NULL,
    aum TEXT, -- Keep as text for display (e.g., "₹5,000 Cr") or numeric if you want to sort
    expense_ratio NUMERIC,
    
    -- Returns (Percentages)
    returns_1y NUMERIC,
    returns_3y NUMERIC,
    returns_5y NUMERIC,
    
    -- Metadata
    rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
    risk TEXT CHECK (risk IN ('Low', 'Moderate', 'Moderately High', 'High', 'Very High')),
    min_investment TEXT,
    launch_date DATE,
    
    image_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Sorting/Filtering
CREATE INDEX idx_mf_category ON mutual_funds(category);
CREATE INDEX idx_mf_returns_3y ON mutual_funds(returns_3y DESC); -- Index for "Top Rated by 3Y"
CREATE INDEX idx_mf_rating ON mutual_funds(rating DESC);

-- RLS
ALTER TABLE mutual_funds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view mutual funds" 
ON mutual_funds FOR SELECT 
USING (true);

-- Only service role (scraper) or admins can insert
CREATE POLICY "Admins can insert mutual funds" 
ON mutual_funds FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');
