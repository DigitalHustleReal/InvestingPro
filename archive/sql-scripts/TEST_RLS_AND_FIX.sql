-- ============================================
-- Test and Fix RLS for Articles
-- ============================================
-- Run this to diagnose and fix RLS issues

-- Step 1: Check current user and role
SELECT 
    'Current User Check' AS step,
    auth.uid() AS current_user_id,
    auth.role() AS current_role,
    (auth.jwt() ->> 'email') AS current_email;

-- Step 2: Verify admin role in user_profiles
SELECT 
    'Admin Role Check' AS step,
    id,
    email,
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin'
        ELSE '❌ Not admin: ' || COALESCE(role, 'NULL')
    END AS status
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 3: Check if is_admin function exists
SELECT 
    'Function Check' AS step,
    proname AS function_name,
    proargtypes::regtype[] AS argument_types,
    prosrc AS source_code
FROM pg_proc
WHERE proname = 'is_admin'
AND pronamespace = 'public'::regnamespace;

-- Step 4: Test is_admin function with your user ID
-- First, get your user ID
DO $$
DECLARE
    user_uuid UUID;
    is_admin_result BOOLEAN;
BEGIN
    SELECT id INTO user_uuid 
    FROM user_profiles 
    WHERE email = 'digitalhustlereal@gmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE '❌ User not found in user_profiles';
    ELSE
        RAISE NOTICE 'User ID: %', user_uuid;
        SELECT public.is_admin(user_uuid) INTO is_admin_result;
        RAISE NOTICE 'Is Admin: %', is_admin_result;
    END IF;
END $$;

-- Step 5: Check current RLS status
SELECT 
    'RLS Status' AS step,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ ENABLED'
        ELSE '❌ DISABLED'
    END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'articles';

-- Step 6: List all current policies
SELECT 
    'Current Policies' AS step,
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

-- Step 7: Test query as current user (this will show what RLS allows)
-- This simulates what your app does
SELECT 
    'Test Query' AS step,
    COUNT(*) AS article_count,
    COUNT(*) FILTER (WHERE status = 'draft') AS draft_count,
    COUNT(*) FILTER (WHERE status = 'published') AS published_count
FROM articles;


