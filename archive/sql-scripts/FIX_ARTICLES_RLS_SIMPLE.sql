-- ============================================
-- FIX: Articles RLS Policies for Admin Access (SIMPLE VERSION)
-- ============================================
-- This is a simpler fix that doesn't require functions
-- It uses a direct check that should work if the user_profiles RLS is fixed

-- Step 1: Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;

-- Step 2: Create a simpler admin policy
-- This checks user_profiles directly but should work if user_profiles RLS allows reading own profile
CREATE POLICY "Admins can manage articles" 
ON public.articles FOR ALL 
USING (
    -- Check JWT claim first (if set)
    (auth.jwt() ->> 'role') = 'admin'
    OR
    -- Check user_profiles table (this should work if user_profiles RLS is fixed)
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
)
WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
    OR
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role = 'admin'
    )
);

-- Step 3: Verify policies exist
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
WHERE polrelid = 'public.articles'::regclass
ORDER BY polname;

-- Step 4: Verify your admin role
SELECT 
    id,
    email,
    role
FROM user_profiles
WHERE email = 'digitalhustlereal@gmail.com';

-- Step 5: If role is not admin, set it
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'digitalhustlereal@gmail.com'
RETURNING id, email, role;


