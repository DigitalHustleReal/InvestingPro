-- ============================================
-- Glossary Terms Table
-- Fully automated glossary system
-- ============================================

CREATE TABLE IF NOT EXISTS glossary_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Term Information
    term TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    full_form TEXT, -- For acronyms (e.g., "SIP" -> "Systematic Investment Plan")
    pronunciation TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'investing', 'mutual-funds', 'stocks', 'credit-cards', 
        'loans', 'insurance', 'tax', 'retirement', 'banking', 'general'
    )),
    
    -- Content (AI-generated from factual data only)
    definition TEXT NOT NULL, -- Max 200 words
    why_it_matters TEXT NOT NULL, -- Max 150 words, factual explanation
    example_numeric TEXT NOT NULL, -- Numeric example with calculation
    example_text TEXT, -- Text explanation of the numeric example
    
    -- Related Content (Auto-generated)
    related_calculators TEXT[], -- Array of calculator slugs (e.g., ['sip', 'emi'])
    related_guides TEXT[], -- Array of guide/article slugs
    related_terms TEXT[], -- Array of related glossary term slugs
    
    -- Sources (Required for factual data)
    sources JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {name, url, type, verified}
    /*
    Example sources structure:
    [
        {
            "name": "RBI Official Website",
            "url": "https://rbi.org.in/...",
            "type": "regulatory",
            "verified": true,
            "last_verified": "2024-01-15T10:00:00Z"
        }
    ]
    */
    
    -- AI Metadata (Tracks AI generation)
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    /*
    Example ai_metadata:
    {
        "generated_at": "2024-01-15T10:00:00Z",
        "generated_by": "ai",
        "data_sources": [...],
        "confidence": 0.95,
        "requires_review": true,
        "review_status": "pending"
    }
    */
    
    -- Internal Links (Auto-generated)
    internal_links JSONB DEFAULT '[]'::jsonb,
    /*
    Example internal_links:
    [
        {
            "text": "SIP Calculator",
            "url": "/calculators/sip",
            "link_type": "calculator",
            "context": "related_calculators"
        }
    ]
    */
    
    -- Schema Markup (Auto-generated JSON-LD)
    schema_markup JSONB DEFAULT '{}'::jsonb,
    /*
    Example schema_markup:
    {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": "SIP",
        "description": "...",
        "url": "https://investingpro.in/glossary/sip"
    }
    */
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    meta_keywords TEXT[],
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_ai_generated BOOLEAN DEFAULT true,
    requires_review BOOLEAN DEFAULT true,
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
    
    -- Analytics
    views INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    last_reviewed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_category ON glossary_terms(category);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_status ON glossary_terms(status);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_term ON glossary_terms(term);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_search ON glossary_terms USING GIN(
    to_tsvector('english', term || ' ' || COALESCE(full_form, '') || ' ' || COALESCE(definition, ''))
);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_glossary_search_vector ON glossary_terms USING GIN(
    to_tsvector('english', 
        term || ' ' || 
        COALESCE(full_form, '') || ' ' || 
        COALESCE(definition, '') || ' ' || 
        COALESCE(why_it_matters, '')
    )
);

-- RLS Policies
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Public can view published terms
CREATE POLICY "Public can view published glossary terms" 
ON glossary_terms FOR SELECT 
USING (status = 'published');

-- Authenticated users (editors/admins) can do everything
CREATE POLICY "Editors can manage glossary terms" 
ON glossary_terms FOR ALL 
USING (auth.role() = 'authenticated');

-- Service role (for scrapers/AI) can insert/update
CREATE POLICY "Service role can manage glossary terms" 
ON glossary_terms FOR ALL 
USING (auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_glossary_terms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER glossary_terms_updated_at
BEFORE UPDATE ON glossary_terms
FOR EACH ROW
EXECUTE FUNCTION update_glossary_terms_updated_at();

-- Function to auto-generate slug from term
CREATE OR REPLACE FUNCTION generate_glossary_slug(term_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(term_text, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

