-- Production Safety: Soft Delete Implementation
-- Prevents accidental permanent data loss

-- Add soft delete columns to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at) WHERE deleted_at IS NOT NULL;

-- Create soft delete function
CREATE OR REPLACE FUNCTION soft_delete_article()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent hard delete, convert to soft delete
    IF TG_OP = 'DELETE' THEN
        UPDATE articles
        SET 
            deleted_at = NOW(),
            deleted_by = auth.uid()
        WHERE id = OLD.id;
        
        -- Cancel the DELETE operation
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS prevent_hard_delete_articles ON articles;
CREATE TRIGGER prevent_hard_delete_articles
BEFORE DELETE ON articles
FOR EACH ROW
EXECUTE FUNCTION soft_delete_article();

-- Create view for active articles (excludes deleted)
CREATE OR REPLACE VIEW articles_active AS
SELECT * FROM articles WHERE deleted_at IS NULL;

-- Create restore function
CREATE OR REPLACE FUNCTION restore_article(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE articles
    SET deleted_at = NULL, deleted_by = NULL
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON COLUMN articles.deleted_at IS 'Soft delete timestamp - article is hidden but not permanently deleted';
COMMENT ON COLUMN articles.deleted_by IS 'User who deleted the article';
COMMENT ON FUNCTION restore_article IS 'Restore a soft-deleted article';
COMMENT ON VIEW articles_active IS 'View of non-deleted articles';
