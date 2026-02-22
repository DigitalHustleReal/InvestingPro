-- Enable RLS on articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all articles (or just published ones, but for admin we need all)
CREATE POLICY "Enable read access for all users" ON public.articles
    FOR SELECT USING (true);

-- Policy to allow authenticated users to insert articles
CREATE POLICY "Enable insert for authenticated users" ON public.articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow users to update their own articles (or all if admin)
-- For simplicity in this admin app, we'll allow authenticated users to update any article
CREATE POLICY "Enable update for authenticated users" ON public.articles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy to allow users to delete articles
CREATE POLICY "Enable delete for authenticated users" ON public.articles
    FOR DELETE USING (auth.role() = 'authenticated');
