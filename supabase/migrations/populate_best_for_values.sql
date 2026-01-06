-- ============================================
-- Fix: Add updated_at column then populate best_for
-- ============================================
-- The trigger requires updated_at column
-- ============================================

-- Step 1: Add updated_at column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Populate best_for values
UPDATE products SET best_for = 'travel-rewards' WHERE slug = 'hdfc-regalia-gold';
UPDATE products SET best_for = 'travel-rewards' WHERE slug = 'hdfc-regalia-gold-credit-card';
UPDATE products SET best_for = 'shopping-rewards' WHERE slug = 'sbi-card-elite';
UPDATE products SET best_for = 'premium-lifestyle' WHERE slug = 'axis-magnus';
UPDATE products SET best_for = 'premium-lifestyle' WHERE slug = 'axis-magnus-credit-card';
UPDATE products SET best_for = 'cashback-dining' WHERE slug = 'icici-sapphiro-credit-card';
UPDATE products SET best_for = 'shopping-rewards' WHERE slug = 'amazon-pay-icici-credit-card';
UPDATE products SET best_for = 'cashback-general' WHERE slug = 'hdfc-moneyback-credit-card';
UPDATE products SET best_for = 'fuel-savings' WHERE slug = 'axis-ace-credit-card';
UPDATE products SET best_for = 'shopping-rewards' WHERE slug = 'flipkart-axis-bank-credit-card';

-- Step 3: Verify
SELECT slug, name, best_for 
FROM products 
WHERE best_for IS NOT NULL AND best_for != ''
ORDER BY best_for, slug;
