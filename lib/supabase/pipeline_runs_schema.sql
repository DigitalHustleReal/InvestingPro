-- Pipeline Runs Table
-- Tracks automation pipeline execution runs for CMS orchestration

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Pipeline Identification
    pipeline_type TEXT NOT NULL, -- 'scraper_credit_cards', 'content_refresh', 'content_regenerate', etc.
    
    -- Execution Status
    status TEXT NOT NULL DEFAULT 'triggered', -- 'triggered', 'running', 'completed', 'failed', 'cancelled'
    
    -- Parameters & Context
    params JSONB DEFAULT '{}'::jsonb, -- Pipeline-specific parameters
    
    -- Timing
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Results
    result JSONB, -- Pipeline execution results
    error_message TEXT, -- Error message if failed
    error_stack TEXT, -- Error stack trace if failed
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_type ON pipeline_runs(pipeline_type);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_triggered ON pipeline_runs(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON pipeline_runs(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_type_status ON pipeline_runs(pipeline_type, status);

-- Enable Row Level Security
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users (admins/editors) can view pipeline runs
CREATE POLICY "Authenticated users can view pipeline runs" 
ON pipeline_runs FOR SELECT 
USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert pipeline runs (via API)
CREATE POLICY "Authenticated users can insert pipeline runs" 
ON pipeline_runs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update pipeline runs
CREATE POLICY "Authenticated users can update pipeline runs" 
ON pipeline_runs FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pipeline_runs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pipeline_runs_updated_at
BEFORE UPDATE ON pipeline_runs
FOR EACH ROW
EXECUTE FUNCTION update_pipeline_runs_updated_at();

