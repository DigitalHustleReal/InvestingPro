-- ============================================
-- SIMPLE: Set Admin Role by Email
-- Just replace the email below with yours
-- ============================================

-- Replace 'your-email@example.com' with your actual email address
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT id, email, role, full_name 
FROM user_profiles 
WHERE email = 'your-email@example.com';

-- If the above returns 0 rows, your user_profiles might not exist.
-- In that case, run this instead (replace email):
INSERT INTO user_profiles (id, email, role, full_name)
SELECT 
    id,
    email,
    'admin'::text,
    COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';


