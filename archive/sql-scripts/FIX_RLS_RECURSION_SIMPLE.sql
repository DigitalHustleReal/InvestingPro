-- ============================================
-- FIX: Remove Infinite Recursion in user_profiles RLS (SIMPLE VERSION)
-- ============================================
-- This version doesn't use functions - just allows basic operations
-- Admin checks will be handled in application code

-- Step 1: Drop ALL existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile by email" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "user_view_own" ON public.user_profiles;
DROP POLICY IF EXISTS "admin_view_user_profiles" ON public.user_profiles;

-- Step 2: Create SIMPLE policies - NO subqueries, NO recursion
-- Users can view their own profile (by ID only)
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for signup)
-- This is critical - allows signup to work
CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- NOTE: We're NOT creating admin policies here to avoid recursion
-- Admin checks will be done in application code after the user is authenticated
-- If you need admin policies, use FIX_RLS_RECURSION.sql which uses a security definer function

-- Step 3: Verify policies are created
SELECT 
    polname AS policy_name,
    CASE polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END AS command
FROM pg_policy
WHERE polrelid = 'public.user_profiles'::regclass
ORDER BY polname;

-- Step 4: Verify your user exists and has admin role
SELECT 
    id,
    email,
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin role set'
        ELSE '❌ Role: ' || COALESCE(role, 'NULL')
    END AS status
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 5: If role is not admin, set it (this should work now)
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com'
RETURNING id, email, role;


