-- IPO Data Cache Table
CREATE TABLE IF NOT EXISTS public.ipo_data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    issue_price DECIMAL(10,2),
    lot_size INTEGER,
    gmp DECIMAL(10,2), -- Grey Market Premium
    estimated_listing_price DECIMAL(10,2),
    subscription_qib DECIMAL(10,2), -- Qualified Institutional Buyers
    subscription_nii DECIMAL(10,2), -- Non-Institutional Investors
    subscription_retail DECIMAL(10,2), -- Retail Individual Investors
    open_date DATE,
    close_date DATE,
    listing_date DATE,
    issue_size_cr DECIMAL(10,2), -- Issue size in crores
    price_band TEXT, -- e.g., "₹100-₹120"
    data_source TEXT DEFAULT 'chittorgarh',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_ipo_listing_date ON public.ipo_data_cache(listing_date DESC);
CREATE INDEX IF NOT EXISTS idx_ipo_last_updated ON public.ipo_data_cache(last_updated DESC);

-- RLS Policies (Public read access)
ALTER TABLE public.ipo_data_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.ipo_data_cache
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access" ON public.ipo_data_cache
    FOR ALL USING (true);

-- FD Rates Cache Table
CREATE TABLE IF NOT EXISTS public.fd_rates_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name TEXT NOT NULL,
    bank_logo_url TEXT,
    regular_rate DECIMAL(5,2) NOT NULL, -- e.g., 7.25
    senior_rate DECIMAL(5,2) NOT NULL, -- e.g., 7.75
    tenure TEXT NOT NULL, -- e.g., "1 Year", "2 Years"
    min_deposit DECIMAL(12,2), -- Minimum deposit amount
    max_deposit DECIMAL(15,2), -- Maximum deposit amount
    rating DECIMAL(2,1), -- Bank rating out of 5
    verified BOOLEAN DEFAULT false,
    features JSONB, -- Additional features as JSON
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bank_name, tenure)
);

CREATE INDEX IF NOT EXISTS idx_fd_rates_updated ON public.fd_rates_cache(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_fd_rates_regular ON public.fd_rates_cache(regular_rate DESC);

ALTER TABLE public.fd_rates_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.fd_rates_cache
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access" ON public.fd_rates_cache
    FOR ALL USING (true);

-- Mutual Fund NAV Cache Table
CREATE TABLE IF NOT EXISTS public.mutual_fund_nav_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_name TEXT NOT NULL,
    scheme_code TEXT UNIQUE NOT NULL,
    isin TEXT,
    nav DECIMAL(12,4) NOT NULL,
    nav_date DATE NOT NULL,
    fund_house TEXT,
    category TEXT, -- e.g., "Equity", "Debt", "Hybrid"
    subcategory TEXT, -- e.g., "Large Cap", "Small Cap"
    aum_cr DECIMAL(15,2), -- Assets Under Management in crores
    expense_ratio DECIMAL(4,2),
    returns_1m DECIMAL(6,2),
    returns_3m DECIMAL(6,2),
    returns_6m DECIMAL(6,2),
    returns_1y DECIMAL(6,2),
    returns_3y DECIMAL(6,2),
    returns_5y DECIMAL(6,2),
    risk_rating TEXT, -- "Low", "Moderate", "High"
    data_source TEXT DEFAULT 'amfi',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mf_nav_date ON public.mutual_fund_nav_cache(nav_date DESC);
CREATE INDEX IF NOT EXISTS idx_mf_category ON public.mutual_fund_nav_cache(category);
CREATE INDEX IF NOT EXISTS idx_mf_returns_1y ON public.mutual_fund_nav_cache(returns_1y DESC);

ALTER TABLE public.mutual_fund_nav_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.mutual_fund_nav_cache
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access" ON public.mutual_fund_nav_cache
    FOR ALL USING (true);

-- Data Sync Log Table (Track API calls and errors)
CREATE TABLE IF NOT EXISTS public.data_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT NOT NULL, -- 'ipo', 'fd_rates', 'mutual_funds'
    sync_status TEXT NOT NULL, -- 'success', 'partial', 'failed'
    records_updated INTEGER DEFAULT 0,
    error_message TEXT,
    sync_duration_ms INTEGER,
    triggered_by TEXT DEFAULT 'cron', -- 'cron', 'manual', 'api'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_log_date ON public.data_sync_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_log_type ON public.data_sync_log(data_type, sync_status);

ALTER TABLE public.data_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.data_sync_log
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access" ON public.data_sync_log
    FOR ALL USING (true);
