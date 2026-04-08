-- Feed Sources — where the content sensor pulls data from
-- Managed via admin UI, not hardcoded
CREATE TABLE IF NOT EXISTS feed_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('rss', 'api', 'scrape')),
    category TEXT NOT NULL,
    priority INTEGER DEFAULT 5,
    active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    item_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feed Items — raw ingested content from all sources
CREATE TABLE IF NOT EXISTS feed_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_id UUID REFERENCES feed_sources(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    summary TEXT,
    published_at TIMESTAMPTZ,
    category TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'selected', 'generated', 'skipped')),
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE feed_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage feed sources" ON feed_sources FOR ALL USING (true);
CREATE POLICY "Admin can manage feed items" ON feed_items FOR ALL USING (true);

-- Indexes
CREATE INDEX idx_feed_items_status ON feed_items(status);
CREATE INDEX idx_feed_items_score ON feed_items(score DESC);
CREATE INDEX idx_feed_items_created ON feed_items(created_at DESC);
CREATE INDEX idx_feed_sources_active ON feed_sources(active) WHERE active = true;

-- Prevent duplicate feed items by URL
CREATE UNIQUE INDEX idx_feed_items_url ON feed_items(url);
