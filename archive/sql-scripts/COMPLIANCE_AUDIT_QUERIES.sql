-- ============================================
-- InvestingPro System Contract Compliance Audit Queries
-- Run these queries to gather missing information
-- ============================================

-- 1. Policy Listing for Critical Tables
-- This will show all RLS policies on articles, products, user_profiles, reviews, affiliate_clicks, calculator_results
SELECT 
    n.nspname AS schema,
    c.relname AS table_name,
    p.polname AS policy_name,
    CASE p.polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END AS command,
    pg_get_expr(p.polqual, p.polrelid) AS using_expression,
    pg_get_expr(p.polwithcheck, p.polrelid) AS with_check_expression,
    CASE p.polpermissive
        WHEN true THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END AS permissive
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname IN (
    'articles', 'products', 'user_profiles', 'reviews', 
    'affiliate_clicks', 'calculator_results', 'portfolios',
    'affiliate_products', 'ad_placements', 'glossary_terms',
    'assets', 'live_rates', 'user_subscriptions', 'content'
)
AND n.nspname = 'public'
ORDER BY c.relname, p.polname;

-- 2. List All Extensions
SELECT 
    extname AS extension_name,
    extversion AS version
FROM pg_extension
ORDER BY extname;

-- 3. List Required Functions
SELECT 
    n.nspname AS schema,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_get_function_result(p.oid) AS return_type,
    p.prosrc AS source_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'update_updated_at_column',
    'handle_new_user',
    'calculate_data_completeness',
    'generate_glossary_slug',
    'update_glossary_terms_updated_at'
)
ORDER BY p.proname;

-- 4. List Triggers on Critical Tables
SELECT 
    t.trigger_name,
    t.event_object_schema AS schema,
    t.event_object_table AS table_name,
    t.event_manipulation AS event,
    t.action_timing AS timing,
    t.action_statement AS trigger_definition
FROM information_schema.triggers t
WHERE t.event_object_schema = 'public'
AND t.event_object_table IN (
    'articles', 'products', 'user_profiles', 'reviews',
    'portfolios', 'affiliate_products', 'ad_placements',
    'glossary_terms', 'assets', 'content'
)
ORDER BY t.event_object_table, t.trigger_name;

-- 5. Check NOT NULL Constraints on Critical Columns
SELECT 
    t.table_name,
    c.column_name,
    c.is_nullable,
    c.column_default,
    c.data_type
FROM information_schema.columns c
JOIN information_schema.tables t ON c.table_name = t.table_name
WHERE t.table_schema = 'public'
AND t.table_name = 'articles'
AND c.column_name IN ('title', 'slug', 'content', 'category')
ORDER BY c.column_name;

-- 6. Check UNIQUE Constraints on Slug Columns
SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND kcu.column_name = 'slug'
AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_name;

-- 7. Check CHECK Constraints on Status Columns
SELECT
    tc.table_name,
    kcu.column_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
JOIN information_schema.key_column_usage kcu 
    ON ccu.table_name = kcu.table_name 
    AND ccu.column_name = kcu.column_name
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.constraint_type = 'CHECK'
AND kcu.column_name IN ('status', 'submission_status', 'role', 'language')
ORDER BY tc.table_name, kcu.column_name;

-- 8. Check if glossary_terms Table Exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'glossary_terms';

-- 9. Check RLS Enabled Status
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'articles', 'products', 'user_profiles', 'reviews',
    'portfolios', 'affiliate_products', 'ad_placements',
    'glossary_terms', 'assets', 'calculator_results',
    'affiliate_clicks', 'content'
)
ORDER BY tablename;

-- 10. Check Foreign Key Constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN ('articles', 'portfolios', 'reviews', 'user_profiles')
ORDER BY tc.table_name, kcu.column_name;


