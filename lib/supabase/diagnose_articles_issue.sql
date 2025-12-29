-- Diagnostic Queries to Check Articles and RLS
-- Run these in Supabase SQL Editor to diagnose the issue

-- 1. Check if articles exist in the database
SELECT 
    id, 
    title, 
    status, 
    category,
    created_at,
    updated_at
FROM articles 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Count articles by status
SELECT 
    status, 
    COUNT(*) as count 
FROM articles 
GROUP BY status;

-- 3. Check your current user and role
SELECT 
    auth.uid() as user_id,
    auth.role() as auth_role,
    auth.jwt() ->> 'role' as jwt_role;

-- 4. Check your user_profiles role
SELECT 
    id,
    email,
    role
FROM user_profiles 
WHERE id = auth.uid();

-- 5. Check all RLS policies on articles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'articles';

-- 6. Test query as your current user (simulating what the app does)
-- This should return articles if RLS allows
SELECT COUNT(*) as visible_articles_count
FROM articles;

-- 7. If you're an admin, this should show all articles
-- Replace 'YOUR_USER_ID' with your actual user ID from step 3
SELECT 
    id,
    title,
    status
FROM articles
WHERE EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
)
OR (auth.jwt() ->> 'role' = 'admin')
LIMIT 10;

