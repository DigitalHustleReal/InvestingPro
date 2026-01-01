-- ============================================
-- FIX: Articles RLS Policies for Admin Access
-- ============================================
-- This fixes the issue where admins cannot see draft articles
-- The problem is the admin policy uses EXISTS query on user_profiles
-- which can cause recursion or fail if JWT doesn't have role claim

-- Step 1: Create/Update the security definer function for checking admin
-- (This should already exist from FIX_RLS_RECURSION.sql, but we'll ensure it exists)
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

-- Step 2: Drop existing admin policy on articles (it might have recursion issue)
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;

-- Step 3: Create new admin policy using the security definer function
-- This avoids recursion and works reliably
CREATE POLICY "Admins can manage articles" 
ON public.articles FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Step 4: Verify the policies exist
SELECT 
    polname AS policy_name,
    CASE polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END AS command,
    pg_get_expr(polqual, polrelid) AS using_expression
FROM pg_policy
WHERE polrelid = 'public.articles'::regclass
ORDER BY polname;

-- Step 5: Test query - this should return all articles including drafts for admin
-- Run this while logged in as admin to verify it works
SELECT 
    id,
    title,
    status,
    submission_status,
    created_at
FROM articles
ORDER BY created_at DESC
LIMIT 10;

-- Step 6: Verify your admin role is set
SELECT 
    id,
    email,
    role
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';


