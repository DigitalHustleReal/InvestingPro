-- ============================================
-- Set Admin Role for Currently Logged In User
-- This uses your current session
-- ============================================

-- Get your current user ID and email
SELECT 
    auth.uid() AS your_user_id,
    auth.email() AS your_email;

-- If the above returns a user_id, use it to set admin role
-- (Uncomment and run after you see your user_id above)
/*
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = auth.uid();
*/

-- Or set admin for current user by email
-- (Uncomment and run after you see your email above)
/*
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = auth.email();
*/

-- Verify it worked
SELECT 
    id,
    email,
    role,
    full_name
FROM user_profiles
WHERE id = auth.uid();


