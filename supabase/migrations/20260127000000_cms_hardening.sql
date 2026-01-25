-- CMS Hardening Migration: E-E-A-T & Pipeline Traceability
-- Generated: 2026-01-27
-- Purpose: Add "Truth Management" fields to articles table

-- 1. Add Fact-Checking Workflow Fields
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS fact_check_status TEXT DEFAULT 'pending' CHECK (fact_check_status IN ('pending', 'verified', 'disputed', 'correction_needed'));

-- 2. Add Citation/Source Tracking (E-E-A-T)
-- Stores array of { "text": "Source Name", "url": "https://..." }
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS citations JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS content_source_url TEXT; -- Original source if repurposed (e.g., RBI PDF)

-- 3. Add Pipeline Traceability
-- Links this article to the specific automation run that generated it
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS pipeline_run_id UUID REFERENCES pipeline_runs(id);

-- Also track provenance for raw product data
ALTER TABLE credit_cards
ADD COLUMN IF NOT EXISTS pipeline_run_id UUID REFERENCES pipeline_runs(id);

ALTER TABLE mutual_funds
ADD COLUMN IF NOT EXISTS pipeline_run_id UUID REFERENCES pipeline_runs(id);

-- 4. Create Index for Review Queue Performance
CREATE INDEX IF NOT EXISTS idx_articles_fact_check_status ON articles(fact_check_status);
CREATE INDEX IF NOT EXISTS idx_articles_pipeline_run ON articles(pipeline_run_id);

-- 5. Add Comment for Documentation
COMMENT ON COLUMN articles.fact_check_status IS 'Workflow status for Editorial Fact-Checking (E-E-A-T compliance)';
COMMENT ON COLUMN articles.citations IS 'structured list of sources used in the article';
