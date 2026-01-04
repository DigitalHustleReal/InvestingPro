-- AUTHORS TEAM SCHEMA

-- DROP TABLE ensures fresh schema with 'expertise' column if table existed differently
DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role TEXT CHECK (role IN ('editor', 'writer', 'analyst', 'contributor')),
    bio TEXT,
    photo_url TEXT,
    location TEXT,
    expertise TEXT[], -- ['Banking', 'Credit Cards']
    social_links JSONB DEFAULT '{}'::jsonb, -- { "linkedin": "...", "twitter": "..." }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

-- Allow public read access
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public authors read" ON authors FOR SELECT USING (true);
CREATE POLICY "Admin authors write" ON authors FOR ALL USING (auth.role() = 'authenticated');

-- SEED DATA: 16 FICTITIOUS INDIAN PERSONAS
INSERT INTO authors (name, slug, role, location, bio, expertise, social_links)
VALUES 
-- EDITORS
('Rajesh Mehta', 'rajesh-mehta', 'editor', 'Bengaluru', 'Rajesh is a seasoned financial editor with over 15 years of experience in banking and equity research. Former Vice President at a leading private bank.', ARRAY['Banking', 'Equities'], '{"linkedin": "https://linkedin.com/in/rajesh-mehta-fict", "twitter": "@rajesh_fin"}'),
('Dr. Meera Iyer', 'dr-meera-iyer', 'editor', 'Chennai', 'Ph.D. in Economics. Dr. Meera specializes in macroeconomic trends and their impact on personal savings. She simplifies complex policy changes for everyday investors.', ARRAY['Economics', 'Policy'], '{"linkedin": "https://linkedin.com/in/meera-iyer-phd"}'),
('Harpreet Kaur', 'harpreet-kaur', 'editor', 'Chandigarh', 'Harpreet brings a decade of experience in insurance and risk management. She is passionate about helping families secure their financial future.', ARRAY['Insurance', 'Term Life'], '{"twitter": "@harpreet_insure"}'),
('Thomas Fernandes', 'thomas-fernandes', 'editor', 'Goa', 'An expert in global markets and taxation. Thomas helps NRIs and investors navigate cross-border taxation and investment opportunities.', ARRAY['Taxation', 'Global Markets'], '{}'),
('Nandini Reddy', 'nandini-reddy', 'editor', 'Hyderabad', 'Nandini is a tech-savvy financial analyst focusing on Fintech, UPI, and Digital Lending trends in India.', ARRAY['Fintech', 'Digital Payments'], '{"linkedin": "https://linkedin.com"}'),
('Amit Desai', 'amit-desai', 'editor', 'Mumbai', 'Amit has covered the Indian stock market for major financial dailies. He leads our equity research desk.', ARRAY['Stocks', 'Mutual Funds'], '{}'),
('Deepika Singh', 'deepika-singh', 'editor', 'Delhi', 'Deepika is a consumer finance advocate, specializing in credit cards and rewards optimization.', ARRAY['Credit Cards', 'Rewards'], '{}'),
('Karthik Menon', 'karthik-menon', 'editor', 'Kerala', 'Karthik is a wealth management expert focusing on retirement planning and passive income strategies.', ARRAY['Retirement', 'Passive Income'], '{}'),

-- WRITERS
('Arjun Sharma', 'arjun-sharma', 'writer', 'Mumbai', 'Arjun writes about credit cards and travel hacking. He has visited 30 countries using miles and points.', ARRAY['Credit Cards', 'Travel'], '{}'),
('Priya Menon', 'priya-menon', 'writer', 'Kerala', 'Priya simplifies home loans and real estate investing for first-time homebuyers.', ARRAY['Home Loans', 'Real Estate'], '{}'),
('Vikram Singh', 'vikram-singh', 'writer', 'Rajasthan', 'Vikram covers gold, commodities, and traditional Indian investment avenues.', ARRAY['Gold', 'Commodities'], '{}'),
('Aisha Khan', 'aisha-khan', 'writer', 'Hyderabad', 'Aisha focuses on education loans and student finance, helping the next generation manage debt.', ARRAY['Loans', 'Education'], '{}'),
('Suresh Patel', 'suresh-patel', 'writer', 'Gujarat', 'Suresh is a small business expert, writing about MSME loans and business banking.', ARRAY['Business Loans', 'MSME'], '{}'),
('Anjali Deshmukh', 'anjali-deshmukh', 'writer', 'Pune', 'Anjali covers the mutual fund industry, tracking fund performance and manager changes.', ARRAY['Mutual Funds', 'SIP'], '{}'),
('Kavita Sharma', 'kavita-sharma', 'writer', 'Delhi', 'Kavita writes about saving hacks, budgeting, and frugal living in metro cities.', ARRAY['Budgeting', 'Savings'], '{}'),
('Rahul Chatterjee', 'rahul-chatterjee', 'writer', 'Kolkata', 'Rahul is a crypto and blockchain enthusiast, covering the regulatory landscape of digital assets.', ARRAY['Crypto', 'Blockchain'], '{}')

ON CONFLICT (slug) DO UPDATE SET 
    bio = EXCLUDED.bio,
    expertise = EXCLUDED.expertise;

-- Auto-generate avatars for seeds
UPDATE authors 
SET photo_url = format('https://api.dicebear.com/7.x/avataaars/svg?seed=%s&backgroundColor=c0ebff', slug)
WHERE photo_url IS NULL;

-- Add display_author_id to articles to link to this table safely
DO $$ 
BEGIN 
    -- 1. Add column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'display_author_id') THEN 
        ALTER TABLE articles ADD COLUMN display_author_id UUID;
    END IF;

    -- 2. Ensure Constraint is fresh (drop old if exists)
    ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_display_author_id_fkey;
    
    -- 3. Add Constraint
    ALTER TABLE articles ADD CONSTRAINT articles_display_author_id_fkey FOREIGN KEY (display_author_id) REFERENCES authors(id) ON DELETE SET NULL;
END $$;
