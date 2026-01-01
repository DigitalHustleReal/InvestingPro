-- ============================================
-- Check Current RLS Status for All Tables
-- ============================================
-- This script shows which tables have RLS enabled
-- and what policies exist

-- Step 1: Check which tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ ENABLED'
        ELSE '❌ DISABLED'
    END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Step 2: List all existing RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN permissive = 'PERMISSIVE' THEN 'ALLOW'
        ELSE 'RESTRICT'
    END AS policy_type,
    CASE cmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
        ELSE cmd::text
    END AS command,
    roles,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Step 3: Check for tables with RLS enabled but NO policies
-- These tables will be inaccessible!
SELECT 
    t.tablename,
    '⚠️ RLS ENABLED BUT NO POLICIES - TABLE IS INACCESSIBLE!' AS warning
FROM pg_tables t
WHERE t.schemaname = 'public'
AND t.rowsecurity = true
AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'public'
    AND p.tablename = t.tablename
)
ORDER BY t.tablename;

-- Step 4: Check for potential recursion issues
-- Policies that query the same table they're on
SELECT 
    tablename,
    policyname,
    '⚠️ POTENTIAL RECURSION - Policy queries same table' AS warning
FROM pg_policies
WHERE schemaname = 'public'
AND (
    using_expression LIKE '%' || tablename || '%'
    OR with_check_expression LIKE '%' || tablename || '%'
)
ORDER BY tablename, policyname;

-- Step 5: Summary of critical tables
SELECT 
    'Critical Tables RLS Status' AS summary,
    COUNT(*) FILTER (WHERE tablename IN ('user_profiles', 'articles', 'reviews', 'portfolios') AND rowsecurity) AS critical_with_rls,
    COUNT(*) FILTER (WHERE tablename IN ('user_profiles', 'articles', 'reviews', 'portfolios') AND NOT rowsecurity) AS critical_without_rls
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'articles', 'reviews', 'portfolios');


