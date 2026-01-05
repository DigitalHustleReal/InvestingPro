-- Add ai_generated column to glossary_terms
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS ai_model TEXT;
