-- =====================================================
-- FIX: Get Public Articles RPC (SECURITY DEFINER)
-- This function bypasses RLS for anonymous users
-- Run this in Supabase SQL Editor
-- =====================================================

-- STEP 1: Fix submission_status for all published articles
UPDATE articles 
SET submission_status = 'approved' 
WHERE status = 'published' 
  AND (submission_status IS NULL OR submission_status != 'approved');

-- STEP 2: Drop existing function if exists
DROP FUNCTION IF EXISTS get_public_articles(INTEGER);

-- STEP 3: Create SECURITY DEFINER RPC that returns JSON
-- This avoids type mismatch issues and bypasses RLS
CREATE OR REPLACE FUNCTION get_public_articles(result_limit INTEGER DEFAULT 1000)
RETURNS SETOF json AS $$
BEGIN
    RETURN QUERY
    SELECT row_to_json(t)
    FROM (
        SELECT 
            a.id,
            a.title,
            a.slug,
            a.excerpt,
            a.category,
            a.featured_image,
            a.published_at,
            a.published_date,
            COALESCE(a.read_time, 5) as read_time,
            COALESCE(a.views, 0) as views,
            COALESCE(a.author_name, 'InvestingPro Team') as author_name,
            a.body_html,
            a.body_markdown,
            a.content,
            a.tags,
            a.status,
            a.created_at,
            a.updated_at
        FROM articles a
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC NULLS LAST
        LIMIT result_limit
    ) t;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- STEP 4: Grant permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION get_public_articles(INTEGER) TO anon, authenticated;

-- STEP 5: Verify it works (should return article count)
SELECT COUNT(*) as article_count FROM get_public_articles(100);
