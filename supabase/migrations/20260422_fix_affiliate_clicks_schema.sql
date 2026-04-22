-- =============================================
-- FIX affiliate_clicks schema drift
-- Date: 2026-04-22
-- Purpose: Ensure all columns the application inserts actually exist.
-- Migration 20260123 added article_id but referenced a 'converted' column
-- in its index creation which doesn't exist — that migration may have
-- failed partway through on some environments. This fixes defensively.
-- =============================================

-- Ensure article_id column exists (idempotent — won't error if already present)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'affiliate_clicks'
          AND column_name = 'article_id'
    ) THEN
        ALTER TABLE public.affiliate_clicks
        ADD COLUMN article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Safe index on article_id without referencing non-existent 'converted' column
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_article_id
    ON public.affiliate_clicks(article_id)
    WHERE article_id IS NOT NULL;

-- Ensure RLS INSERT policy exists for anonymous tracking
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'affiliate_clicks'
          AND policyname = 'affiliate_clicks_insert_policy'
    ) THEN
        CREATE POLICY "affiliate_clicks_insert_policy" ON public.affiliate_clicks
            FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- Optional: allow anon select of own session clicks (for debugging/user dashboards later)
-- Currently disabled — uncomment if you want users to see their own click history.
-- DO $$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT 1 FROM pg_policies
--         WHERE schemaname = 'public' AND tablename = 'affiliate_clicks'
--           AND policyname = 'affiliate_clicks_own_session_read'
--     ) THEN
--         CREATE POLICY "affiliate_clicks_own_session_read" ON public.affiliate_clicks
--             FOR SELECT
--             USING (session_id = current_setting('request.headers', true)::json ->> 'x-session-id');
--     END IF;
-- END $$;

COMMENT ON TABLE public.affiliate_clicks IS
'Affiliate click tracking. Last schema verify: 2026-04-22. Core columns in migration 20260107, article_id in 20260123.';
