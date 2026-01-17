-- RBI Policy Rates Table
-- Stores current RBI policy rates (updated daily via cron job)

CREATE TABLE IF NOT EXISTS rbi_policy_rates (
    id INTEGER PRIMARY KEY DEFAULT 1, -- Single row table
    repo_rate NUMERIC NOT NULL, -- Policy repo rate
    reverse_repo_rate NUMERIC NOT NULL, -- Reverse repo rate
    bank_rate NUMERIC NOT NULL, -- Bank rate
    base_rate NUMERIC NOT NULL, -- Base rate (calculated: repo + 1.5%)
    mclr NUMERIC, -- Marginal Cost of Funds Based Lending Rate
    source_url TEXT, -- Source URL (RBI website)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1) -- Ensure only one row
);

-- Insert default rates (will be updated by cron job)
INSERT INTO rbi_policy_rates (
    id,
    repo_rate,
    reverse_repo_rate,
    bank_rate,
    base_rate,
    mclr,
    source_url
) VALUES (
    1,
    6.5, -- Default repo rate (update via cron)
    6.25, -- Reverse repo (repo - 0.25)
    6.75, -- Bank rate (repo + 0.25)
    8.0, -- Base rate (repo + 1.5)
    8.0, -- MCLR (same as base rate)
    'https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx'
) ON CONFLICT (id) DO NOTHING;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_rbi_rates_updated ON rbi_policy_rates(updated_at);

-- RLS (Public read, admin write)
ALTER TABLE rbi_policy_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view RBI rates"
ON rbi_policy_rates FOR SELECT
USING (true);

CREATE POLICY "Service role can update RBI rates"
ON rbi_policy_rates FOR UPDATE
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert RBI rates"
ON rbi_policy_rates FOR INSERT
WITH CHECK (auth.role() = 'service_role');
