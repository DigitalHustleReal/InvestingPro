-- Calculator Results & History
CREATE TABLE calculator_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT, -- Optional: for logged-in users
    calculator_type TEXT NOT NULL CHECK (calculator_type IN ('sip', 'swp', 'lumpsum', 'fd', 'emi', 'tax', 'retirement', 'inflation')),
    
    -- Input Parameters (JSONB for flexibility)
    inputs JSONB NOT NULL,
    
    -- Calculated Results
    results JSONB NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT -- For anonymous users
);

-- Indexes
CREATE INDEX idx_calculator_results_type ON calculator_results(calculator_type);
CREATE INDEX idx_calculator_results_user ON calculator_results(user_email);
CREATE INDEX idx_calculator_results_created ON calculator_results(created_at);

-- RLS
ALTER TABLE calculator_results ENABLE ROW LEVEL SECURITY;

-- Public can insert (for anonymous usage)
CREATE POLICY "Public can insert calculator results" 
ON calculator_results FOR INSERT 
WITH CHECK (true);

-- Users can view their own results
CREATE POLICY "Users can view own results" 
ON calculator_results FOR SELECT 
USING (user_email IS NULL OR auth.jwt() ->> 'email' = user_email);

-- Live Financial Rates (for scrapers)
CREATE TABLE live_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_type TEXT NOT NULL CHECK (rate_type IN ('fd', 'savings', 'loan_personal', 'loan_home', 'loan_car', 'loan_education', 'inflation', 'mutual_fund_return')),
    provider TEXT, -- Bank name, institution name, etc.
    
    -- Rate Details
    rate_value NUMERIC NOT NULL,
    rate_unit TEXT DEFAULT 'percentage' CHECK (rate_unit IN ('percentage', 'basis_points')),
    min_amount NUMERIC,
    max_amount NUMERIC,
    tenure_months INTEGER,
    tenure_years NUMERIC,
    
    -- Source & Provenance
    source_url TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_live_rates_type ON live_rates(rate_type);
CREATE INDEX idx_live_rates_provider ON live_rates(provider);
CREATE INDEX idx_live_rates_scraped ON live_rates(scraped_at);
CREATE INDEX idx_live_rates_valid ON live_rates(valid_until);

-- RLS
ALTER TABLE live_rates ENABLE ROW LEVEL SECURITY;

-- Public can view active rates
CREATE POLICY "Public can view active rates" 
ON live_rates FOR SELECT 
USING (valid_until IS NULL OR valid_until > NOW());

-- Service role can manage rates
CREATE POLICY "Service role can manage rates" 
ON live_rates FOR ALL 
USING (auth.role() = 'service_role');

-- Inflation Data
CREATE TABLE inflation_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER, -- 1-12, NULL for annual data
    inflation_rate NUMERIC NOT NULL,
    source TEXT DEFAULT 'RBI',
    source_url TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_inflation_year_month ON inflation_data(year, month);
CREATE INDEX idx_inflation_scraped ON inflation_data(scraped_at);

-- RLS
ALTER TABLE inflation_data ENABLE ROW LEVEL SECURITY;

-- Public can view inflation data
CREATE POLICY "Public can view inflation data" 
ON inflation_data FOR SELECT 
USING (true);

-- Service role can manage
CREATE POLICY "Service role can manage inflation data" 
ON inflation_data FOR ALL 
USING (auth.role() = 'service_role');

