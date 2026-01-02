
-- Final Table Alignment
-- Adds all columns that might be missing from legacy products table

DO $$ 
BEGIN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_link TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS official_link TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_notes TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Some columns might already exist';
END $$;
