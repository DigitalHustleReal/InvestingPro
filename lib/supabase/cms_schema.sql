-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. AUTHORS Table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Editor',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ARTICLES Table (Content Heavy)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT, -- Rich Text / HTML / Markdown
    featured_image TEXT,
    
    -- SEO Metadata
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[], -- Array of strings
    
    -- Status
    status TEXT DEFAULT 'draft', -- 'published', 'draft', 'archived'
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Relations
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Stats
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Speed
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published_at);
CREATE INDEX idx_articles_category ON articles(category_id);

-- RLS Policies (Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Public articles are viewable by everyone" 
ON articles FOR SELECT 
USING (status = 'published');

-- Allow editors (authenticated) to do everything
CREATE POLICY "Editors can do everything" 
ON articles FOR ALL 
USING (auth.role() = 'authenticated');
