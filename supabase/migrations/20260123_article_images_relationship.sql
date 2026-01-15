-- Article Images Relationship Table
-- Allows multiple images per article with positions, captions, and usage context

-- Create article_images table
CREATE TABLE IF NOT EXISTS article_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    
    -- Image details (can be external URL if media_id is null)
    image_url TEXT NOT NULL,
    
    -- Positioning and context
    position INTEGER DEFAULT 0, -- Order in article (0 = featured, 1+ = inline)
    usage_context TEXT DEFAULT 'inline' CHECK (usage_context IN ('featured', 'inline', 'gallery', 'sidebar', 'banner')),
    
    -- Content
    caption TEXT,
    alt_text TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_images_article ON article_images(article_id);
CREATE INDEX IF NOT EXISTS idx_article_images_media ON article_images(media_id);
CREATE INDEX IF NOT EXISTS idx_article_images_context ON article_images(usage_context);
CREATE INDEX IF NOT EXISTS idx_article_images_position ON article_images(article_id, position);

-- RLS Policies
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

-- Public can view images for published articles
CREATE POLICY "Public can view article images for published articles"
ON article_images FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM articles
        WHERE articles.id = article_images.article_id
        AND articles.status = 'published'
    )
);

-- Authenticated users (editors) can manage images
CREATE POLICY "Editors can manage article images"
ON article_images FOR ALL
USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_article_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER article_images_updated_at
    BEFORE UPDATE ON article_images
    FOR EACH ROW
    EXECUTE FUNCTION update_article_images_updated_at();

-- Function to track media usage when article image is created/deleted
CREATE OR REPLACE FUNCTION track_article_image_media_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.media_id IS NOT NULL THEN
        -- Increment usage count
        UPDATE media
        SET usage_count = COALESCE(usage_count, 0) + 1,
            used_in_articles = COALESCE(used_in_articles, ARRAY[]::UUID[]) || NEW.article_id
        WHERE id = NEW.media_id;
    ELSIF TG_OP = 'DELETE' AND OLD.media_id IS NOT NULL THEN
        -- Decrement usage count
        UPDATE media
        SET usage_count = GREATEST(COALESCE(usage_count, 0) - 1, 0),
            used_in_articles = array_remove(COALESCE(used_in_articles, ARRAY[]::UUID[]), OLD.article_id)
        WHERE id = OLD.media_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to track media usage
CREATE TRIGGER article_images_media_usage_tracker
    AFTER INSERT OR DELETE ON article_images
    FOR EACH ROW
    EXECUTE FUNCTION track_article_image_media_usage();

-- Add comment
COMMENT ON TABLE article_images IS 'Stores multiple images per article with positioning, captions, and usage context';
COMMENT ON COLUMN article_images.position IS 'Order in article: 0 = featured image, 1+ = inline images';
COMMENT ON COLUMN article_images.usage_context IS 'Where image is used: featured, inline, gallery, sidebar, banner';
