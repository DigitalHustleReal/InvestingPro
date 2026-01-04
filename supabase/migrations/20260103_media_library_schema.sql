-- ============================================================================
-- MEDIA LIBRARY SYSTEM
-- Complete image upload, management, and organization system
-- ============================================================================

-- Media files table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- File information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path in Supabase Storage (e.g., 'images/123-photo.jpg')
    public_url TEXT NOT NULL,
    
    -- File metadata
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- bytes
    width INTEGER,
    height INTEGER,
    
    -- Content metadata
    alt_text TEXT,
    caption TEXT,
    title TEXT,
    description TEXT,
    
    -- Organization
    folder TEXT DEFAULT 'uncategorized', -- For organizing media
    tags TEXT[], -- Array of tags for filtering
    
    -- Usage tracking
    used_in_articles TEXT[], -- Array of article IDs using this image
    usage_count INTEGER DEFAULT 0,
    
    -- Upload information
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_tags ON public.media USING GIN(tags);

-- Full-text search on media
CREATE INDEX IF NOT EXISTS idx_media_search ON public.media 
    USING GIN(to_tsvector('english', 
        COALESCE(original_filename, '') || ' ' || 
        COALESCE(alt_text, '') || ' ' || 
        COALESCE(caption, '') || ' ' ||
        COALESCE(title, '')
    ));

-- RLS Policies
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Public can view all media
CREATE POLICY "Public can view media" ON public.media
    FOR SELECT USING (true);

-- Authenticated users can upload
CREATE POLICY "Authenticated can upload media" ON public.media
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own uploads or admins can update any
CREATE POLICY "Users can update own media" ON public.media
    FOR UPDATE USING (
        uploaded_by = auth.uid() OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Users can delete their own uploads or admins can delete any
CREATE POLICY "Users can delete own media" ON public.media
    FOR DELETE USING (
        uploaded_by = auth.uid() OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- ============================================================================
-- MEDIA FOLDERS (Optional - for organization)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_folders_parent ON public.media_folders(parent_id);

-- RLS
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view folders" ON public.media_folders
    FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage folders" ON public.media_folders
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default folders
INSERT INTO public.media_folders (name, slug, description) VALUES
    ('Featured Images', 'featured-images', 'Featured images for articles'),
    ('Blog Content', 'blog-content', 'Images used in blog post content'),
    ('Icons', 'icons', 'Icon images'),
    ('Logos', 'logos', 'Brand and partner logos'),
    ('Thumbnails', 'thumbnails', 'Thumbnail images')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update media usage when used in article
CREATE OR REPLACE FUNCTION update_media_usage(
    p_media_id UUID,
    p_article_id TEXT,
    p_action TEXT -- 'add' or 'remove'
) RETURNS VOID AS $$
BEGIN
    IF p_action = 'add' THEN
        UPDATE public.media
        SET 
            used_in_articles = array_append(used_in_articles, p_article_id),
            usage_count = usage_count + 1,
            updated_at = NOW()
        WHERE id = p_media_id
        AND NOT (p_article_id = ANY(used_in_articles));
    ELSIF p_action = 'remove' THEN
        UPDATE public.media
        SET 
            used_in_articles = array_remove(used_in_articles, p_article_id),
            usage_count = GREATEST(usage_count - 1, 0),
            updated_at = NOW()
        WHERE id = p_media_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to search media (full-text + filters)
CREATE OR REPLACE FUNCTION search_media(
    p_query TEXT DEFAULT NULL,
    p_folder TEXT DEFAULT NULL,
    p_mime_type TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
) RETURNS SETOF public.media AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.media
    WHERE 
        (p_query IS NULL OR 
         to_tsvector('english', 
            COALESCE(original_filename, '') || ' ' || 
            COALESCE(alt_text, '') || ' ' || 
            COALESCE(caption, '')
         ) @@ plainto_tsquery('english', p_query))
    AND (p_folder IS NULL OR folder = p_folder)
    AND (p_mime_type IS NULL OR mime_type LIKE p_mime_type || '%')
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STORAGE BUCKET SETUP INSTRUCTIONS
-- ============================================================================

-- After running this migration, manually create storage bucket in Supabase Dashboard:
-- 
-- 1. Go to Storage → New Bucket
-- 2. Name: "media"
-- 3. Public: Yes
-- 4. File size limit: 10MB
-- 5. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
--
-- 6. Add Storage Policies:
--
-- Policy 1 - Public Read:
-- bucket_id = 'media'
--
-- Policy 2 - Authenticated Upload:
-- bucket_id = 'media' AND auth.role() = 'authenticated'
--
-- Policy 3 - Authenticated Delete (own files or admin):
-- bucket_id = 'media' AND (
--   storage.foldername(name)[1] = auth.uid()::text OR
--   auth.jwt() ->> 'role' = 'admin'
-- )

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================

-- Test: Insert sample media record
-- INSERT INTO public.media (filename, original_filename, file_path, public_url, mime_type, file_size, width, height, alt_text)
-- VALUES ('test-123.jpg', 'test.jpg', 'images/test-123.jpg', 'https://your-project.supabase.co/storage/v1/object/public/media/images/test-123.jpg', 'image/jpeg', 102400, 1920, 1080, 'Test image');

-- Test: Search media
-- SELECT * FROM search_media('test');

-- Test: List recent uploads
-- SELECT filename, original_filename, file_size, created_at FROM media ORDER BY created_at DESC LIMIT 10;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary:
-- ✅ media table created with full metadata
-- ✅ media_folders table for organization
-- ✅ RLS policies configured
-- ✅ Indexes for performance
-- ✅ Full-text search enabled
-- ✅ Helper functions for usage tracking
-- ✅ Ready for Supabase Storage integration
