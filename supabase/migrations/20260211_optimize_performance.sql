-- ============================================================================
-- PERFORMANCE OPTIMIZATION (Indices for Public API & Dashboard)
-- Date: 2026-02-11
-- Description: Adds indices to support fast filtering/sorting on articles and products.
--              Fixes timeouts on Homepage and Admin Dashboard.
-- ============================================================================

-- 1. Optimization for Articles (Used by LatestInsights, ArticleService, Admin Stats)
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_updated_at ON articles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views);
CREATE INDEX IF NOT EXISTS idx_articles_is_ai_generated ON articles(is_ai_generated);

-- Composite index for common public query: "published" + "category"
CREATE INDEX IF NOT EXISTS idx_articles_status_category ON articles(status, category);

-- 2. Optimization for Products (Used by FeaturedProducts, ProductService)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_trust_score ON products(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

-- Composite index for featured products query
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(is_active, category);

-- 3. Optimization for Stats (Used by get_admin_dashboard_stats)
-- Ensure 'reviews' table has indices if it exists (referenced in dashboard stats)
-- CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating); -- Commented out as table schema uncertain

-- 4. VACUUM ANALYZE to update statistics for the query planner
-- Note: This might not run in a transaction block in some postgres versions, 
-- but is good practice if run manually. We'll leave it out of the migration script 
-- to avoid transaction errors, but the indices themselves will trigger stats updates.
