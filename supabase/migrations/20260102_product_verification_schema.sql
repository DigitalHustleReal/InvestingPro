-- =====================================================
-- PRODUCT QUALITY GATES
-- =====================================================
-- Adds tracking for product data accuracy and verification
-- Date: 2026-01-02

-- 1. Add Verification columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'; -- 'verified', 'discrepancy', 'outdated'
ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;

-- 2. Index for filtering outdated products
CREATE INDEX IF NOT EXISTS idx_products_verification ON products(verification_status, last_verified_at);
