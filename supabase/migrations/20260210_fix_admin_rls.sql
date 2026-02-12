-- ============================================================================
-- FIX ADMIN RLS AND ADD UTILITY RPCs (v2 - Fixed Column Names)
-- Date: 2026-02-10
-- Description: Unblocks Admin Dashboard by fixing RLS and adding exec_sql.
--              Removed incorrect reference to 'user_id' in articles table.
-- ============================================================================

-- 1. Create exec_sql function (Required for migration scripts)
-- ⚠️ SECURITY: Only grant to service_role!
CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_string;
END;
$$;

-- Secure the function
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM public;
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM anon;
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- 2. Update Dashboard Stats RPC to be SECURITY DEFINER
-- This ensures it returns accurate counts regardless of RLS
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_articles', (SELECT COUNT(*) FROM articles),
        'published_articles', (SELECT COUNT(*) FROM articles WHERE status = 'published'),
        'draft_articles', (SELECT COUNT(*) FROM articles WHERE status = 'draft'),
        'total_views', (SELECT COALESCE(SUM(views), 0) FROM articles),
        'articles_this_month', (SELECT COUNT(*) FROM articles WHERE created_at >= date_trunc('month', CURRENT_DATE)),
        'ai_generated_articles', (SELECT COUNT(*) FROM articles WHERE is_ai_generated = true OR ai_generated = true),
        'recent_activity', (
            SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
            FROM (
                SELECT 
                    id,
                    title,
                    status,
                    created_at,
                    updated_at
                FROM articles
                ORDER BY updated_at DESC
                LIMIT 5
            ) t
        ),
        'category_stats', (
            SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
            FROM (
                SELECT 
                    COALESCE(category, 'uncategorized') as category,
                    COUNT(*) as count
                FROM articles
                GROUP BY category
                ORDER BY count DESC
                LIMIT 10
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- ADDED SECURITY DEFINER

GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO anon, authenticated, service_role;

-- 3. Fix Articles RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Published articles are visible to everyone
DROP POLICY IF EXISTS "Published articles are public" ON articles;
CREATE POLICY "Published articles are public" ON articles
    FOR SELECT TO public
    USING (status = 'published');

-- Policy: Admins can see ALL articles (Drafts, Archives, etc)
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
CREATE POLICY "Admins can view all articles" ON articles
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 4. Fix Reviews RLS (Reviews usually have user_id, refer to schema if needed)
-- We'll wrap this in a DO block to be safe, or just assume reviews has user_id based on API client code.
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
CREATE POLICY "Admins can view all reviews" ON reviews
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );
