-- Social Media Automation Schema
-- Buffer, content repurposing, and social scheduling

-- Social Media Schedulers (Buffer, Hootsuite, etc.)
CREATE TABLE IF NOT EXISTS social_scheduler_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduler_type TEXT NOT NULL CHECK (scheduler_type IN ('buffer', 'hootsuite', 'later', 'sprout_social', 'native')),
    scheduler_name TEXT NOT NULL,
    config JSONB NOT NULL, -- API tokens, credentials (encrypted)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'expired')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_schedulers_type ON social_scheduler_integrations(scheduler_type);
CREATE INDEX idx_social_schedulers_status ON social_scheduler_integrations(status);

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduler_id UUID REFERENCES social_scheduler_integrations(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'pinterest', 'youtube', 'tiktok')),
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL, -- Platform-specific account ID
    account_handle TEXT, -- @username
    profile_data JSONB, -- Profile info, followers, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_accounts_scheduler ON social_media_accounts(scheduler_id);
CREATE INDEX idx_social_accounts_platform ON social_media_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_media_accounts(is_active) WHERE is_active = TRUE;

-- Content Repurposing Templates
CREATE TABLE IF NOT EXISTS repurposing_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'pinterest', 'youtube')),
    template_structure JSONB NOT NULL, -- How to extract/format content
    character_limit INTEGER,
    include_hashtags BOOLEAN DEFAULT TRUE,
    include_cta BOOLEAN DEFAULT TRUE,
    include_media BOOLEAN DEFAULT TRUE,
    hashtag_strategy TEXT, -- 'auto', 'manual', 'trending'
    cta_text TEXT, -- Default CTA text
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_repurposing_templates_platform ON repurposing_templates(platform);
CREATE INDEX idx_repurposing_templates_active ON repurposing_templates(is_active) WHERE is_active = TRUE;

-- Repurposed Content
CREATE TABLE IF NOT EXISTS repurposed_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES repurposing_templates(id),
    platform TEXT NOT NULL,
    content_text TEXT NOT NULL,
    media_urls TEXT[],
    hashtags TEXT[],
    extracted_from TEXT, -- 'excerpt', 'section_1', 'key_points', 'title', etc.
    auto_generated BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    engagement_metrics JSONB, -- Likes, shares, comments, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_repurposed_content_article ON repurposed_content(source_article_id);
CREATE INDEX idx_repurposed_content_platform ON repurposed_content(platform);
CREATE INDEX idx_repurposed_content_status ON repurposed_content(status);
CREATE INDEX idx_repurposed_content_scheduled ON repurposed_content(scheduled_at) WHERE status = 'scheduled';

-- Enhance content_distributions table with scheduler support
ALTER TABLE content_distributions 
ADD COLUMN IF NOT EXISTS scheduler_id UUID REFERENCES social_scheduler_integrations(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS post_format JSONB, -- Platform-specific formatting
ADD COLUMN IF NOT EXISTS media_urls TEXT[], -- Attached media
ADD COLUMN IF NOT EXISTS engagement_metrics JSONB; -- Likes, shares, comments

CREATE INDEX idx_content_distributions_scheduler ON content_distributions(scheduler_id);

