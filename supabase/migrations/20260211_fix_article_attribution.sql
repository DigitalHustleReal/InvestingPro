-- Fix missing attribution columns in articles table
-- Resolves "record new has no editor id" error in triggers

ALTER TABLE public.articles
    ADD COLUMN IF NOT EXISTS author_id UUID,
    ADD COLUMN IF NOT EXISTS editor_id UUID,
    ADD COLUMN IF NOT EXISTS author_name TEXT,
    ADD COLUMN IF NOT EXISTS editor_name TEXT,
    ADD COLUMN IF NOT EXISTS show_author BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS show_reviewer BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS reviewer_label TEXT DEFAULT 'Reviewed by',
    ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_editor_id ON public.articles(editor_id);
