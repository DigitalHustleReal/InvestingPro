-- Add scheduled publishing support to articles table
-- This enables automatic publishing at a specified date/time

-- Add scheduled_publish_at column if not exists
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;

-- 1. Add 'scheduled' status
do $$
begin
  -- Check if the enum type exists
  if exists (select 1 from pg_type where typname = 'article_status') then
    -- It exists, try to add the value if not present
    BEGIN
        ALTER TYPE article_status ADD VALUE 'scheduled';
    EXCEPTION
        WHEN duplicate_object THEN null; -- Value already exists
    END;
  else
    -- It does not exist. The status column might be text with check constraint, 
    -- or we need to create the type. 
    -- For safety, we will assume it's text for now and just rely on application logic 
    -- or add a check constraint if one exists.
    
    -- Try to add check constraint if it doesn't default to text
    -- This part depends on how 'articles' was created. 
    -- Safest bet: Just ensure the column accepts the string.
    NULL; 
  end if;
end $$;

-- Create index for scheduled publishing queries
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish 
ON articles(scheduled_publish_at) 
WHERE status = 'scheduled' AND scheduled_publish_at IS NOT NULL;

-- Add comment
COMMENT ON COLUMN articles.scheduled_publish_at IS 'Timestamp when article should be automatically published';
