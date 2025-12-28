-- InvestingPro Universal Asset Model (Ghost Infrastructure v1.0)
-- This schema handles all financial verticals in a single unified architecture.

-- 1. Create the Assets table
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'mutual_funds', 'stocks', 'fixed_deposits', 'loans', 'insurance'
    vertical_slug TEXT NOT NULL, -- 'equity', 'debt', 'tax-saver', 'personal-loan'
    slug TEXT UNIQUE NOT NULL, -- SEO friendly URL e.g. 'hdfc-nifty-50-index-fund'
    name TEXT NOT NULL,
    provider TEXT NOT NULL, -- AMC, Bank, or Insurer name
    logo_url TEXT,
    
    -- Status & Tracking
    status TEXT DEFAULT 'active',
    scraped_at TIMESTAMPTZ DEFAULT now(),
    
    -- Universal Metrics (Commonly used in search/filters)
    rating INTEGER DEFAULT 0,
    risk_level TEXT, -- 'Low', 'Moderate', 'High', etc.
    
    -- Vertical Specific Data (JSONB for flexibility)
    -- This stores performance, rates, fees, etc.
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Technical fields
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', name || ' ' || provider || ' ' || category)
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Asset Price History (For charting and performance tracking)
CREATE TABLE IF NOT EXISTS public.asset_price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    price_value NUMERIC(15, 4) NOT NULL,
    as_of_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Portfolios (User specific holdings)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users(id)
    asset_id UUID REFERENCES public.assets(id), -- Nullable for manual entries
    
    -- Manual Entry Overrides
    asset_name TEXT, -- Fallback if asset_id is null
    asset_type TEXT, -- e.g. 'Equity', 'Gold'
    
    quantity NUMERIC(15, 4) NOT NULL DEFAULT 0,
    average_price NUMERIC(15, 4) NOT NULL DEFAULT 0,
    current_price NUMERIC(15, 4),
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Assets are public for viewing
CREATE POLICY "Allow public read access for assets" ON public.assets
    FOR SELECT USING (true);

-- Price history is public for viewing
CREATE POLICY "Allow public read access for history" ON public.asset_price_history
    FOR SELECT USING (true);

-- Portfolios are private to the user
CREATE POLICY "Portfolios are owned by user" ON public.portfolios
    FOR ALL USING (auth.uid() = user_id);

-- 6. Indexes for high performance
CREATE INDEX idx_assets_category ON public.assets(category);
CREATE INDEX idx_assets_provider ON public.assets(provider);
CREATE INDEX idx_assets_search ON public.assets USING gin(search_vector);
CREATE INDEX idx_price_history_asset_date ON public.asset_price_history(asset_id, as_of_date DESC);
CREATE INDEX idx_portfolios_user ON public.portfolios(user_id);

-- 7. Automated Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
