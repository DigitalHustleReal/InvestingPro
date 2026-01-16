-- Email Sequences Table
-- Tracks automated email sequences (welcome, nurture, re-engagement)

CREATE TABLE IF NOT EXISTS email_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Subscriber Info
    subscriber_email TEXT NOT NULL,
    subscriber_id UUID, -- Optional link to newsletter_subscribers.id
    
    -- Sequence Details
    sequence_type TEXT NOT NULL CHECK (sequence_type IN ('welcome', 'nurture', 're-engagement', 'conversion')),
    email_id TEXT NOT NULL, -- e.g., 'welcome-1', 'nurture-2'
    
    -- Email Content
    subject TEXT NOT NULL,
    content TEXT NOT NULL, -- HTML content
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'skipped')),
    
    -- Tracking
    resend_id TEXT, -- Resend API email ID
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error TEXT, -- Error message if failed
    skipped_reason TEXT, -- Reason if skipped
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_sequences_email ON email_sequences(subscriber_email);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_scheduled ON email_sequences(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_email_sequences_type ON email_sequences(sequence_type);

-- RLS
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Admins can view all sequences
CREATE POLICY "Admins can view email sequences" 
ON email_sequences FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can manage sequences
CREATE POLICY "Service can manage email sequences" 
ON email_sequences FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Comments
COMMENT ON TABLE email_sequences IS 'Tracks automated email sequences for subscribers';
COMMENT ON COLUMN email_sequences.sequence_type IS 'Type of sequence: welcome, nurture, re-engagement, conversion';
COMMENT ON COLUMN email_sequences.status IS 'Status: scheduled, sent, failed, skipped';
