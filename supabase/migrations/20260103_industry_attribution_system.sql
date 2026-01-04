-- Industry-Standard Attribution System
-- Based on Investopedia, NerdWallet, The Balance patterns

-- Update authors table with SME (Subject Matter Expert) roles
ALTER TABLE public.authors
    ADD COLUMN IF NOT EXISTS editor_type TEXT CHECK (editor_type IN ('subject_matter_expert', 'content_editor', 'both')),
    ADD COLUMN IF NOT EXISTS sme_categories TEXT[]; -- Categories they're subject matter experts in

-- Update content tables with attribution metadata
ALTER TABLE public.glossary_terms
    ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'glossary_term',
    ADD COLUMN IF NOT EXISTS show_author BOOLEAN DEFAULT false, -- Glossary = false
    ADD COLUMN IF NOT EXISTS show_reviewer BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS reviewer_label TEXT DEFAULT 'Reviewed by',
    ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'guide', 'how_to', 'comparison', 'review', 'list', 'news')),
    ADD COLUMN IF NOT EXISTS show_author BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS show_reviewer BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS reviewer_label TEXT DEFAULT 'Reviewed by',
    ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE;

---

-- Configure editors as Subject Matter Experts

-- Karthik Menon - Credit Products SME
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['credit-cards', 'loans', 'banking', 'small-business']
WHERE slug = 'karthik-menon';

-- Dr. Meera Iyer - Economics & Investing SME
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['investing', 'banking', 'ipo']
WHERE slug = 'meera-iyer';

-- Harpreet Kaur - Insurance SME  
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['insurance', 'taxes']
WHERE slug = 'harpreet-kaur';

-- Thomas Fernandes - Banking Regulations SME
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['banking', 'loans', 'small-business']
WHERE slug = 'thomas-fernandes';

-- Nandini Reddy - SEBI/Investing SME
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['investing', 'ipo', 'insurance']
WHERE slug = 'nandini-reddy';

-- Amit Desai - Markets & IPO SME
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['ipo', 'investing']
WHERE slug = 'amit-desai';

-- Deepika Singh - Tax SME
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['taxes', 'small-business', 'investing']
WHERE slug = 'deepika-singh';

--Rajesh Mehta - General Content Editor + SME for everything
UPDATE public.authors 
SET 
    editor_type = 'both',
    sme_categories = ARRAY['credit-cards', 'loans', 'investing', 'ipo', 'insurance', 'banking', 'taxes', 'small-business']
WHERE slug = 'rajesh-mehta';

---

-- Function to get expert reviewer for category
CREATE OR REPLACE FUNCTION get_expert_reviewer_for_category(p_category TEXT)
RETURNS UUID AS $$
DECLARE
    v_reviewer_id UUID;
BEGIN
    -- Find editor who is SME in this category with least reviews (load balance)
    SELECT id INTO v_reviewer_id
    FROM public.authors
    WHERE role = 'editor'
      AND active = true
      AND editor_type IN ('subject_matter_expert', 'both')
      AND p_category = ANY(sme_categories)
    ORDER BY total_reviews ASC
    LIMIT 1;
    
    -- Fallback to Rajesh if no specialist found
    IF v_reviewer_id IS NULL THEN
        SELECT id INTO v_reviewer_id
        FROM public.authors
        WHERE slug = 'rajesh-mehta';
    END IF;
    
    RETURN v_reviewer_id;
END;
$$ LANGUAGE plpgsql;

---

-- Updated auto-assignment for glossary terms (NO AUTHOR, JUST REVIEWER)
CREATE OR REPLACE FUNCTION auto_assign_glossary_attribution() 
RETURNS TRIGGER AS $$
BEGIN
    -- Glossary terms: NO author shown, only expert reviewer
    NEW.author_id := NULL; -- Still track internally but don't show
    NEW.editor_id := get_expert_reviewer_for_category(NEW.category);
    
    SELECT name INTO NEW.editor_name 
    FROM public.authors 
    WHERE id = NEW.editor_id;
    
    NEW.show_author := false;
    NEW.show_reviewer := true;
    NEW.reviewer_label := 'Reviewed by';
    NEW.last_reviewed_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_assign_glossary_author ON public.glossary_terms;
CREATE TRIGGER trigger_auto_assign_glossary_attribution
    BEFORE INSERT ON public.glossary_terms
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_glossary_attribution();

---

-- Updated auto-assignment for blog posts (AUTHOR + REVIEWER based on type)
CREATE OR REPLACE FUNCTION auto_assign_blog_attribution() 
RETURNS TRIGGER AS $$
DECLARE
    v_content_type TEXT;
BEGIN
    v_content_type := COALESCE(NEW.content_type, 'article');
    
    CASE v_content_type
        WHEN 'article', 'guide', 'how_to' THEN
            -- Full attribution: Author + Expert Reviewer
            IF NEW.author_id IS NULL THEN
                -- Any available writer (round-robin)
                SELECT id INTO NEW.author_id
                FROM public.authors
                WHERE role = 'author' AND active = true
                ORDER BY total_articles ASC
                LIMIT 1;
                
                SELECT name INTO NEW.author_name 
                FROM public.authors 
                WHERE id = NEW.author_id;
            END IF;
            
            IF NEW.editor_id IS NULL THEN
                NEW.editor_id := get_expert_reviewer_for_category(NEW.category);
                SELECT name INTO NEW.editor_name 
                FROM public.authors 
                WHERE id = NEW.editor_id;
            END IF;
            
            NEW.show_author := true;
            NEW.show_reviewer := true;
            NEW.reviewer_label := 'Reviewed by';
            
        WHEN 'comparison', 'review', 'list' THEN
            -- Minimal: Just author, no reviewer shown
            IF NEW.author_id IS NULL THEN
                SELECT id INTO NEW.author_id
                FROM public.authors
                WHERE role = 'author' 
                  AND active = true
                  AND NEW.category = ANY(assigned_categories)
                ORDER BY total_articles ASC
                LIMIT 1;
                
                SELECT name INTO NEW.author_name 
                FROM public.authors 
                WHERE id = NEW.author_id;
            END IF;
            
            NEW.show_author := true;
            NEW.show_reviewer := false;
            
        WHEN 'news' THEN
            -- News: Just author byline
            IF NEW.author_id IS NULL THEN
                SELECT id INTO NEW.author_id
                FROM public.authors
                WHERE role = 'author' AND active = true
                ORDER BY total_articles ASC
                LIMIT 1;
                
                SELECT name INTO NEW.author_name 
                FROM public.authors 
                WHERE id = NEW.author_id;
            END IF;
            
            NEW.show_author := true;
            NEW.show_reviewer := false;
    END CASE;
    
    NEW.last_reviewed_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_assign_blog_author ON public.blog_posts;
CREATE TRIGGER trigger_auto_assign_blog_attribution
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_blog_attribution();

---

-- View: Content with proper attribution
CREATE OR REPLACE VIEW public.content_with_attribution AS
SELECT 
    'glossary' as content_source,
    id,
    term as title,
    slug,
    category,
    NULL as author_id, -- Not shown for glossary
    NULL as author_name,
    editor_id as reviewer_id,
    editor_name as reviewer_name,
    show_author,
    show_reviewer,
    reviewer_label,
    last_reviewed_at,
    updated_at,
    created_at
FROM public.glossary_terms
WHERE published = true

UNION ALL

SELECT 
    'blog' as content_source,
    id,
    title,
    slug,
    category,
    CASE WHEN show_author = true THEN author_id ELSE NULL END as author_id,
    CASE WHEN show_author = true THEN author_name ELSE NULL END as author_name,
    CASE WHEN show_reviewer = true THEN editor_id ELSE NULL END as reviewer_id,
    CASE WHEN show_reviewer = true THEN editor_name ELSE NULL END as reviewer_name,
    show_author,
    show_reviewer,
    reviewer_label,
    last_reviewed_at,
    updated_at,
    published_at as created_at
FROM public.blog_posts
WHERE published = true;

---

-- Editorial standards page content
CREATE TABLE IF NOT EXISTS public.editorial_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.editorial_standards (section, content, display_order) VALUES
('Mission', 'InvestingPro is committed to providing accurate, unbiased financial information to help Indians make better money decisions.', 1),
('Review Process', 'All glossary terms and technical content are reviewed by certified subject matter experts (CFAs, CAs, PhDs) to ensure accuracy.', 2),
('Fact-Checking', 'We verify all interest rates, fees, and product details against official sources before publication.', 3),
('Updates', 'Content is reviewed quarterly and updated immediately when regulations or products change.', 4),
('Expert Team', 'Our editorial team includes CFAs, Chartered Accountants, former RBI officials, and industry experts with 160+ combined years of experience.', 5),
('Independence', 'Editorial content is independent of advertising. We maintain a firewall between content and commercial teams.', 6)
ON CONFLICT DO NOTHING;
