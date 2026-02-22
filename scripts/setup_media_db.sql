-- Create the media table (matching MediaService implementation)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT,
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    title TEXT,
    description TEXT,
    folder TEXT DEFAULT 'uploads',
    tags TEXT[],
    used_in_articles TEXT[],
    usage_count INTEGER DEFAULT 0,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all for authenticated users" ON public.media
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users" ON public.media
    FOR SELECT USING (true);

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

