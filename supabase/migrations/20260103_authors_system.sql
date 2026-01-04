-- Authors & Editors Management System
-- Integrates AI personas into CMS with category assignments

-- Authors table
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL, -- 'author' or 'editor'
    title TEXT NOT NULL, -- e.g., "Senior Financial Writer"
    bio TEXT NOT NULL,
    credentials TEXT[], -- e.g., ["MBA Finance", "CA", "CFA"]
    expertise_areas TEXT[], -- e.g., ["Banking", "Investments", "Insurance"]
    
    -- Social media
    linkedin_url TEXT,
    twitter_handle TEXT,
    instagram_handle TEXT,
    medium_url TEXT,
    
    -- Profile
    photo_url TEXT,
    email TEXT,
    location TEXT,
    years_experience INTEGER,
    
    -- AI Configuration
    is_ai_persona BOOLEAN DEFAULT true,
    ai_system_prompt TEXT, -- Custom system prompt for this author
    ai_model TEXT DEFAULT 'gpt-4', -- AI model to use
    
    -- Category Assignments
    assigned_categories TEXT[], -- Categories this author covers
    primary_category TEXT, -- Main category
    
    -- Stats
    total_articles INTEGER DEFAULT 0,
    total_glossary_terms INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Status
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);
CREATE INDEX IF NOT EXISTS idx_authors_role ON public.authors(role);
CREATE INDEX IF NOT EXISTS idx_authors_active ON public.authors(active);
CREATE INDEX IF NOT EXISTS idx_authors_categories ON public.authors USING GIN(assigned_categories);

-- RLS Policies
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active authors" ON public.authors
    FOR SELECT USING (active = true);

CREATE POLICY "Service role full access on authors" ON public.authors
    FOR ALL USING (true);

---

-- Update glossary_terms to include author/editor
ALTER TABLE public.glossary_terms 
    ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.authors(id),
    ADD COLUMN IF NOT EXISTS editor_id UUID REFERENCES public.authors(id),
    ADD COLUMN IF NOT EXISTS author_name TEXT, -- Denormalized for performance
    ADD COLUMN IF NOT EXISTS editor_name TEXT;

CREATE INDEX IF NOT EXISTS idx_glossary_author ON public.glossary_terms(author_id);
CREATE INDEX IF NOT EXISTS idx_glossary_editor ON public.glossary_terms(editor_id);

---

-- Update blog_posts to include author/editor
ALTER TABLE public.blog_posts 
    ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.authors(id),
    ADD COLUMN IF NOT EXISTS editor_id UUID REFERENCES public.authors(id),
    ADD COLUMN IF NOT EXISTS author_name TEXT,
    ADD COLUMN IF NOT EXISTS editor_name TEXT;

CREATE INDEX IF NOT EXISTS idx_blog_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_editor ON public.blog_posts(editor_id);

---

-- Content Assignment Log
CREATE TABLE IF NOT EXISTS public.content_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL, -- 'glossary_term', 'blog_post', 'comparison'
    content_id UUID NOT NULL,
    author_id UUID REFERENCES public.authors(id),
    editor_id UUID REFERENCES public.authors(id),
    category TEXT NOT NULL,
    
    -- Workflow
    status TEXT DEFAULT 'assigned', -- assigned, drafted, reviewed, approved, published
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    drafted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Quality
    quality_score INTEGER, -- 0-100
    revision_count INTEGER DEFAULT 0,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_content ON public.content_assignments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_assignments_author ON public.content_assignments(author_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.content_assignments(status);

---

-- Author Stats View
CREATE OR REPLACE VIEW public.author_stats AS
SELECT 
    a.id,
    a.name,
    a.role,
    COUNT(DISTINCT CASE WHEN gt.id IS NOT NULL THEN gt.id END) as glossary_count,
    COUNT(DISTINCT CASE WHEN bp.id IS NOT NULL THEN bp.id END) as blog_count,
    AVG(CASE WHEN gt.id IS NOT NULL THEN gt.views_count END) as avg_glossary_views,
    AVG(CASE WHEN bp.id IS NOT NULL THEN bp.views_count END) as avg_blog_views
FROM public.authors a
LEFT JOIN public.glossary_terms gt ON gt.author_id = a.id
LEFT JOIN public.blog_posts bp ON bp.author_id = a.id
WHERE a.active = true
GROUP BY a.id, a.name, a.role;

---

-- Insert default AI personas
INSERT INTO public.authors (
    name,
    slug,
    role,
    title,
    bio,
    credentials,
    expertise_areas,
    linkedin_url,
    twitter_handle,
    instagram_handle,
    location,
    years_experience,
    is_ai_persona,
    ai_system_prompt,
    assigned_categories,
    primary_category,
    featured,
    photo_url
) VALUES 
(
    'Arjun Sharma',
    'arjun-sharma',
    'author',
    'Senior Financial Content Writer',
    'Passionate about financial literacy in India. I break down complex banking, investment, and insurance concepts into simple, actionable advice for everyday Indians. 8+ years covering credit cards, loans, mutual funds, and insurance. Chartered Accountant with MBA from IIM.',
    ARRAY['MBA Finance - IIM Ahmedabad', 'Chartered Accountant (CA)', '8+ Years Experience'],
    ARRAY['Banking', 'Credit Cards', 'Loans', 'Investments', 'Insurance', 'Tax Planning'],
    'https://linkedin.com/in/arjun-sharma-finance',
    '@ArjunFinanceIN',
    '@arjunsharma.finance',
    'Mumbai, India',
    8,
    true,
    'You are Arjun Sharma, a Senior Financial Content Writer with 8+ years of experience covering Indian financial markets. You hold an MBA in Finance from IIM and are a qualified Chartered Accountant (CA). Your writing style is conversational, friendly, and educational. You use simple language, Indian context (₹, Indian banks), and relatable examples.',
    ARRAY['credit-cards', 'loans', 'investing', 'banking', 'taxes', 'small-business'],
    'credit-cards',
    true,
    '/images/authors/arjun-sharma.jpg'
),
(
    'Rajesh Mehta',
    'rajesh-mehta',
    'editor',
    'Chief Content Editor & CFA Charterholder',
    'Ensuring accuracy and compliance in financial content for over a decade. As Chief Editor at InvestingPro, I oversee fact-checking, regulatory compliance, and quality standards. My goal is to make financial information accessible, accurate, and actionable for Indian consumers.',
    ARRAY['CFA Charterholder', '12+ Years Publishing Experience', 'Former Editor @ MoneyControl'],
    ARRAY['Regulatory Compliance', 'Financial Analysis', 'Fact-Checking', 'RBI/SEBI/IRDAI Guidelines', 'Quality Assurance'],
    'https://linkedin.com/in/rajesh-mehta-cfa',
    '@RajeshMehta_CFA',
    NULL,
    'Bengaluru, India',
    12,
    true,
    'You are Rajesh Mehta, Chief Content Editor with 12+ years in financial publishing and a CFA charter. Your editing style is professional, authoritative, and data-driven. You focus on accuracy, regulatory compliance, and clarity. You reference RBI/SEBI/IRDAI guidelines when relevant.',
    ARRAY['credit-cards', 'loans', 'investing', 'ipo', 'insurance', 'banking', 'taxes', 'small-business'],
    'banking',
    true,
    '/images/authors/rajesh-mehta.jpg'
)
ON CONFLICT (slug) DO NOTHING;

---

-- Function to auto-assign author based on category
CREATE OR REPLACE FUNCTION assign_author_by_category(
    p_category TEXT,
    p_content_type TEXT DEFAULT 'glossary_term'
) RETURNS UUID AS $$
DECLARE
    v_author_id UUID;
BEGIN
    -- Try to find author specialized in this category
    SELECT id INTO v_author_id
    FROM public.authors
    WHERE role = 'author'
      AND active = true
      AND p_category = ANY(assigned_categories)
    ORDER BY 
        CASE WHEN primary_category = p_category THEN 0 ELSE 1 END,
        total_articles ASC
    LIMIT 1;
    
    -- If no specialized author, get any active author
    IF v_author_id IS NULL THEN
        SELECT id INTO v_author_id
        FROM public.authors
        WHERE role = 'author' AND active = true
        ORDER BY total_articles ASC
        LIMIT 1;
    END IF;
    
    RETURN v_author_id;
END;
$$ LANGUAGE plpgsql;

---

-- Function to auto-assign editor
CREATE OR REPLACE FUNCTION assign_editor() RETURNS UUID AS $$
DECLARE
    v_editor_id UUID;
BEGIN
    -- Get editor with least reviews (load balancing)
    SELECT id INTO v_editor_id
    FROM public.authors
    WHERE role = 'editor' AND active = true
    ORDER BY total_reviews ASC
    LIMIT 1;
    
    RETURN v_editor_id;
END;
$$ LANGUAGE plpgsql;

---

-- Trigger to auto-assign authors to new glossary terms
CREATE OR REPLACE FUNCTION auto_assign_glossary_author() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.author_id IS NULL THEN
        NEW.author_id := assign_author_by_category(NEW.category);
        SELECT name INTO NEW.author_name FROM public.authors WHERE id = NEW.author_id;
    END IF;
    
    IF NEW.editor_id IS NULL THEN
        NEW.editor_id := assign_editor();
        SELECT name INTO NEW.editor_name FROM public.authors WHERE id = NEW.editor_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_assign_glossary_author
    BEFORE INSERT ON public.glossary_terms
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_glossary_author();

---

-- Trigger to auto-assign authors to new blog posts
CREATE OR REPLACE FUNCTION auto_assign_blog_author() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.author_id IS NULL THEN
        NEW.author_id := assign_author_by_category(NEW.category, 'blog_post');
        SELECT name INTO NEW.author_name FROM public.authors WHERE id = NEW.author_id;
    END IF;
    
    IF NEW.editor_id IS NULL THEN
        NEW.editor_id := assign_editor();
        SELECT name INTO NEW.editor_name FROM public.authors WHERE id = NEW.editor_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_assign_blog_author
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_blog_author();

---

-- Update author stats when content is published
CREATE OR REPLACE FUNCTION update_author_stats() 
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'glossary_terms' AND NEW.published = true THEN
        UPDATE public.authors 
        SET total_glossary_terms = total_glossary_terms + 1
        WHERE id = NEW.author_id;
        
        UPDATE public.authors 
        SET total_reviews = total_reviews + 1
        WHERE id = NEW.editor_id;
    END IF;
    
    IF TG_TABLE_NAME = 'blog_posts' AND NEW.published = true THEN
        UPDATE public.authors 
        SET total_articles = total_articles + 1
        WHERE id = NEW.author_id;
        
        UPDATE public.authors 
        SET total_reviews = total_reviews + 1
        WHERE id = NEW.editor_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_author_stats_glossary
    AFTER INSERT OR UPDATE ON public.glossary_terms
    FOR EACH ROW
    EXECUTE FUNCTION update_author_stats();

CREATE TRIGGER trigger_update_author_stats_blog
    AFTER INSERT OR UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_author_stats();
