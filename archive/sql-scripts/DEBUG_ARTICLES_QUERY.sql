-- ============================================
-- Debug: Check if articles exist and can be queried
-- ============================================

-- Step 1: Check if articles table exists and has data
SELECT 
    COUNT(*) AS total_articles,
    COUNT(*) FILTER (WHERE status = 'draft') AS draft_count,
    COUNT(*) FILTER (WHERE status = 'review') AS review_count,
    COUNT(*) FILTER (WHERE status = 'published') AS published_count,
    COUNT(*) FILTER (WHERE status = 'archived') AS archived_count
FROM articles;

-- Step 2: List all articles with basic info
SELECT 
    id,
    title,
    status,
    submission_status,
    author_id,
    created_at
FROM articles
ORDER BY created_at DESC
LIMIT 20;

-- Step 3: Check if RLS is enabled or disabled
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN 'ENABLED (might block access)'
        ELSE 'DISABLED (should allow all)'
    END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'articles';

-- Step 4: Check existing policies (if RLS is enabled)
SELECT 
    policyname,
    CASE cmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END AS command,
    qual AS using_expression
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'articles';

-- Step 5: Test query as current user (run this while logged in)
-- This simulates what the API should return
SELECT * FROM articles
ORDER BY created_at DESC
LIMIT 10;


