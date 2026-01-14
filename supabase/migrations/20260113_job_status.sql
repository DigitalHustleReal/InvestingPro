-- Job Status Tracking Table
-- Optional: Store job status in database for easier querying
-- This complements Inngest's built-in status tracking

CREATE TABLE IF NOT EXISTS job_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT NOT NULL UNIQUE, -- Inngest event ID
    status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    job_type TEXT, -- 'article-generation', 'bulk-generation', etc.
    metadata JSONB, -- Job parameters, progress, etc.
    result JSONB, -- Job result when completed
    error TEXT, -- Error message if failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_status_job_id ON job_status(job_id);
CREATE INDEX IF NOT EXISTS idx_job_status_status ON job_status(status);
CREATE INDEX IF NOT EXISTS idx_job_status_job_type ON job_status(job_type);
CREATE INDEX IF NOT EXISTS idx_job_status_created_at ON job_status(created_at);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_job_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    IF NEW.status IN ('completed', 'failed', 'cancelled') AND NEW.completed_at IS NULL THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_status_timestamp
    BEFORE UPDATE ON job_status
    FOR EACH ROW
    EXECUTE FUNCTION update_job_status_updated_at();

-- RLS Policies
ALTER TABLE job_status ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own jobs
CREATE POLICY "Users can read their own job status"
    ON job_status
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Allow service role to manage all jobs
CREATE POLICY "Service role can manage all jobs"
    ON job_status
    FOR ALL
    USING (auth.role() = 'service_role');

-- Archive old completed jobs (optional cleanup function)
CREATE OR REPLACE FUNCTION archive_old_job_status()
RETURNS void AS $$
BEGIN
    -- Archive jobs older than 30 days
    DELETE FROM job_status
    WHERE status IN ('completed', 'failed', 'cancelled')
    AND completed_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE job_status IS 'Tracks status of background jobs processed by Inngest';
COMMENT ON COLUMN job_status.job_id IS 'Inngest event ID';
COMMENT ON COLUMN job_status.status IS 'Current job status';
COMMENT ON COLUMN job_status.metadata IS 'Job parameters and progress information';
COMMENT ON COLUMN job_status.result IS 'Job result when completed';
