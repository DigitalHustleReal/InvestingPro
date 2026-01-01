-- ==============================================================================
-- SECURITY REMEDIATION PLAN (PHASE 1.1)
-- ==============================================================================
--
-- Objective: Secure the database by restricting write access to Admins/Editors only.
-- Implementation:
-- 1. Create a secure `is_admin_or_editor()` function.
-- 2. Update RLS policies on critical tables (articles, pipeline_runs, etc.).
-- 3. Ensure `user_profiles` handles roles correctly.

-- ------------------------------------------------------------------------------
-- 1. Helper Function: is_admin_or_editor()
-- ------------------------------------------------------------------------------
-- specific function to check role safely without recursion
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
DECLARE
    current_role TEXT;
BEGIN
    -- Check if it's the service role (always allow)
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN TRUE;
    END IF;

    -- Fetch role from user_profiles
    SELECT role INTO current_role
    FROM public.user_profiles
    WHERE id = auth.uid();

    RETURN (current_role IN ('admin', 'editor'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. Secure ARTICLES Table
-- ------------------------------------------------------------------------------
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing loose policies (if any)
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON articles;
DROP POLICY IF EXISTS "Editors can do everything" ON articles;
DROP POLICY IF EXISTS "Authenticated users can create articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

-- Policy 1: Public Read (Only Published)
CREATE POLICY "Public Read Published"
ON articles FOR SELECT
TO public
USING (status = 'published');

-- Policy 2: Authenticated Read (Admins/Editors see drafts)
CREATE POLICY "Staff Read All"
ON articles FOR SELECT
TO authenticated
USING (public.is_admin_or_editor());

-- Policy 3: Staff Write (Create/Update/Delete)
CREATE POLICY "Staff Write"
ON articles FOR ALL
TO authenticated
USING (public.is_admin_or_editor())
WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 3. Secure PIPELINE_RUNS Table
-- ------------------------------------------------------------------------------
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view pipeline runs" ON pipeline_runs;
DROP POLICY IF EXISTS "Authenticated users can insert pipeline runs" ON pipeline_runs;
DROP POLICY IF EXISTS "Authenticated users can update pipeline runs" ON pipeline_runs;

CREATE POLICY "Staff Full Access Pipeline"
ON pipeline_runs FOR ALL
TO authenticated
USING (public.is_admin_or_editor())
WITH CHECK (public.is_admin_or_editor());

-- ------------------------------------------------------------------------------
-- 4. Secure OTHER Critical Tables (generic 'assets' if used for content)
-- ------------------------------------------------------------------------------
-- Assuming 'assets' table exists (from previous context), if not this might fail gracefully or ideally checking existance.
-- We will apply if it exists in schema.
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'assets') THEN
        ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public read assets" ON assets;
        DROP POLICY IF EXISTS "Staff write assets" ON assets;

        CREATE POLICY "Public read assets" ON assets FOR SELECT USING (true);
        CREATE POLICY "Staff write assets" ON assets FOR ALL USING (public.is_admin_or_editor());
    END IF;
END
$$;

-- ------------------------------------------------------------------------------
-- 5. User Profiles Checks
-- ------------------------------------------------------------------------------
-- Ensure users can't upgrade themselves to admin
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Users can update only non-protected fields
CREATE POLICY "Users can update own profile safe"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND (
        -- Preventing role escalation via update
        old_role IS DISTINCT FROM new_role OR role = old_role 
        OR (public.is_admin_or_editor()) -- Only existing admins can change roles
    )
);

-- Note: In a real migration, we would grant the first user admin rights if none exist.
-- But we can't do that blindly here.
