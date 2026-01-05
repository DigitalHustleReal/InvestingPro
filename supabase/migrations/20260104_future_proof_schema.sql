-- FUTURE PROOFING SCHEMA
-- Includes: Approval Workflows, A/B Testing, and Content Health

-- DROP tables to ensure fresh schema (Development Mode)
DROP TABLE IF EXISTS article_reviews CASCADE;
DROP TABLE IF EXISTS ab_variants CASCADE;
DROP TABLE IF EXISTS ab_tests CASCADE;
DROP TABLE IF EXISTS repurposed_content CASCADE;

-- 1. APPROVAL WORKFLOWS
-- Track review history and editorial comments
CREATE TABLE IF NOT EXISTS article_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL CHECK (status IN ('approved', 'changes_requested', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add review status to articles if not exists
DO $$ 
BEGIN
  -- Check if the enum type exists
  if exists (select 1 from pg_type where typname = 'article_status') then
    -- It exists, try to add the value if not present
    BEGIN
        ALTER TYPE article_status ADD VALUE 'review';
    EXCEPTION
        WHEN duplicate_object THEN null; -- Value already exists
    END;
  else
    -- Assuming text column if enum doesn't exist
    NULL; 
  end if;
END $$;

-- 2. A/B TESTING (Title/Thumbnail Experiments)
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('title', 'thumbnail', 'excerpt')),
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed')),
    winner_variant_id UUID,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ab_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
    value TEXT NOT NULL, -- The title text or image URL
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr DECIMAL(5,4) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN CAST(clicks AS DECIMAL) / impressions ELSE 0 END
    ) STORED,
    is_control BOOLEAN DEFAULT false
);

-- 3. CONTENT HEALTH & REPURPOSING
-- Add columns to articles for health tracking
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS last_audited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS content_health_score INTEGER DEFAULT 100, -- 0-100 score (decay over time)
ADD COLUMN IF NOT EXISTS decay_rate DECIMAL(3,2) DEFAULT 1.0; -- Multiplier for decay

-- Repurposed content outputs
CREATE TABLE IF NOT EXISTS repurposed_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    format TEXT NOT NULL CHECK (format IN ('newsletter', 'video_script', 'tweet_thread', 'linkedin_article')),
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    platform_id TEXT, -- External ID if published
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_article_reviews_article ON article_reviews(article_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_article ON ab_tests(article_id);
CREATE INDEX IF NOT EXISTS idx_repurposed_article ON repurposed_content(article_id);

-- RLS
ALTER TABLE article_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposed_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users full access reviews" ON article_reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access ab_tests" ON ab_tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access ab_variants" ON ab_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access repurposed" ON repurposed_content FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- HOTFIX: Align Authors attribution with is_active schema
-- Resolves "column active does not exist" error in triggers
-- =====================================================

-- 1. Fix get_expert_reviewer_for_category to use is_active
CREATE OR REPLACE FUNCTION get_expert_reviewer_for_category(p_category TEXT)
RETURNS UUID AS $$
DECLARE
    v_reviewer_id UUID;
BEGIN
    SELECT id INTO v_reviewer_id
    FROM public.authors
    WHERE role = 'editor'
      AND is_active = true
      AND editor_type IN ('subject_matter_expert', 'both')
      AND p_category = ANY(sme_categories)
    ORDER BY total_reviews ASC
    LIMIT 1;
    
    IF v_reviewer_id IS NULL THEN
        SELECT id INTO v_reviewer_id
        FROM public.authors
        WHERE slug = 'rajesh-mehta';
    END IF;
    
    RETURN v_reviewer_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Fix auto_assign_blog_attribution to use is_active
CREATE OR REPLACE FUNCTION auto_assign_blog_attribution() 
RETURNS TRIGGER AS $$
DECLARE
    v_content_type TEXT;
BEGIN
    v_content_type := COALESCE(NEW.content_type, 'article');
    
    CASE v_content_type
        WHEN 'article', 'guide', 'how_to' THEN
            IF NEW.author_id IS NULL THEN
                SELECT id INTO NEW.author_id
                FROM public.authors
                WHERE role = 'writer' AND is_active = true
                ORDER BY total_articles ASC
                LIMIT 1;
                
                SELECT name INTO NEW.author_name FROM public.authors WHERE id = NEW.author_id;
            END IF;
            
            IF NEW.editor_id IS NULL THEN
                NEW.editor_id := get_expert_reviewer_for_category(NEW.category);
                SELECT name INTO NEW.editor_name FROM public.authors WHERE id = NEW.editor_id;
            END IF;
            
            NEW.show_author := true;
            NEW.show_reviewer := true;
            NEW.reviewer_label := 'Reviewed by';
            
        WHEN 'comparison', 'review', 'list' THEN
            IF NEW.author_id IS NULL THEN
                SELECT id INTO NEW.author_id
                FROM public.authors
                WHERE role = 'writer' AND is_active = true AND NEW.category = ANY(assigned_categories)
                ORDER BY total_articles ASC LIMIT 1;
                
                SELECT name INTO NEW.author_name FROM public.authors WHERE id = NEW.author_id;
            END IF;
            NEW.show_author := true;
            NEW.show_reviewer := false;
            
        WHEN 'news' THEN
            IF NEW.author_id IS NULL THEN
                SELECT id INTO NEW.author_id
                FROM public.authors
                WHERE role = 'writer' AND is_active = true
                ORDER BY total_articles ASC LIMIT 1;
                
                SELECT name INTO NEW.author_name FROM public.authors WHERE id = NEW.author_id;
            END IF;
            NEW.show_author := true;
            NEW.show_reviewer := false;
    END CASE;
    
    NEW.last_reviewed_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Ensure all columns exist on glossary_terms for attribution
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS total_articles INTEGER DEFAULT 0;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS assigned_categories TEXT[];

ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS author_id UUID;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS editor_id UUID;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS editor_name TEXT;
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;


-- 4. CONTENT TYPES & ATTRIBUTION
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article';
-- Types: 'article', 'news', 'deep_insight', 'guide', 'analysis'

-- Attach attribution trigger to ARTICLES (consolidating from blog_posts)
DROP TRIGGER IF EXISTS trigger_auto_assign_article_attribution ON articles;
CREATE TRIGGER trigger_auto_assign_article_attribution
    BEFORE INSERT ON articles
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_blog_attribution(); -- Renaming strictly recommended later
