-- FIX FOR ACTIVE COLUMN ERROR
-- Aligns functions with the new authors table schema (is_active)

-- 1. Fix get_expert_reviewer_for_category
CREATE OR REPLACE FUNCTION get_expert_reviewer_for_category(p_category TEXT)
RETURNS UUID AS $$
DECLARE
    v_reviewer_id UUID;
BEGIN
    -- Find editor who is SME in this category with least reviews (load balance)
    SELECT id INTO v_reviewer_id
    FROM public.authors
    WHERE role = 'editor'
      AND is_active = true
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

-- 2. Fix auto_assign_blog_attribution
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
                WHERE role = 'writer' AND is_active = true
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
                WHERE role = 'writer' 
                  AND is_active = true
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
                WHERE role = 'writer' AND is_active = true
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

-- 3. Also ensure authors table has the columns needed by the triggers
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS editor_type TEXT CHECK (editor_type IN ('subject_matter_expert', 'content_editor', 'both'));
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS sme_categories TEXT[];
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS total_articles INTEGER DEFAULT 0;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS assigned_categories TEXT[];
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS credentials TEXT[];
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS expertise_areas TEXT[];
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 4. Ensure glossary_terms has the columns needed by the triggers
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS author_id UUID;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS editor_id UUID;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS editor_name TEXT;
-- is_active might be wanted for consistency in some RLS policies?
-- Error suggested "glossary_terms.is_active", let's add it.
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
