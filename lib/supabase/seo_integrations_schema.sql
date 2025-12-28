-- SEO Service Integrations Schema
-- Google Search Console, Google Trends, and other SEO services

-- SEO Service Integrations
CREATE TABLE IF NOT EXISTS seo_service_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type TEXT NOT NULL CHECK (service_type IN ('google_search_console', 'google_trends', 'ahrefs', 'semrush', 'moz', 'screaming_frog')),
    service_name TEXT NOT NULL,
    config JSONB NOT NULL, -- API keys, tokens, credentials (encrypted)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'expired')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_seo_services_type ON seo_service_integrations(service_type);
CREATE INDEX idx_seo_services_status ON seo_service_integrations(status);

-- GSC Performance Data
CREATE TABLE IF NOT EXISTS gsc_performance_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    query_date DATE NOT NULL,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr NUMERIC, -- Click-through rate (0-1)
    position NUMERIC, -- Average position
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, keyword, query_date)
);

CREATE INDEX idx_gsc_performance_article ON gsc_performance_data(article_id);
CREATE INDEX idx_gsc_performance_date ON gsc_performance_data(query_date DESC);
CREATE INDEX idx_gsc_performance_keyword ON gsc_performance_data(keyword);

-- GSC Issues Tracking
CREATE TABLE IF NOT EXISTS gsc_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL, -- 'mobile-usability', 'page-speed', 'indexing', 'security', 'structured-data'
    issue_description TEXT,
    severity TEXT CHECK (severity IN ('error', 'warning', 'info')),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT
);

CREATE INDEX idx_gsc_issues_article ON gsc_issues(article_id);
CREATE INDEX idx_gsc_issues_resolved ON gsc_issues(resolved);
CREATE INDEX idx_gsc_issues_type ON gsc_issues(issue_type);

-- Google Trends Data
CREATE TABLE IF NOT EXISTS google_trends_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT NOT NULL,
    region TEXT DEFAULT 'IN', -- Country code
    trend_date DATE NOT NULL,
    interest_score INTEGER, -- 0-100
    related_queries JSONB, -- Related rising/queries
    related_topics JSONB, -- Related topics
    seasonal_pattern JSONB, -- Seasonal trends
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(keyword, region, trend_date)
);

CREATE INDEX idx_trends_data_keyword ON google_trends_data(keyword);
CREATE INDEX idx_trends_data_date ON google_trends_data(trend_date DESC);
CREATE INDEX idx_trends_data_region ON google_trends_data(region);

