-- ============================================
-- CMS Automation Tables - Complete Schema
-- Run this AFTER SCHEMA_FIXES_REQUIRED.sql
-- ============================================

-- ============================================
-- 1. Keyword Research & SEO Intelligence
-- ============================================

-- Keyword Research & Suggestions
CREATE TABLE IF NOT EXISTS keyword_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    primary_keyword TEXT NOT NULL,
    keyword_type TEXT NOT NULL CHECK (keyword_type IN ('primary', 'long-tail', 'semantic', 'alternative', 'lsi')),
    keyword_text TEXT NOT NULL,
    search_volume INTEGER,
    competition_score NUMERIC, -- 0-100
    difficulty_score NUMERIC, -- 0-100
    cpc NUMERIC, -- Cost per click
    trend_data JSONB, -- Trend over time
    suggestions_source TEXT, -- 'google_trends', 'search_console', 'ai_generated', 'manual'
    is_alternative BOOLEAN DEFAULT FALSE,
    parent_keyword_id UUID REFERENCES keyword_research(id) ON DELETE SET NULL,
    similarity_score NUMERIC, -- Similarity to primary keyword (0-1)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, keyword_text)
);

CREATE INDEX IF NOT EXISTS idx_keyword_research_article ON keyword_research(article_id);
CREATE INDEX IF NOT EXISTS idx_keyword_research_type ON keyword_research(keyword_type);
CREATE INDEX IF NOT EXISTS idx_keyword_research_primary ON keyword_research(primary_keyword);

-- Keyword Clusters for Topical Authority
CREATE TABLE IF NOT EXISTS keyword_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_name TEXT NOT NULL,
    primary_keyword TEXT NOT NULL,
    related_keywords TEXT[] NOT NULL,
    authority_score NUMERIC DEFAULT 0, -- 0-100
    coverage_percentage NUMERIC DEFAULT 0, -- % of cluster keywords covered
    articles_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS article_keyword_clusters (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES keyword_clusters(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, cluster_id)
);

CREATE INDEX IF NOT EXISTS idx_clusters_primary_keyword ON keyword_clusters(primary_keyword);

-- Generated Title Variations
CREATE TABLE IF NOT EXISTS title_variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    title_text TEXT NOT NULL,
    variation_type TEXT CHECK (variation_type IN ('semantic', 'question', 'number', 'emotional', 'power-word', 'original')),
    seo_score INTEGER, -- SEO quality score (0-100)
    click_through_score INTEGER, -- Predicted CTR score (0-100)
    length_score INTEGER, -- Length optimization score (0-100)
    keyword_density NUMERIC,
    is_selected BOOLEAN DEFAULT FALSE,
    generated_by TEXT, -- 'ai', 'search_console', 'trends', 'manual'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_title_variations_article ON title_variations(article_id);
CREATE INDEX IF NOT EXISTS idx_title_variations_selected ON title_variations(article_id, is_selected) WHERE is_selected = TRUE;

-- ============================================
-- 2. RSS Import & Automated Article Generation
-- ============================================

-- RSS Feeds Configuration
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT, -- 'news', 'industry', 'competitor', 'curated'
    auto_import BOOLEAN DEFAULT FALSE,
    import_frequency TEXT DEFAULT 'daily' CHECK (import_frequency IN ('hourly', 'daily', 'weekly')),
    auto_generate_articles BOOLEAN DEFAULT FALSE,
    keyword_extraction_enabled BOOLEAN DEFAULT TRUE,
    content_transformation JSONB,
    filter_rules JSONB,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    last_fetched_at TIMESTAMPTZ,
    last_successful_fetch TIMESTAMPTZ,
    fetch_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rss_feeds_status ON rss_feeds(status);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_auto_import ON rss_feeds(auto_import) WHERE auto_import = TRUE;
CREATE INDEX IF NOT EXISTS idx_rss_feeds_url ON rss_feeds(url);

-- RSS Feed Items (Imported)
CREATE TABLE IF NOT EXISTS rss_feed_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    author TEXT,
    published_date TIMESTAMPTZ,
    guid TEXT,
    categories TEXT[],
    extracted_keywords TEXT[],
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'article_generated', 'skipped', 'error')),
    generated_article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    processing_error TEXT,
    imported_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    UNIQUE(feed_id, guid)
);

CREATE INDEX IF NOT EXISTS idx_rss_items_feed ON rss_feed_items(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_items_status ON rss_feed_items(processing_status);
CREATE INDEX IF NOT EXISTS idx_rss_items_published ON rss_feed_items(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_rss_items_article ON rss_feed_items(generated_article_id) WHERE generated_article_id IS NOT NULL;

-- Keyword Extraction Results
CREATE TABLE IF NOT EXISTS keyword_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type TEXT NOT NULL CHECK (source_type IN ('rss_item', 'article', 'url', 'text')),
    source_id UUID,
    extracted_text TEXT NOT NULL,
    extraction_method TEXT NOT NULL CHECK (extraction_method IN ('ai', 'nlp', 'tfidf', 'rake', 'manual')),
    keywords JSONB NOT NULL,
    primary_keywords TEXT[],
    long_tail_keywords TEXT[],
    entities JSONB,
    topics JSONB,
    sentiment_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_keyword_extractions_source ON keyword_extractions(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_keyword_extractions_method ON keyword_extractions(extraction_method);

-- RSS Import Jobs (Track import runs)
CREATE TABLE IF NOT EXISTS rss_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'partial')),
    items_found INTEGER DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    articles_generated INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rss_import_jobs_feed ON rss_import_jobs(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_import_jobs_status ON rss_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_rss_import_jobs_started ON rss_import_jobs(started_at DESC);

-- RSS-to-Article Generation Rules
CREATE TABLE IF NOT EXISTS rss_article_generation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    article_template_id UUID,
    transformation_prompt TEXT,
    keyword_strategy TEXT DEFAULT 'extract' CHECK (keyword_strategy IN ('extract', 'use_feed_keywords', 'generate', 'hybrid')),
    category_mapping JSONB,
    auto_publish BOOLEAN DEFAULT FALSE,
    publish_as_draft BOOLEAN DEFAULT TRUE,
    add_source_attribution BOOLEAN DEFAULT TRUE,
    summarize_content BOOLEAN DEFAULT FALSE,
    expand_content BOOLEAN DEFAULT FALSE,
    target_word_count INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rss_gen_rules_feed ON rss_article_generation_rules(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_gen_rules_active ON rss_article_generation_rules(is_active) WHERE is_active = TRUE;

-- ============================================
-- 3. SEO Service Integrations
-- ============================================

-- SEO Service Integrations
CREATE TABLE IF NOT EXISTS seo_service_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type TEXT NOT NULL CHECK (service_type IN ('google_search_console', 'google_trends', 'ahrefs', 'semrush', 'moz', 'screaming_frog')),
    service_name TEXT NOT NULL,
    config JSONB NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'expired')),
    last_sync_at TIMESTAMPTZ,
    sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_services_type ON seo_service_integrations(service_type);
CREATE INDEX IF NOT EXISTS idx_seo_services_status ON seo_service_integrations(status);

-- GSC Performance Data
CREATE TABLE IF NOT EXISTS gsc_performance_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    query_date DATE NOT NULL,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr NUMERIC,
    position NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, keyword, query_date)
);

CREATE INDEX IF NOT EXISTS idx_gsc_performance_article ON gsc_performance_data(article_id);
CREATE INDEX IF NOT EXISTS idx_gsc_performance_date ON gsc_performance_data(query_date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_performance_keyword ON gsc_performance_data(keyword);

-- GSC Issues Tracking
CREATE TABLE IF NOT EXISTS gsc_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL,
    issue_description TEXT,
    severity TEXT CHECK (severity IN ('error', 'warning', 'info')),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_gsc_issues_article ON gsc_issues(article_id);
CREATE INDEX IF NOT EXISTS idx_gsc_issues_resolved ON gsc_issues(resolved);
CREATE INDEX IF NOT EXISTS idx_gsc_issues_type ON gsc_issues(issue_type);

-- Google Trends Data
CREATE TABLE IF NOT EXISTS google_trends_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT NOT NULL,
    region TEXT DEFAULT 'IN',
    trend_date DATE NOT NULL,
    interest_score INTEGER,
    related_queries JSONB,
    related_topics JSONB,
    seasonal_pattern JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(keyword, region, trend_date)
);

CREATE INDEX IF NOT EXISTS idx_trends_data_keyword ON google_trends_data(keyword);
CREATE INDEX IF NOT EXISTS idx_trends_data_date ON google_trends_data(trend_date DESC);
CREATE INDEX IF NOT EXISTS idx_trends_data_region ON google_trends_data(region);

-- ============================================
-- 4. Social Media Automation
-- ============================================

-- Social Media Schedulers
CREATE TABLE IF NOT EXISTS social_scheduler_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduler_type TEXT NOT NULL CHECK (scheduler_type IN ('buffer', 'hootsuite', 'later', 'sprout_social', 'native')),
    scheduler_name TEXT NOT NULL,
    config JSONB NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'expired')),
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_schedulers_type ON social_scheduler_integrations(scheduler_type);
CREATE INDEX IF NOT EXISTS idx_social_schedulers_status ON social_scheduler_integrations(status);

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduler_id UUID REFERENCES social_scheduler_integrations(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'pinterest', 'youtube', 'tiktok')),
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    account_handle TEXT,
    profile_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_accounts_scheduler ON social_media_accounts(scheduler_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_media_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_media_accounts(is_active) WHERE is_active = TRUE;

-- Content Repurposing Templates
CREATE TABLE IF NOT EXISTS repurposing_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'pinterest', 'youtube')),
    template_structure JSONB NOT NULL,
    character_limit INTEGER,
    include_hashtags BOOLEAN DEFAULT TRUE,
    include_cta BOOLEAN DEFAULT TRUE,
    include_media BOOLEAN DEFAULT TRUE,
    hashtag_strategy TEXT,
    cta_text TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repurposing_templates_platform ON repurposing_templates(platform);
CREATE INDEX IF NOT EXISTS idx_repurposing_templates_active ON repurposing_templates(is_active) WHERE is_active = TRUE;

-- Repurposed Content
CREATE TABLE IF NOT EXISTS repurposed_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES repurposing_templates(id),
    platform TEXT NOT NULL,
    content_text TEXT NOT NULL,
    media_urls TEXT[],
    hashtags TEXT[],
    extracted_from TEXT,
    auto_generated BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    engagement_metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repurposed_content_article ON repurposed_content(source_article_id);
CREATE INDEX IF NOT EXISTS idx_repurposed_content_platform ON repurposed_content(platform);
CREATE INDEX IF NOT EXISTS idx_repurposed_content_status ON repurposed_content(status);
CREATE INDEX IF NOT EXISTS idx_repurposed_content_scheduled ON repurposed_content(scheduled_at) WHERE status = 'scheduled';

-- Content Distributions (if referenced but not exists)
CREATE TABLE IF NOT EXISTS content_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    distribution_channel TEXT NOT NULL CHECK (distribution_channel IN ('email', 'rss', 'social', 'newsletter', 'syndication')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sent', 'failed')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhance content_distributions table with scheduler support (from social_automation_schema.sql)
ALTER TABLE content_distributions 
ADD COLUMN IF NOT EXISTS scheduler_id UUID REFERENCES social_scheduler_integrations(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS post_format JSONB,
ADD COLUMN IF NOT EXISTS media_urls TEXT[],
ADD COLUMN IF NOT EXISTS engagement_metrics JSONB;

CREATE INDEX IF NOT EXISTS idx_content_distributions_article ON content_distributions(article_id);
CREATE INDEX IF NOT EXISTS idx_content_distributions_channel ON content_distributions(distribution_channel);
CREATE INDEX IF NOT EXISTS idx_content_distributions_scheduler ON content_distributions(scheduler_id);

-- ============================================
-- 5. Visual Content Generation
-- ============================================

-- Brand Color Palette
CREATE TABLE IF NOT EXISTS brand_color_palette (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    color_name TEXT NOT NULL,
    hex_code TEXT NOT NULL,
    usage_context TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    color_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_colors_active ON brand_color_palette(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_brand_colors_context ON brand_color_palette USING GIN(usage_context);

-- Generated Images
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL CHECK (image_type IN ('feature', 'social', 'thumbnail', 'infographic', 'graphic', 'banner')),
    prompt_used TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    provider TEXT,
    generation_params JSONB,
    brand_colors JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    file_size INTEGER,
    dimensions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_images_article ON generated_images(article_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_type ON generated_images(image_type);
CREATE INDEX IF NOT EXISTS idx_generated_images_active ON generated_images(article_id, is_active) WHERE is_active = TRUE;

-- Generated Graphics
CREATE TABLE IF NOT EXISTS generated_graphics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    graphic_type TEXT NOT NULL CHECK (graphic_type IN ('infographic', 'chart', 'diagram', 'quote_card', 'cta_banner', 'icon', 'illustration')),
    content_data JSONB NOT NULL,
    template_id UUID,
    image_url TEXT NOT NULL,
    brand_colors_used TEXT[],
    svg_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_graphics_article ON generated_graphics(article_id);
CREATE INDEX IF NOT EXISTS idx_generated_graphics_type ON generated_graphics(graphic_type);

-- Graphic Templates
CREATE TABLE IF NOT EXISTS graphic_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    graphic_type TEXT NOT NULL CHECK (graphic_type IN ('infographic', 'chart', 'diagram', 'quote_card', 'cta_banner', 'icon')),
    template_structure JSONB NOT NULL,
    default_colors JSONB,
    default_dimensions JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_graphic_templates_type ON graphic_templates(graphic_type);
CREATE INDEX IF NOT EXISTS idx_graphic_templates_active ON graphic_templates(is_active) WHERE is_active = TRUE;

-- ============================================
-- 6. Pipeline Runs (already exists, but ensure it's there)
-- ============================================

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'triggered' CHECK (status IN ('triggered', 'running', 'completed', 'failed', 'cancelled')),
    params JSONB DEFAULT '{}'::jsonb,
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result JSONB,
    error_message TEXT,
    error_stack TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_type ON pipeline_runs(pipeline_type);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_triggered ON pipeline_runs(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON pipeline_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_type_status ON pipeline_runs(pipeline_type, status);

-- ============================================
-- 7. RLS Policies for CMS Automation Tables
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE keyword_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_article_generation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_service_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_performance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_trends_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_scheduler_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposed_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_color_palette ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_graphics ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphic_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

-- Basic policies: Admins/editors can manage, service role has full access
-- (You can customize these based on your security requirements)

-- Service role has full access to all CMS automation tables
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'keyword_research', 'keyword_clusters', 'title_variations',
        'rss_feeds', 'rss_feed_items', 'keyword_extractions', 'rss_import_jobs', 'rss_article_generation_rules',
        'seo_service_integrations', 'gsc_performance_data', 'gsc_issues', 'google_trends_data',
        'social_scheduler_integrations', 'social_media_accounts', 'repurposing_templates', 'repurposed_content', 'content_distributions',
        'brand_color_palette', 'generated_images', 'generated_graphics', 'graphic_templates',
        'pipeline_runs'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "Service role full access" ON %I;
            CREATE POLICY "Service role full access" ON %I FOR ALL USING (auth.role() = ''service_role'');
        ', table_name, table_name);
        
        EXECUTE format('
            DROP POLICY IF EXISTS "Admins can manage" ON %I;
            CREATE POLICY "Admins can manage" ON %I FOR ALL USING (
                EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''admin'', ''editor''))
            );
        ', table_name, table_name);
    END LOOP;
END $$;

-- ============================================
-- 8. Triggers for updated_at
-- ============================================

-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_keyword_clusters_updated_at ON keyword_clusters;
CREATE TRIGGER update_keyword_clusters_updated_at BEFORE UPDATE ON keyword_clusters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rss_feeds_updated_at ON rss_feeds;
CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON rss_feeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rss_article_generation_rules_updated_at ON rss_article_generation_rules;
CREATE TRIGGER update_rss_article_generation_rules_updated_at BEFORE UPDATE ON rss_article_generation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seo_service_integrations_updated_at ON seo_service_integrations;
CREATE TRIGGER update_seo_service_integrations_updated_at BEFORE UPDATE ON seo_service_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_scheduler_integrations_updated_at ON social_scheduler_integrations;
CREATE TRIGGER update_social_scheduler_integrations_updated_at BEFORE UPDATE ON social_scheduler_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_media_accounts_updated_at ON social_media_accounts;
CREATE TRIGGER update_social_media_accounts_updated_at BEFORE UPDATE ON social_media_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_repurposing_templates_updated_at ON repurposing_templates;
CREATE TRIGGER update_repurposing_templates_updated_at BEFORE UPDATE ON repurposing_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_repurposed_content_updated_at ON repurposed_content;
CREATE TRIGGER update_repurposed_content_updated_at BEFORE UPDATE ON repurposed_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_distributions_updated_at ON content_distributions;
CREATE TRIGGER update_content_distributions_updated_at BEFORE UPDATE ON content_distributions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brand_color_palette_updated_at ON brand_color_palette;
CREATE TRIGGER update_brand_color_palette_updated_at BEFORE UPDATE ON brand_color_palette
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_graphic_templates_updated_at ON graphic_templates;
CREATE TRIGGER update_graphic_templates_updated_at BEFORE UPDATE ON graphic_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Pipeline runs already has its own trigger function, but we'll use the standard one for consistency
DROP TRIGGER IF EXISTS update_pipeline_runs_updated_at ON pipeline_runs;
DROP FUNCTION IF EXISTS update_pipeline_runs_updated_at(); -- Drop the custom function if it exists
CREATE TRIGGER update_pipeline_runs_updated_at BEFORE UPDATE ON pipeline_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

