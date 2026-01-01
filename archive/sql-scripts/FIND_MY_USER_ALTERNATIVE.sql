-- ============================================
-- Alternative: Find Your User (Multiple Methods)
-- Try these queries one by one
-- ============================================

-- Method 1: Check user_profiles directly (if you have access)
SELECT 
    id,
    email,
    role,
    full_name,
    created_at
FROM user_profiles
ORDER BY created_at DESC;

-- Method 2: Check if you can see auth.users (might be restricted)
-- This might return 0 rows if you don't have access
SELECT 
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Method 3: Check current authenticated user (if you're logged in)
-- This uses the current session
SELECT 
    auth.uid() AS current_user_id,
    auth.email() AS current_email;

-- Method 4: Check user_profiles with role info
SELECT 
    id,
    email,
    role,
    full_name,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin'
        WHEN role = 'editor' THEN '📝 Editor'
        WHEN role = 'user' THEN '👤 User'
        WHEN role IS NULL THEN '⚠️ No Role Set'
    END AS status
FROM user_profiles
ORDER BY created_at DESC;

-- Method 5: If you know your email, check directly
-- Replace 'your-email@example.com' with your actual email
SELECT 
    id,
    email,
    role,
    full_name
FROM user_profiles
WHERE email = 'your-email@example.com';


