-- Fix RLS Policy for Articles - Avoid Infinite Recursion
-- The previous version caused infinite recursion because user_profiles has its own RLS
-- This version uses a SECURITY DEFINER function to bypass RLS for the role check

-- Step 1: Create a function that checks user role without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This bypasses RLS when checking user_profiles
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$;

-- Step 2: Drop the problematic admin policy if it exists
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;

-- Step 3: Create a new admin policy using the function (avoids recursion)
CREATE POLICY "Admins can manage articles" 
ON articles FOR ALL 
USING (
    -- Use the function to check admin role (bypasses RLS recursion)
    public.is_admin()
    OR
    -- Fallback: Check JWT claim (for backward compatibility)
    (auth.jwt() ->> 'role' = 'admin')
);

-- Step 4: Add policy for authenticated users to view all articles
-- This allows any logged-in user to see articles in admin context
CREATE POLICY "Authenticated users can view all articles" 
ON articles FOR SELECT 
USING (auth.role() = 'authenticated');

-- Step 5: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

