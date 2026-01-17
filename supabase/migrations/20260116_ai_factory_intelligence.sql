-- AI Persona Performance & Enhanced Revenue Tracking
-- For solo operator managing 20 AI writer personas
-- Tracks each AI's bio, prompts, articles, revenue, rankings

-- ============================================
-- 1. AI PERSONA PERFORMANCE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.ai_persona_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE CASCADE,
    
    -- Performance Metrics
    total_articles_written INT DEFAULT 0,
    total_articles_published INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    total_views BIGINT DEFAULT 0,
    total_affiliate_clicks INT DEFAULT 0,
    avg_seo_score DECIMAL(5,2) DEFAULT 0.00,
    avg_quality_score DECIMAL(5,2) DEFAULT 0.00,
    avg_readability_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Rankings
    revenue_rank INT,
    article_count_rank INT,
    quality_rank INT,
    overall_rank INT,
    
    -- Training & Config
    prompts_used JSONB DEFAULT '[]'::jsonb,
    training_data TEXT,
    specialization TEXT[], -- e.g. ['credit-cards', 'loans']
    persona_config JSONB DEFAULT '{}'::jsonb,
    
    -- Stats
    first_article_date TIMESTAMPTZ,
    last_article_date TIMESTAMPTZ,
    active_status BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_persona_author ON public.ai_persona_performance(author_id);
CREATE INDEX idx_ai_persona_revenue_rank ON public.ai_persona_performance(revenue_rank);
CREATE INDEX idx_ai_persona_quality_rank ON public.ai_persona_performance(quality_rank);
CREATE INDEX idx_ai_persona_specialization ON public.ai_persona_performance USING GIN(specialization);

-- ============================================
-- 2. ARTICLE REVENUE TRACKING (Enhanced)
-- ============================================

CREATE TABLE IF NOT EXISTS public.article_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.authors(id),
    
    -- Revenue Sources
    affiliate_revenue DECIMAL(10,2) DEFAULT 0.00,
    ad_revenue DECIMAL(10,2) DEFAULT 0.00,
    sponsored_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_revenue DECIMAL(10,2) GENERATED ALWAYS AS (affiliate_revenue + ad_revenue + sponsored_revenue) STORED,
    
    -- Traffic Data
    total_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    avg_time_on_page DECIMAL(8,2) DEFAULT 0.00, -- seconds
    bounce_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    
    -- Conversion Data
    affiliate_clicks INT DEFAULT 0,
    affiliate_conversions INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    
    -- Timeframe
    revenue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    -- Aggregation period
    period_type TEXT DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly', 'all_time')),
    
    UNIQUE(article_id, revenue_date, period_type)
);

-- Create indexes
CREATE INDEX idx_article_revenue_article ON public.article_revenue(article_id);
CREATE INDEX idx_article_revenue_author ON public.article_revenue(author_id);
CREATE INDEX idx_article_revenue_date ON public.article_revenue(revenue_date);
CREATE INDEX idx_article_revenue_total ON public.article_revenue(total_revenue DESC);

-- ============================================
-- 3. PIPELINE STAGE TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS public.pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    
    -- Stage Timestamps
    ingested_at TIMESTAMPTZ,
    validated_at TIMESTAMPTZ,
    enriched_at TIMESTAMPTZ,
    ai_generated_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    -- Current Stage
    current_stage TEXT DEFAULT 'ingested' CHECK (current_stage IN (
        'ingested', 'validated', 'enriched', 'ai_generated', 
        'reviewed', 'approved', 'scheduled', 'published', 'failed'
    )),
    
    -- Stage Durations (in seconds)
    duration_ingestion INT,
    duration_validation INT,
    duration_enrichment INT,
    duration_ai_generation INT,
    duration_review INT,
    duration_approval INT,
    duration_scheduling INT,
    duration_total INT,
    
    -- Failure Tracking
    failed_stage TEXT,
    failure_reason TEXT,
    failure_count INT DEFAULT 0,
    retry_count INT DEFAULT 0,
    
    -- Bottleneck Detection
    is_stuck BOOLEAN DEFAULT false,
    stuck_duration INT, -- seconds in current stage
    
    -- AI Persona Assignment
    assigned_to_persona_id UUID REFERENCES public.authors(id),
    persona_assigned_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pipeline_article ON public.pipeline_stages(article_id);
CREATE INDEX idx_pipeline_current_stage ON public.pipeline_stages(current_stage);
CREATE INDEX idx_pipeline_stuck ON public.pipeline_stages(is_stuck) WHERE is_stuck = true;
CREATE INDEX idx_pipeline_failed ON public.pipeline_stages(failed_stage) WHERE failed_stage IS NOT NULL;
CREATE INDEX idx_pipeline_persona ON public.pipeline_stages(assigned_to_persona_id);

-- ============================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to calculate AI persona rankings
CREATE OR REPLACE FUNCTION calculate_ai_persona_rankings()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update revenue rank
    WITH revenue_ranks AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as rank
        FROM public.ai_persona_performance
        WHERE active_status = true
    )
    UPDATE public.ai_persona_performance p
    SET revenue_rank = r.rank
    FROM revenue_ranks r
    WHERE p.id = r.id;
    
    -- Update article count rank
    WITH article_ranks AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY total_articles_published DESC) as rank
        FROM public.ai_persona_performance
        WHERE active_status = true
    )
    UPDATE public.ai_persona_performance p
    SET article_count_rank = r.rank
    FROM article_ranks r
    WHERE p.id = r.id;
    
    -- Update quality rank
    WITH quality_ranks AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY avg_quality_score DESC) as rank
        FROM public.ai_persona_performance
        WHERE active_status = true
    )
    UPDATE public.ai_persona_performance p
    SET quality_rank = r.rank
    FROM quality_ranks r
    WHERE p.id = r.id;
    
    -- Update overall rank (weighted average)
    WITH overall_ranks AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                ORDER BY 
                    (revenue_rank * 0.5) + 
                    (article_count_rank * 0.3) + 
                    (quality_rank * 0.2)
            ) as rank
        FROM public.ai_persona_performance
        WHERE active_status = true
    )
    UPDATE public.ai_persona_performance p
    SET overall_rank = r.rank
    FROM overall_ranks r
    WHERE p.id = r.id;
END;
$$;

-- Function to update pipeline stage durations
CREATE OR REPLACE FUNCTION update_pipeline_durations()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Calculate durations when moving between stages
    IF NEW.validated_at IS NOT NULL AND OLD.validated_at IS NULL THEN
        NEW.duration_ingestion := EXTRACT(EPOCH FROM (NEW.validated_at - NEW.ingested_at))::INT;
    END IF;
    
    IF NEW.enriched_at IS NOT NULL AND OLD.enriched_at IS NULL THEN
        NEW.duration_validation := EXTRACT(EPOCH FROM (NEW.enriched_at - NEW.validated_at))::INT;
    END IF;
    
    IF NEW.ai_generated_at IS NOT NULL AND OLD.ai_generated_at IS NULL THEN
        NEW.duration_enrichment := EXTRACT(EPOCH FROM (NEW.ai_generated_at - NEW.enriched_at))::INT;
    END IF;
    
    IF NEW.reviewed_at IS NOT NULL AND OLD.reviewed_at IS NULL THEN
        NEW.duration_ai_generation := EXTRACT(EPOCH FROM (NEW.reviewed_at - NEW.ai_generated_at))::INT;
    END IF;
    
    IF NEW.approved_at IS NOT NULL AND OLD.approved_at IS NULL THEN
        NEW.duration_review := EXTRACT(EPOCH FROM (NEW.approved_at - NEW.reviewed_at))::INT;
    END IF;
    
    IF NEW.published_at IS NOT NULL AND OLD.published_at IS NULL THEN
        NEW.duration_total := EXTRACT(EPOCH FROM (NEW.published_at - NEW.ingested_at))::INT;
    END IF;
    
    -- Detect if stuck (>2 hours in same stage)
    IF NEW.current_stage != 'published' AND NEW.current_stage != 'failed' THEN
        NEW.stuck_duration := EXTRACT(EPOCH FROM (NOW() - NEW.updated_at))::INT;
        NEW.is_stuck := NEW.stuck_duration > 7200; -- 2 hours
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_pipeline_durations
    BEFORE UPDATE ON public.pipeline_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_pipeline_durations();

-- ============================================
-- 5. RLS POLICIES
-- ============================================

ALTER TABLE public.ai_persona_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (solo operator)
CREATE POLICY "Allow all for authenticated users" ON public.ai_persona_performance
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON public.article_revenue
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON public.pipeline_stages
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 6. COMMENTS
-- ============================================

COMMENT ON TABLE public.ai_persona_performance IS 'Performance metrics and rankings for each AI writer persona';
COMMENT ON TABLE public.article_revenue IS 'Enhanced revenue tracking per article with multiple revenue sources';
COMMENT ON TABLE public.pipeline_stages IS 'Detailed stage-by-stage tracking of article pipeline progression';

COMMENT ON FUNCTION calculate_ai_persona_rankings() IS 'Calculates and updates rankings for all AI personas based on revenue, article count, and quality';
COMMENT ON FUNCTION update_pipeline_durations() IS 'Automatically calculates time spent in each pipeline stage and detects stuck articles';
