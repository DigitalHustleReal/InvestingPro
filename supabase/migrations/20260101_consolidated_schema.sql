-- ============================================
-- CONSOLIDATED SCHEMA 2026-01-01
-- Merges 000, 001, and 20250119 migrations.
-- Resolves conflicts: 'content' -> 'articles', 'assets' -> 'products'.
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 1. CLEANUP (Drop duplicate/legacy tables)
-- ============================================
DROP TABLE IF EXISTS content CASCADE; -- Duplicate of articles
DROP TABLE IF EXISTS assets CASCADE; -- Duplicate of products
DROP TABLE IF EXISTS asset_price_history CASCADE; -- Linked to assets

-- ============================================
-- 2. CORE REFERENCE TABLES
-- ============================================

-- Data Sources (Provenance)
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('bank_website', 'aggregator', 'regulatory', 'api', 'manual')),
    is_verified BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors (CMS)
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Editor',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (CMS)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PRODUCT CATALOG (The Source of Truth)
-- ============================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('credit_card', 'mutual_fund', 'personal_loan', 'fd', 'insurance', 'stock', 'etf')),
    provider TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    data_completeness_score DECIMAL(3,2) DEFAULT 0,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Search Vector
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(provider, '')), 'B')
    ) STORED
);

CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug_type ON products(slug, product_type);

-- Sub-tables for Specific Types

CREATE TABLE IF NOT EXISTS credit_cards (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    annual_fee NUMERIC, -- Normalized to Number
    joining_fee NUMERIC,
    reward_rate NUMERIC,
    features JSONB, 
    apply_link TEXT, -- Affiliate Link
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mutual_funds (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    amfi_code TEXT UNIQUE,
    nav NUMERIC NOT NULL,
    returns_1y DECIMAL(6,2),
    returns_3y DECIMAL(6,2),
    returns_5y DECIMAL(6,2),
    expense_ratio DECIMAL(5,2),
    risk_level TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_loans (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    interest_rate_min DECIMAL(5,2),
    interest_rate_max DECIMAL(5,2),
    processing_fee_value DECIMAL(10,2),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CMS & CONTENT
-- ============================================

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown
    
    -- Taxonomy
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[],
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    
    -- Attribution
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    
    -- AI Metadata
    is_ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- ============================================
-- 5. REVIEWS & RATINGS
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    user_name TEXT NOT NULL,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    source_url TEXT, -- If scraped
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. USER DATA
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calculator_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    calculator_type TEXT NOT NULL,
    inputs JSONB,
    results JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. PIPELINES & AUTOMATION
-- ============================================

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    params JSONB,
    result JSONB,
    error_message TEXT,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);

-- ============================================
-- 8. AFFILIATE TRACKING (New for Phase 1)
-- ============================================

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES auth.users(id),
    source_page TEXT,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    sub_id TEXT -- For tracking on network side
);
