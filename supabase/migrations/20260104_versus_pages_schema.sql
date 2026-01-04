-- Versus Pages Table for Programmatic SEO
-- Stores pre-generated comparison verdicts

CREATE TABLE IF NOT EXISTS versus_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- e.g., "hdfc-regalia-vs-axis-magnus"
    product1_id TEXT NOT NULL, -- slug of first product
    product2_id TEXT NOT NULL, -- slug of second product
    product1_name TEXT NOT NULL,
    product2_name TEXT NOT NULL,
    category TEXT NOT NULL, -- credit_card, loan, insurance, etc.
    title TEXT NOT NULL, -- SEO title
    meta_description TEXT NOT NULL, -- SEO description
    verdict TEXT NOT NULL, -- AI-generated comparison verdict
    winner TEXT, -- product1_id or product2_id
    difference_score INTEGER DEFAULT 0, -- How different they are (0-100)
    
    -- SEO
    h1 TEXT,
    canonical_url TEXT,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Performance
    CONSTRAINT unique_comparison UNIQUE(product1_id, product2_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_versus_slug ON versus_pages(slug);
CREATE INDEX IF NOT EXISTS idx_versus_category ON versus_pages(category);
CREATE INDEX IF NOT EXISTS idx_versus_product1 ON versus_pages(product1_id);
CREATE INDEX IF NOT EXISTS idx_versus_product2 ON versus_pages(product2_id);
CREATE INDEX IF NOT EXISTS idx_versus_views ON versus_pages(view_count DESC);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_versus_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS versus_updated_at ON versus_pages;
CREATE TRIGGER versus_updated_at
    BEFORE UPDATE ON versus_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_versus_timestamp();

-- RLS Policies (if needed)
ALTER TABLE versus_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view versus pages"
    ON versus_pages
    FOR SELECT
    USING (true);

-- Only service role can insert/update
CREATE POLICY "Service role can manage versus pages"
    ON versus_pages
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

COMMENT ON TABLE versus_pages IS 'Programmatic SEO pages for product comparisons (A vs B)';
