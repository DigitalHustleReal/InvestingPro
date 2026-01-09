-- Add Rich Content Fields to Glossary Terms
-- This migration adds Investopedia-style rich content fields to existing glossary_terms table

-- Add rich content fields
ALTER TABLE glossary_terms 
  ADD COLUMN IF NOT EXISTS full_form TEXT,
  ADD COLUMN IF NOT EXISTS pronunciation TEXT,
  ADD COLUMN IF NOT EXISTS why_it_matters TEXT NOT NULL DEFAULT 'Understanding this term is crucial for making informed financial decisions.',
  ADD COLUMN IF NOT EXISTS example_numeric TEXT NOT NULL DEFAULT 'Example calculation pending',
  ADD COLUMN IF NOT EXISTS example_text TEXT,
  ADD COLUMN IF NOT EXISTS how_to_use TEXT,
  ADD COLUMN IF NOT EXISTS common_mistakes TEXT[],
  ADD COLUMN IF NOT EXISTS related_calculators TEXT[],
  ADD COLUMN IF NOT EXISTS related_guides TEXT[],
  ADD COLUMN IF NOT EXISTS related_terms TEXT[],
  ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS internal_links JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS schema_markup JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_review BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_glossary_terms_status ON glossary_terms(status);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_category ON glossary_terms(category);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_created_at ON glossary_terms(created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_glossary_search_vector ON glossary_terms USING GIN(
    to_tsvector('english', 
        term || ' ' || 
        COALESCE(full_form, '') || ' ' || 
        COALESCE(definition, '') || ' ' || 
        COALESCE(why_it_matters, '')
    )
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_glossary_terms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS glossary_terms_updated_at ON glossary_terms;
CREATE TRIGGER glossary_terms_updated_at
BEFORE UPDATE ON glossary_terms
FOR EACH ROW
EXECUTE FUNCTION update_glossary_terms_updated_at();

-- Update existing rows to set published_at for published terms
UPDATE glossary_terms 
SET published_at = created_at 
WHERE status = 'published' AND published_at IS NULL;

COMMENT ON TABLE glossary_terms IS 'Investopedia-style financial glossary with rich content and automatic interlinking';
COMMENT ON COLUMN glossary_terms.why_it_matters IS 'Explains practical importance and relevance (150 words)';
COMMENT ON COLUMN glossary_terms.example_numeric IS 'Numeric example with step-by-step calculation';
COMMENT ON COLUMN glossary_terms.example_text IS 'Explanation of the numeric example';
COMMENT ON COLUMN glossary_terms.how_to_use IS 'Practical guide on using this concept';
COMMENT ON COLUMN glossary_terms.related_calculators IS 'Array of calculator slugs related to this term';
COMMENT ON COLUMN glossary_terms.related_guides IS 'Array of article/guide slugs';
COMMENT ON COLUMN glossary_terms.internal_links IS 'Auto-generated internal links to this term';
