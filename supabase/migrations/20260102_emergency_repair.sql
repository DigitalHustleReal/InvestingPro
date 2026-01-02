
-- Emergency Repair for Products Schema
-- Drops legacy constraints and ensures category column is clean

DO $$ 
BEGIN
    -- Drop old check constraint if it exists
    ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_type_check;
    
    -- Drop old default if it blocks
    ALTER TABLE IF EXISTS products ALTER COLUMN category DROP DEFAULT;
    
    -- Ensure category can accept all our enum values
    -- The enum was already created as product_category
END $$;
