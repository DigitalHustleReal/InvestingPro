-- A/B Tests Table
-- Tracks A/B testing experiments

CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Test Details
    name TEXT NOT NULL,
    description TEXT,
    element TEXT NOT NULL CHECK (element IN ('cta', 'headline', 'layout', 'image', 'copy', 'popup')),
    
    -- Variants
    variants JSONB NOT NULL, -- Array of variant objects
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
    
    -- Scheduling
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Traffic
    traffic_split INTEGER DEFAULT 50 CHECK (traffic_split >= 0 AND traffic_split <= 100), -- Percentage of traffic to test
    
    -- Results
    winner_variant_id TEXT, -- ID of winning variant
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Test Events Table
-- Tracks impressions and conversions for each variant

CREATE TABLE IF NOT EXISTS ab_test_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Test Reference
    test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant_id TEXT NOT NULL,
    
    -- User/Session
    user_id UUID,
    session_id TEXT,
    
    -- Event
    event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'conversion')),
    
    -- Conversion Details (if conversion)
    conversion_value NUMERIC, -- Optional: value of conversion
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_element ON ab_tests(element);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_test ON ab_test_events(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_variant ON ab_test_events(variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_type ON ab_test_events(event_type);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_created ON ab_test_events(created_at DESC);

-- RLS
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all tests
CREATE POLICY "Admins can view AB tests" 
ON ab_tests FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can manage tests
CREATE POLICY "Service can manage AB tests" 
ON ab_tests FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Public can insert events (for tracking)
CREATE POLICY "Public can track AB events" 
ON ab_test_events FOR INSERT 
WITH CHECK (true);

-- Admins can view events
CREATE POLICY "Admins can view AB events" 
ON ab_test_events FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Comments
COMMENT ON TABLE ab_tests IS 'A/B testing experiments';
COMMENT ON TABLE ab_test_events IS 'Tracks impressions and conversions for A/B test variants';
