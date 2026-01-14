-- Prompt Versioning & A/B Testing Enhancement
-- Adds A/B test groups, performance tracking, and auto-optimization

-- Add A/B testing fields to prompts table
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS ab_test_group TEXT, -- 'A', 'B', 'C', etc. or NULL if not in test
ADD COLUMN IF NOT EXISTS ab_test_id UUID, -- Links versions in same A/B test
ADD COLUMN IF NOT EXISTS traffic_percentage INTEGER DEFAULT 100, -- % of traffic for this version (for A/B testing)
ADD COLUMN IF NOT EXISTS is_control BOOLEAN DEFAULT FALSE, -- True for control version in A/B test
ADD COLUMN IF NOT EXISTS performance_score NUMERIC DEFAULT 0, -- Calculated performance score (0-100)
ADD COLUMN IF NOT EXISTS quality_score NUMERIC DEFAULT 0, -- Average quality score from content scorer
ADD COLUMN IF NOT EXISTS engagement_score NUMERIC DEFAULT 0, -- Based on views, time on page, etc.
ADD COLUMN IF NOT EXISTS cost_efficiency NUMERIC DEFAULT 0, -- Cost per successful generation
ADD COLUMN IF NOT EXISTS error_count INTEGER DEFAULT 0, -- Number of errors/failures
ADD COLUMN IF NOT EXISTS last_performance_update TIMESTAMPTZ;

-- Create prompt_performance table for detailed tracking
CREATE TABLE IF NOT EXISTS public.prompt_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    prompt_version INTEGER NOT NULL,
    
    -- Execution metrics
    execution_id UUID, -- Links to article/workflow execution
    execution_type TEXT, -- 'article_generation', 'product_generation', etc.
    
    -- Performance metrics
    latency_ms INTEGER,
    tokens_used INTEGER,
    cost_usd NUMERIC,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    -- Quality metrics (from content scorer)
    quality_score NUMERIC, -- 0-100
    readability_score NUMERIC,
    seo_score NUMERIC,
    
    -- Engagement metrics (from article analytics)
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    views INTEGER DEFAULT 0,
    avg_time_on_page INTEGER, -- seconds
    bounce_rate NUMERIC, -- 0-1
    conversion_rate NUMERIC, -- 0-1 (affiliate clicks / views)
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance queries
CREATE INDEX IF NOT EXISTS idx_prompt_performance_prompt_id ON public.prompt_performance(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_performance_version ON public.prompt_performance(prompt_id, prompt_version);
CREATE INDEX IF NOT EXISTS idx_prompt_performance_created_at ON public.prompt_performance(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_performance_success ON public.prompt_performance(success);
CREATE INDEX IF NOT EXISTS idx_prompt_performance_quality ON public.prompt_performance(quality_score DESC NULLS LAST);

-- Create ab_tests table to track A/B test experiments
CREATE TABLE IF NOT EXISTS public.ab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Test configuration
    prompt_slug TEXT NOT NULL, -- Base prompt being tested
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'archived')),
    
    -- Test parameters
    traffic_split JSONB, -- {"A": 50, "B": 50} - percentage distribution
    min_sample_size INTEGER DEFAULT 100, -- Minimum samples before declaring winner
    confidence_level NUMERIC DEFAULT 0.95, -- Statistical confidence (0.95 = 95%)
    
    -- Results
    winner_version TEXT, -- 'A', 'B', etc. or NULL if no winner yet
    winner_prompt_id UUID REFERENCES public.prompts(id),
    statistical_significance NUMERIC, -- 0-1, how confident we are in the winner
    test_started_at TIMESTAMPTZ,
    test_ended_at TIMESTAMPTZ,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_prompt_slug ON public.ab_tests(prompt_slug);

-- RLS Policies
ALTER TABLE public.prompt_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;

-- Admins can view all performance data
CREATE POLICY "Admins can view prompt performance"
ON public.prompt_performance FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- Service role can insert performance data
CREATE POLICY "Service role can insert prompt performance"
ON public.prompt_performance FOR INSERT
WITH CHECK (true);

-- Admins can manage A/B tests
CREATE POLICY "Admins can manage ab_tests"
ON public.ab_tests FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- Function to record prompt performance
CREATE OR REPLACE FUNCTION record_prompt_performance(
    p_prompt_id UUID,
    p_prompt_version INTEGER,
    p_execution_id UUID DEFAULT NULL,
    p_execution_type TEXT DEFAULT NULL,
    p_latency_ms INTEGER DEFAULT NULL,
    p_tokens_used INTEGER DEFAULT NULL,
    p_cost_usd NUMERIC DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL,
    p_quality_score NUMERIC DEFAULT NULL,
    p_readability_score NUMERIC DEFAULT NULL,
    p_seo_score NUMERIC DEFAULT NULL,
    p_article_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_performance_id UUID;
BEGIN
    INSERT INTO public.prompt_performance (
        prompt_id,
        prompt_version,
        execution_id,
        execution_type,
        latency_ms,
        tokens_used,
        cost_usd,
        success,
        error_message,
        quality_score,
        readability_score,
        seo_score,
        article_id
    ) VALUES (
        p_prompt_id,
        p_prompt_version,
        p_execution_id,
        p_execution_type,
        p_latency_ms,
        p_tokens_used,
        p_cost_usd,
        p_success,
        p_error_message,
        p_quality_score,
        p_readability_score,
        p_seo_score,
        p_article_id
    )
    RETURNING id INTO v_performance_id;
    
    -- Update error count if failed
    IF NOT p_success THEN
        UPDATE public.prompts
        SET error_count = error_count + 1
        WHERE id = p_prompt_id;
    END IF;
    
    RETURN v_performance_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update prompt performance scores
CREATE OR REPLACE FUNCTION update_prompt_performance_scores(p_prompt_id UUID)
RETURNS void AS $$
DECLARE
    v_avg_quality NUMERIC;
    v_avg_latency NUMERIC;
    v_success_rate NUMERIC;
    v_avg_cost NUMERIC;
    v_total_executions INTEGER;
    v_performance_score NUMERIC;
BEGIN
    -- Calculate aggregate metrics
    SELECT
        AVG(quality_score),
        AVG(latency_ms),
        (COUNT(*) FILTER (WHERE success = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
        AVG(cost_usd),
        COUNT(*)
    INTO
        v_avg_quality,
        v_avg_latency,
        v_success_rate,
        v_avg_cost,
        v_total_executions
    FROM public.prompt_performance
    WHERE prompt_id = p_prompt_id
    AND created_at >= NOW() - INTERVAL '30 days'; -- Last 30 days
    
    -- Calculate performance score (weighted formula)
    -- Quality (40%) + Success Rate (30%) + Cost Efficiency (20%) + Speed (10%)
    v_performance_score := 0;
    
    IF v_avg_quality IS NOT NULL THEN
        v_performance_score := v_performance_score + (v_avg_quality * 0.4);
    END IF;
    
    IF v_success_rate IS NOT NULL THEN
        v_performance_score := v_performance_score + (v_success_rate * 0.3);
    END IF;
    
    IF v_avg_cost IS NOT NULL AND v_avg_cost > 0 THEN
        -- Cost efficiency: lower is better, normalize to 0-100
        v_performance_score := v_performance_score + (LEAST(100, (1.0 / v_avg_cost) * 100) * 0.2);
    END IF;
    
    IF v_avg_latency IS NOT NULL THEN
        -- Speed: lower latency is better, normalize to 0-100
        v_performance_score := v_performance_score + (LEAST(100, (5000.0 / NULLIF(v_avg_latency, 0)) * 100) * 0.1);
    END IF;
    
    -- Update prompt with calculated scores
    UPDATE public.prompts
    SET
        quality_score = COALESCE(v_avg_quality, quality_score),
        performance_score = v_performance_score,
        cost_efficiency = v_avg_cost,
        last_performance_update = NOW()
    WHERE id = p_prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get best performing prompt version
CREATE OR REPLACE FUNCTION get_best_prompt_version(
    p_prompt_slug TEXT,
    p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    prompt_id UUID,
    version INTEGER,
    performance_score NUMERIC,
    quality_score NUMERIC,
    success_rate NUMERIC,
    avg_latency_ms NUMERIC,
    usage_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.version,
        p.performance_score,
        p.quality_score,
        CASE
            WHEN p.usage_count > 0 THEN (p.success_count::NUMERIC / p.usage_count) * 100
            ELSE 0
        END as success_rate,
        p.avg_latency_ms,
        p.usage_count
    FROM public.prompts p
    WHERE p.slug = p_prompt_slug
    AND p.is_active = TRUE
    AND (p_category IS NULL OR p.category = p_category)
    ORDER BY
        p.performance_score DESC NULLS LAST,
        p.quality_score DESC NULLS LAST,
        p.success_count DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to select prompt for A/B testing
CREATE OR REPLACE FUNCTION select_prompt_for_ab_test(
    p_prompt_slug TEXT,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    prompt_id UUID,
    version INTEGER,
    ab_test_group TEXT,
    user_prompt_template TEXT,
    system_prompt TEXT,
    preferred_model TEXT,
    temperature NUMERIC,
    max_tokens INTEGER,
    output_format TEXT,
    json_schema JSONB
) AS $$
DECLARE
    v_ab_test_id UUID;
    v_active_test RECORD;
    v_selected_group TEXT;
    v_user_hash INTEGER;
BEGIN
    -- Check if there's an active A/B test for this prompt
    SELECT id, status, traffic_split INTO v_active_test
    FROM public.ab_tests
    WHERE prompt_slug = p_prompt_slug
    AND status = 'running'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF v_active_test IS NOT NULL THEN
        v_ab_test_id := v_active_test.id;
        
        -- Deterministic group assignment based on user_id or random
        IF p_user_id IS NOT NULL THEN
            -- Use user_id for consistent assignment
            v_user_hash := abs(hashtext(p_user_id::TEXT)) % 100;
        ELSE
            -- Random assignment
            v_user_hash := floor(random() * 100)::INTEGER;
        END IF;
        
        -- Assign group based on traffic split
        -- Example: {"A": 50, "B": 50} means 0-49 = A, 50-99 = B
        DECLARE
            cumulative INTEGER := 0;
            group_key TEXT;
            group_pct INTEGER;
        BEGIN
            FOR group_key, group_pct IN SELECT * FROM jsonb_each(v_active_test.traffic_split)
            LOOP
                cumulative := cumulative + group_pct;
                IF v_user_hash < cumulative THEN
                    v_selected_group := group_key;
                    EXIT;
                END IF;
            END LOOP;
        END;
        
        -- Return prompt for selected group
        RETURN QUERY
        SELECT
            p.id,
            p.version,
            p.ab_test_group,
            p.user_prompt_template,
            p.system_prompt,
            p.preferred_model,
            p.temperature,
            p.max_tokens,
            p.output_format,
            p.json_schema
        FROM public.prompts p
        WHERE p.slug = p_prompt_slug
        AND p.ab_test_id = v_ab_test_id
        AND p.ab_test_group = v_selected_group
        AND p.is_active = TRUE
        LIMIT 1;
    ELSE
        -- No active A/B test, return best performing version
        RETURN QUERY
        SELECT
            p.id,
            p.version,
            NULL::TEXT,
            p.user_prompt_template,
            p.system_prompt,
            p.preferred_model,
            p.temperature,
            p.max_tokens,
            p.output_format,
            p.json_schema
        FROM public.prompts p
        WHERE p.slug = p_prompt_slug
        AND p.is_active = TRUE
        ORDER BY
            p.performance_score DESC NULLS LAST,
            p.quality_score DESC NULLS LAST,
            p.version DESC
        LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to analyze A/B test results
CREATE OR REPLACE FUNCTION analyze_ab_test_results(p_ab_test_id UUID)
RETURNS TABLE (
    test_group TEXT,
    sample_size INTEGER,
    avg_quality_score NUMERIC,
    avg_latency_ms NUMERIC,
    success_rate NUMERIC,
    avg_cost_usd NUMERIC,
    performance_score NUMERIC,
    is_winner BOOLEAN
) AS $$
DECLARE
    v_min_sample_size INTEGER;
    v_winner_group TEXT;
    v_highest_score NUMERIC := 0;
BEGIN
    -- Get minimum sample size from test config
    SELECT min_sample_size INTO v_min_sample_size
    FROM public.ab_tests
    WHERE id = p_ab_test_id;
    
    -- Calculate metrics per group
    RETURN QUERY
    WITH group_metrics AS (
        SELECT
            p.ab_test_group,
            COUNT(pp.id) as sample_size,
            AVG(pp.quality_score) as avg_quality,
            AVG(pp.latency_ms) as avg_latency,
            (COUNT(*) FILTER (WHERE pp.success = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100 as success_rate,
            AVG(pp.cost_usd) as avg_cost,
            -- Calculate performance score
            (
                COALESCE(AVG(pp.quality_score), 0) * 0.4 +
                (COUNT(*) FILTER (WHERE pp.success = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100 * 0.3 +
                LEAST(100, (1.0 / NULLIF(AVG(pp.cost_usd), 0)) * 100) * 0.2 +
                LEAST(100, (5000.0 / NULLIF(AVG(pp.latency_ms), 0)) * 100) * 0.1
            ) as perf_score
        FROM public.prompts p
        JOIN public.prompt_performance pp ON p.id = pp.prompt_id
        WHERE p.ab_test_id = p_ab_test_id
        AND pp.created_at >= (
            SELECT test_started_at FROM public.ab_tests WHERE id = p_ab_test_id
        )
        GROUP BY p.ab_test_group
    )
    SELECT
        gm.ab_test_group,
        gm.sample_size::INTEGER,
        gm.avg_quality,
        gm.avg_latency,
        gm.success_rate,
        gm.avg_cost,
        gm.perf_score,
        (gm.sample_size >= v_min_sample_size AND gm.perf_score = (SELECT MAX(perf_score) FROM group_metrics)) as is_winner
    FROM group_metrics gm
    ORDER BY gm.perf_score DESC;
    
    -- Update winner if test has enough samples
    SELECT ab_test_group INTO v_winner_group
    FROM (
        SELECT
            p.ab_test_group,
            (
                COALESCE(AVG(pp.quality_score), 0) * 0.4 +
                (COUNT(*) FILTER (WHERE pp.success = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100 * 0.3 +
                LEAST(100, (1.0 / NULLIF(AVG(pp.cost_usd), 0)) * 100) * 0.2 +
                LEAST(100, (5000.0 / NULLIF(AVG(pp.latency_ms), 0)) * 100) * 0.1
            ) as perf_score
        FROM public.prompts p
        JOIN public.prompt_performance pp ON p.id = pp.prompt_id
        WHERE p.ab_test_id = p_ab_test_id
        AND pp.created_at >= (SELECT test_started_at FROM public.ab_tests WHERE id = p_ab_test_id)
        GROUP BY p.ab_test_group
        HAVING COUNT(pp.id) >= v_min_sample_size
        ORDER BY perf_score DESC
        LIMIT 1
    ) winner;
    
    IF v_winner_group IS NOT NULL THEN
        UPDATE public.ab_tests
        SET
            winner_version = v_winner_group,
            winner_prompt_id = (SELECT id FROM public.prompts WHERE ab_test_id = p_ab_test_id AND ab_test_group = v_winner_group LIMIT 1),
            test_ended_at = NOW(),
            status = 'completed'
        WHERE id = p_ab_test_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update performance scores when new performance data is added
CREATE OR REPLACE FUNCTION trigger_update_prompt_performance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update performance scores for the prompt
    PERFORM update_prompt_performance_scores(NEW.prompt_id);
    
    -- If part of A/B test, analyze results
    IF EXISTS (
        SELECT 1 FROM public.prompts
        WHERE id = NEW.prompt_id
        AND ab_test_id IS NOT NULL
    ) THEN
        DECLARE
            v_ab_test_id UUID;
        BEGIN
            SELECT ab_test_id INTO v_ab_test_id
            FROM public.prompts
            WHERE id = NEW.prompt_id;
            
            IF v_ab_test_id IS NOT NULL THEN
                PERFORM analyze_ab_test_results(v_ab_test_id);
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompt_performance_update_trigger
    AFTER INSERT ON public.prompt_performance
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_prompt_performance();

-- Comments
COMMENT ON TABLE public.prompt_performance IS 'Detailed performance tracking for prompt versions';
COMMENT ON TABLE public.ab_tests IS 'A/B test experiments for prompt optimization';
COMMENT ON FUNCTION select_prompt_for_ab_test IS 'Selects prompt version for A/B testing based on user and traffic split';
COMMENT ON FUNCTION analyze_ab_test_results IS 'Analyzes A/B test results and declares winner when statistically significant';
COMMENT ON FUNCTION update_prompt_performance_scores IS 'Updates aggregate performance scores for a prompt based on recent performance data';
