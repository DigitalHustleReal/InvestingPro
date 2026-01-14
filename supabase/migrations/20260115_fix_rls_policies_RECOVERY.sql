-- RECOVERY SCRIPT - Run this if Step 1 migration partially failed
-- This will clean up any partial state and allow the main migration to run cleanly

-- Drop ALL policies on articles (including ones created by partial migration)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN
        DROP POLICY IF EXISTS "Editors can do everything" ON articles;
        DROP POLICY IF EXISTS "Admin full access articles" ON articles;
        DROP POLICY IF EXISTS "Public can view articles" ON articles;
        DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
        DROP POLICY IF EXISTS "Public can view published articles" ON articles;
        DROP POLICY IF EXISTS "Authenticated users can create articles" ON articles;
        DROP POLICY IF EXISTS "Authors can view own articles" ON articles;
        DROP POLICY IF EXISTS "Authors can update own drafts" ON articles;
        DROP POLICY IF EXISTS "Editors can view all articles" ON articles;
        DROP POLICY IF EXISTS "Editors can moderate articles" ON articles;
        DROP POLICY IF EXISTS "Editors can publish articles" ON articles;
        DROP POLICY IF EXISTS "Admins have full access" ON articles;
        DROP POLICY IF EXISTS "Service role bypass" ON articles;
    END IF;
END $$;

-- Drop policies on user_roles
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
        DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
    END IF;
END $$;

-- Drop functions (CASCADE will drop dependent policies)
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_editor(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_editor() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;

-- Note: We do NOT drop the user_roles table here to preserve any existing role assignments
-- The main migration will use CREATE TABLE IF NOT EXISTS

-- After running this, run the main migration: 20260115_fix_rls_policies.sql
