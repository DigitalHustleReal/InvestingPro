-- Keyword Research & SEO Intelligence Schema
-- Part of Advanced Automation Features

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, keyword_text)
);

CREATE INDEX idx_keyword_research_article ON keyword_research(article_id);
CREATE INDEX idx_keyword_research_type ON keyword_research(keyword_type);
CREATE INDEX idx_keyword_research_primary ON keyword_research(primary_keyword);

-- Keyword Clusters for Topical Authority
CREATE TABLE IF NOT EXISTS keyword_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_name TEXT NOT NULL, -- Topic cluster name
    primary_keyword TEXT NOT NULL,
    related_keywords TEXT[] NOT NULL,
    authority_score NUMERIC DEFAULT 0, -- 0-100
    coverage_percentage NUMERIC DEFAULT 0, -- % of cluster keywords covered
    articles_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS article_keyword_clusters (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES keyword_clusters(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, cluster_id)
);

CREATE INDEX idx_clusters_primary_keyword ON keyword_clusters(primary_keyword);

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_title_variations_article ON title_variations(article_id);
CREATE INDEX idx_title_variations_selected ON title_variations(article_id, is_selected) WHERE is_selected = TRUE;

