-- Glossary Terms Table
CREATE TABLE IF NOT EXISTS public.glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- URL-friendly version
    category TEXT NOT NULL, -- credit-cards, loans, investing, etc.
    definition TEXT NOT NULL,
    detailed_explanation TEXT,
    example TEXT,
    related_terms TEXT[], -- Array of related term slugs
    search_keywords TEXT[], -- For SEO and search
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published BOOLEAN DEFAULT false,
    reviewed_by TEXT, -- Admin who reviewed the AI-generated content
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_glossary_category ON public.glossary_terms(category);
CREATE INDEX IF NOT EXISTS idx_glossary_slug ON public.glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_published ON public.glossary_terms(published);
CREATE INDEX IF NOT EXISTS idx_glossary_views ON public.glossary_terms(views_count DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_glossary_search ON public.glossary_terms 
    USING GIN (to_tsvector('english', term || ' ' || definition || ' ' || COALESCE(detailed_explanation, '')));

-- RLS Policies
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published glossary terms" ON public.glossary_terms
    FOR SELECT USING (published = true);

CREATE POLICY "Service role full access on glossary" ON public.glossary_terms
    FOR ALL USING (true);

---

-- Blog Posts / Info Articles Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL, -- Short summary for cards
    content TEXT NOT NULL, -- Full article content (Markdown)
    meta_description TEXT NOT NULL, -- SEO meta description
    meta_keywords TEXT[],
    featured_image_url TEXT,
    author TEXT DEFAULT 'InvestingPro Editorial Team',
    reading_time_minutes INTEGER,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    
    -- SEO & Schema
    schema_markup JSONB, -- JSON-LD structured data
    canonical_url TEXT,
    
    -- Related Content
    related_posts UUID[], -- Array of related post IDs
    related_glossary_terms TEXT[], -- Array of glossary term slugs
    
    -- Publishing
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_publish_at TIMESTAMP WITH TIME ZONE,
    
    -- AI Generation Metadata
    ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT, -- 'gpt-4', 'claude-3', etc.
    human_edited BOOLEAN DEFAULT false,
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_views ON public.blog_posts(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_scheduled ON public.blog_posts(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_blog_search ON public.blog_posts 
    USING GIN (to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- RLS Policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts" ON public.blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Service role full access on posts" ON public.blog_posts
    FOR ALL USING (true);

---

-- Content Generation Queue Table (for managing AI tasks)
CREATE TABLE IF NOT EXISTS public.content_generation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL, -- 'glossary', 'blog_post'
    category TEXT NOT NULL,
    title_or_term TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    ai_model TEXT,
    generated_content JSONB, -- Store the AI response
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_queue_status ON public.content_generation_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_queue_category ON public.content_generation_queue(category);

-- RLS
ALTER TABLE public.content_generation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on queue" ON public.content_generation_queue
    FOR ALL USING (true);

---

-- Scraper Run Logs (track scraper executions)
CREATE TABLE IF NOT EXISTS public.scraper_run_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scraper_name TEXT NOT NULL, -- 'bankbazaar_fd', 'chittorgarh_ipo', etc.
    category TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'partial', 'failed'
    records_scraped INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_new INTEGER DEFAULT 0,
    error_message TEXT,
    run_duration_ms INTEGER,
    triggered_by TEXT DEFAULT 'cron', -- 'cron', 'manual', 'api'
    metadata JSONB, -- Additional info about the run
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scraper_logs_name ON public.scraper_run_logs(scraper_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraper_logs_status ON public.scraper_run_logs(status);
CREATE INDEX IF NOT EXISTS idx_scraper_logs_date ON public.scraper_run_logs(created_at DESC);

-- RLS
ALTER TABLE public.scraper_run_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read scraper logs" ON public.scraper_run_logs
    FOR SELECT USING (true);

CREATE POLICY "Service role full access on scraper logs" ON public.scraper_run_logs
    FOR ALL USING (true);

---

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_glossary_terms_updated_at BEFORE UPDATE ON public.glossary_terms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
