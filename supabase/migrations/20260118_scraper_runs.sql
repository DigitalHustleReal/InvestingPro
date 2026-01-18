-- Scraper Runs Tracking Table
-- Stores execution history and status of all scrapers

CREATE TABLE IF NOT EXISTS public.scraper_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scraper_id TEXT NOT NULL,
    scraper_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'idle')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    items_scraped INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraper_runs_scraper_id ON public.scraper_runs(scraper_id);
CREATE INDEX IF NOT EXISTS idx_scraper_runs_status ON public.scraper_runs(status);
CREATE INDEX IF NOT EXISTS idx_scraper_runs_started_at ON public.scraper_runs(started_at DESC);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_scraper_runs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scraper_runs_updated_at
    BEFORE UPDATE ON public.scraper_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_scraper_runs_updated_at();

-- Comments
COMMENT ON TABLE public.scraper_runs IS 'Tracks execution history and status of all scrapers';
COMMENT ON COLUMN public.scraper_runs.scraper_id IS 'Unique identifier for the scraper (e.g., credit-cards, mutual-funds)';
COMMENT ON COLUMN public.scraper_runs.status IS 'Current status: running, completed, failed, idle';
COMMENT ON COLUMN public.scraper_runs.items_scraped IS 'Number of items successfully scraped';
COMMENT ON COLUMN public.scraper_runs.errors IS 'Array of error messages if any';
COMMENT ON COLUMN public.scraper_runs.duration_ms IS 'Total execution time in milliseconds';
