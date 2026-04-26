-- =============================================
-- ALIGN affiliate_clicks production schema with application writers
-- Date: 2026-04-26
-- =============================================
-- Why: Production has the legacy 10-column schema (link_id, ip_address,
-- user_agent, referer, created_at, commission_earned, converted,
-- conversion_date, product_type) but the active client-side writer in
-- lib/tracking/affiliate-tracker.ts inserts product_id, product_name,
-- source_page, category, session_id, affiliate_link, affiliate_network,
-- conversion_status, utm_*, etc. Migration 20260107 — which would have
-- introduced this schema — never ran in production. Result: every
-- INSERT 400s with "column does not exist" and the try/catch in the
-- tracker swallows it. affiliate_clicks has 0 lifetime rows.
--
-- Fix: ADD all the columns the writer expects. Keep the existing
-- legacy columns intact so the older /api/out and /go/[slug] paths
-- keep working. Both writer styles can coexist — link_id-style or
-- product-id-style — until we consolidate later.

ALTER TABLE public.affiliate_clicks
    ADD COLUMN IF NOT EXISTS product_id UUID,
    ADD COLUMN IF NOT EXISTS product_slug TEXT,
    ADD COLUMN IF NOT EXISTS product_name TEXT,
    ADD COLUMN IF NOT EXISTS category TEXT,
    ADD COLUMN IF NOT EXISTS provider_name TEXT,
    ADD COLUMN IF NOT EXISTS source_page TEXT,
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS source_component TEXT,
    ADD COLUMN IF NOT EXISTS article_id UUID,
    ADD COLUMN IF NOT EXISTS session_id TEXT,
    ADD COLUMN IF NOT EXISTS user_id UUID,
    ADD COLUMN IF NOT EXISTS ip_hash TEXT,
    ADD COLUMN IF NOT EXISTS affiliate_link TEXT,
    ADD COLUMN IF NOT EXISTS affiliate_network TEXT,
    ADD COLUMN IF NOT EXISTS utm_source TEXT,
    ADD COLUMN IF NOT EXISTS utm_medium TEXT,
    ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
    ADD COLUMN IF NOT EXISTS utm_content TEXT,
    ADD COLUMN IF NOT EXISTS conversion_status TEXT DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS commission_currency TEXT DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS country TEXT,
    ADD COLUMN IF NOT EXISTS region TEXT,
    ADD COLUMN IF NOT EXISTS city TEXT;

-- Indexes for analytics queries (idempotent)
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON public.affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_category ON public.affiliate_clicks(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON public.affiliate_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_source_page ON public.affiliate_clicks(source_page);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_conversion_status ON public.affiliate_clicks(conversion_status);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_session_id ON public.affiliate_clicks(session_id);

-- Confirm RLS INSERT policy exists for anonymous tracking
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'affiliate_clicks'
          AND cmd = 'INSERT'
    ) THEN
        CREATE POLICY "affiliate_clicks_insert_policy" ON public.affiliate_clicks
            FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- Make sure RLS is on
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.affiliate_clicks IS
'Affiliate click tracking. Hybrid schema as of 2026-04-26: legacy link_id-style columns + product-id-style columns coexist. Active writer is lib/tracking/affiliate-tracker.ts (product-id-style). Schema aligned with migration 20260107 spec.';
