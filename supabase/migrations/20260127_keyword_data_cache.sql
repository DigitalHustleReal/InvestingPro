-- Keyword Data Cache Table
-- Stores manually curated keyword data (free, human-curated)
-- Used when free API estimation isn't sufficient

CREATE TABLE IF NOT EXISTS keyword_data_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT UNIQUE NOT NULL,
    
    -- Keyword Metrics
    search_volume INTEGER DEFAULT 0,
    difficulty INTEGER DEFAULT 50 CHECK (difficulty >= 0 AND difficulty <= 100),
    cpc NUMERIC DEFAULT 0.5, -- Cost per click (USD)
    competition TEXT DEFAULT 'medium' CHECK (competition IN ('low', 'medium', 'high')),
    intent TEXT DEFAULT 'informational' CHECK (intent IN ('informational', 'commercial', 'transactional', 'navigational')),
    
    -- Metadata
    source TEXT DEFAULT 'manual', -- 'manual', 'google_ads', 'premium_api'
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Related Keywords (JSONB for flexibility)
    related_keywords TEXT[],
    serp_features TEXT[], -- 'featured_snippet', 'people_also_ask', 'video', etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_keyword_cache_keyword ON keyword_data_cache(keyword);
CREATE INDEX IF NOT EXISTS idx_keyword_cache_volume ON keyword_data_cache(search_volume DESC);
CREATE INDEX IF NOT EXISTS idx_keyword_cache_difficulty ON keyword_data_cache(difficulty);
CREATE INDEX IF NOT EXISTS idx_keyword_cache_verified ON keyword_data_cache(verified) WHERE verified = TRUE;

-- RLS Policies
ALTER TABLE keyword_data_cache ENABLE ROW LEVEL SECURITY;

-- Public can read (for keyword research)
CREATE POLICY "Public can read keyword cache"
ON keyword_data_cache FOR SELECT
USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage keyword cache"
ON keyword_data_cache FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- Comments
COMMENT ON TABLE keyword_data_cache IS 'Manually curated keyword data cache (free, human-curated alternative to premium APIs)';
COMMENT ON COLUMN keyword_data_cache.source IS 'Source of data: manual (human-curated), google_ads (free API), premium_api (paid API)';
COMMENT ON COLUMN keyword_data_cache.verified IS 'Whether data has been verified by human review';
