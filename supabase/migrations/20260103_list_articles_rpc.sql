-- =====================================================
-- FIX: Add RPC for listing published articles without search
-- This bypasses RLS issues for anonymous users
-- =====================================================

-- Drop if exists to allow re-running
DROP FUNCTION IF EXISTS list_published_articles(INTEGER);

CREATE OR REPLACE FUNCTION list_published_articles(
    result_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    category TEXT,
    featured_image TEXT,
    published_at TIMESTAMPTZ,
    read_time INTEGER,
    views INTEGER,
    author_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.category,
        a.featured_image,
        a.published_at,
        COALESCE(a.read_time, 5) as read_time,
        COALESCE(a.views, 0) as views,
        COALESCE(a.author_name, 'InvestingPro Team') as author_name
    FROM articles a
    WHERE 
        a.status = 'published'
        AND (a.submission_status = 'approved' OR a.submission_status IS NULL)
    ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC NULLS LAST
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION list_published_articles(INTEGER) TO anon, authenticated;

-- Verify: Run this to check
-- SELECT * FROM list_published_articles(10);
