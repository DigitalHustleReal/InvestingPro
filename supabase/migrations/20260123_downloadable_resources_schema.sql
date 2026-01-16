-- Downloadable Resources Table
-- Stores downloadable dashboards, guides, eBooks, PDFs

CREATE TABLE IF NOT EXISTS downloadable_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Resource Details
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('dashboard', 'guide', 'ebook', 'pdf', 'template')),
    format TEXT NOT NULL CHECK (format IN ('excel', 'google-sheets', 'notion', 'pdf', 'csv')),
    category TEXT NOT NULL,
    
    -- File Information
    file_url TEXT, -- URL to static file (if pre-generated)
    template_data JSONB, -- Template configuration for dynamic generation
    
    -- Access Control
    requires_email BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    download_count INTEGER DEFAULT 0,
    
    -- SEO
    slug TEXT UNIQUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Download Logs Table
-- Tracks who downloaded what

CREATE TABLE IF NOT EXISTS download_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    resource_id UUID REFERENCES downloadable_resources(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    source TEXT, -- Where the download was initiated from
    ip_address TEXT,
    user_agent TEXT,
    
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_downloadable_resources_category ON downloadable_resources(category);
CREATE INDEX IF NOT EXISTS idx_downloadable_resources_type ON downloadable_resources(type);
CREATE INDEX IF NOT EXISTS idx_downloadable_resources_status ON downloadable_resources(status);
CREATE INDEX IF NOT EXISTS idx_download_logs_resource ON download_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_email ON download_logs(email);
CREATE INDEX IF NOT EXISTS idx_download_logs_date ON download_logs(downloaded_at DESC);

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(resource_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE downloadable_resources
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE downloadable_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;

-- Public can view active resources
CREATE POLICY "Public can view active downloads" 
ON downloadable_resources FOR SELECT 
USING (status = 'active');

-- Admins can manage resources
CREATE POLICY "Admins can manage downloads" 
ON downloadable_resources FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- Public can insert download logs
CREATE POLICY "Public can log downloads" 
ON download_logs FOR INSERT 
WITH CHECK (true);

-- Admins can view download logs
CREATE POLICY "Admins can view download logs" 
ON download_logs FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Comments
COMMENT ON TABLE downloadable_resources IS 'Downloadable finance resources (dashboards, guides, eBooks, PDFs)';
COMMENT ON TABLE download_logs IS 'Tracks download activity for analytics';

-- Insert default resources
INSERT INTO downloadable_resources (title, description, type, format, category, slug, tags) VALUES
('Investment Portfolio Tracker', 'Track all your investments in one Excel dashboard - stocks, mutual funds, ETFs, bonds', 'dashboard', 'excel', 'portfolio', 'portfolio-tracker', ARRAY['portfolio', 'investments', 'tracking']),
('Monthly Expense Tracker', 'Track your monthly expenses by category and stay within budget', 'dashboard', 'excel', 'expenses', 'expense-tracker', ARRAY['expenses', 'budget', 'tracking']),
('Tax Planning & Savings Tracker', 'Track tax-saving investments and calculate your tax liability', 'dashboard', 'excel', 'tax', 'tax-tracker', ARRAY['tax', 'planning', '80C', '80D']),
('Annual Budget Planner', 'Plan your annual budget and track spending across categories', 'dashboard', 'excel', 'budget', 'budget-planner', ARRAY['budget', 'planning', 'finance']),
('Complete Guide to Credit Cards in India 2026', 'Comprehensive guide covering everything about credit cards - rewards, fees, how to choose', 'guide', 'pdf', 'credit-cards', 'credit-card-guide-2026', ARRAY['credit-cards', 'guide', '2026']),
('Mutual Funds Investment Guide', 'Learn how to invest in mutual funds, choose the right funds, and build wealth', 'ebook', 'pdf', 'mutual-funds', 'mutual-fund-guide', ARRAY['mutual-funds', 'investing', 'guide']),
('Tax Saving Handbook 2026', 'Complete handbook on tax-saving investments under Section 80C, 80D, and more', 'ebook', 'pdf', 'tax', 'tax-saving-handbook', ARRAY['tax', '80C', 'handbook', '2026']);
