-- ============================================
-- Re-enable RLS and Fix All Policies Properly
-- ============================================
-- After temporarily disabling RLS, use this to re-enable it
-- with proper policies that work correctly

-- Step 1: Re-enable RLS on all tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE 'Enabled RLS on: %', r.tablename;
    END LOOP;
END $$;

-- Step 2: Create security definer function for admin checks (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$;

-- Step 3: Fix user_profiles RLS policies (no recursion)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles (using function - no recursion)
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
ON public.user_profiles FOR UPDATE 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Step 4: Fix articles RLS policies
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Users can submit articles" ON public.articles;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.articles;
DROP POLICY IF EXISTS "Users can edit own drafts" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;

-- Public can view published and approved articles
CREATE POLICY "Public can view published articles" 
ON public.articles FOR SELECT 
USING (
    status = 'published' 
    AND (submission_status = 'approved' OR submission_status IS NULL)
);

-- Users can submit articles
CREATE POLICY "Users can submit articles" 
ON public.articles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Users can view own submissions
CREATE POLICY "Users can view own submissions" 
ON public.articles FOR SELECT 
USING (auth.uid() = author_id);

-- Users can edit own drafts
CREATE POLICY "Users can edit own drafts" 
ON public.articles FOR UPDATE 
USING (auth.uid() = author_id AND status = 'draft');

-- Admins can manage all articles (using function - no recursion)
CREATE POLICY "Admins can manage articles" 
ON public.articles FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Step 5: Verify your admin role is set
SELECT 
    id,
    email,
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin role set'
        ELSE '❌ Role: ' || COALESCE(role, 'NULL') || ' - needs to be admin'
    END AS status
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 6: If role is not admin, set it
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com'
RETURNING id, email, role;

-- Step 7: Verify policies are created
SELECT 
    tablename,
    COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'articles')
GROUP BY tablename
ORDER BY tablename;

-- Step 8: Test query (should work for admin)
-- Run this while logged in as admin to verify
SELECT 
    COUNT(*) FILTER (WHERE status = 'draft') AS draft_count,
    COUNT(*) FILTER (WHERE status = 'review') AS review_count,
    COUNT(*) FILTER (WHERE status = 'published') AS published_count,
    COUNT(*) AS total_articles
FROM articles;


