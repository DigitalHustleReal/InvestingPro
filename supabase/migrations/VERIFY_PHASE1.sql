-- =====================================================
-- PHASE 1 VERIFICATION QUERIES
-- =====================================================
-- Run these in Supabase SQL Editor to verify Phase 1 is working

-- 1. Check if all new tables exist
SELECT 
  table_name,
  'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'platform_metrics',
    'keyword_difficulty_cache',
    'article_performance'
  )
ORDER BY table_name;

-- 2. Check if new columns were added to articles table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'articles' 
  AND column_name IN (
    'difficulty_score',
    'target_authority',
    'primary_keyword',
    'featured_image',
    'body_html',
    'body_markdown',
    'category'
  )
ORDER BY column_name;

-- 3. Check recent articles (if any exist)
SELECT 
  id,
  title,
  difficulty_score,
  target_authority,
  primary_keyword,
  category,
  status,
  created_at
FROM articles
ORDER BY created_at DESC
LIMIT 5;

-- 4. Test inserting a sample metric (run this if you want)
-- INSERT INTO platform_metrics (
--   date,
--   domain_authority,
--   organic_traffic,
--   indexed_pages
-- ) VALUES (
--   CURRENT_DATE,
--   15,  -- Your current DA
--   1000,  -- Estimated traffic
--   50  -- Estimated pages
-- );

-- 5. Verify all indexes were created
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN (
  'platform_metrics',
  'keyword_difficulty_cache',
  'article_performance'
)
ORDER BY tablename, indexname;
