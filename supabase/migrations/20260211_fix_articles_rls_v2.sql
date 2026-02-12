-- ============================================================================
-- FIX ARTICLES RLS: FULL CRUD FOR ADMINS
-- Date: 2026-02-11
-- Description: Adds missing INSERT, UPDATE, and DELETE policies for the articles table.
--              Also adds a permanent exec_sql_query for diagnostics.
-- ============================================================================

-- 1. Create a permanent exec_sql_query if it doesn't exist
CREATE OR REPLACE FUNCTION exec_sql_query(sql_query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
    RETURN result;
END;
$$;

-- Secure the query function
REVOKE EXECUTE ON FUNCTION exec_sql_query(text) FROM public;
REVOKE EXECUTE ON FUNCTION exec_sql_query(text) FROM anon;
REVOKE EXECUTE ON FUNCTION exec_sql_query(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION exec_sql_query(text) TO service_role;

-- 2. Grant FULL CRUD to Admins on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Published articles are visible to everyone
DROP POLICY IF EXISTS "Published articles are public" ON articles;
CREATE POLICY "Published articles are public" ON articles
    FOR SELECT TO public
    USING (status = 'published');

-- Policy: Admins can do ANYTHING to articles
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

DROP POLICY IF EXISTS "Admins can insert articles" ON articles;
CREATE POLICY "Admins can insert articles" ON articles
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update articles" ON articles;
CREATE POLICY "Admins can update articles" ON articles
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can delete articles" ON articles;
CREATE POLICY "Admins can delete articles" ON articles
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );
