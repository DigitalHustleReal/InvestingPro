-- ============================================
-- Add best_for column to products table
-- ============================================
-- Run this in Supabase SQL Editor
-- Project: InvestingPro
-- Date: 2026-01-06
-- ============================================

-- Step 1: Add the column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS best_for TEXT;

-- Step 2: Add index for performance
CREATE INDEX IF NOT EXISTS idx_products_best_for 
ON products(best_for);

-- Step 3: Update existing products
UPDATE products SET best_for = 'travel-rewards' WHERE slug = 'hdfc-regalia-gold';
UPDATE products SET best_for = 'shopping-rewards' WHERE slug = 'sbi-card-elite';
UPDATE products SET best_for = 'premium-lifestyle' WHERE slug = 'axis-magnus';
UPDATE products SET best_for = 'cashback-dining' WHERE slug = 'icici-sapphiro';

-- Step 4: Verify the updates
SELECT slug, name, best_for 
FROM products 
WHERE best_for IS NOT NULL
ORDER BY slug;

-- Expected result: 4 products with best_for values
