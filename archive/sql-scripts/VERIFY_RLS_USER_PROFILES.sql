-- ============================================
-- Verify and Fix RLS for user_profiles
-- This is likely why login is failing
-- ============================================

-- Step 1: Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

-- Step 2: Check existing policies
SELECT 
    polname AS policy_name,
    CASE polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END AS command,
    pg_get_expr(polqual, polrelid) AS using_expression,
    pg_get_expr(polwithcheck, polrelid) AS with_check_expression
FROM pg_policy
WHERE polrelid = 'public.user_profiles'::regclass;

-- Step 3: Ensure users can read their own profile
-- This is CRITICAL for login to work
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Step 4: Also allow reading by email (for login check)
-- This helps if the ID match doesn't work
DROP POLICY IF EXISTS "Users can view own profile by email" ON public.user_profiles;
CREATE POLICY "Users can view own profile by email" 
ON public.user_profiles FOR SELECT 
USING (
    auth.uid() = id 
    OR (auth.jwt() ->> 'email') = email
);

-- Step 5: Verify your user's role one more time
SELECT 
    id,
    email,
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin'
        WHEN role IS NULL THEN '❌ NULL - needs to be set'
        ELSE '❌ Not admin: ' || role
    END AS status
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 6: If role is still not admin, force it
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com'
RETURNING id, email, role;


