-- ============================================
-- Find Your User ID and Email
-- Run this first to see all users
-- ============================================

-- Show all users with their current roles
SELECT 
    u.id AS user_id,
    u.email,
    u.created_at AS user_created,
    up.role AS current_role,
    up.full_name,
    CASE 
        WHEN up.role = 'admin' THEN '✅ Already Admin'
        WHEN up.role IS NULL THEN '⚠️ No Profile - Run INSERT below'
        ELSE '❌ Not Admin'
    END AS status
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC;

-- Copy your email from above, then use it in SET_ADMIN_ROLE_SIMPLE.sql


