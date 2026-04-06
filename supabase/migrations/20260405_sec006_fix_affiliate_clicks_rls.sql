-- =============================================
-- SEC-006: Fix affiliate_clicks RLS policies
-- =============================================
-- The affiliate_complete_schema.sql file defined overly permissive
-- RLS policies on affiliate_clicks using USING(true) for SELECT
-- and UPDATE. This migration drops those and replaces them with
-- proper role-scoped policies.
--
-- The original 20260107_affiliate_clicks.sql migration had correct
-- policies (admin-only SELECT, open INSERT). This migration ensures
-- those correct policies are in place regardless of which schema
-- file was applied.
-- =============================================

-- 1. Drop all existing policies on affiliate_clicks
DO $$ BEGIN DROP POLICY IF EXISTS "affiliate_clicks_insert_policy" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "affiliate_clicks_read_policy" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Public can insert clicks" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Admins can view clicks" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "System can update clicks" ON affiliate_clicks; EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 2. Ensure RLS is enabled
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- 3. Recreate with proper scoping

-- INSERT: Allow anonymous inserts for click tracking (public tracking endpoint)
CREATE POLICY "affiliate_clicks_insert_public"
    ON public.affiliate_clicks
    FOR INSERT
    WITH CHECK (true);

-- SELECT: Admin-only read access
CREATE POLICY "affiliate_clicks_select_admin"
    ON public.affiliate_clicks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- UPDATE: Admin-only (for conversion status updates)
CREATE POLICY "affiliate_clicks_update_admin"
    ON public.affiliate_clicks
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- DELETE: Admin-only
CREATE POLICY "affiliate_clicks_delete_admin"
    ON public.affiliate_clicks
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- =============================================
-- Also fix affiliate_conversions (same issue in affiliate_complete_schema.sql)
-- =============================================

DO $$ BEGIN DROP POLICY IF EXISTS "System can insert conversions" ON affiliate_conversions; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "Admins can view conversions" ON affiliate_conversions; EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- INSERT: Service role only (webhook-driven), but allow via SECURITY DEFINER functions
CREATE POLICY "affiliate_conversions_insert_service"
    ON public.affiliate_conversions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- SELECT: Admin-only
CREATE POLICY "affiliate_conversions_select_admin"
    ON public.affiliate_conversions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
        OR
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );
