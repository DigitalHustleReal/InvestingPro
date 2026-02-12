-- Rollback: 20260129_categories_tags_enhancement.sql
-- Drop hierarchical category support, tags system, and junction table

-- 1. Drop policies
DROP POLICY IF EXISTS "Tags are viewable by authenticated users" ON tags;
DROP POLICY IF EXISTS "Tags are manageable by authenticated users" ON tags;
DROP POLICY IF EXISTS "Content tags are manageable by authenticated users" ON content_tags;

-- 2. Drop triggers and functions
DROP TRIGGER IF EXISTS trigger_tags_updated_at ON tags;
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS trigger_update_category_level ON categories;
DROP TRIGGER IF EXISTS trigger_update_tag_usage_count ON content_tags;

DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_category_level();
DROP FUNCTION IF EXISTS update_tag_usage_count();

-- 3. Drop junction table
DROP TABLE IF EXISTS content_tags;

-- 4. Drop tags table
DROP TABLE IF EXISTS tags;

-- 5. Drop added columns from other tables
ALTER TABLE IF EXISTS articles DROP COLUMN IF EXISTS category_id;
ALTER TABLE IF EXISTS content_drafts DROP COLUMN IF EXISTS category_id;

-- 6. Drop added columns and parent reference from categories
DROP INDEX IF EXISTS idx_categories_level;
DROP INDEX IF EXISTS idx_categories_parent_id;

ALTER TABLE categories 
  DROP CONSTRAINT IF EXISTS categories_parent_id_fkey,
  DROP COLUMN IF EXISTS parent_id,
  DROP COLUMN IF EXISTS level,
  DROP COLUMN IF EXISTS order_index,
  DROP COLUMN IF EXISTS metadata,
  DROP COLUMN IF EXISTS updated_at;
