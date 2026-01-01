-- ============================================
-- Create Admin User Profile (If None Exists)
-- Use this if user_profiles is empty
-- ============================================

-- Step 1: See what users exist in auth.users
-- (This might not work if you don't have access)
SELECT 
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: If you see users above, create/update their profiles
-- Replace 'user-email@example.com' with an email from Step 1
INSERT INTO user_profiles (id, email, role, full_name)
SELECT 
    u.id,
    u.email,
    'admin'::text,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email)
FROM auth.users u
WHERE u.email = 'user-email@example.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- Step 3: Verify
SELECT 
    id,
    email,
    role,
    full_name
FROM user_profiles
WHERE role = 'admin';

-- Alternative: If you can't access auth.users, 
-- create a profile manually (you'll need the UUID)
-- Get the UUID from your application's auth session
-- Then run:
/*
INSERT INTO user_profiles (id, email, role, full_name)
VALUES (
    'PASTE-UUID-HERE'::uuid,
    'your-email@example.com',
    'admin',
    'Your Name'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/


