-- ============================================
-- InvestingPro Core Schema
-- Production-grade financial intelligence platform
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For RAG (if using Supabase vector)

-- ============================================
-- DATA SOURCES (Provenance Tracking)
-- ============================================

CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g., "HDFC Bank Official Website"
    url TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('bank_website', 'aggregator', 'regulatory', 'api', 'manual')),
    is_verified BOOLEAN DEFAULT false,
    update_frequency TEXT NOT NULL CHECK (update_frequency IN ('daily', 'weekly', 'monthly', 'on_demand')),
    last_checked_at TIMESTAMPTZ,
    last_successful_fetch_at TIMESTAMPTZ,
    reliability_score DECIMAL(3,2) DEFAULT 0.5 CHECK (reliability_score >= 0 AND reliability_score <= 1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_data_sources_type ON data_sources(source_type);
CREATE INDEX idx_data_sources_verified ON data_sources(is_verified) WHERE is_verified = true;

-- ============================================
-- PRODUCTS (Unified Table with Type Discriminator)
-- ============================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('credit_card', 'mutual_fund', 'personal_loan')),
    
    -- Common fields
    provider TEXT NOT NULL, -- Bank/AMC name
    provider_slug TEXT,
    is_active BOOLEAN DEFAULT true,
    launch_date DATE,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    
    -- Status
    data_completeness_score DECIMAL(3,2) DEFAULT 0 CHECK (data_completeness_score >= 0 AND data_completeness_score <= 1),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(provider, '')), 'B')
    ) STORED
);

CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_provider ON products(provider);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE UNIQUE INDEX idx_products_slug_type ON products(slug, product_type);

-- ============================================
-- PRODUCT DATA POINTS (Provenance Tracking)
-- ============================================

CREATE TABLE product_data_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL, -- e.g., "annual_fee", "interest_rate_min"
    field_value JSONB NOT NULL, -- Flexible value storage
    data_type TEXT NOT NULL CHECK (data_type IN ('number', 'text', 'boolean', 'date', 'array', 'object')),
    
    -- Provenance
    source_id UUID REFERENCES data_sources(id),
    source_url TEXT, -- Direct URL to source
    fetched_at TIMESTAMPTZ NOT NULL,
    update_frequency TEXT NOT NULL CHECK (update_frequency IN ('daily', 'weekly', 'monthly', 'on_demand')),
    
    -- Validation
    is_verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    previous_value JSONB,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_data_points_product ON product_data_points(product_id);
CREATE INDEX idx_data_points_field ON product_data_points(field_name);
CREATE INDEX idx_data_points_source ON product_data_points(source_id);
CREATE INDEX idx_data_points_fetched ON product_data_points(fetched_at DESC);
CREATE UNIQUE INDEX idx_data_points_unique ON product_data_points(product_id, field_name, version);

-- ============================================
-- CREDIT CARDS (Type-Specific Data)
-- ============================================

CREATE TABLE credit_cards (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    
    -- Fees
    annual_fee DECIMAL(10,2),
    joining_fee DECIMAL(10,2),
    renewal_fee DECIMAL(10,2),
    
    -- Interest Rates
    interest_rate_min DECIMAL(5,2), -- APR %
    interest_rate_max DECIMAL(5,2),
    
    -- Rewards
    reward_rate DECIMAL(5,2), -- % cashback/rewards
    reward_type TEXT, -- 'cashback', 'points', 'miles'
    reward_categories JSONB, -- {"dining": 5, "shopping": 2}
    
    -- Eligibility
    min_income DECIMAL(12,2),
    min_credit_score INTEGER,
    max_credit_limit DECIMAL(12,2),
    
    -- Features
    features JSONB, -- Array of feature strings
    benefits JSONB,
    
    -- Additional
    fuel_surcharge_waiver BOOLEAN,
    lounge_access BOOLEAN,
    insurance_coverage JSONB,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MUTUAL FUNDS (Type-Specific Data)
-- ============================================

CREATE TABLE mutual_funds (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    
    -- Basic Info
    amfi_code TEXT UNIQUE,
    isin TEXT,
    fund_category TEXT, -- 'Large Cap', 'Mid Cap', etc.
    fund_type TEXT, -- 'Equity', 'Debt', 'Hybrid'
    
    -- Performance
    returns_1y DECIMAL(6,2),
    returns_3y DECIMAL(6,2),
    returns_5y DECIMAL(6,2),
    returns_since_inception DECIMAL(6,2),
    inception_date DATE,
    
    -- Risk Metrics
    risk_level TEXT CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Very High')),
    sharpe_ratio DECIMAL(5,2),
    alpha DECIMAL(6,2),
    beta DECIMAL(5,2),
    standard_deviation DECIMAL(6,2),
    
    -- Costs
    expense_ratio DECIMAL(5,2),
    exit_load TEXT, -- e.g., "1% if redeemed within 1 year"
    
    -- Investment Details
    min_investment DECIMAL(10,2),
    sip_minimum DECIMAL(10,2),
    aum DECIMAL(15,2), -- Assets Under Management
    
    -- Fund Manager
    fund_manager TEXT,
    fund_manager_experience_years INTEGER,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mutual_funds_category ON mutual_funds(fund_category);
CREATE INDEX idx_mutual_funds_type ON mutual_funds(fund_type);
CREATE INDEX idx_mutual_funds_amfi ON mutual_funds(amfi_code);

-- ============================================
-- PERSONAL LOANS (Type-Specific Data)
-- ============================================

CREATE TABLE personal_loans (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    
    -- Interest Rates
    interest_rate_min DECIMAL(5,2), -- APR %
    interest_rate_max DECIMAL(5,2),
    interest_rate_type TEXT, -- 'fixed', 'floating'
    
    -- Loan Amounts
    min_loan_amount DECIMAL(12,2),
    max_loan_amount DECIMAL(12,2),
    
    -- Tenure
    min_tenure_months INTEGER,
    max_tenure_months INTEGER,
    
    -- Fees
    processing_fee_type TEXT, -- 'percentage', 'fixed', 'nil'
    processing_fee_value DECIMAL(10,2),
    prepayment_charges TEXT,
    foreclosure_charges TEXT,
    
    -- Eligibility
    min_income DECIMAL(12,2),
    min_age INTEGER,
    max_age INTEGER,
    employment_type TEXT[], -- ['salaried', 'self_employed']
    
    -- Features
    features JSONB,
    documents_required JSONB, -- Array of required documents
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RANKINGS (Versioned, Reproducible)
-- ============================================

CREATE TABLE ranking_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g., "Credit Cards - Best Overall 2025"
    product_type TEXT NOT NULL CHECK (product_type IN ('credit_card', 'mutual_fund', 'personal_loan')),
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Weight configuration (JSONB for flexibility)
    weights JSONB NOT NULL, -- {"annual_fee": 0.3, "rewards": 0.4, ...}
    
    -- Methodology
    methodology_text TEXT NOT NULL,
    factors JSONB NOT NULL, -- Array of factors considered
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    
    created_by TEXT, -- User/system identifier
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ranking_configs_type ON ranking_configurations(product_type);
CREATE INDEX idx_ranking_configs_active ON ranking_configurations(is_active) WHERE is_active = true;

CREATE TABLE rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    configuration_id UUID NOT NULL REFERENCES ranking_configurations(id),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    -- Score
    total_score DECIMAL(6,2) NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
    rank INTEGER NOT NULL,
    
    -- Breakdown (explainable)
    score_breakdown JSONB NOT NULL, -- {"annual_fee_score": 25, "rewards_score": 30, ...}
    factor_scores JSONB NOT NULL, -- Detailed factor-level scores
    
    -- Explanation
    explanation_text TEXT, -- Human-readable explanation
    strengths JSONB, -- Array of strengths
    weaknesses JSONB, -- Array of weaknesses
    
    -- Metadata
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    data_snapshot_date DATE, -- Date of data used for calculation
    
    UNIQUE(configuration_id, product_id, calculated_at)
);

CREATE INDEX idx_rankings_config ON rankings(configuration_id);
CREATE INDEX idx_rankings_product ON rankings(product_id);
CREATE INDEX idx_rankings_score ON rankings(total_score DESC);
CREATE INDEX idx_rankings_rank ON rankings(rank);

-- ============================================
-- CONTENT (Articles, FAQs with Citations)
-- ============================================

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('article', 'faq', 'guide', 'comparison')),
    
    -- Content
    excerpt TEXT,
    body_markdown TEXT NOT NULL,
    body_html TEXT, -- Rendered HTML
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    
    -- Citations
    citations JSONB, -- Array of {source_url, source_name, citation_text}
    data_sources JSONB, -- Array of data_source_ids used
    
    -- AI Generation Metadata
    is_ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT, -- e.g., "gpt-4o-mini"
    ai_prompt_hash TEXT, -- Hash of prompt used
    human_reviewed BOOLEAN DEFAULT false,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    
    -- Language
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_type ON content(content_type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_language ON content(language);
CREATE INDEX idx_content_published ON content(published_at DESC) WHERE status = 'published';

-- ============================================
-- COMPARISONS
-- ============================================

CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    product_type TEXT NOT NULL,
    product_ids UUID[] NOT NULL, -- Array of product IDs being compared
    
    -- Comparison data (snapshot at time of creation)
    comparison_data JSONB NOT NULL,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comparisons_type ON comparisons(product_type);
CREATE INDEX idx_comparisons_products ON comparisons USING GIN(product_ids);

-- ============================================
-- RAW DATA SNAPSHOTS (For Audit Trail)
-- ============================================

CREATE TABLE raw_data_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES data_sources(id),
    product_id UUID REFERENCES products(id),
    
    -- Raw data
    raw_html TEXT, -- Full HTML snapshot
    raw_json JSONB, -- Parsed JSON data
    url TEXT NOT NULL,
    
    -- Metadata
    fetched_at TIMESTAMPTZ NOT NULL,
    fetch_duration_ms INTEGER,
    http_status_code INTEGER,
    
    -- Processing
    parsed_at TIMESTAMPTZ,
    parse_errors JSONB, -- Array of parsing errors if any
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_snapshots_source ON raw_data_snapshots(source_id);
CREATE INDEX idx_snapshots_product ON raw_data_snapshots(product_id);
CREATE INDEX idx_snapshots_fetched ON raw_data_snapshots(fetched_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON credit_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mutual_funds_updated_at BEFORE UPDATE ON mutual_funds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_loans_updated_at BEFORE UPDATE ON personal_loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate data completeness score
CREATE OR REPLACE FUNCTION calculate_data_completeness(p_product_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_fields INTEGER;
    filled_fields INTEGER;
    completeness DECIMAL;
BEGIN
    -- Count total expected fields for product type
    SELECT COUNT(*) INTO total_fields
    FROM product_data_points
    WHERE product_id = p_product_id;
    
    -- Count fields with non-null values
    SELECT COUNT(*) INTO filled_fields
    FROM product_data_points
    WHERE product_id = p_product_id
    AND field_value IS NOT NULL
    AND field_value != 'null'::jsonb;
    
    IF total_fields = 0 THEN
        RETURN 0;
    END IF;
    
    completeness := (filled_fields::DECIMAL / total_fields::DECIMAL);
    RETURN ROUND(completeness, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on sensitive tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access" ON product_data_points
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON rankings
    FOR SELECT USING (true);

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE products IS 'Unified product table with type discriminator. All financial products inherit from this.';
COMMENT ON TABLE product_data_points IS 'Individual data fields with full provenance tracking. Every value has source, timestamp, and update frequency.';
COMMENT ON TABLE rankings IS 'Versioned ranking results. Rankings are immutable snapshots for reproducibility.';
COMMENT ON TABLE raw_data_snapshots IS 'Full HTML/JSON snapshots for audit trail and debugging.';

