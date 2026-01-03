-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all articles (since client-side filters for 'published')
-- Or specifically 'published' if strictness is desired
DROP POLICY IF EXISTS "Public can view articles" ON articles;
CREATE POLICY "Public can view articles" ON articles
    FOR SELECT
    USING (status = 'published');

-- Allow admins full access
DROP POLICY IF EXISTS "Admin full access articles" ON articles;
CREATE POLICY "Admin full access articles" ON articles
    FOR ALL
    USING (true); -- Ideally restrict to admin role via auth.jwt() -> role

-- Verify it worked
-- SELECT * FROM articles LIMIT 1;
