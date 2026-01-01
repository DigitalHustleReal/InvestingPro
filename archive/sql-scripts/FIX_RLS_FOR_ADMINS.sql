-- ============================================
-- Fix RLS Policies to Allow Admin Access
-- ============================================
-- This script fixes RLS policies so admins can see all articles
-- Run this after enabling RLS if articles disappear

-- Step 1: Verify admin role is set
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

-- Step 2: Ensure the is_admin function exists and works
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    -- This function bypasses RLS, so it can check user_profiles
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$;

-- Step 3: Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- Step 4: Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Users can submit articles" ON public.articles;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.articles;
DROP POLICY IF EXISTS "Users can edit own drafts" ON public.articles;

-- Step 5: Create policies in correct order (most permissive first)
-- IMPORTANT: Admin policy must come FIRST and use FOR ALL

-- Policy 1: Admins can do EVERYTHING (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage articles" 
ON public.articles FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Policy 2: Public can view published articles
CREATE POLICY "Public can view published articles" 
ON public.articles FOR SELECT 
USING (
    status = 'published' 
    AND (submission_status = 'approved' OR submission_status IS NULL)
);

-- Policy 3: Users can view their own submissions
CREATE POLICY "Users can view own submissions" 
ON public.articles FOR SELECT 
USING (auth.uid() = author_id);

-- Policy 4: Authenticated users can submit articles
CREATE POLICY "Users can submit articles" 
ON public.articles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy 5: Users can edit their own drafts
CREATE POLICY "Users can edit own drafts" 
ON public.articles FOR UPDATE 
USING (auth.uid() = author_id AND status = 'draft')
WITH CHECK (auth.uid() = author_id AND status = 'draft');

-- Step 6: Verify policies are created
SELECT 
    polname AS policy_name,
    CASE polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END AS command,
    CASE 
        WHEN polpermissive = 'PERMISSIVE' THEN 'ALLOW'
        ELSE 'RESTRICT'
    END AS type
FROM pg_policy
WHERE polrelid = 'public.articles'::regclass
ORDER BY polname;

-- Step 7: Test the is_admin function
-- Replace 'YOUR_USER_ID' with your actual user ID from user_profiles
SELECT 
    id,
    email,
    role,
    public.is_admin(id) AS is_admin_check
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 8: If role is not admin, set it
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com'
RETURNING id, email, role;

-- Step 9: Test query (run this while logged in as admin)
-- This should return all articles including drafts
SELECT 
    COUNT(*) AS total_articles,
    COUNT(*) FILTER (WHERE status = 'draft') AS draft_count,
    COUNT(*) FILTER (WHERE status = 'published') AS published_count
FROM articles;


