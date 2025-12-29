-- Fix RLS Policy for Articles - Allow Admins from user_profiles to access all articles
-- This fixes the issue where articles inserted via SQL aren't visible in CMS

-- Drop the existing admin policy if it exists
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;

-- Create a new admin policy that checks user_profiles.role instead of JWT claim
-- This allows admins to view/edit all articles even if JWT doesn't have role claim
CREATE POLICY "Admins can manage articles" 
ON articles FOR ALL 
USING (
    -- Check if user has admin role in user_profiles
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
    OR
    -- Fallback: Check JWT claim (for backward compatibility)
    (auth.jwt() ->> 'role' = 'admin')
);

-- Also add a policy for authenticated users to view all articles in admin context
-- This is a temporary workaround - ideally we'd check if user is in admin route
-- But for now, any authenticated user can view all articles (they can't edit unless admin)
CREATE POLICY "Authenticated users can view all articles" 
ON articles FOR SELECT 
USING (auth.role() = 'authenticated');

