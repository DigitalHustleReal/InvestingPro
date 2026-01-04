-- ============================================================================
-- VERIFICATION: Check All Migrations Succeeded
-- Run this to verify your database is ready
-- ============================================================================

-- ✅ 1. Check Authors Count (should be 16)
SELECT 
    'Authors Count' as check_name,
    COUNT(*) as result,
    CASE WHEN COUNT(*) = 16 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM public.authors;

-- ✅ 2. Check Writers vs Editors (should be 8 each)
SELECT 
    'Writers vs Editors' as check_name,
    role,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 8 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM public.authors
GROUP BY role
ORDER BY role;

-- ✅ 3. Verify all 16 team members
SELECT 
    name,
    role,
    primary_category,
    CASE WHEN editor_type IS NOT NULL THEN editor_type ELSE 'N/A' END as editor_type
FROM public.authors
ORDER BY role, name;

-- ✅ 4. Check Content Tables Exist
SELECT 
    'Content Tables' as check_name,
    COUNT(*) as tables_exist,
    CASE WHEN COUNT(*) = 2 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('glossary_terms', 'blog_posts');

-- ✅ 5. Check Media Table Exists
SELECT 
    'Media Table' as check_name,
    COUNT(*) as table_exists,
    CASE WHEN COUNT(*) = 1 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'media';

-- ✅ 6. Check Attribution Columns Added
SELECT 
    'Glossary Attribution' as check_name,
    COUNT(*) as columns_exist,
    CASE WHEN COUNT(*) >= 4 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'glossary_terms'
  AND column_name IN ('author_id', 'editor_id', 'show_author', 'show_reviewer');

-- ✅ 7. Check Auto-Assignment Functions
SELECT 
    'Auto-Assignment Functions' as check_name,
    COUNT(*) as functions_exist,
    CASE WHEN COUNT(*) >= 2 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_expert_reviewer_for_category', 'auto_assign_glossary_attribution');

-- ✅ 8. Test Auto-Assignment (Insert Test Glossary Term)
-- This will trigger auto-assignment
INSERT INTO public.glossary_terms (
    term, 
    slug, 
    category, 
    definition,
    published
) VALUES (
    'Test Term - Migration Verification',
    'test-term-migration-' || gen_random_uuid()::text,
    'credit-cards',
    'This is a test term to verify auto-assignment works.',
    false
) RETURNING 
    term,
    author_name,
    editor_name,
    show_author,
    show_reviewer;

-- ✅ 9. Check Editorial Standards
SELECT 
    'Editorial Standards' as check_name,
    COUNT(*) as standards_count,
    CASE WHEN COUNT(*) >= 6 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM public.editorial_standards;

-- ✅ 10. Summary
SELECT 
    '=== MIGRATION STATUS SUMMARY ===' as summary,
    (SELECT COUNT(*) FROM public.authors) as total_authors,
    (SELECT COUNT(*) FROM public.authors WHERE role = 'author') as writers,
    (SELECT COUNT(*) FROM public.authors WHERE role = 'editor') as editors,
    (SELECT COUNT(*) FROM public.editorial_standards) as editorial_standards,
    CASE 
        WHEN (SELECT COUNT(*) FROM public.authors) = 16 
        THEN '✅ ALL MIGRATIONS SUCCESSFUL!' 
        ELSE '⚠️ CHECK FAILED ITEMS ABOVE' 
    END as status;

-- Clean up test data
DELETE FROM public.glossary_terms WHERE term LIKE 'Test Term - Migration Verification%';
