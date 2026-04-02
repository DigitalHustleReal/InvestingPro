-- Add columns for Conduit CMS sync
-- Run this in investingpro's Supabase SQL Editor

-- Track which articles came from Conduit
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS conduit_id TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0;

-- Index for fast Conduit lookups
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_conduit_id ON articles(conduit_id);

-- Ensure slug is unique (needed for upsert on conflict)
-- This may already exist — IF NOT EXISTS prevents errors
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'articles_slug_unique'
  ) THEN
    ALTER TABLE articles ADD CONSTRAINT articles_slug_unique UNIQUE (slug);
  END IF;
END $$;
