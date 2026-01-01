-- ============================================
-- ⚠️ WARNING: TEMPORARY RLS DISABLE
-- ============================================
-- This script DISABLES RLS on all tables
-- USE ONLY FOR TESTING/DEBUGGING
-- DO NOT USE IN PRODUCTION WITHOUT UNDERSTANDING SECURITY IMPLICATIONS

-- What this does:
-- - Removes all row-level security restrictions
-- - Makes ALL data visible to ANY authenticated user
-- - SECURITY RISK - use with caution!

-- Step 1: List tables that will be affected
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'Will be disabled' ELSE 'Already disabled' END AS status
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
ORDER BY tablename;

-- Step 2: DISABLE RLS on all tables (UNCOMMENT TO RUN)
-- ⚠️ UNCOMMENT THE LINES BELOW ONLY IF YOU UNDERSTAND THE RISKS

/*
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = true
    LOOP
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE 'Disabled RLS on: %', r.tablename;
    END LOOP;
END $$;
*/

-- Step 3: To RE-ENABLE RLS later, use:
/*
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE 'Enabled RLS on: %', r.tablename;
    END LOOP;
END $$;
*/

-- ============================================
-- Better Alternative: Fix RLS Policies Instead
-- ============================================
-- Instead of disabling RLS, fix the policies:
-- 1. Run FIX_RLS_RECURSION_SIMPLE.sql for user_profiles
-- 2. Run FIX_ARTICLES_RLS.sql for articles
-- 3. Check other tables with CHECK_RLS_STATUS.sql


