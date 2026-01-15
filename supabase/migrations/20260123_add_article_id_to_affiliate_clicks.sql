-- =============================================
-- ADD article_id COLUMN TO affiliate_clicks
-- Purpose: Track which article generated affiliate clicks for content-to-revenue mapping
-- Date: January 23, 2026
-- =============================================

-- Add article_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_clicks' 
        AND column_name = 'article_id'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Column article_id added to affiliate_clicks';
    ELSE
        RAISE NOTICE 'Column article_id already exists in affiliate_clicks';
    END IF;
END $$;

-- Create index on article_id for faster queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_article_id 
ON public.affiliate_clicks(article_id) 
WHERE article_id IS NOT NULL;

-- Create index on article_id + converted for revenue queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_article_converted 
ON public.affiliate_clicks(article_id, converted) 
WHERE article_id IS NOT NULL AND converted = TRUE;

-- =============================================
-- BACKFILL article_id FROM source_page
-- For existing clicks from article pages, extract article_id from source_page
-- =============================================
DO $$
DECLARE
    click_record RECORD;
    article_slug TEXT;
    found_article_id UUID;
BEGIN
    -- Loop through clicks where article_id is NULL and source_page contains '/article/'
    FOR click_record IN 
        SELECT id, source_page 
        FROM public.affiliate_clicks 
        WHERE article_id IS NULL 
        AND source_page LIKE '/article/%'
    LOOP
        -- Extract slug from source_page (e.g., '/article/slug-here' -> 'slug-here')
        article_slug := substring(click_record.source_page from '/article/([^/?]+)');
        
        IF article_slug IS NOT NULL THEN
            -- Find article by slug
            SELECT id INTO found_article_id
            FROM public.articles
            WHERE slug = article_slug
            LIMIT 1;
            
            -- Update affiliate_clicks with article_id
            IF found_article_id IS NOT NULL THEN
                UPDATE public.affiliate_clicks
                SET article_id = found_article_id
                WHERE id = click_record.id;
                
                RAISE NOTICE 'Updated click % with article_id % (slug: %)', click_record.id, found_article_id, article_slug;
            END IF;
        END IF;
    END LOOP;
END $$;

COMMENT ON COLUMN public.affiliate_clicks.article_id IS 'Reference to articles table - tracks which article generated this affiliate click for content-to-revenue mapping';
