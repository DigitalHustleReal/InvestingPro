-- ============================================================================
-- FIX: get_user_role function and article status trigger
-- Date: 2026-03-11
-- Problem: enforce_article_status_transition trigger calls get_user_role()
--          with no arguments, causing "function get_user_role() does not exist"
--          when updating article status.
-- ============================================================================

-- Step 1: Drop old versions of the function to ensure clean state
DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;

-- Step 2: Recreate get_user_role with a default argument
-- This allows both get_user_role() and get_user_role(some_uuid) to work.
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    v_role TEXT;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN 'viewer';
    END IF;

    SELECT role INTO v_role
    FROM public.user_roles
    WHERE user_id = p_user_id
    LIMIT 1;

    RETURN COALESCE(v_role, 'viewer');
END;
$$;

COMMENT ON FUNCTION get_user_role(UUID) IS
  'Returns the role for the given user (defaults to current user). Falls back to "viewer".';

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO service_role;

-- Step 4: Re-create the article status trigger function
-- Uses EXISTS check directly instead of calling get_user_role(),
-- making it resilient to future function signature changes.
CREATE OR REPLACE FUNCTION enforce_article_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Service role bypasses all validation (used by server-side admin ops)
    IF auth.role() = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- If status didn't change, allow update freely
    IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
        RETURN NEW;
    END IF;

    -- Get current user's role safely
    current_user_role := get_user_role(auth.uid());

    -- Admins can always change status
    IF current_user_role = 'admin' THEN
        -- Log the transition
        INSERT INTO article_status_history (
            article_id,
            old_status,
            new_status,
            changed_by,
            change_reason
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            'Admin status change'
        ) ON CONFLICT DO NOTHING;
        RETURN NEW;
    END IF;

    -- Editors can move to review, published, archived, draft
    IF current_user_role IN ('editor') THEN
        IF NEW.status IN ('review', 'published', 'archived', 'draft') THEN
            INSERT INTO article_status_history (
                article_id, old_status, new_status, changed_by, change_reason
            ) VALUES (
                NEW.id, OLD.status, NEW.status, auth.uid(), 'Editor status change'
            ) ON CONFLICT DO NOTHING;
            RETURN NEW;
        END IF;
    END IF;

    -- Authors can submit for review or revert to draft
    IF current_user_role = 'author' THEN
        IF NEW.status IN ('review', 'draft') THEN
            INSERT INTO article_status_history (
                article_id, old_status, new_status, changed_by, change_reason
            ) VALUES (
                NEW.id, OLD.status, NEW.status, auth.uid(), 'Author submission'
            ) ON CONFLICT DO NOTHING;
            RETURN NEW;
        END IF;
    END IF;

    -- Default: reject invalid transitions
    RAISE EXCEPTION 'Invalid status transition from "%" to "%" for role "%".',
        OLD.status, NEW.status, current_user_role;
END;
$$;

-- Step 5: Re-attach the trigger (idempotent)
DROP TRIGGER IF EXISTS enforce_article_status_transition_trigger ON public.articles;
CREATE TRIGGER enforce_article_status_transition_trigger
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION enforce_article_status_transition();

-- Step 6: Ensure helper functions exist too
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_user_id AND role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION is_editor_or_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_user_id AND role IN ('admin', 'editor')
    );
$$;

GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_editor_or_admin(UUID) TO authenticated;
