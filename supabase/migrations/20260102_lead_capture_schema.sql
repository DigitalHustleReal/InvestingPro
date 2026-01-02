-- =====================================================
-- LEAD CAPTURE SCHEMA
-- =====================================================
-- Stores emails and metadata from Lead Magnets

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    resource_id TEXT NOT NULL,         -- e.g. 'expense-tracker'
    resource_title TEXT NOT NULL,      -- e.g. 'Master Expense Tracker'
    source_url TEXT,                   -- Where the lead was captured
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Optional fields for better lead grading
    user_metadata JSONB DEFAULT '{}'::jsonb,
    is_processed BOOLEAN DEFAULT FALSE -- For syncing to Mailchimp/crm
);

-- Index for unique email-resource combinations (prevent spam/duplicates for same resource)
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_resource ON leads(email, resource_id);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert leads
CREATE POLICY "Public can submit leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Only Admin can view leads
CREATE POLICY "Admin can view leads" ON leads
    FOR SELECT USING ( true ); -- In production, use public.is_admin()
