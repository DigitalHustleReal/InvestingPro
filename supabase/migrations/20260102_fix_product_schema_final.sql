-- =====================================================
-- FIX PRODUCT SCHEMA (ALIGNS LEGACY WITH NEW SERVICE)
-- =====================================================

-- 1. Ensure Table and Category Enum exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('credit_card', 'broker', 'loan', 'mutual_fund', 'insurance');
    END IF;
END $$;

-- 2. Refactor existing products table columns if they exist from Jan 1st migration
DO $$ 
BEGIN
    -- Rename product_type to category if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'product_type') THEN
        -- We can't direct cast TEXT to ENUM easily if values don't match, 
        -- but since 'credit_card' is in both, we will try.
        ALTER TABLE products RENAME COLUMN product_type TO category;
        -- Convert column type to product_category enum
        ALTER TABLE products ALTER COLUMN category TYPE product_category USING category::product_category;
    END IF;

    -- Rename provider to provider_name if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'provider') THEN
        ALTER TABLE products RENAME COLUMN provider TO provider_name;
    END IF;
END $$;

-- 3. Add missing columns used by product-service.ts
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_link TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS official_link TEXT;

-- 4. Verification columns (In case they weren't added by previous script)
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;

-- 5. Cleanup legacy sub-tables if they cause confusion (we use JSONB now)
-- We keep them for now to avoid data loss if user had data, but the service uses JSONB features.

-- 6. Indexes
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_verification ON products(verification_status, last_verified_at);

-- 7. RLS Fixes
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

CREATE POLICY "Public can view active products" 
    ON products FOR SELECT 
    USING (is_active = true);

-- Note: relies on public.is_admin() existing from Jan 1st consolidated script
CREATE POLICY "Admin can manage products" 
    ON products FOR ALL 
    USING ( 
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
        )
    );
