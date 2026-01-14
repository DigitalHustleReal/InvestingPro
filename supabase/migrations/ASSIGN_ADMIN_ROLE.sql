-- Assign Admin Role Script
-- Replace 'your-email@example.com' with your actual email address

-- Step 1: Find your user ID (uncomment and run first to see your UUID)
-- SELECT id, email, created_at 
-- FROM auth.users 
-- WHERE email = 'your-email@example.com';

-- Step 2: Assign admin role using email (replace email below)
-- This will find your user ID and assign admin role in one step
-- Assign admin role to digitalhustlereal@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'digitalhustlereal@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 3: Verify it worked
-- SELECT get_user_role(); -- Should return 'admin' (if you're authenticated)
-- SELECT is_admin(); -- Should return true (if you're authenticated)

-- Alternative: If you know your UUID, use this instead:
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('YOUR-UUID-HERE', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
