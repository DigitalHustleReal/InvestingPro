-- =====================================================
-- FIX: Get Public Products RPC (SECURITY DEFINER)
-- This function bypasses RLS for anonymous users
-- Run this in Supabase SQL Editor
-- =====================================================

-- STEP 1: Ensure all active products are properly flagged
UPDATE products 
SET is_active = true 
WHERE is_active IS NULL;

-- STEP 2: Drop existing function if exists
DROP FUNCTION IF EXISTS get_public_products(TEXT, INTEGER, INTEGER, TEXT);

-- STEP 3: Create SECURITY DEFINER RPC that returns JSON
CREATE OR REPLACE FUNCTION get_public_products(
    category_filter TEXT DEFAULT NULL,
    result_limit INTEGER DEFAULT 50,
    result_offset INTEGER DEFAULT 0,
    search_term TEXT DEFAULT NULL
)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'products', COALESCE(
            (SELECT json_agg(t)
            FROM (
                SELECT 
                    p.id,
                    p.slug,
                    p.name,
                    p.category,
                    p.provider_name,
                    p.description,
                    p.image_url,
                    COALESCE(p.rating, 4.0) as rating,
                    COALESCE(p.features, '{}'::jsonb) as features,
                    COALESCE(p.pros, '{}') as pros,
                    COALESCE(p.cons, '{}') as cons,
                    p.affiliate_link,
                    p.official_link,
                    p.is_active,
                    p.last_verified_at,
                    COALESCE(p.verification_status, 'pending') as verification_status,
                    COALESCE(p.trust_score, 0) as trust_score,
                    p.created_at,
                    p.updated_at
                FROM products p
                WHERE p.is_active = true
                    AND (category_filter IS NULL OR p.category::text = category_filter)
                    AND (search_term IS NULL OR search_term = '' OR 
                         p.name ILIKE '%' || search_term || '%' OR 
                         p.provider_name ILIKE '%' || search_term || '%' OR
                         p.description ILIKE '%' || search_term || '%')
                ORDER BY p.trust_score DESC NULLS LAST, p.rating DESC NULLS LAST, p.name ASC
                LIMIT result_limit
                OFFSET result_offset
            ) t),
            '[]'::json
        ),
        'total', (
            SELECT COUNT(*)
            FROM products p
            WHERE p.is_active = true
                AND (category_filter IS NULL OR p.category::text = category_filter)
                AND (search_term IS NULL OR search_term = '' OR 
                     p.name ILIKE '%' || search_term || '%' OR 
                     p.provider_name ILIKE '%' || search_term || '%' OR
                     p.description ILIKE '%' || search_term || '%')
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- STEP 4: Grant permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION get_public_products(TEXT, INTEGER, INTEGER, TEXT) TO anon, authenticated;

-- STEP 5: Verify it works (should return product count)
SELECT 
    (get_public_products()->>'total')::int as total_products,
    json_array_length(get_public_products()->'products') as returned_products;

