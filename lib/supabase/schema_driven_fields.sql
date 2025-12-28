-- Schema-Driven Fields for Content System
-- Adds intent classification and keyword fields to articles table

-- Add schema-driven fields to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS primary_keyword TEXT,
ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS search_intent TEXT CHECK (search_intent IN ('informational', 'commercial', 'transactional'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_primary_keyword ON articles(primary_keyword) WHERE primary_keyword IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_search_intent ON articles(search_intent) WHERE search_intent IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN articles.primary_keyword IS 'Primary SEO keyword for this content';
COMMENT ON COLUMN articles.secondary_keywords IS 'Array of secondary SEO keywords';
COMMENT ON COLUMN articles.search_intent IS 'Search intent: informational (learn), commercial (compare), transactional (buy)';

