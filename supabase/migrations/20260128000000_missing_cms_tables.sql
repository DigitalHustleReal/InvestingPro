-- Missing CMS Tables Migration
-- Generated: 2026-01-28
-- Purpose: Create tables required for Phase 3 (Pipeline) and Phase 4 (SEO)

-- 1. Pipeline Runs (Traceability)
CREATE TABLE IF NOT EXISTS public.pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_type TEXT NOT NULL, -- e.g. 'scraper_credit_cards', 'article_generator'
    status TEXT NOT NULL DEFAULT 'triggered', -- triggered, running, completed, failed
    params JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    error_stack TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Versus Pages (Programmatic SEO)
CREATE TABLE IF NOT EXISTS public.versus_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE, -- e.g. 'hdfc-regalia-vs-axis-magnus'
    category TEXT NOT NULL, -- e.g. 'credit_cards'
    title TEXT NOT NULL,
    meta_description TEXT,
    product1_id TEXT NOT NULL, -- Storing slug or ID
    product2_id TEXT NOT NULL,
    verdict TEXT NOT NULL, -- The AI generated content
    is_programmatic BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_versus_slug ON versus_pages(slug);
CREATE INDEX IF NOT EXISTS idx_versus_category ON versus_pages(category);

-- 3. Comparison Cache (On-the-fly SEO)
CREATE TABLE IF NOT EXISTS public.comparison_cache (
    slug_key TEXT PRIMARY KEY, -- e.g. 'axis-magnus:hdfc-regalia' (alphabetical sort)
    p1_slug TEXT NOT NULL,
    p2_slug TEXT NOT NULL,
    verdict_content TEXT NOT NULL,
    provider TEXT DEFAULT 'gemini',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ensure Product Tables Exist (Idempotent)
CREATE TABLE IF NOT EXISTS public.credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    bank TEXT NOT NULL,
    type TEXT,
    annual_fee TEXT,
    joining_fee TEXT,
    interest_rate TEXT,
    min_income TEXT,
    rewards TEXT[],
    pros TEXT[],
    cons TEXT[],
    apply_link TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mutual funds table (simple version if not exists)
CREATE TABLE IF NOT EXISTS public.mutual_funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code INTEGER UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    fund_house TEXT,
    nav NUMERIC,
    category TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.versus_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mutual_funds ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read versus pages" ON public.versus_pages FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read credit cards" ON public.credit_cards FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read mutual funds" ON public.mutual_funds FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read cache" ON public.comparison_cache FOR SELECT TO PUBLIC USING (true);

-- Service role policies (or admin)
CREATE POLICY "Service insert pipeline" ON public.pipeline_runs FOR INSERT TO PUBLIC WITH CHECK (true); -- Ideally restrict
CREATE POLICY "Service update pipeline" ON public.pipeline_runs FOR UPDATE TO PUBLIC USING (true);
