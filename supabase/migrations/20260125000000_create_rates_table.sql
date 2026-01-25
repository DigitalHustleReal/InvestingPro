-- Create rates table for dynamic widget data
CREATE TABLE IF NOT EXISTS public.rates (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
    subtext TEXT,
    category TEXT CHECK (category IN ('loans', 'investing', 'banking', 'market')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.rates ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Allow public read access" ON public.rates
    FOR SELECT USING (true);

-- Policy: Admin write access (Assuming authenticated users with 'admin' role or similar mechanism, 
-- strictly this might need adjustment based on auth setup, but 'anon' shouldn't write)
-- For now, letting service_role handle writes via scripts/admin panel.

-- Seed Data (Initial "Truth")
INSERT INTO public.rates (key, label, value, trend, subtext, category) VALUES
    ('gold_24k', 'Gold (24K)', '₹74,200', 'up', 'per 10g', 'investing'),
    ('silver_1kg', 'Silver', '₹85,000', 'stable', 'per kg', 'investing'),
    ('sbi_home_loan', 'SBI Home Loan', '8.50%', 'stable', 'min', 'loans'),
    ('hdfc_home_loan', 'HDFC Home Loan', '8.45%', 'down', 'special', 'loans'),
    ('sbi_fd_1y', 'SBI FD (1Y)', '6.80%', 'stable', '', 'banking'),
    ('small_fin_fd', 'Small Fin FD', '8.50%', 'up', 'senior citizen', 'banking'),
    ('nifty_50', 'Nifty 50', '22,450', 'up', 'live', 'market'),
    ('inflation', 'Inflation', '5.1%', 'down', 'CPI', 'investing')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    trend = EXCLUDED.trend,
    updated_at = now();
