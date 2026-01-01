-- ============================================
-- Quick Script to Set Admin Role
-- Run this to make your user an admin
-- ============================================

-- STEP 1: Find your user ID and email
-- Run this first to see all users and find yours
SELECT 
    u.id,
    u.email,
    up.role AS current_role,
    up.full_name
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC;

-- STEP 2: Set admin role by email (EASIEST - just replace the email)
-- Replace 'your-email@example.com' with your actual email from STEP 1
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- OR: Set admin role by user ID (if you know the UUID from STEP 1)
-- Replace the UUID below with your actual user ID from STEP 1
-- Example: WHERE id = '123e4567-e89b-12d3-a456-426614174000'::uuid;
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE id = 'PASTE-YOUR-UUID-HERE'::uuid;

-- Verify the update
SELECT id, email, role, full_name 
FROM user_profiles 
WHERE role = 'admin';

-- STEP 3: If user_profiles doesn't exist for your user, create it:
-- (Replace 'your-email@example.com' with your actual email)
INSERT INTO user_profiles (id, email, role, full_name)
SELECT 
    id,
    email,
    'admin'::text,
    COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- STEP 4: Verify the update worked
SELECT id, email, role, full_name 
FROM user_profiles 
WHERE role = 'admin';

-- Check if RLS policies allow admin access
-- This should return rows if you're an admin
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
WHERE polrelid = 'public.articles'::regclass
AND polname LIKE '%admin%';

