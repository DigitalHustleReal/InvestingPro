-- =====================================================
-- ARTICLES TABLE ENHANCEMENT
-- Adds missing columns expected by services
-- =====================================================

-- Add content columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS body_html TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS body_markdown TEXT;

-- Add media columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add metrics columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS read_time INTEGER;

-- Add category as TEXT (for direct access without JOIN)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT;

-- Add author info (denormalized for performance)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_role TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- Add AI metadata columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_metadata JSONB;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS structured_content JSONB;

-- Add publishing columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_date DATE;

-- Add user submission columns
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_user_submission BOOLEAN DEFAULT false;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS submission_status TEXT CHECK (submission_status IN ('pending', 'approved', 'rejected', 'revision-requested'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS quality_score INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS editorial_notes JSONB;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS verified_by_expert BOOLEAN DEFAULT false;

-- Add language support
ALTER TABLE articles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- =====================================================
-- ANALYTICS TABLES
-- =====================================================

-- Article Views (for detailed analytics)
CREATE TABLE IF NOT EXISTS article_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    session_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    is_bot BOOLEAN DEFAULT false,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_views_article ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_date ON article_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_session ON article_views(session_id);

-- Article Analytics (aggregated)
CREATE TABLE IF NOT EXISTS article_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID UNIQUE REFERENCES articles(id) ON DELETE CASCADE,
    total_views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    avg_read_time INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    shares INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_analytics_article ON article_analytics(article_id);

-- =====================================================
-- RSS IMPORT TABLES
-- =====================================================

-- RSS Feeds Configuration
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    feed_url TEXT NOT NULL UNIQUE,
    category TEXT,
    auto_generate BOOLEAN DEFAULT false,
    generation_prompt TEXT,
    fetch_interval_minutes INTEGER DEFAULT 60,
    last_fetched_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSS Feed Items
CREATE TABLE IF NOT EXISTS rss_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    guid TEXT NOT NULL,
    title TEXT NOT NULL,
    link TEXT,
    description TEXT,
    content TEXT,
    pub_date TIMESTAMPTZ,
    author TEXT,
    categories TEXT[],
    status TEXT CHECK (status IN ('new', 'processing', 'generated', 'skipped', 'failed')) DEFAULT 'new',
    generated_article_id UUID REFERENCES articles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(feed_id, guid)
);

CREATE INDEX IF NOT EXISTS idx_rss_items_feed ON rss_items(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_items_status ON rss_items(status);

-- RSS Import Jobs
CREATE TABLE IF NOT EXISTS rss_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    items_fetched INTEGER DEFAULT 0,
    items_generated INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rss_jobs_feed ON rss_jobs(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_jobs_status ON rss_jobs(status);

-- =====================================================
-- AD PLACEMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    ad_type TEXT CHECK (ad_type IN ('banner', 'native', 'sidebar', 'inline')),
    status TEXT CHECK (status IN ('active', 'paused', 'draft')) DEFAULT 'draft',
    target_url TEXT,
    image_url TEXT,
    html_content TEXT,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    cpc DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_placements_status ON ad_placements(status);
CREATE INDEX IF NOT EXISTS idx_ad_placements_position ON ad_placements(position);

-- =====================================================
-- CONTENT CALENDAR TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    category TEXT,
    status TEXT CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planned',
    article_id UUID REFERENCES articles(id),
    assignee TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);

-- =====================================================
-- SOCIAL SCHEDULERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS social_schedulers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'facebook', 'linkedin', 'instagram')),
    post_content TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'posted', 'failed', 'cancelled')) DEFAULT 'scheduled',
    post_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_schedulers_article ON social_schedulers(article_id);
CREATE INDEX IF NOT EXISTS idx_social_schedulers_scheduled ON social_schedulers(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_social_schedulers_status ON social_schedulers(status);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Analytics - public read, service write
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read article_views" ON article_views FOR SELECT USING (true);
CREATE POLICY "Service insert article_views" ON article_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read article_analytics" ON article_analytics FOR SELECT USING (true);
CREATE POLICY "Service manage article_analytics" ON article_analytics FOR ALL USING (true);

-- RSS - admin only
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read rss_feeds" ON rss_feeds FOR SELECT USING (true);
CREATE POLICY "Admin manage rss_feeds" ON rss_feeds FOR ALL USING (true);

CREATE POLICY "Admin read rss_items" ON rss_items FOR SELECT USING (true);
CREATE POLICY "Admin manage rss_items" ON rss_items FOR ALL USING (true);

CREATE POLICY "Admin read rss_jobs" ON rss_jobs FOR SELECT USING (true);
CREATE POLICY "Admin manage rss_jobs" ON rss_jobs FOR ALL USING (true);

-- Ads - admin only
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage ad_placements" ON ad_placements FOR ALL USING (true);

-- Content Calendar - admin only
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage content_calendar" ON content_calendar FOR ALL USING (true);

-- Social Schedulers - admin only
ALTER TABLE social_schedulers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manage social_schedulers" ON social_schedulers FOR ALL USING (true);

-- =====================================================
-- FUNCTION: Increment article views
-- =====================================================

CREATE OR REPLACE FUNCTION increment_article_views(p_article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE id = p_article_id;
    
    INSERT INTO article_analytics (article_id, total_views)
    VALUES (p_article_id, 1)
    ON CONFLICT (article_id) 
    DO UPDATE SET 
        total_views = article_analytics.total_views + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
