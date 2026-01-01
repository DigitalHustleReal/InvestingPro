-- ============================================
-- Fix Login Issue - Verify and Fix Admin Role
-- ============================================

-- Step 1: Verify your user exists and role is set
SELECT 
    id,
    email,
    role,
    full_name,
    created_at
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 2: If role is not 'admin', set it
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 3: Verify the update
SELECT id, email, role FROM user_profiles 
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 4: Check RLS policies on user_profiles
-- The login code needs to be able to SELECT the profile
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
WHERE polrelid = 'public.user_profiles'::regclass;

-- Step 5: If RLS is blocking, ensure users can read their own profile
-- This policy should exist:
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Step 6: Also ensure the profile can be read by the authenticated user
-- (The login code runs as the authenticated user, so this should work)
-- But if it doesn't, we might need a policy that allows reading by email match

-- Step 7: Test query (this should work if you're logged in)
-- Run this in Supabase SQL editor while logged in as your user:
SELECT * FROM user_profiles WHERE email = 'digitalhustlereal@gmail.com';


