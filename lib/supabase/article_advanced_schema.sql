-- Advanced Articles Table (Supports Editorial + User Submissions)
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Content
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown or HTML
    
    -- Classification
    category TEXT NOT NULL CHECK (category IN ('mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics')),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu')),
    tags TEXT[],
    
    -- Media
    featured_image TEXT,
    read_time NUMERIC, -- Minutes
    
    -- Authorship & Moderation
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to registered user
    author_name TEXT, -- Display name (could be user's name or guest name)
    author_email TEXT, -- Private field for contacting guest authors
    
    is_user_submission BOOLEAN DEFAULT FALSE,
    submission_status TEXT DEFAULT 'approved' CHECK (submission_status IN ('pending', 'approved', 'rejected', 'revision-requested')),
    rejection_reason TEXT,
    
    -- Publishing Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_date TIMESTAMP WITH TIME ZONE,
    
    -- Analytics & Tech
    views INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT FALSE,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    
    -- Monetization
    affiliate_products TEXT[], -- Array of affiliate_product_ids to display sidebar/inline ads
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_submission ON articles(submission_status);

-- RLS Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 1. Public can view PUBLISHED and APPROVED articles
CREATE POLICY "Public can view published articles" 
ON articles FOR SELECT 
USING (status = 'published' AND submission_status = 'approved');

-- 2. Authenticated Users can CREATE articles (Submit for review)
CREATE POLICY "Users can submit articles" 
ON articles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. Users can VIEW their own submissions (even if pending)
CREATE POLICY "Users can view own submissions" 
ON articles FOR SELECT 
USING (auth.uid() = author_id);

-- 4. Users can UPDATE their own submissions (if not yet published)
CREATE POLICY "Users can edit own drafts" 
ON articles FOR UPDATE 
USING (auth.uid() = author_id AND status = 'draft');

-- 5. Admins have full access
CREATE POLICY "Admins can manage articles" 
ON articles FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
