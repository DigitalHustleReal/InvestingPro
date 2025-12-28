-- RSS Import & Automated Article Generation Schema
-- Part of Advanced Automation Features

-- RSS Feeds Configuration
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT, -- 'news', 'industry', 'competitor', 'curated'
    auto_import BOOLEAN DEFAULT FALSE,
    import_frequency TEXT DEFAULT 'daily' CHECK (import_frequency IN ('hourly', 'daily', 'weekly')),
    auto_generate_articles BOOLEAN DEFAULT FALSE, -- Generate articles from RSS items
    keyword_extraction_enabled BOOLEAN DEFAULT TRUE, -- Extract keywords from RSS items
    content_transformation JSONB, -- Transformation rules (summarize, expand, etc.)
    filter_rules JSONB, -- Filter criteria (keywords, domains, etc.)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    last_successful_fetch TIMESTAMP WITH TIME ZONE,
    fetch_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_feeds_status ON rss_feeds(status);
CREATE INDEX idx_rss_feeds_auto_import ON rss_feeds(auto_import) WHERE auto_import = TRUE;
CREATE INDEX idx_rss_feeds_url ON rss_feeds(url);

-- RSS Feed Items (Imported)
CREATE TABLE IF NOT EXISTS rss_feed_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Full content if available
    author TEXT,
    published_date TIMESTAMP WITH TIME ZONE,
    guid TEXT, -- RSS item GUID
    categories TEXT[], -- RSS categories/tags
    extracted_keywords TEXT[], -- Keywords extracted from this item
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'article_generated', 'skipped', 'error')),
    generated_article_id UUID REFERENCES articles(id) ON DELETE SET NULL, -- If article was generated
    processing_error TEXT,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(feed_id, guid)
);

CREATE INDEX idx_rss_items_feed ON rss_feed_items(feed_id);
CREATE INDEX idx_rss_items_status ON rss_feed_items(processing_status);
CREATE INDEX idx_rss_items_published ON rss_feed_items(published_date DESC);
CREATE INDEX idx_rss_items_article ON rss_feed_items(generated_article_id) WHERE generated_article_id IS NOT NULL;

-- Keyword Extraction Results
CREATE TABLE IF NOT EXISTS keyword_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type TEXT NOT NULL CHECK (source_type IN ('rss_item', 'article', 'url', 'text')),
    source_id UUID, -- Reference to rss_feed_items.id or articles.id
    extracted_text TEXT NOT NULL, -- Original text extracted from
    extraction_method TEXT NOT NULL CHECK (extraction_method IN ('ai', 'nlp', 'tfidf', 'rake', 'manual')),
    keywords JSONB NOT NULL, -- Array of {keyword: string, score: number, relevance: number}
    primary_keywords TEXT[], -- Top keywords
    long_tail_keywords TEXT[], -- Long-tail variants
    entities JSONB, -- Named entities (people, places, organizations)
    topics JSONB, -- Topic categorization
    sentiment_score NUMERIC, -- -1 to 1
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_keyword_extractions_source ON keyword_extractions(source_type, source_id);
CREATE INDEX idx_keyword_extractions_method ON keyword_extractions(extraction_method);

-- RSS Import Jobs (Track import runs)
CREATE TABLE IF NOT EXISTS rss_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'partial')),
    items_found INTEGER DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    articles_generated INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_import_jobs_feed ON rss_import_jobs(feed_id);
CREATE INDEX idx_rss_import_jobs_status ON rss_import_jobs(status);
CREATE INDEX idx_rss_import_jobs_started ON rss_import_jobs(started_at DESC);

-- RSS-to-Article Generation Rules
CREATE TABLE IF NOT EXISTS rss_article_generation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    article_template_id UUID, -- Reference to content_templates if exists
    transformation_prompt TEXT, -- AI prompt for content transformation
    keyword_strategy TEXT DEFAULT 'extract' CHECK (keyword_strategy IN ('extract', 'use_feed_keywords', 'generate', 'hybrid')),
    category_mapping JSONB, -- Map RSS categories to article categories
    auto_publish BOOLEAN DEFAULT FALSE,
    publish_as_draft BOOLEAN DEFAULT TRUE,
    add_source_attribution BOOLEAN DEFAULT TRUE,
    summarize_content BOOLEAN DEFAULT FALSE,
    expand_content BOOLEAN DEFAULT FALSE,
    target_word_count INTEGER, -- Target word count for generated article
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_gen_rules_feed ON rss_article_generation_rules(feed_id);
CREATE INDEX idx_rss_gen_rules_active ON rss_article_generation_rules(is_active) WHERE is_active = TRUE;

