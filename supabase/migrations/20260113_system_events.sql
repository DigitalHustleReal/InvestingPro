-- Create system_events table for event persistence
-- This table stores all events published through the event bus

CREATE TABLE IF NOT EXISTS system_events (
    id UUID PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    source VARCHAR(255) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_system_events_event_type ON system_events(event_type);
CREATE INDEX IF NOT EXISTS idx_system_events_timestamp ON system_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_events_source ON system_events(source);
CREATE INDEX IF NOT EXISTS idx_system_events_created_at ON system_events(created_at DESC);

-- Create index on payload for JSONB queries (useful for filtering by event payload)
CREATE INDEX IF NOT EXISTS idx_system_events_payload ON system_events USING GIN (payload);

-- Add comment
COMMENT ON TABLE system_events IS 'Stores all system events published through the event bus for audit, replay, and monitoring';

-- Enable Row Level Security (RLS)
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only authenticated admin users can read events
CREATE POLICY "Admin users can read system events"
    ON system_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- RLS Policy: Service role can insert events (for event publisher)
CREATE POLICY "Service role can insert system events"
    ON system_events
    FOR INSERT
    WITH CHECK (true); -- Service role bypasses RLS

-- RLS Policy: Service role can update events (for event replay)
CREATE POLICY "Service role can update system events"
    ON system_events
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Function to automatically archive old events (optional, can be called via cron)
CREATE OR REPLACE FUNCTION archive_old_events(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- Move events older than days_to_keep to archive (if archive table exists)
    -- For now, just delete old events
    -- In production, you might want to move them to an archive table
    
    DELETE FROM system_events
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    
    RETURN archived_count;
END;
$$;

COMMENT ON FUNCTION archive_old_events IS 'Archives or deletes system events older than specified days (default 90)';
