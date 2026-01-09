-- Newsletter Subscribers Table
-- Stores email subscribers from lead magnets and newsletter signups

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    source TEXT NOT NULL DEFAULT 'website', -- 'lead_magnet_newsletter', 'lead_magnet_guide', 'footer', 'article', etc.
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    confirmed BOOLEAN DEFAULT FALSE,
    confirm_token UUID DEFAULT gen_random_uuid(),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    last_email_at TIMESTAMPTZ,
    email_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_source ON newsletter_subscribers(source);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at DESC);

-- RLS Policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with admin role can read/write
CREATE POLICY "Admins can manage subscribers"
ON newsletter_subscribers
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

-- Allow anonymous inserts for lead capture
CREATE POLICY "Anyone can subscribe"
ON newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- Analytics view
CREATE OR REPLACE VIEW newsletter_stats AS
SELECT
    COUNT(*) AS total_subscribers,
    COUNT(*) FILTER (WHERE status = 'active') AS active_subscribers,
    COUNT(*) FILTER (WHERE status = 'unsubscribed') AS unsubscribed,
    COUNT(*) FILTER (WHERE confirmed = true) AS confirmed,
    COUNT(*) FILTER (WHERE subscribed_at >= NOW() - INTERVAL '7 days') AS last_7_days,
    COUNT(*) FILTER (WHERE subscribed_at >= NOW() - INTERVAL '30 days') AS last_30_days,
    source,
    COUNT(*) AS source_count
FROM newsletter_subscribers
GROUP BY source
ORDER BY source_count DESC;

COMMENT ON TABLE newsletter_subscribers IS 'Email subscribers from lead magnets and newsletter signups';
