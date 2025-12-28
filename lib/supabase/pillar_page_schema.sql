-- Pillar Page Content Type Support
-- Extends articles table to support pillar pages

-- Add content_type column to articles table (if not exists)
-- This distinguishes between 'article', 'pillar', and 'category-page'
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article' 
CHECK (content_type IN ('article', 'pillar', 'category-page'));

-- Create index on content_type for filtering
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON articles(content_type);

-- Pillar Page Specific Fields
-- Add fields that are specific to pillar pages
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS pillar_related_articles UUID[] DEFAULT '{}', -- Array of related article IDs
ADD COLUMN IF NOT EXISTS pillar_hub_content JSONB, -- Structured hub content (sections, clusters)
ADD COLUMN IF NOT EXISTS pillar_primary_topic TEXT, -- Main topic this pillar covers
ADD COLUMN IF NOT EXISTS pillar_subtopics TEXT[] DEFAULT '{}', -- Related subtopics
ADD COLUMN IF NOT EXISTS pillar_related_categories TEXT[] DEFAULT '{}'; -- Related categories

-- Create index on pillar_primary_topic for searching
CREATE INDEX IF NOT EXISTS idx_articles_pillar_topic ON articles(pillar_primary_topic) 
WHERE content_type = 'pillar';

-- Update the updated_at trigger to work with new columns
-- (The existing trigger should already handle this, but ensuring it works)

-- Add comment to content_type column for documentation
COMMENT ON COLUMN articles.content_type IS 'Content type: article (standard article), pillar (comprehensive pillar page), category-page (category hub page)';
COMMENT ON COLUMN articles.pillar_related_articles IS 'Array of related article IDs that cluster around this pillar page';
COMMENT ON COLUMN articles.pillar_hub_content IS 'JSONB field for structured hub content including sections and content clusters';
COMMENT ON COLUMN articles.pillar_primary_topic IS 'Primary topic/theme of the pillar page';
COMMENT ON COLUMN articles.pillar_subtopics IS 'Array of subtopics covered in the pillar page';
COMMENT ON COLUMN articles.pillar_related_categories IS 'Array of related category slugs';

