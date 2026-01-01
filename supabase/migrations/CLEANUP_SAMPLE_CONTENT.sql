-- =====================================================
-- DATABASE CLEANUP: Remove Sample/Test Content
-- =====================================================
-- Run this in Supabase SQL Editor to clean database

-- 1. Delete sample/test articles
DELETE FROM articles 
WHERE 
  -- Test/sample titles
  title ILIKE '%test%' 
  OR title ILIKE '%sample%'
  OR title ILIKE '%lorem%'
  OR title ILIKE '%placeholder%'
  OR title ILIKE '%draft%'
  OR title ILIKE '%example%'
  
  -- Very short articles (likely incomplete)
  OR LENGTH(COALESCE(body_html, content, '')) < 500
  
  -- Missing essential fields
  OR title IS NULL
  OR slug IS NULL
  OR (body_html IS NULL AND content IS NULL AND body_markdown IS NULL)
  
  -- Status = draft/deleted
  OR status IN ('draft', 'deleted', 'archived');

-- Get count before we proceed
SELECT COUNT(*) as deleted_articles FROM articles WHERE id NOT IN (
  SELECT id FROM articles WHERE status = 'published' AND LENGTH(COALESCE(body_html, content, '')) >= 500
);

-- 2. Delete sample glossary terms (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'glossary_terms') THEN
    DELETE FROM glossary_terms
    WHERE
      term ILIKE '%test%'
      OR term ILIKE '%sample%'
      OR definition IS NULL
      OR LENGTH(definition) < 50;
    RAISE NOTICE 'Cleaned glossary_terms table';
  ELSE
    RAISE NOTICE 'glossary_terms table does not exist - skipping';
  END IF;
END $$;

-- 3. Delete orphaned data (if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'article_views') THEN
    DELETE FROM article_views WHERE article_id NOT IN (SELECT id FROM articles);
    RAISE NOTICE 'Cleaned article_views';
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookmarks') THEN
    DELETE FROM bookmarks WHERE article_id NOT IN (SELECT id FROM articles);
    RAISE NOTICE 'Cleaned bookmarks';
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reading_progress') THEN
    DELETE FROM reading_progress WHERE article_id NOT IN (SELECT id FROM articles);
    RAISE NOTICE 'Cleaned reading_progress';
  END IF;
END $$;

-- 4. Clean keyword difficulty cache (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'keyword_difficulty_cache') THEN
    DELETE FROM keyword_difficulty_cache WHERE expires_at < NOW();
    RAISE NOTICE 'Cleaned keyword_difficulty_cache';
  ELSE
    RAISE NOTICE 'keyword_difficulty_cache table does not exist - skipping';
  END IF;
END $$;

-- 5. Reset article_performance for fresh start (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'article_performance') THEN
    DELETE FROM article_performance;
    RAISE NOTICE 'Reset article_performance';
  ELSE
    RAISE NOTICE 'article_performance table does not exist - skipping';
  END IF;
END $$;

-- 6. Clean newsletter subscribers (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers') THEN
    DELETE FROM newsletter_subscribers 
    WHERE email ILIKE '%test%' 
       OR email ILIKE '%example%'
       OR email ILIKE '%sample%';
    RAISE NOTICE 'Cleaned newsletter_subscribers';
  ELSE
    RAISE NOTICE 'newsletter_subscribers table does not exist - skipping';
  END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check remaining articles
SELECT 
  status,
  COUNT(*) as count,
  AVG(LENGTH(COALESCE(body_html, content, ''))) as avg_length
FROM articles
GROUP BY status;

-- Check if tables are clean (only existing tables)
DO $$
DECLARE
  article_count INT;
  glossary_count INT := 0;
  newsletter_count INT := 0;
  views_count INT := 0;
BEGIN
  SELECT COUNT(*) INTO article_count FROM articles;
  RAISE NOTICE 'articles: % rows', article_count;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'glossary_terms') THEN
    SELECT COUNT(*) INTO glossary_count FROM glossary_terms;
    RAISE NOTICE 'glossary_terms: % rows', glossary_count;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers') THEN
    SELECT COUNT(*) INTO newsletter_count FROM newsletter_subscribers;
    RAISE NOTICE 'newsletter_subscribers: % rows', newsletter_count;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'article_views') THEN
    SELECT COUNT(*) INTO views_count FROM article_views;
    RAISE NOTICE 'article_views: % rows', views_count;
  END IF;
END $$;

-- =====================================================
-- Optional: Nuclear Option (Delete ALL articles)
-- =====================================================
-- Uncomment ONLY if you want to start completely fresh

-- DELETE FROM article_views;
-- DELETE FROM bookmarks;
-- DELETE FROM reading_progress;
-- DELETE FROM articles;
-- DELETE FROM glossary_terms;
-- DELETE FROM keyword_difficulty_cache;
-- DELETE FROM article_performance;

-- VACUUM ANALYZE articles;
-- VACUUM ANALYZE glossary_terms;
