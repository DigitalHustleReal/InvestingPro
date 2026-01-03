-- =====================================================
-- FIX: Update Product Category Constraints
-- =====================================================

-- 1. Drop the existing check constraint
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_category_check;

-- Also try dropping likely variations of the name just in case
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_product_type_check;

-- 2. Add the new updated constraint including 'broker' and 'loan'
ALTER TABLE public.products 
ADD CONSTRAINT products_category_check 
CHECK (category IN (
    'credit_card', 
    'mutual_fund', 
    'loan',            -- Generic loan category
    'personal_loan',   -- Keep legacy if needed
    'insurance', 
    'broker',          -- New: For Zerodha, Groww etc
    'stock', 
    'etf', 
    'fd'
));

-- 3. Update any existing 'personal_loan' to 'loan' if you want to standardize (Optional)
-- UPDATE products SET category = 'loan' WHERE category = 'personal_loan';
