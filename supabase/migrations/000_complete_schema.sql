-- ============================================
-- InvestingPro Complete Database Schema
-- All-inclusive SQL for creating all tables
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For RAG (if using Supabase vector)

-- ============================================
-- 1. DATA SOURCES (Provenance Tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS data_sources (
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

CREATE INDEX IF NOT EXISTS idx_data_sources_type ON data_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_data_sources_verified ON data_sources(is_verified) WHERE is_verified = true;

-- ============================================
-- 2. PRODUCTS (Unified Table with Type Discriminator)
-- ============================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('credit_card', 'mutual_fund', 'personal_loan', 'fd', 'insurance', 'stock', 'etf')),
    
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

CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_provider ON products(provider);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_type ON products(slug, product_type);

-- ============================================
-- 3. PRODUCT DATA POINTS (Provenance Tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS product_data_points (
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

CREATE INDEX IF NOT EXISTS idx_data_points_product ON product_data_points(product_id);
CREATE INDEX IF NOT EXISTS idx_data_points_field ON product_data_points(field_name);
CREATE INDEX IF NOT EXISTS idx_data_points_source ON product_data_points(source_id);
CREATE INDEX IF NOT EXISTS idx_data_points_fetched ON product_data_points(fetched_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_data_points_unique ON product_data_points(product_id, field_name, version);

-- ============================================
-- 4. CREDIT CARDS (Type-Specific Data)
-- ============================================

CREATE TABLE IF NOT EXISTS credit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    bank TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Cashback', 'Rewards', 'Travel', 'Premium', 'Shopping', 'Fuel')),
    description TEXT,
    
    -- Fees
    annual_fee DECIMAL(10,2),
    joining_fee DECIMAL(10,2),
    renewal_fee DECIMAL(10,2),
    annual_fee_text TEXT, -- For display like "Free" or "₹500 + GST"
    joining_fee_text TEXT,
    
    -- Interest Rates
    interest_rate_min DECIMAL(5,2), -- APR %
    interest_rate_max DECIMAL(5,2),
    interest_rate_text TEXT,
    
    -- Rewards
    reward_rate DECIMAL(5,2), -- % cashback/rewards
    reward_type TEXT, -- 'cashback', 'points', 'miles'
    reward_categories JSONB, -- {"dining": 5, "shopping": 2}
    rewards TEXT[],
    
    -- Eligibility
    min_income DECIMAL(12,2),
    min_income_text TEXT,
    min_credit_score INTEGER,
    max_credit_limit DECIMAL(12,2),
    
    -- Features
    features JSONB, -- Array of feature strings
    benefits JSONB,
    pros TEXT[],
    cons TEXT[],
    
    -- Additional
    fuel_surcharge_waiver BOOLEAN,
    lounge_access BOOLEAN,
    insurance_coverage JSONB,
    
    -- Display
    rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    apply_link TEXT,
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_cards_product ON credit_cards(product_id);
CREATE INDEX IF NOT EXISTS idx_credit_cards_slug ON credit_cards(slug);
CREATE INDEX IF NOT EXISTS idx_credit_cards_bank ON credit_cards(bank);
CREATE INDEX IF NOT EXISTS idx_credit_cards_type ON credit_cards(type);

-- ============================================
-- 5. MUTUAL FUNDS (Type-Specific Data)
-- ============================================

CREATE TABLE IF NOT EXISTS mutual_funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    fund_house TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index Fund', 'Debt', 'Hybrid')),
    fund_type TEXT, -- 'Equity', 'Debt', 'Hybrid'
    description TEXT,
    
    -- Basic Info
    amfi_code TEXT UNIQUE,
    isin TEXT,
    
    -- Performance
    nav NUMERIC NOT NULL,
    returns_1y DECIMAL(6,2),
    returns_3y DECIMAL(6,2),
    returns_5y DECIMAL(6,2),
    returns_since_inception DECIMAL(6,2),
    inception_date DATE,
    
    -- Risk Metrics
    risk_level TEXT CHECK (risk_level IN ('Low', 'Moderate', 'Moderately High', 'High', 'Very High')),
    risk TEXT CHECK (risk IN ('Low', 'Moderate', 'Moderately High', 'High', 'Very High')),
    sharpe_ratio DECIMAL(5,2),
    alpha DECIMAL(6,2),
    beta DECIMAL(5,2),
    standard_deviation DECIMAL(6,2),
    
    -- Costs
    expense_ratio DECIMAL(5,2),
    exit_load TEXT, -- e.g., "1% if redeemed within 1 year"
    
    -- Investment Details
    min_investment DECIMAL(10,2),
    min_investment_text TEXT,
    sip_minimum DECIMAL(10,2),
    aum DECIMAL(15,2), -- Assets Under Management
    aum_text TEXT, -- Display format like "₹5,000 Cr"
    
    -- Fund Manager
    fund_manager TEXT,
    fund_manager_experience_years INTEGER,
    
    -- Metadata
    rating NUMERIC CHECK (rating >= 1 AND rating <= 5),
    launch_date DATE,
    image_url TEXT,
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mutual_funds_product ON mutual_funds(product_id);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_slug ON mutual_funds(slug);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_category ON mutual_funds(category);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_type ON mutual_funds(fund_type);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_amfi ON mutual_funds(amfi_code);
CREATE INDEX IF NOT EXISTS idx_mf_category ON mutual_funds(category);
CREATE INDEX IF NOT EXISTS idx_mf_returns_3y ON mutual_funds(returns_3y DESC);
CREATE INDEX IF NOT EXISTS idx_mf_rating ON mutual_funds(rating DESC);

-- ============================================
-- 6. PERSONAL LOANS (Type-Specific Data)
-- ============================================

CREATE TABLE IF NOT EXISTS personal_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
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
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personal_loans_product ON personal_loans(product_id);

-- ============================================
-- 7. USER PROFILES (extends Supabase Auth)
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    
    -- User Information
    full_name TEXT,
    avatar_url TEXT,
    
    -- Role Management
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
    
    -- Preferences
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- 8. USER SUBSCRIPTIONS (Stripe integration)
-- ============================================

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    
    -- Stripe Information
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    
    -- Subscription Details
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
    plan_name TEXT,
    
    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_email ON user_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- ============================================
-- 9. ARTICLES (Content Management)
-- ============================================

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Content
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown or HTML
    body_markdown TEXT, -- Alternative field name
    body_html TEXT, -- Rendered HTML
    
    -- Classification
    category TEXT NOT NULL CHECK (category IN ('mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics')),
    category_id UUID, -- For CMS schema compatibility
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu')),
    tags TEXT[],
    keywords TEXT[], -- SEO keywords
    
    -- Media
    featured_image TEXT,
    read_time NUMERIC, -- Minutes
    
    -- Authorship & Moderation
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT, -- Display name
    author_email TEXT, -- Private field for contacting guest authors
    is_user_submission BOOLEAN DEFAULT FALSE,
    submission_status TEXT DEFAULT 'approved' CHECK (submission_status IN ('pending', 'approved', 'rejected', 'revision-requested')),
    rejection_reason TEXT,
    
    -- Publishing Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    published_date TIMESTAMPTZ, -- Alternative field name
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    
    -- Citations
    citations JSONB, -- Array of {source_url, source_name, citation_text}
    data_sources JSONB, -- Array of data_source_ids used
    
    -- AI Generation Metadata
    is_ai_generated BOOLEAN DEFAULT false,
    ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT, -- e.g., "gpt-4o-mini"
    ai_prompt_hash TEXT, -- Hash of prompt used
    human_reviewed BOOLEAN DEFAULT false,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    
    -- Analytics & Tech
    views INTEGER DEFAULT 0,
    
    -- Monetization
    affiliate_products TEXT[], -- Array of affiliate_product_ids
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_submission ON articles(submission_status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);

-- ============================================
-- 10. AUTHORS (CMS)
-- ============================================

CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Editor',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. CATEGORIES (CMS)
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to articles if category_id exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'category_id') THEN
        ALTER TABLE articles ADD CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================
-- 12. CONTENT (Alternative content table)
-- ============================================

CREATE TABLE IF NOT EXISTS content (
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

CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_language ON content(language);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(published_at DESC) WHERE status = 'published';

-- ============================================
-- 13. COMPARISONS
-- ============================================

CREATE TABLE IF NOT EXISTS comparisons (
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

CREATE INDEX IF NOT EXISTS idx_comparisons_type ON comparisons(product_type);
CREATE INDEX IF NOT EXISTS idx_comparisons_products ON comparisons USING GIN(product_ids);

-- ============================================
-- 14. RANKINGS (Versioned, Reproducible)
-- ============================================

CREATE TABLE IF NOT EXISTS ranking_configurations (
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

CREATE INDEX IF NOT EXISTS idx_ranking_configs_type ON ranking_configurations(product_type);
CREATE INDEX IF NOT EXISTS idx_ranking_configs_active ON ranking_configurations(is_active) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS rankings (
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

CREATE INDEX IF NOT EXISTS idx_rankings_config ON rankings(configuration_id);
CREATE INDEX IF NOT EXISTS idx_rankings_product ON rankings(product_id);
CREATE INDEX IF NOT EXISTS idx_rankings_score ON rankings(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON rankings(rank);

-- ============================================
-- 15. REVIEWS
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL, -- Reference to products.id or specific product tables
    product_type TEXT, -- 'credit_card', 'mutual_fund', etc.
    
    -- User Info
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    
    -- Content
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review_text TEXT NOT NULL,
    
    pros TEXT[],
    cons TEXT[],
    
    -- Metadata
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    
    -- Moderation
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_type ON reviews(product_type);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- ============================================
-- 16. CALCULATOR RESULTS
-- ============================================

CREATE TABLE IF NOT EXISTS calculator_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT, -- For logged-in users
    calculator_type TEXT NOT NULL CHECK (calculator_type IN ('sip', 'swp', 'lumpsum', 'fd', 'emi', 'tax', 'retirement', 'inflation', 'ppf', 'nps', 'goal-planning')),
    
    -- Input Parameters (JSONB for flexibility)
    inputs JSONB NOT NULL,
    
    -- Calculated Results
    results JSONB NOT NULL,
    
    -- Metadata
    session_id TEXT, -- For anonymous users
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calculator_results_type ON calculator_results(calculator_type);
CREATE INDEX IF NOT EXISTS idx_calculator_results_user ON calculator_results(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_results_user_email ON calculator_results(user_email);
CREATE INDEX IF NOT EXISTS idx_calculator_results_created ON calculator_results(created_at);

-- ============================================
-- 17. LIVE FINANCIAL RATES
-- ============================================

CREATE TABLE IF NOT EXISTS live_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_type TEXT NOT NULL CHECK (rate_type IN ('fd', 'savings', 'loan_personal', 'loan_home', 'loan_car', 'loan_education', 'inflation', 'mutual_fund_return')),
    provider TEXT, -- Bank name, institution name, etc.
    
    -- Rate Details
    rate_value NUMERIC NOT NULL,
    rate_unit TEXT DEFAULT 'percentage' CHECK (rate_unit IN ('percentage', 'basis_points')),
    min_amount NUMERIC,
    max_amount NUMERIC,
    tenure_months INTEGER,
    tenure_years NUMERIC,
    
    -- Source & Provenance
    source_url TEXT,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_rates_type ON live_rates(rate_type);
CREATE INDEX IF NOT EXISTS idx_live_rates_provider ON live_rates(provider);
CREATE INDEX IF NOT EXISTS idx_live_rates_scraped ON live_rates(scraped_at);
CREATE INDEX IF NOT EXISTS idx_live_rates_valid ON live_rates(valid_until);

-- ============================================
-- 18. INFLATION DATA
-- ============================================

CREATE TABLE IF NOT EXISTS inflation_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER, -- 1-12, NULL for annual data
    inflation_rate NUMERIC NOT NULL,
    source TEXT DEFAULT 'RBI',
    source_url TEXT,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inflation_year_month ON inflation_data(year, month);
CREATE INDEX IF NOT EXISTS idx_inflation_scraped ON inflation_data(scraped_at);

-- ============================================
-- 19. PORTFOLIOS (User Holdings)
-- ============================================

CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT, -- Alternative identifier
    asset_id UUID, -- References assets table (universal asset model)
    
    -- Manual Entry Overrides
    asset_name TEXT, -- Fallback if asset_id is null
    asset_type TEXT NOT NULL CHECK (asset_type IN ('mutual-fund', 'stock', 'etf', 'bond', 'fd', 'gold')),
    asset_category TEXT NOT NULL CHECK (asset_category IN ('equity', 'debt', 'hybrid', 'gold', 'international')),
    
    -- Financials
    quantity NUMERIC(15, 4) NOT NULL DEFAULT 0,
    purchase_price NUMERIC(15, 4) NOT NULL DEFAULT 0,
    average_price NUMERIC(15, 4) NOT NULL DEFAULT 0, -- Alternative field name
    current_price NUMERIC(15, 4),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Calculated Fields (Optional: Can be computed on fly, but storing for caching)
    invested_amount NUMERIC GENERATED ALWAYS AS (quantity * purchase_price) STORED,
    current_value NUMERIC GENERATED ALWAYS AS (quantity * COALESCE(current_price, purchase_price)) STORED,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_email ON portfolios(user_email);
CREATE INDEX IF NOT EXISTS idx_portfolios_asset ON portfolios(asset_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_asset_type ON portfolios(asset_type);

-- ============================================
-- 20. UNIVERSAL ASSETS (Ghost Infrastructure)
-- ============================================

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- 'mutual_funds', 'stocks', 'fixed_deposits', 'loans', 'insurance'
    vertical_slug TEXT NOT NULL, -- 'equity', 'debt', 'tax-saver', 'personal-loan'
    slug TEXT UNIQUE NOT NULL, -- SEO friendly URL
    name TEXT NOT NULL,
    provider TEXT NOT NULL, -- AMC, Bank, or Insurer name
    logo_url TEXT,
    
    -- Status & Tracking
    status TEXT DEFAULT 'active',
    scraped_at TIMESTAMPTZ DEFAULT now(),
    
    -- Universal Metrics
    rating INTEGER DEFAULT 0,
    risk_level TEXT, -- 'Low', 'Moderate', 'High', etc.
    
    -- Vertical Specific Data (JSONB for flexibility)
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Technical fields
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', name || ' ' || provider || ' ' || category)
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_provider ON assets(provider);
CREATE INDEX IF NOT EXISTS idx_assets_search ON assets USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_assets_slug ON assets(slug);

-- ============================================
-- 21. ASSET PRICE HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS asset_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    price_value NUMERIC(15, 4) NOT NULL,
    as_of_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_asset_date ON asset_price_history(asset_id, as_of_date DESC);

-- ============================================
-- 22. AFFILIATE PRODUCTS
-- ============================================

CREATE TABLE IF NOT EXISTS affiliate_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Identity
    name TEXT NOT NULL,
    company TEXT NOT NULL, -- e.g. "Zerodha", "HDFC Life"
    type TEXT NOT NULL CHECK (type IN ('mutual-fund', 'stock-broker', 'insurance', 'loan', 'credit-card', 'demat-account', 'banking')),
    description TEXT,
    
    -- Affiliate Logic
    affiliate_link TEXT NOT NULL,
    commission_rate NUMERIC,
    commission_type TEXT DEFAULT 'cpa' CHECK (commission_type IN ('percentage', 'fixed', 'cpa')),
    
    -- Content/Display
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    features TEXT[], -- Array of strings
    pricing JSONB, -- { "amount": "₹200", "period": "yearly" }
    image_url TEXT,
    
    -- Analytics (Aggregated)
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aff_prod_type ON affiliate_products(type);
CREATE INDEX IF NOT EXISTS idx_aff_prod_status ON affiliate_products(status);
CREATE INDEX IF NOT EXISTS idx_aff_prod_company ON affiliate_products(company);

-- ============================================
-- 23. AFFILIATE CLICKS TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source Context
    product_id UUID NOT NULL, -- Generic reference to products.id
    product_type TEXT, -- Optional: 'credit_card', 'loan', etc.
    affiliate_product_id UUID REFERENCES affiliate_products(id) ON DELETE SET NULL,
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL, -- If clicked from a blog post
    
    -- User Metadata
    user_ip TEXT, 
    user_agent TEXT,
    referrer TEXT,
    
    -- Conversion Tracking
    converted BOOLEAN DEFAULT FALSE,
    conversion_date TIMESTAMPTZ,
    commission_earned NUMERIC DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_product ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_aff_product ON affiliate_clicks(affiliate_product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_created ON affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_converted ON affiliate_clicks(converted) WHERE converted = TRUE;

-- ============================================
-- 24. AD PLACEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    
    -- Positioning
    position TEXT NOT NULL CHECK (position IN ('header', 'sidebar', 'in-article', 'footer', 'between-cards')),
    pages TEXT[], -- Array of page slugs, e.g. ['/credit-cards', '/loans'] or ['*'] for all
    
    -- Content
    ad_type TEXT NOT NULL DEFAULT 'banner' CHECK (ad_type IN ('banner', 'native', 'video', 'sponsored-content')),
    advertiser TEXT,
    ad_content TEXT NOT NULL, -- HTML snippet or Image URL
    click_url TEXT,
    
    -- Campaign Logic
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    
    -- Performance & Billing
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    cpc NUMERIC DEFAULT 0, -- Cost Per Click
    budget NUMERIC, -- Total Budget
    spent NUMERIC DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ads_status ON ad_placements(status);
CREATE INDEX IF NOT EXISTS idx_ads_position ON ad_placements(position);
CREATE INDEX IF NOT EXISTS idx_ads_pages ON ad_placements USING GIN(pages);

-- ============================================
-- 25. RAW DATA SNAPSHOTS (Audit Trail)
-- ============================================

CREATE TABLE IF NOT EXISTS raw_data_snapshots (
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

CREATE INDEX IF NOT EXISTS idx_snapshots_source ON raw_data_snapshots(source_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_product ON raw_data_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_fetched ON raw_data_snapshots(fetched_at DESC);

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

-- Apply triggers to relevant tables
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_credit_cards_updated_at ON credit_cards;
CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON credit_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mutual_funds_updated_at ON mutual_funds;
CREATE TRIGGER update_mutual_funds_updated_at BEFORE UPDATE ON mutual_funds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_personal_loans_updated_at ON personal_loans;
CREATE TRIGGER update_personal_loans_updated_at BEFORE UPDATE ON personal_loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comparisons_updated_at ON comparisons;
CREATE TRIGGER update_comparisons_updated_at BEFORE UPDATE ON comparisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_live_rates_updated_at ON live_rates;
CREATE TRIGGER update_live_rates_updated_at BEFORE UPDATE ON live_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliate_products_updated_at ON affiliate_products;
CREATE TRIGGER update_affiliate_products_updated_at BEFORE UPDATE ON affiliate_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ad_placements_updated_at ON ad_placements;
CREATE TRIGGER update_ad_placements_updated_at BEFORE UPDATE ON ad_placements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutual_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inflation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_data_snapshots ENABLE ROW LEVEL SECURITY;

-- Products: Public read access for active products
DROP POLICY IF EXISTS "Public read access" ON products;
CREATE POLICY "Public read access" ON products
    FOR SELECT USING (is_active = true);

-- Product Data Points: Public read access
DROP POLICY IF EXISTS "Public read access" ON product_data_points;
CREATE POLICY "Public read access" ON product_data_points
    FOR SELECT USING (true);

-- Credit Cards: Public read, admin write
DROP POLICY IF EXISTS "Public can view credit cards" ON credit_cards;
CREATE POLICY "Public can view credit cards" ON credit_cards
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert credit cards" ON credit_cards;
CREATE POLICY "Admins can insert credit cards" ON credit_cards
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- Mutual Funds: Public read, admin write
DROP POLICY IF EXISTS "Public can view mutual funds" ON mutual_funds;
CREATE POLICY "Public can view mutual funds" ON mutual_funds
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert mutual funds" ON mutual_funds;
CREATE POLICY "Admins can insert mutual funds" ON mutual_funds
    FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- User Profiles: Users can view/update own, admins can view all
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- User Subscriptions: Users can view own, service role can manage
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.jwt() ->> 'email' = email OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Articles: Public can view published, users can submit, admins can manage
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles" ON articles
    FOR SELECT USING (status = 'published' AND (submission_status = 'approved' OR submission_status IS NULL));

DROP POLICY IF EXISTS "Users can submit articles" ON articles;
CREATE POLICY "Users can submit articles" ON articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can view own submissions" ON articles;
CREATE POLICY "Users can view own submissions" ON articles
    FOR SELECT USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can edit own drafts" ON articles;
CREATE POLICY "Users can edit own drafts" ON articles
    FOR UPDATE USING (auth.uid() = author_id AND status = 'draft');

DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
CREATE POLICY "Admins can manage articles" ON articles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Content: Public can view published
DROP POLICY IF EXISTS "Public can view published content" ON content;
CREATE POLICY "Public can view published content" ON content
    FOR SELECT USING (status = 'published');

-- Rankings: Public read access
DROP POLICY IF EXISTS "Public read access" ON rankings;
CREATE POLICY "Public read access" ON rankings
    FOR SELECT USING (true);

-- Reviews: Public can view approved, users can submit, admins can manage
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Users can submit reviews" ON reviews;
CREATE POLICY "Users can submit reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR true); -- Allow anonymous reviews

DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews" ON reviews
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Calculator Results: Public can insert, users can view own
DROP POLICY IF EXISTS "Public can insert calculator results" ON calculator_results;
CREATE POLICY "Public can insert calculator results" ON calculator_results
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own results" ON calculator_results;
CREATE POLICY "Users can view own results" ON calculator_results
    FOR SELECT USING (user_email IS NULL OR auth.jwt() ->> 'email' = user_email OR auth.uid() = user_id);

-- Live Rates: Public can view active rates
DROP POLICY IF EXISTS "Public can view active rates" ON live_rates;
CREATE POLICY "Public can view active rates" ON live_rates
    FOR SELECT USING (valid_until IS NULL OR valid_until > NOW());

DROP POLICY IF EXISTS "Service role can manage rates" ON live_rates;
CREATE POLICY "Service role can manage rates" ON live_rates
    FOR ALL USING (auth.role() = 'service_role');

-- Inflation Data: Public can view
DROP POLICY IF EXISTS "Public can view inflation data" ON inflation_data;
CREATE POLICY "Public can view inflation data" ON inflation_data
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage inflation data" ON inflation_data;
CREATE POLICY "Service role can manage inflation data" ON inflation_data
    FOR ALL USING (auth.role() = 'service_role');

-- Portfolios: Users can only see their own
DROP POLICY IF EXISTS "Users can view own assets" ON portfolios;
CREATE POLICY "Users can view own assets" ON portfolios
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email);

DROP POLICY IF EXISTS "Users can insert own assets" ON portfolios;
CREATE POLICY "Users can insert own assets" ON portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email);

DROP POLICY IF EXISTS "Users can update own assets" ON portfolios;
CREATE POLICY "Users can update own assets" ON portfolios
    FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email);

DROP POLICY IF EXISTS "Users can delete own assets" ON portfolios;
CREATE POLICY "Users can delete own assets" ON portfolios
    FOR DELETE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = user_email);

-- Assets: Public read access
DROP POLICY IF EXISTS "Allow public read access for assets" ON assets;
CREATE POLICY "Allow public read access for assets" ON assets
    FOR SELECT USING (true);

-- Asset Price History: Public read access
DROP POLICY IF EXISTS "Allow public read access for history" ON asset_price_history;
CREATE POLICY "Allow public read access for history" ON asset_price_history
    FOR SELECT USING (true);

-- Affiliate Products: Public can view active
DROP POLICY IF EXISTS "Public can view active affiliate products" ON affiliate_products;
CREATE POLICY "Public can view active affiliate products" ON affiliate_products
    FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage affiliate products" ON affiliate_products;
CREATE POLICY "Admins can manage affiliate products" ON affiliate_products
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Affiliate Clicks: Public can insert, admins can view
DROP POLICY IF EXISTS "Public can track clicks" ON affiliate_clicks;
CREATE POLICY "Public can track clicks" ON affiliate_clicks
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view clicks" ON affiliate_clicks;
CREATE POLICY "Admins can view clicks" ON affiliate_clicks
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can update conversions" ON affiliate_clicks;
CREATE POLICY "Admins can update conversions" ON affiliate_clicks
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Ad Placements: Public can view active ads
DROP POLICY IF EXISTS "Public can view active ads" ON ad_placements;
CREATE POLICY "Public can view active ads" ON ad_placements
    FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage ads" ON ad_placements;
CREATE POLICY "Admins can manage ads" ON ad_placements
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE products IS 'Unified product table with type discriminator. All financial products inherit from this.';
COMMENT ON TABLE product_data_points IS 'Individual data fields with full provenance tracking. Every value has source, timestamp, and update frequency.';
COMMENT ON TABLE rankings IS 'Versioned ranking results. Rankings are immutable snapshots for reproducibility.';
COMMENT ON TABLE raw_data_snapshots IS 'Full HTML/JSON snapshots for audit trail and debugging.';
COMMENT ON TABLE user_profiles IS 'User profile information extending Supabase auth.users';
COMMENT ON TABLE user_subscriptions IS 'Stripe subscription management for premium features';
COMMENT ON TABLE articles IS 'Content management for articles, guides, and educational content';
COMMENT ON TABLE portfolios IS 'User portfolio holdings for tracking investments';
COMMENT ON TABLE assets IS 'Universal asset model for all financial products';
COMMENT ON TABLE affiliate_products IS 'Monetizable affiliate products inventory';
COMMENT ON TABLE live_rates IS 'Live financial rates scraped from various sources';

