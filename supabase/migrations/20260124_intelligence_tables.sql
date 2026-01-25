-- =============================================
-- CONTENT INTELLIGENCE TABLES
-- Purpose: Store learned patterns, performance predictions, and revenue intelligence
-- Part of Brain CMS Intelligence Layer
-- =============================================

-- ============================================
-- 1. CONTENT INTELLIGENCE TABLE
-- Stores learned patterns from high-performing content
-- ============================================

CREATE TABLE IF NOT EXISTS public.content_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Pattern Classification
    pattern_type TEXT NOT NULL CHECK (pattern_type IN (
        'headline', 'structure', 'cta', 'length', 'tone',
        'keyword_density', 'formatting', 'hook', 'conclusion'
    )),
    
    -- Pattern Data (learned characteristics)
    pattern_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Example: {
    --   "avg_word_count": 1850,
    --   "headline_has_numbers": true,
    --   "uses_lists": true,
    --   "cta_position": "middle",
    --   "tone": "professional"
    -- }
    
    -- Correlation with success
    success_correlation DECIMAL(5,4) NOT NULL DEFAULT 0,
    -- Range: -1 to 1 (negative = bad pattern, positive = good pattern)
    
    -- Statistical confidence
    sample_size INT NOT NULL DEFAULT 0,
    -- Number of articles analyzed to derive this pattern
    
    confidence DECIMAL(5,4) NOT NULL DEFAULT 0,
    -- Range: 0 to 1 (how confident are we in this pattern)
    
    -- Category specificity
    category TEXT,
    -- NULL = applies to all, or specific category like 'credit-cards'
    
    -- Pattern examples (for reference)
    example_articles UUID[] DEFAULT '{}',
    -- Article IDs that exemplify this pattern
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_validated TIMESTAMPTZ,
    validation_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for content_intelligence
CREATE INDEX IF NOT EXISTS idx_content_intelligence_type ON public.content_intelligence(pattern_type);
CREATE INDEX IF NOT EXISTS idx_content_intelligence_category ON public.content_intelligence(category);
CREATE INDEX IF NOT EXISTS idx_content_intelligence_correlation ON public.content_intelligence(success_correlation DESC);
CREATE INDEX IF NOT EXISTS idx_content_intelligence_active ON public.content_intelligence(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_content_intelligence_data ON public.content_intelligence USING GIN(pattern_data);

-- ============================================
-- 2. PERFORMANCE PREDICTIONS TABLE
-- Stores AI predictions for article performance
-- ============================================

CREATE TABLE IF NOT EXISTS public.performance_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Article reference (nullable for draft predictions)
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    
    -- Draft identifier (for predictions before article exists)
    draft_hash TEXT,
    -- SHA256 hash of title + first 500 chars of content
    
    -- Predicted scores
    predicted_score INT NOT NULL CHECK (predicted_score >= 0 AND predicted_score <= 100),
    predicted_traffic INT NOT NULL DEFAULT 0,
    -- Expected monthly views
    
    predicted_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    -- Expected monthly revenue in INR
    
    -- Confidence in predictions
    confidence DECIMAL(5,4) NOT NULL DEFAULT 0,
    -- Range: 0 to 1
    
    -- What drove this prediction
    factors JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Example: {
    --   "pattern_matches": ["headline_numbers", "optimal_length"],
    --   "category_baseline": 75,
    --   "keyword_strength": 0.8,
    --   "competition_level": "medium",
    --   "seasonal_boost": 1.2
    -- }
    
    -- Actual performance (filled after 30 days)
    actual_performance JSONB,
    -- Example: {
    --   "score": 82,
    --   "traffic": 1250,
    --   "revenue": 3500,
    --   "measured_at": "2026-02-24"
    -- }
    
    -- Prediction accuracy (calculated after actual data available)
    prediction_accuracy DECIMAL(5,4),
    -- Range: 0 to 1 (how accurate was this prediction)
    
    -- Metadata
    model_version TEXT DEFAULT 'v1.0',
    category TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ
);

-- Indexes for performance_predictions
CREATE INDEX IF NOT EXISTS idx_perf_pred_article ON public.performance_predictions(article_id);
CREATE INDEX IF NOT EXISTS idx_perf_pred_draft_hash ON public.performance_predictions(draft_hash);
CREATE INDEX IF NOT EXISTS idx_perf_pred_score ON public.performance_predictions(predicted_score DESC);
CREATE INDEX IF NOT EXISTS idx_perf_pred_confidence ON public.performance_predictions(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_perf_pred_category ON public.performance_predictions(category);
CREATE INDEX IF NOT EXISTS idx_perf_pred_factors ON public.performance_predictions USING GIN(factors);

-- ============================================
-- 3. REVENUE INTELLIGENCE TABLE
-- Stores revenue predictions and optimization data
-- ============================================

CREATE TABLE IF NOT EXISTS public.revenue_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Article reference
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    
    -- Revenue predictions
    predicted_monthly_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    predicted_revenue_range_min DECIMAL(10,2) DEFAULT 0,
    predicted_revenue_range_max DECIMAL(10,2) DEFAULT 0,
    
    -- Actual revenue (updated periodically)
    actual_monthly_revenue DECIMAL(10,2) DEFAULT 0,
    revenue_last_updated TIMESTAMPTZ,
    
    -- Optimal affiliate positions
    optimal_affiliate_positions JSONB DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"position": "after_intro", "product_type": "credit_card", "expected_ctr": 0.042},
    --   {"position": "comparison_table", "product_type": "credit_card", "expected_ctr": 0.068},
    --   {"position": "conclusion", "product_type": "credit_card", "expected_ctr": 0.035}
    -- ]
    
    -- Revenue drivers analysis
    revenue_drivers JSONB DEFAULT '{}'::jsonb,
    -- Example: {
    --   "primary_driver": "comparison_table",
    --   "top_products": ["hdfc_regalia", "icici_amazon"],
    --   "best_cta_type": "button",
    --   "optimal_cta_count": 3,
    --   "seasonal_factor": 1.15
    -- }
    
    -- Conversion insights
    conversion_insights JSONB DEFAULT '{}'::jsonb,
    -- Example: {
    --   "avg_conversion_rate": 0.032,
    --   "best_converting_position": "after_pros_cons",
    --   "avg_commission": 850
    -- }
    
    -- Prediction confidence
    prediction_confidence DECIMAL(5,4) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for revenue_intelligence
CREATE INDEX IF NOT EXISTS idx_rev_intel_article ON public.revenue_intelligence(article_id);
CREATE INDEX IF NOT EXISTS idx_rev_intel_predicted ON public.revenue_intelligence(predicted_monthly_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_rev_intel_actual ON public.revenue_intelligence(actual_monthly_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_rev_intel_positions ON public.revenue_intelligence USING GIN(optimal_affiliate_positions);
CREATE INDEX IF NOT EXISTS idx_rev_intel_drivers ON public.revenue_intelligence USING GIN(revenue_drivers);

-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to update content intelligence patterns
CREATE OR REPLACE FUNCTION update_content_intelligence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_content_intelligence_updated
    BEFORE UPDATE ON public.content_intelligence
    FOR EACH ROW
    EXECUTE FUNCTION update_content_intelligence_timestamp();

CREATE TRIGGER trigger_revenue_intelligence_updated
    BEFORE UPDATE ON public.revenue_intelligence
    FOR EACH ROW
    EXECUTE FUNCTION update_content_intelligence_timestamp();

-- Function to calculate prediction accuracy
CREATE OR REPLACE FUNCTION calculate_prediction_accuracy(
    predicted_value DECIMAL,
    actual_value DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
    IF actual_value = 0 AND predicted_value = 0 THEN
        RETURN 1.0;
    END IF;
    
    IF actual_value = 0 THEN
        RETURN 0;
    END IF;
    
    -- Calculate accuracy as 1 - (error / actual)
    -- Capped between 0 and 1
    RETURN GREATEST(0, LEAST(1, 
        1 - ABS(predicted_value - actual_value) / actual_value
    ));
END;
$$ LANGUAGE plpgsql;

-- Function to get top patterns for a category
CREATE OR REPLACE FUNCTION get_top_patterns(
    p_category TEXT DEFAULT NULL,
    p_limit INT DEFAULT 10
)
RETURNS TABLE (
    pattern_type TEXT,
    pattern_data JSONB,
    success_correlation DECIMAL,
    confidence DECIMAL,
    sample_size INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.pattern_type,
        ci.pattern_data,
        ci.success_correlation,
        ci.confidence,
        ci.sample_size
    FROM public.content_intelligence ci
    WHERE ci.is_active = true
        AND (p_category IS NULL OR ci.category IS NULL OR ci.category = p_category)
        AND ci.confidence >= 0.5
    ORDER BY ci.success_correlation DESC, ci.confidence DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get revenue prediction for an article
CREATE OR REPLACE FUNCTION get_article_revenue_prediction(p_article_id UUID)
RETURNS TABLE (
    predicted_monthly_revenue DECIMAL,
    actual_monthly_revenue DECIMAL,
    prediction_accuracy DECIMAL,
    top_revenue_driver TEXT,
    optimal_positions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ri.predicted_monthly_revenue,
        ri.actual_monthly_revenue,
        CASE 
            WHEN ri.actual_monthly_revenue > 0 THEN
                calculate_prediction_accuracy(ri.predicted_monthly_revenue, ri.actual_monthly_revenue)
            ELSE NULL
        END as prediction_accuracy,
        ri.revenue_drivers->>'primary_driver' as top_revenue_driver,
        ri.optimal_affiliate_positions
    FROM public.revenue_intelligence ri
    WHERE ri.article_id = p_article_id
    ORDER BY ri.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. RLS POLICIES
-- ============================================

ALTER TABLE public.content_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_intelligence ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (solo operator model)
CREATE POLICY "content_intelligence_all_authenticated" ON public.content_intelligence
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "performance_predictions_all_authenticated" ON public.performance_predictions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "revenue_intelligence_all_authenticated" ON public.revenue_intelligence
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 6. COMMENTS
-- ============================================

COMMENT ON TABLE public.content_intelligence IS 'Stores learned patterns from high-performing content for AI-driven content optimization';
COMMENT ON TABLE public.performance_predictions IS 'Stores AI predictions for article performance before and after publishing';
COMMENT ON TABLE public.revenue_intelligence IS 'Stores revenue predictions, optimal affiliate positions, and conversion insights';

COMMENT ON COLUMN public.content_intelligence.pattern_type IS 'Type of pattern: headline, structure, cta, length, tone, keyword_density, formatting, hook, conclusion';
COMMENT ON COLUMN public.content_intelligence.success_correlation IS 'Correlation coefficient between this pattern and article success (-1 to 1)';
COMMENT ON COLUMN public.performance_predictions.draft_hash IS 'SHA256 hash for identifying draft predictions before article creation';
COMMENT ON COLUMN public.revenue_intelligence.optimal_affiliate_positions IS 'JSON array of optimal positions for affiliate links with expected CTR';
