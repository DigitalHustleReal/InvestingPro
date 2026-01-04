-- Social Media Automation Schema

-- DROP tables to ensure fresh schema
DROP TABLE IF EXISTS social_posts CASCADE;

CREATE TABLE IF NOT EXISTS social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),
    content TEXT NOT NULL,
    media_url TEXT, -- Link to OG image or custom generated social card
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
    scheduled_at TIMESTAMPTZ,
    posted_at TIMESTAMPTZ,
    external_post_id TEXT, -- ID from Twitter/LinkedIn API
    analytics JSONB DEFAULT '{}'::jsonb, -- Store likes, retweets, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS idx_social_posts_article_id ON social_posts(article_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);

-- Enable RLS
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage social posts" ON social_posts
    FOR ALL USING (auth.role() = 'authenticated');
