-- Archive Tables for Data Retention
-- Creates archive tables for historical data storage

-- Archive table for articles
CREATE TABLE IF NOT EXISTS articles_archive (
    id UUID PRIMARY KEY,
    original_id UUID NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT,
    body_html TEXT,
    body_markdown TEXT,
    excerpt TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT,
    published_at TIMESTAMPTZ,
    published_date DATE,
    author_id UUID,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    archive_metadata JSONB DEFAULT '{}'::jsonb,
    -- Store full article data as JSONB for complete archival
    full_data JSONB
);

-- Indexes for archive table
CREATE INDEX IF NOT EXISTS idx_articles_archive_original_id ON articles_archive(original_id);
CREATE INDEX IF NOT EXISTS idx_articles_archive_archived_at ON articles_archive(archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_archive_published_at ON articles_archive(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_archive_category ON articles_archive(category);

-- Archive table for workflow instances
CREATE TABLE IF NOT EXISTS workflow_instances_archive (
    id UUID PRIMARY KEY,
    original_id UUID NOT NULL,
    workflow_id TEXT NOT NULL,
    workflow_version TEXT NOT NULL,
    state TEXT NOT NULL,
    current_step TEXT,
    completed_steps TEXT[],
    failed_steps TEXT[],
    context JSONB,
    result JSONB,
    error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    archive_metadata JSONB DEFAULT '{}'::jsonb,
    -- Store full workflow data as JSONB
    full_data JSONB
);

-- Indexes for workflow archive
CREATE INDEX IF NOT EXISTS idx_workflow_archive_original_id ON workflow_instances_archive(original_id);
CREATE INDEX IF NOT EXISTS idx_workflow_archive_archived_at ON workflow_instances_archive(archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_archive_workflow_id ON workflow_instances_archive(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_archive_state ON workflow_instances_archive(state);

-- Function to archive an article
CREATE OR REPLACE FUNCTION archive_article(article_uuid UUID)
RETURNS UUID AS $$
DECLARE
    archived_id UUID;
BEGIN
    INSERT INTO articles_archive (
        id,
        original_id,
        title,
        slug,
        content,
        body_html,
        body_markdown,
        excerpt,
        category,
        tags,
        status,
        published_at,
        published_date,
        author_id,
        views,
        created_at,
        updated_at,
        archived_at,
        archive_metadata,
        full_data
    )
    SELECT
        gen_random_uuid(),
        id,
        title,
        slug,
        content,
        body_html,
        body_markdown,
        excerpt,
        category,
        tags,
        status,
        published_at,
        published_date,
        author_id,
        views,
        created_at,
        updated_at,
        NOW(),
        jsonb_build_object(
            'archived_by', 'retention_policy',
            'archive_reason', 'age_threshold'
        ),
        to_jsonb(a.*)
    FROM articles a
    WHERE a.id = article_uuid
    RETURNING id INTO archived_id;

    RETURN archived_id;
END;
$$ LANGUAGE plpgsql;

-- Function to archive a workflow instance
CREATE OR REPLACE FUNCTION archive_workflow_instance(workflow_uuid UUID)
RETURNS UUID AS $$
DECLARE
    archived_id UUID;
BEGIN
    INSERT INTO workflow_instances_archive (
        id,
        original_id,
        workflow_id,
        workflow_version,
        state,
        current_step,
        completed_steps,
        failed_steps,
        context,
        result,
        error,
        started_at,
        completed_at,
        metadata,
        created_at,
        updated_at,
        archived_at,
        archive_metadata,
        full_data
    )
    SELECT
        gen_random_uuid(),
        id,
        workflow_id,
        workflow_version,
        state,
        current_step,
        completed_steps,
        failed_steps,
        context,
        result,
        error,
        started_at,
        completed_at,
        metadata,
        created_at,
        updated_at,
        NOW(),
        jsonb_build_object(
            'archived_by', 'retention_policy',
            'archive_reason', 'age_threshold'
        ),
        to_jsonb(w.*)
    FROM workflow_instances w
    WHERE w.id = workflow_uuid
    RETURNING id INTO archived_id;

    RETURN archived_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore an archived article
CREATE OR REPLACE FUNCTION restore_archived_article(archive_uuid UUID)
RETURNS UUID AS $$
DECLARE
    restored_id UUID;
BEGIN
    INSERT INTO articles (
        id,
        title,
        slug,
        content,
        body_html,
        body_markdown,
        excerpt,
        category,
        tags,
        status,
        published_at,
        published_date,
        author_id,
        views,
        created_at,
        updated_at
    )
    SELECT
        original_id,
        title,
        slug,
        content,
        body_html,
        body_markdown,
        excerpt,
        category,
        tags,
        status,
        published_at,
        published_date,
        author_id,
        views,
        created_at,
        updated_at
    FROM articles_archive
    WHERE id = archive_uuid
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        content = EXCLUDED.content,
        body_html = EXCLUDED.body_html,
        body_markdown = EXCLUDED.body_markdown,
        excerpt = EXCLUDED.excerpt,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        status = EXCLUDED.status,
        published_at = EXCLUDED.published_at,
        published_date = EXCLUDED.published_date,
        author_id = EXCLUDED.author_id,
        views = EXCLUDED.views,
        updated_at = NOW()
    RETURNING id INTO restored_id;

    -- Delete from archive after restore
    DELETE FROM articles_archive WHERE id = archive_uuid;

    RETURN restored_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE articles_archive IS 'Archived articles moved from main articles table for long-term storage';
COMMENT ON TABLE workflow_instances_archive IS 'Archived workflow instances moved from main workflow_instances table';
COMMENT ON FUNCTION archive_article IS 'Archives an article to the archive table';
COMMENT ON FUNCTION archive_workflow_instance IS 'Archives a workflow instance to the archive table';
COMMENT ON FUNCTION restore_archived_article IS 'Restores an archived article back to the main articles table';

-- Enable RLS on archive tables
ALTER TABLE articles_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances_archive ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can read archive tables
CREATE POLICY "Admin users can read articles archive"
    ON articles_archive
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin users can read workflow archive"
    ON workflow_instances_archive
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Service role can insert/delete (for archival script)
CREATE POLICY "Service role can manage articles archive"
    ON articles_archive
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can manage workflow archive"
    ON workflow_instances_archive
    FOR ALL
    USING (true)
    WITH CHECK (true);
