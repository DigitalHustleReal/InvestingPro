-- Article Versioning System
-- Creates version tracking table and functions for article versioning and rollback

-- Create article_versions table
CREATE TABLE IF NOT EXISTS article_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    
    -- Store full article state as JSONB
    content JSONB NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    change_summary TEXT, -- Optional summary of what changed
    
    -- Ensure unique version numbers per article
    UNIQUE(article_id, version_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_versions_article_id ON article_versions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_versions_version_number ON article_versions(article_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_article_versions_created_at ON article_versions(created_at DESC);

-- RLS Policies
ALTER TABLE article_versions ENABLE ROW LEVEL SECURITY;

-- Admins can view all versions
CREATE POLICY "Admins can view all versions"
ON article_versions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

-- Authors can view versions of their own articles
CREATE POLICY "Authors can view own article versions"
ON article_versions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM articles
        WHERE articles.id = article_versions.article_id
        AND articles.author_id = auth.uid()
    )
);

-- Service role can manage all versions
CREATE POLICY "Service role can manage all versions"
ON article_versions FOR ALL
USING (true)
WITH CHECK (true);

-- Function to create a version snapshot
CREATE OR REPLACE FUNCTION create_article_version(
    p_article_id UUID,
    p_created_by UUID DEFAULT NULL,
    p_change_summary TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_version_number INTEGER;
    v_article_data JSONB;
    v_version_id UUID;
BEGIN
    -- Get the next version number
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO v_version_number
    FROM article_versions
    WHERE article_id = p_article_id;

    -- Get current article data as JSONB
    SELECT to_jsonb(a.*)
    INTO v_article_data
    FROM articles a
    WHERE a.id = p_article_id;

    -- If article doesn't exist, raise error
    IF v_article_data IS NULL THEN
        RAISE EXCEPTION 'Article not found: %', p_article_id;
    END IF;

    -- Create version record
    INSERT INTO article_versions (
        article_id,
        version_number,
        content,
        created_by,
        change_summary
    ) VALUES (
        p_article_id,
        v_version_number,
        v_article_data,
        COALESCE(p_created_by, auth.uid()),
        p_change_summary
    )
    RETURNING id INTO v_version_id;

    RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore article from version
CREATE OR REPLACE FUNCTION restore_article_from_version(
    p_article_id UUID,
    p_version_number INTEGER
) RETURNS UUID AS $$
DECLARE
    v_version_data JSONB;
    v_restored_version_id UUID;
BEGIN
    -- Get version data
    SELECT content
    INTO v_version_data
    FROM article_versions
    WHERE article_id = p_article_id
    AND version_number = p_version_number;

    -- If version doesn't exist, raise error
    IF v_version_data IS NULL THEN
        RAISE EXCEPTION 'Version % not found for article %', p_version_number, p_article_id;
    END IF;

    -- Create a new version before restoring (so we can rollback the rollback)
    SELECT create_article_version(p_article_id, auth.uid(), format('Rollback to version %s', p_version_number))
    INTO v_restored_version_id;

    -- Restore article fields from version
    UPDATE articles
    SET
        title = (v_version_data->>'title')::TEXT,
        slug = (v_version_data->>'slug')::TEXT,
        excerpt = (v_version_data->>'excerpt')::TEXT,
        content = (v_version_data->>'content')::TEXT,
        category = (v_version_data->>'category')::TEXT,
        language = (v_version_data->>'language')::TEXT,
        tags = ARRAY(SELECT jsonb_array_elements_text(v_version_data->'tags')),
        featured_image = (v_version_data->>'featured_image')::TEXT,
        read_time = (v_version_data->>'read_time')::NUMERIC,
        author_id = (v_version_data->>'author_id')::UUID,
        author_name = (v_version_data->>'author_name')::TEXT,
        author_email = (v_version_data->>'author_email')::TEXT,
        status = (v_version_data->>'status')::TEXT,
        published_date = (v_version_data->>'published_date')::TIMESTAMP WITH TIME ZONE,
        seo_title = (v_version_data->>'seo_title')::TEXT,
        seo_description = (v_version_data->>'seo_description')::TEXT,
        ai_generated = (v_version_data->>'ai_generated')::BOOLEAN,
        views = COALESCE((v_version_data->>'views')::INTEGER, 0),
        updated_at = NOW()
    WHERE id = p_article_id;

    RETURN v_restored_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create version on article update
CREATE OR REPLACE FUNCTION auto_create_article_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create version if article actually changed (not just updated_at)
    IF OLD.title IS DISTINCT FROM NEW.title
       OR OLD.content IS DISTINCT FROM NEW.content
       OR OLD.excerpt IS DISTINCT FROM NEW.excerpt
       OR OLD.status IS DISTINCT FROM NEW.status
       OR OLD.category IS DISTINCT FROM NEW.category
       OR OLD.tags IS DISTINCT FROM NEW.tags
       OR OLD.seo_title IS DISTINCT FROM NEW.seo_title
       OR OLD.seo_description IS DISTINCT FROM NEW.seo_description
    THEN
        -- Create version snapshot
        PERFORM create_article_version(
            NEW.id,
            auth.uid(),
            NULL -- Auto-generated change summary could be added here
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_create_article_version ON articles;
CREATE TRIGGER trigger_auto_create_article_version
AFTER UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION auto_create_article_version();

-- Function to get version history for an article
CREATE OR REPLACE FUNCTION get_article_version_history(
    p_article_id UUID,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id UUID,
    version_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_by_name TEXT,
    change_summary TEXT,
    content_preview JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        av.id,
        av.version_number,
        av.created_at,
        av.created_by,
        up.name as created_by_name,
        av.change_summary,
        jsonb_build_object(
            'title', av.content->>'title',
            'status', av.content->>'status',
            'updated_at', av.content->>'updated_at'
        ) as content_preview
    FROM article_versions av
    LEFT JOIN user_profiles up ON up.id = av.created_by
    WHERE av.article_id = p_article_id
    ORDER BY av.version_number DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE article_versions IS 'Stores version history for articles, enabling rollback functionality';
COMMENT ON FUNCTION create_article_version IS 'Creates a new version snapshot of an article';
COMMENT ON FUNCTION restore_article_from_version IS 'Restores an article to a specific version, creating a new version in the process';
COMMENT ON FUNCTION get_article_version_history IS 'Returns version history for an article with pagination';
