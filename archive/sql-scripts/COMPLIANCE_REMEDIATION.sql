-- ============================================
-- InvestingPro System Contract Compliance Remediation
-- Apply these fixes for NON-COMPLIANT items
-- ============================================

-- ============================================
-- 1. Add NOT NULL Constraints to articles
-- ============================================

-- Check current nullability first (run audit query)
-- Then apply if needed:

ALTER TABLE public.articles 
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN slug SET NOT NULL,
    ALTER COLUMN content SET NOT NULL,
    ALTER COLUMN category SET NOT NULL;

-- ============================================
-- 2. Ensure slug UNIQUE + NOT NULL on all tables
-- ============================================

-- Articles (should already be unique, ensure NOT NULL)
ALTER TABLE public.articles ALTER COLUMN slug SET NOT NULL;

-- Products (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'products' 
               AND column_name = 'slug') THEN
        ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;
    END IF;
END $$;

-- Assets (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'assets' 
               AND column_name = 'slug') THEN
        ALTER TABLE public.assets ALTER COLUMN slug SET NOT NULL;
    END IF;
END $$;

-- Glossary terms (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'glossary_terms' 
               AND column_name = 'slug') THEN
        ALTER TABLE public.glossary_terms ALTER COLUMN slug SET NOT NULL;
    END IF;
END $$;

-- ============================================
-- 3. Create update_updated_at_column() Function
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Create Triggers for updated_at Auto-Update
-- ============================================

-- Articles
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Products
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'products') THEN
        DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
        CREATE TRIGGER update_products_updated_at
            BEFORE UPDATE ON public.products
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- User Profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Portfolios
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Affiliate Products
DROP TRIGGER IF EXISTS update_affiliate_products_updated_at ON public.affiliate_products;
CREATE TRIGGER update_affiliate_products_updated_at
    BEFORE UPDATE ON public.affiliate_products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Ad Placements
DROP TRIGGER IF EXISTS update_ad_placements_updated_at ON public.ad_placements;
CREATE TRIGGER update_ad_placements_updated_at
    BEFORE UPDATE ON public.ad_placements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Assets
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'assets') THEN
        DROP TRIGGER IF EXISTS update_assets_updated_at ON public.assets;
        CREATE TRIGGER update_assets_updated_at
            BEFORE UPDATE ON public.assets
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Content
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'content') THEN
        DROP TRIGGER IF EXISTS update_content_updated_at ON public.content;
        CREATE TRIGGER update_content_updated_at
            BEFORE UPDATE ON public.content
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Glossary Terms (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'glossary_terms') THEN
        DROP TRIGGER IF EXISTS update_glossary_terms_updated_at ON public.glossary_terms;
        CREATE TRIGGER update_glossary_terms_updated_at
            BEFORE UPDATE ON public.glossary_terms
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- ============================================
-- 5. Create handle_new_user() Function
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. Fix submission_status Default for User Submissions
-- ============================================

-- Create trigger to set submission_status to 'pending' for user submissions
CREATE OR REPLACE FUNCTION public.set_submission_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_user_submission = true AND NEW.submission_status IS NULL THEN
        NEW.submission_status := 'pending';
    ELSIF NEW.is_user_submission = false AND NEW.submission_status IS NULL THEN
        NEW.submission_status := 'approved';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_submission_status_trigger ON public.articles;
CREATE TRIGGER set_submission_status_trigger
    BEFORE INSERT ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_submission_status();

-- ============================================
-- 7. Ensure Required Extensions Exist
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- Note: vector extension may require additional setup
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 8. Fix Numeric Precision for Portfolios (if needed)
-- ============================================

-- Check current precision first, then apply if different
DO $$
BEGIN
    -- Only alter if current type is not numeric(15,4)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'portfolios'
        AND column_name = 'quantity'
        AND data_type = 'numeric'
        AND (numeric_precision IS NULL OR numeric_precision != 15 OR numeric_scale != 4)
    ) THEN
        ALTER TABLE public.portfolios 
            ALTER COLUMN quantity TYPE numeric(15,4),
            ALTER COLUMN purchase_price TYPE numeric(15,4),
            ALTER COLUMN average_price TYPE numeric(15,4);
    END IF;
END $$;

-- ============================================
-- 9. RLS Policies - Articles (if missing)
-- ============================================

-- Public can view published and approved articles
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles" 
ON public.articles FOR SELECT 
USING (
    status = 'published' 
    AND (submission_status = 'approved' OR submission_status IS NULL)
);

-- Users can submit articles
DROP POLICY IF EXISTS "Users can submit articles" ON public.articles;
CREATE POLICY "Users can submit articles" 
ON public.articles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Users can view own submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON public.articles;
CREATE POLICY "Users can view own submissions" 
ON public.articles FOR SELECT 
USING (auth.uid() = author_id);

-- Users can edit own drafts
DROP POLICY IF EXISTS "Users can edit own drafts" ON public.articles;
CREATE POLICY "Users can edit own drafts" 
ON public.articles FOR UPDATE 
USING (auth.uid() = author_id AND status = 'draft');

-- Admins can manage all articles
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles" 
ON public.articles FOR ALL 
USING (
    (auth.jwt() ->> 'role') = 'admin' 
    OR EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
)
WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin' 
    OR EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================
-- 10. RLS Policies - User Profiles (if missing)
-- ============================================

-- Users can view own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (
    (auth.jwt() ->> 'role') = 'admin' 
    OR EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================
-- 11. RLS Policies - Products (if missing)
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'products') THEN
        
        -- Public can read active products
        DROP POLICY IF EXISTS "Public read access" ON public.products;
        CREATE POLICY "Public read access" 
        ON public.products FOR SELECT 
        USING (is_active = true);
        
        -- Admins can manage all products
        DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
        CREATE POLICY "Admins can manage products" 
        ON public.products FOR ALL 
        USING (
            (auth.jwt() ->> 'role') = 'admin' 
            OR EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() 
                AND role = 'admin'
            )
        )
        WITH CHECK (
            (auth.jwt() ->> 'role') = 'admin' 
            OR EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() 
                AND role = 'admin'
            )
        );
    END IF;
END $$;

-- ============================================
-- 12. RLS Policies - Calculator Results (if missing)
-- ============================================

-- Public can insert calculator results
DROP POLICY IF EXISTS "Public can insert calculator results" ON public.calculator_results;
CREATE POLICY "Public can insert calculator results" 
ON public.calculator_results FOR INSERT 
WITH CHECK (true);

-- Users can view own results
DROP POLICY IF EXISTS "Users can view own results" ON public.calculator_results;
CREATE POLICY "Users can view own results" 
ON public.calculator_results FOR SELECT 
USING (
    user_email IS NULL 
    OR (auth.jwt() ->> 'email') = user_email 
    OR auth.uid() = user_id
);

-- ============================================
-- 13. RLS Policies - Affiliate Clicks (if missing)
-- ============================================

-- Public can track clicks
DROP POLICY IF EXISTS "Public can track clicks" ON public.affiliate_clicks;
CREATE POLICY "Public can track clicks" 
ON public.affiliate_clicks FOR INSERT 
WITH CHECK (true);

-- Admins can view clicks
DROP POLICY IF EXISTS "Admins can view clicks" ON public.affiliate_clicks;
CREATE POLICY "Admins can view clicks" 
ON public.affiliate_clicks FOR SELECT 
USING (
    (auth.jwt() ->> 'role') = 'admin' 
    OR EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Admins can update conversions
DROP POLICY IF EXISTS "Admins can update conversions" ON public.affiliate_clicks;
CREATE POLICY "Admins can update conversions" 
ON public.affiliate_clicks FOR UPDATE 
USING (
    (auth.jwt() ->> 'role') = 'admin' 
    OR EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);


