-- ============================================
-- Day 7: Populate best_for for ALL Products
-- ============================================
-- Comprehensive SQL to tag all products with badges
-- Run in Supabase SQL Editor
-- ============================================

-- ==========================================
-- STEP 1: Credit Cards (extend existing)
-- ==========================================

-- Travel rewards cards
UPDATE products SET best_for = 'travel-rewards' 
WHERE category = 'credit_card' 
AND (name ILIKE '%regalia%' OR name ILIKE '%travel%' OR name ILIKE '%miles%' OR name ILIKE '%lounge%');

-- Cashback dining cards
UPDATE products SET best_for = 'cashback-dining' 
WHERE category = 'credit_card' 
AND (name ILIKE '%sapphir%' OR name ILIKE '%dining%' OR name ILIKE '%food%' OR name ILIKE '%zomato%' OR name ILIKE '%swiggy%');

-- Fuel savings cards
UPDATE products SET best_for = 'fuel-savings'
WHERE category = 'credit_card'
AND (name ILIKE '%ace%' OR name ILIKE '%fuel%' OR name ILIKE '%petrol%' OR name ILIKE '%indian oil%' OR name ILIKE '%hp%');

-- Zero annual fee cards
UPDATE products SET best_for = 'zero-fees'
WHERE category = 'credit_card'
AND (name ILIKE '%lifetime free%' OR name ILIKE '%zero annual%' OR name ILIKE '%no fee%' OR name ILIKE '%free forever%');

-- Shopping rewards (Amazon, Flipkart, etc.)
UPDATE products SET best_for = 'shopping-rewards'
WHERE category = 'credit_card'
AND (name ILIKE '%amazon%' OR name ILIKE '%flipkart%' OR name ILIKE '%shopping%' OR name ILIKE '%sbi card elite%' OR name ILIKE '%myntra%');

-- Premium lifestyle cards
UPDATE products SET best_for = 'premium-lifestyle'
WHERE category = 'credit_card'
AND (name ILIKE '%magnus%' OR name ILIKE '%infinia%' OR name ILIKE '%prestige%' OR name ILIKE '%premium%' OR name ILIKE '%reserve%' OR name ILIKE '%centurion%');

-- General cashback cards
UPDATE products SET best_for = 'cashback-general'
WHERE category = 'credit_card'
AND (name ILIKE '%cashback%' OR name ILIKE '%moneyback%' OR name ILIKE '%rewards%')
AND best_for IS NULL; -- Only if not already tagged

-- Business cards
UPDATE products SET best_for = 'business-expenses'
WHERE category = 'credit_card'
AND (name ILIKE '%business%' OR name ILIKE '%corporate%' OR name ILIKE '%commercial%');

-- Student cards
UPDATE products SET best_for = 'student-starter'
WHERE category = 'credit_card'
AND (name ILIKE '%student%' OR name ILIKE '%youth%' OR name ILIKE '%campus%' OR name ILIKE '%first%');

-- ==========================================
-- STEP 2: Loans
-- ==========================================

-- Home loans
UPDATE products SET best_for = 'home-loan'
WHERE category = 'loan'
AND (name ILIKE '%home%' OR name ILIKE '%housing%' OR name ILIKE '%property%' OR name ILIKE '%mortgage%');

-- Education loans
UPDATE products SET best_for = 'education-loan'
WHERE category = 'loan'
AND (name ILIKE '%education%' OR name ILIKE '%student%' OR name ILIKE '%study%' OR name ILIKE '%abroad%' OR name ILIKE '%scholar%');

-- Personal loans
UPDATE products SET best_for = 'personal-loan'
WHERE category = 'loan'
AND (name ILIKE '%personal%' OR name ILIKE '%instant%' OR name ILIKE '%quick%')
AND best_for IS NULL;

-- Business loans
UPDATE products SET best_for = 'business-loan'
WHERE category = 'loan'
AND (name ILIKE '%business%' OR name ILIKE '%sme%' OR name ILIKE '%msme%' OR name ILIKE '%commercial%' OR name ILIKE '%working capital%');

-- Car/Auto loans
UPDATE products SET best_for = 'car-loan'
WHERE category = 'loan'
AND (name ILIKE '%car%' OR name ILIKE '%auto%' OR name ILIKE '%vehicle%' OR name ILIKE '%two wheeler%' OR name ILIKE '%bike%');

-- Gold loans
UPDATE products SET best_for = 'gold-loan'
WHERE category = 'loan'
AND (name ILIKE '%gold%' OR name ILIKE '%jewel%' OR name ILIKE '%ornament%');

-- ==========================================
-- STEP 3: Mutual Funds
-- ==========================================

-- Retirement funds
UPDATE products SET best_for = 'retirement-fund'
WHERE category = 'mutual_fund'
AND (name ILIKE '%retirement%' OR name ILIKE '%pension%' OR name ILIKE '%senior citizen%');

-- Tax saving funds (ELSS)
UPDATE products SET best_for = 'tax-saving-fund'
WHERE category = 'mutual_fund'
AND (name ILIKE '%elss%' OR name ILIKE '%tax%' OR name ILIKE '%80c%');

-- Aggressive growth (Small cap, Mid cap)
UPDATE products SET best_for = 'aggressive-growth'
WHERE category = 'mutual_fund'
AND (name ILIKE '%small cap%' OR name ILIKE '%mid cap%' OR name ILIKE '%aggressive%' OR name ILIKE '%growth%')
AND best_for IS NULL;

-- Index funds
UPDATE products SET best_for = 'index-fund'
WHERE category = 'mutual_fund'
AND (name ILIKE '%index%' OR name ILIKE '%nifty%' OR name ILIKE '%sensex%' OR name ILIKE '%passive%');

-- Balanced/Hybrid funds
UPDATE products SET best_for = 'balanced-fund'
WHERE category = 'mutual_fund'
AND (name ILIKE '%balanced%' OR name ILIKE '%hybrid%' OR name ILIKE '%equity and debt%');

-- Liquid funds
UPDATE products SET best_for = 'liquid-fund'
WHERE category = 'mutual_fund'
AND (name ILIKE '%liquid%' OR name ILIKE '%money market%' OR name ILIKE '%ultra short%' OR name ILIKE '%overnight%');

-- ==========================================
-- STEP 4: Verification
-- ==========================================

-- Count products by category and best_for
SELECT 
  category,
  best_for,
  COUNT(*) as count
FROM products
GROUP BY category, best_for
ORDER BY category, count DESC;

-- Show products without badges
SELECT category, name, slug
FROM products
WHERE best_for IS NULL
ORDER BY category, name;

-- Total coverage
SELECT 
  category,
  COUNT(*) as total,
  COUNT(best_for) as tagged,
  ROUND(100.0 * COUNT(best_for) / COUNT(*), 1) as coverage_percent
FROM products
GROUP BY category;
