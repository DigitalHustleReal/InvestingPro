-- ==============================================================================
-- PERFORMANCE OPTIMIZATION: DADMIN DASHBOARD STATS
-- ==============================================================================

-- Create a return type for the dashboard stats
DROP TYPE IF EXISTS dashboard_stats_result CASCADE;
CREATE TYPE dashboard_stats_result AS (
    total_articles BIGINT,
    published_articles BIGINT,
    draft_articles BIGINT,
    ai_generated_articles BIGINT,
    total_views BIGINT,
    articles_this_month BIGINT,
    recent_activity JSONB,
    category_stats JSONB
);

-- Function to get all stats in ONE call
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS dashboard_stats_result
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result dashboard_stats_result;
BEGIN
    -- 1. Counts
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'published'),
        COUNT(*) FILTER (WHERE status = 'draft'),
        COUNT(*) FILTER (WHERE ai_generated = true),
        COALESCE(SUM(views), 0)
    INTO 
        result.total_articles,
        result.published_articles,
        result.draft_articles,
        result.ai_generated_articles,
        result.total_views
    FROM articles;

    -- 2. This Month
    SELECT COUNT(*)
    INTO result.articles_this_month
    FROM articles
    WHERE created_at >= date_trunc('month', CURRENT_DATE);

    -- 3. Recent Activity (Last 5 modified articles)
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', id,
                'title', title,
                'status', status,
                'updated_at', updated_at,
                'author_name', author_name
            )
        ),
        '[]'::jsonb
    )
    INTO result.recent_activity
    FROM (
        SELECT id, title, status, updated_at, author_name
        FROM articles
        ORDER BY updated_at DESC
        LIMIT 5
    ) t;

    -- 4. Category Stats
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'category', category,
                'count', count
            )
        ),
        '[]'::jsonb
    )
    INTO result.category_stats
    FROM (
        SELECT category, COUNT(*) as count
        FROM articles
        WHERE category IS NOT NULL
        GROUP BY category
    ) c;

    RETURN result;
END;
$$;

-- Grant access to authenticated users (or limit to admins via RLS/Policy on function if needed)
-- For RPC, we usually just grant execute to public/authenticated and rely on internal logic.
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO service_role;
