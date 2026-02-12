-- Rollback: 20260129_security_constraints.sql
-- Drop constraints, indexes, and functions added for security and validation

-- 1. Drop functions
DROP FUNCTION IF EXISTS check_slug_uniqueness(TEXT, TEXT, UUID);
DROP FUNCTION IF EXISTS generate_slug_from_title(TEXT);

-- 2. Drop indexes
DROP INDEX IF EXISTS idx_tags_name;
DROP INDEX IF EXISTS idx_categories_name;

-- 3. Drop NOT NULL constraints (cannot be easily "rolled back" if data exists, but we can set to nullable)
ALTER TABLE IF EXISTS categories ALTER COLUMN name DROP NOT NULL;
ALTER TABLE IF EXISTS categories ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE IF EXISTS tags ALTER COLUMN name DROP NOT NULL;
ALTER TABLE IF EXISTS tags ALTER COLUMN slug DROP NOT NULL;

-- 4. Drop CHECK constraints
ALTER TABLE IF EXISTS categories DROP CONSTRAINT IF EXISTS categories_level_check;
ALTER TABLE IF EXISTS tags DROP CONSTRAINT IF EXISTS tags_usage_count_check;

-- 5. Drop UNIQUE constraints
ALTER TABLE IF EXISTS categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE IF EXISTS tags DROP CONSTRAINT IF EXISTS tags_slug_key;
