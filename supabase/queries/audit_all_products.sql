-- ============================================
-- Query all products to plan badge assignments
-- ============================================
-- Run this in Supabase SQL Editor to see all products
-- ============================================

-- Get all Credit Cards
SELECT id, slug, name, category 
FROM products 
WHERE category = 'credit_card' 
ORDER BY slug;

-- Get all Loans
SELECT id, slug, name, category 
FROM products 
WHERE category = 'loan' 
ORDER BY slug;

-- Get all Mutual Funds
SELECT id, slug, name, category 
FROM products 
WHERE category = 'mutual_fund' 
ORDER BY slug;

-- Count by category
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category;
