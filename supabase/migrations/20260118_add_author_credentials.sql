-- Add credentials and expert fields to authors table
-- This migration adds support for professional credentials (CA, CFA, CFP, etc.)

ALTER TABLE authors
ADD COLUMN IF NOT EXISTS credentials TEXT[], -- Array of credentials: ['CA', 'CFA', 'CFP']
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
ADD COLUMN IF NOT EXISTS specialization TEXT[], -- Areas of expertise
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS is_expert BOOLEAN DEFAULT FALSE, -- Flag for expert team page
ADD COLUMN IF NOT EXISTS expert_order INTEGER, -- Display order on expert team page
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE; -- URL-friendly slug

-- Create index for expert team page
CREATE INDEX IF NOT EXISTS idx_authors_expert ON authors(is_expert, expert_order) WHERE is_expert = TRUE;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug) WHERE slug IS NOT NULL;
