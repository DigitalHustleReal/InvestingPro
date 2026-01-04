-- ============================================================================
-- FIND YOUR 200 POSTS - Where Did They Go?
-- ============================================================================

-- Check 1: Do we have an 'articles' table? (old schema)
SELECT 
    'Old articles table' as location,
    COUNT(*) as post_count,
    MIN(created_at) as oldest_post,
    MAX(created_at) as newest_post
FROM information_schema.tables t
LEFT JOIN public.articles ON true
WHERE t.table_schema = 'public' 
  AND t.table_name = 'articles'
GROUP BY t.table_name;

-- Check 2: Check new blog_posts table
SELECT 
    'New blog_posts table' as location,
    COUNT(*) as post_count,
    MIN(created_at) as oldest_post,
    MAX(created_at) as newest_post
FROM public.blog_posts;

-- Check 3: Check glossary_terms
SELECT 
    'Glossary terms' as location,
    COUNT(*) as term_count,
    MIN(created_at) as oldest_term,
    MAX(created_at) as newest_term
FROM public.glossary_terms;

-- Check 4: List all tables that might contain content
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_schema = 'public' 
       AND columns.table_name = tables.table_name 
       AND column_name IN ('title', 'content', 'slug')) as has_content_columns
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name LIKE '%article%' 
   OR table_name LIKE '%post%'
   OR table_name LIKE '%content%'
ORDER BY table_name;

-- Check 5: If articles table exists, show sample
SELECT 
    id,
    title,
    slug,
    CASE WHEN published THEN 'Published' ELSE 'Draft' END as status,
    created_at,
    updated_at
FROM public.articles
ORDER BY created_at DESC
LIMIT 10;

-- Check 6: Check if articles table has different schema than blog_posts
SELECT 
    'articles table columns' as table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'articles'
ORDER BY ordinal_position;

-- Check 7: Count by status in each table
-- Articles table (if exists)
SELECT 
    'articles' as table_name,
    status,
    COUNT(*) as count
FROM public.articles
GROUP BY status
ORDER BY count DESC;

-- blog_posts table
SELECT 
    'blog_posts' as table_name,
    CASE WHEN published THEN 'Published' ELSE 'Draft' END as status,
    COUNT(*) as count
FROM public.blog_posts
GROUP BY published
ORDER BY count DESC;

-- ============================================================================
-- MIGRATION PLAN (if articles table exists)
-- ============================================================================

-- If you have an 'articles' table with old posts, we need to migrate them!
-- Uncomment and run this if you want to migrate:

/*
INSERT INTO public.blog_posts (
    title,
    slug,
    category,
    excerpt,
    content,
    meta_description,
    published,
    published_at,
    ai_generated,
    created_at,
    updated_at
)
SELECT 
    title,
    slug,
    COALESCE(category, 'credit-cards') as category,
    COALESCE(excerpt, LEFT(content, 200)) as excerpt,
    content,
    COALESCE(meta_description, excerpt) as meta_description,
    COALESCE(published, false) as published,
    COALESCE(published_at, created_at) as published_at,
    COALESCE(ai_generated, true) as ai_generated,
    created_at,
    updated_at
FROM public.articles
WHERE id NOT IN (
    SELECT id FROM public.blog_posts
)
ON CONFLICT (slug) DO NOTHING;
*/

-- After migrating, verify:
-- SELECT COUNT(*) as migrated_posts FROM public.blog_posts;
