-- ============================================
-- Quick Admin Setup (After Creating Auth User)
-- Run this AFTER you've signed up/logged in
-- ============================================

-- STEP 1: Check if your user exists in auth.users
-- (This might return 0 rows if you don't have access)
-- If it works, you'll see your email
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- STEP 2: Set admin role for your email
-- Replace 'your-admin-email@example.com' with the email you used to sign up
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';

-- STEP 3: If user_profiles doesn't exist yet, create it
-- (The handle_new_user() trigger should create it automatically, but if not...)
INSERT INTO user_profiles (id, email, role, full_name)
SELECT 
    id,
    email,
    'admin'::text,
    COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE email = 'your-admin-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- STEP 4: Verify it worked
SELECT 
    id,
    email,
    role,
    full_name,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin Access Granted'
        ELSE '❌ Not Admin'
    END AS status
FROM user_profiles
WHERE email = 'your-admin-email@example.com';

-- STEP 5: Test admin RLS policy
-- This should return rows if you're an admin and policies are set up
SELECT 
    polname AS policy_name,
    CASE polcmd
        WHEN '*' THEN 'ALL (SELECT, INSERT, UPDATE, DELETE)'
        ELSE 'Other'
    END AS permissions
FROM pg_policy
WHERE polrelid = 'public.articles'::regclass
AND polname LIKE '%admin%';


