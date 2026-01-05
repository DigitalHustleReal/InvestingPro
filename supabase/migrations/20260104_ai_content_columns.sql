-- Add missing columns for AI content generator
ALTER TABLE articles ADD COLUMN IF NOT EXISTS reading_time INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS word_count INTEGER;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS structured_content JSONB DEFAULT '{}'::jsonb;

-- Optional: If read_time exists and reading_time is empty, maybe sync them?
-- UPDATE articles SET reading_time = read_time WHERE reading_time IS NULL AND read_time IS NOT NULL;
