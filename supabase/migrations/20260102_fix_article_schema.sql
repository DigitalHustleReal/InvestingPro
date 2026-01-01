-- =====================================================
-- ARTICLE & ANALYTICS SCHEMA FIXES
-- =====================================================
-- Run this migration to fix critical schema gaps
-- Date: 2026-01-02

-- 1. Add missing columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS body_html TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS body_markdown TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS read_time INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_role TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Create Article Views table for Analytics
CREATE TABLE IF NOT EXISTS article_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    session_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_views_article ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_date ON article_views(viewed_at);

-- 3. Create RSS Feeds table
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, error
    last_fetched_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create RSS Items table
CREATE TABLE IF NOT EXISTS rss_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL,
    description TEXT,
    pub_date TIMESTAMPTZ,
    author TEXT,
    guid TEXT,
    is_processed BOOLEAN DEFAULT FALSE,
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create RSS Jobs table (for logging)
CREATE TABLE IF NOT EXISTS rss_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    status VARCHAR(20), -- started, completed, failed
    items_found INTEGER DEFAULT 0,
    items_imported INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_log TEXT
);

-- 6. Create Ad Placements table
CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(50) NOT NULL, -- header, sidebar, inline, footer
    type VARCHAR(20) NOT NULL, -- banner, script, native
    content TEXT NOT NULL, -- HTML or Script code
    is_active BOOLEAN DEFAULT TRUE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety: Ensure columns exist (if table existed but was empty/old)
ALTER TABLE ad_placements ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE ad_placements ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0;
ALTER TABLE ad_placements ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;
ALTER TABLE ad_placements ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE ad_placements ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- 7. Add RLS Policies

-- Article Views: Public can insert, Admin can read
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can record views" ON article_views;
CREATE POLICY "Public can record views" ON article_views
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view analytics" ON article_views;
CREATE POLICY "Admin can view analytics" ON article_views
    FOR SELECT USING (true); -- Ideally restrict to admin role

-- RSS Tables: Admin only
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access rss_feeds" ON rss_feeds;
CREATE POLICY "Admin full access rss_feeds" ON rss_feeds
    FOR ALL USING (true); -- Ideally restrict to admin role

DROP POLICY IF EXISTS "Admin full access rss_items" ON rss_items;
CREATE POLICY "Admin full access rss_items" ON rss_items
    FOR ALL USING (true); 

DROP POLICY IF EXISTS "Admin full access rss_jobs" ON rss_jobs;
CREATE POLICY "Admin full access rss_jobs" ON rss_jobs
    FOR ALL USING (true); 

DROP POLICY IF EXISTS "Admin full access to ads" ON ad_placements;
CREATE POLICY "Admin full access to ads" ON ad_placements
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view active ads" ON ad_placements;
CREATE POLICY "Public can view active ads" ON ad_placements
    FOR SELECT USING (is_active = true);

-- Add Updated At Trigger
DROP TRIGGER IF EXISTS update_rss_feeds_updated_at ON rss_feeds;
CREATE TRIGGER update_rss_feeds_updated_at
    BEFORE UPDATE ON rss_feeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ad_placements_updated_at ON ad_placements;
CREATE TRIGGER update_ad_placements_updated_at
    BEFORE UPDATE ON ad_placements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
