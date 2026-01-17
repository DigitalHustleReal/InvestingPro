-- RBI Policy Rates Table
-- Stores RBI policy rates (repo rate, base rate, etc.) for fact-checking

CREATE TABLE IF NOT EXISTS rbi_policy_rates (
    id INTEGER PRIMARY KEY DEFAULT 1, -- Single row table
    repo_rate NUMERIC NOT NULL,
    reverse_repo_rate NUMERIC NOT NULL,
    bank_rate NUMERIC NOT NULL,
    mclr NUMERIC NOT NULL, -- Marginal Cost of Funds Based Lending Rate
    base_rate NUMERIC NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'rbi_website',
    
    -- Ensure only one row
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default values (will be updated by cron job)
INSERT INTO rbi_policy_rates (
    id,
    repo_rate,
    reverse_repo_rate,
    bank_rate,
    mclr,
    base_rate,
    source
) VALUES (
    1,
    6.5, -- Default repo rate (as of 2024)
    3.35, -- Default reverse repo rate
    6.75, -- Default bank rate
    8.0, -- Default MCLR
    8.0, -- Default base rate
    'default'
) ON CONFLICT (id) DO NOTHING;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_rbi_rates_updated ON rbi_policy_rates(last_updated);

-- RLS: Public read (for fact-checking)
ALTER TABLE rbi_policy_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read RBI rates"
ON rbi_policy_rates FOR SELECT
USING (true);

-- Only service role can update
CREATE POLICY "Service role can update RBI rates"
ON rbi_policy_rates FOR UPDATE
USING (auth.role() = 'service_role');
