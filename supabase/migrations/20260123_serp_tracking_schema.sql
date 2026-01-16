-- SERP Tracking Table
-- Tracks keyword rankings over time for SEO monitoring

CREATE TABLE IF NOT EXISTS serp_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Keyword
    keyword TEXT NOT NULL,
    
    -- Ranking Data
    position INTEGER, -- Position in SERP (1-100, NULL if not in top 100)
    url TEXT, -- URL ranking for this keyword
    
    -- Tracking Metadata
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Source
    data_source TEXT DEFAULT 'manual' CHECK (data_source IN ('serpapi', 'gsc', 'manual')),
    
    -- Change tracking
    previous_position INTEGER, -- Position from previous check
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_serp_tracking_keyword ON serp_tracking(keyword);
CREATE INDEX IF NOT EXISTS idx_serp_tracking_tracked_at ON serp_tracking(tracked_at DESC);
CREATE INDEX IF NOT EXISTS idx_serp_tracking_keyword_date ON serp_tracking(keyword, tracked_at DESC);

-- Composite index for getting latest ranking per keyword
CREATE INDEX IF NOT EXISTS idx_serp_tracking_latest ON serp_tracking(keyword, tracked_at DESC) WHERE position IS NOT NULL;

-- RLS
ALTER TABLE serp_tracking ENABLE ROW LEVEL SECURITY;

-- Admins can view all tracking data
CREATE POLICY "Admins can view SERP tracking" 
ON serp_tracking FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can insert/update (for automated tracking)
CREATE POLICY "Service can manage SERP tracking" 
ON serp_tracking FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Comments
COMMENT ON TABLE serp_tracking IS 'Tracks keyword rankings over time for SEO monitoring';
COMMENT ON COLUMN serp_tracking.position IS 'Ranking position (1-100, NULL if not in top 100)';
COMMENT ON COLUMN serp_tracking.data_source IS 'Source of ranking data: serpapi (paid), gsc (Google Search Console free), manual';
