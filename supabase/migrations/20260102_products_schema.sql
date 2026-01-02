-- 1. DROP EXISTING TO RESOLVE CONFLICTS
DROP TABLE IF EXISTS products CASCADE;

-- 2. Create Enums if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('credit_card', 'broker', 'loan', 'mutual_fund', 'insurance');
    END IF;
END $$;

-- 3. Create Products Table
CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    category product_category NOT NULL, 
    provider_name text NOT NULL,
    description text,
    image_url text,
    rating numeric(3,1) DEFAULT 4.0,
    features jsonb DEFAULT '{}'::jsonb,
    pros text[] DEFAULT '{}',
    cons text[] DEFAULT '{}',
    affiliate_link text,
    official_link text,
    is_active boolean DEFAULT true,
    last_verified_at TIMESTAMPTZ,
    verification_status TEXT DEFAULT 'pending',
    verification_notes TEXT,
    trust_score INTEGER DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" 
    ON products FOR SELECT 
    USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage products" ON products;
CREATE POLICY "Admin can manage products" 
    ON products FOR ALL 
    USING ( true ); -- Optimized for Dev. In production, use is_admin() check.

-- 7. Indexes
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
