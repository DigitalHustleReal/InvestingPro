-- =====================================================
-- ADMIN DASHBOARD RPC FUNCTIONS
-- Required for the admin dashboard to display stats
-- =====================================================

-- Get Admin Dashboard Stats (aggregated)
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
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO anon, authenticated;

-- =====================================================
-- AFFILIATE STATISTICS RPC FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION get_affiliate_stats()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'totalClicks', (SELECT COALESCE(SUM(clicks), 0) FROM affiliate_links),
        'totalConversions', (SELECT COALESCE(SUM(conversions), 0) FROM affiliate_links),
        'totalRevenue', (SELECT COALESCE(SUM(revenue), 0) FROM affiliate_links),
        'conversionRate', (
            SELECT CASE 
                WHEN SUM(clicks) > 0 
                THEN ROUND((SUM(conversions)::numeric / SUM(clicks)::numeric) * 100, 1)
                ELSE 0
            END 
            FROM affiliate_links
        ),
        'topPartners', (
            SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
            FROM (
                SELECT 
                    p.name as partner,
                    COALESCE(SUM(l.clicks), 0) as clicks,
                    COALESCE(SUM(l.revenue), 0) as revenue
                FROM affiliate_partners p
                LEFT JOIN affiliate_links l ON l.partner_id = p.id
                GROUP BY p.id, p.name
                ORDER BY clicks DESC
                LIMIT 5
            ) t
        ),
        'topLinks', (
            SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
            FROM (
                SELECT 
                    name,
                    clicks,
                    conversions
                FROM affiliate_links
                ORDER BY clicks DESC
                LIMIT 5
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_affiliate_stats() TO anon, authenticated;

-- =====================================================
-- INCREMENT AFFILIATE CLICKS RPC
-- =====================================================

CREATE OR REPLACE FUNCTION increment_affiliate_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE affiliate_links
    SET clicks = COALESCE(clicks, 0) + 1, updated_at = NOW()
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_affiliate_clicks(UUID) TO anon, authenticated;

-- =====================================================
-- SEARCH ARTICLES RPC
-- Full-text search with relevance scoring
-- =====================================================

CREATE OR REPLACE FUNCTION search_articles(
    search_query TEXT,
    search_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    category TEXT,
    featured_image TEXT,
    published_at TIMESTAMPTZ,
    relevance REAL
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
        ts_rank(
            setweight(to_tsvector('english', COALESCE(a.title, '')), 'A') ||
            setweight(to_tsvector('english', COALESCE(a.excerpt, '')), 'B') ||
            setweight(to_tsvector('english', COALESCE(a.body_markdown, '')), 'C'),
            plainto_tsquery('english', search_query)
        ) as relevance
    FROM articles a
    WHERE 
        a.status = 'published'
        AND (
            a.title ILIKE '%' || search_query || '%'
            OR a.excerpt ILIKE '%' || search_query || '%'
            OR a.body_markdown ILIKE '%' || search_query || '%'
            OR to_tsvector('english', COALESCE(a.title, '') || ' ' || COALESCE(a.excerpt, '')) 
               @@ plainto_tsquery('english', search_query)
        )
    ORDER BY relevance DESC
    LIMIT search_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_articles(TEXT, INTEGER) TO anon, authenticated;
