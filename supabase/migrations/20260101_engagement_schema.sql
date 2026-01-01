-- =====================================================
-- ENGAGEMENT SCHEMA: Newsletter, Bookmarks, Notifications
-- =====================================================
-- Run this migration to enable user engagement features

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('pending', 'verified', 'unsubscribed')) DEFAULT 'pending',
    interests TEXT[] DEFAULT '{}',
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly')) DEFAULT 'weekly',
    verification_token VARCHAR(64),
    verified_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- Reading Progress Table
CREATE TABLE IF NOT EXISTS reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    read_time INTEGER DEFAULT 0, -- in seconds
    completed_at TIMESTAMPTZ,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    image TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_settings JSONB DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_article ON bookmarks(article_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- RLS Policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Newsletter is public for subscribe, admin only for read
CREATE POLICY "Public can subscribe" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read subscribers" ON newsletter_subscribers
    FOR SELECT USING (true);

-- Users can only access their own bookmarks
CREATE POLICY "Users can manage own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own reading progress
CREATE POLICY "Users can manage own progress" ON reading_progress
    FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Service can create notifications
CREATE POLICY "Service can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Users can manage their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
