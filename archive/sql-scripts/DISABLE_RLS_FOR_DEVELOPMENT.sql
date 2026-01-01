-- ============================================
-- Disable RLS Temporarily for Development
-- ============================================
-- Use this to disable RLS while working on article workflow
-- ⚠️ DO NOT USE IN PRODUCTION

-- Disable RLS on articles table
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on user_profiles (if needed for testing)
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ ENABLED'
        ELSE '❌ DISABLED'
    END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('articles', 'user_profiles')
ORDER BY tablename;

-- Note: To re-enable RLS later, run:
-- ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
-- Then run RE_ENABLE_RLS_AND_FIX.sql to set up proper policies


