-- ============================================
-- FIX: Remove Infinite Recursion in user_profiles RLS
-- ============================================
-- The error "infinite recursion detected in policy" happens when
-- a policy on user_profiles tries to SELECT from user_profiles itself.

-- Step 1: Drop ALL existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile by email" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "user_view_own" ON public.user_profiles;
DROP POLICY IF EXISTS "admin_view_user_profiles" ON public.user_profiles;

-- Step 2: Create a security definer function to check admin role
-- This function bypasses RLS, so it won't cause recursion
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

-- Step 3: Create SIMPLE policies that don't cause recursion
-- Users can view their own profile (by ID only - no subquery)
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

-- Admins can view all profiles (using the security definer function)
-- This avoids recursion because the function bypasses RLS
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
ON public.user_profiles FOR UPDATE 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Step 4: Verify policies are created
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

-- Step 5: Verify your user exists and has admin role
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

-- Step 6: If role is not admin, set it (this should work now)
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com'
RETURNING id, email, role;

