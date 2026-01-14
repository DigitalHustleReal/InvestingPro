-- Phase 1: Fix RLS Policies - Critical Security Fix
-- Date: January 15, 2026
-- Purpose: Restrict article updates to authors/admins only, implement role-based access

-- First, drop ALL existing policies (including ones we're about to create)
-- This makes the migration idempotent - safe to run multiple times
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN
        -- Drop old policies
        DROP POLICY IF EXISTS "Editors can do everything" ON articles;
        DROP POLICY IF EXISTS "Admin full access articles" ON articles;
        DROP POLICY IF EXISTS "Public can view articles" ON articles;
        DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
        -- Drop new policies (in case migration was partially run)
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

-- Drop existing functions FIRST with CASCADE (this will drop dependent policies)
-- This ensures a clean state even if migration was partially run
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_editor(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_editor() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;

-- Now drop any remaining policies that might not have been dropped by CASCADE
-- (Some policies might use functions in ways that don't create dependencies)

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'author', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on user_roles (if migration was partially run)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
        DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
    END IF;
END $$;

-- Users can view their own role
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all roles (using direct check to avoid circular dependency)
CREATE POLICY "Admins can view all roles" ON user_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role = 'admin'
        )
    );

-- Function to get user role (with fallback to 'viewer')
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM user_roles
    WHERE user_id = user_uuid;
    
    RETURN COALESCE(user_role, 'viewer');
END;
$$;

-- Function to check if user is admin (no parameters - uses auth.uid())
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$;

-- Function to check if user is editor (no parameters - uses auth.uid())
CREATE OR REPLACE FUNCTION is_editor()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN get_user_role() IN ('admin', 'editor');
END;
$$;

-- Now create proper RLS policies for articles

-- 1. Public can view PUBLISHED and APPROVED articles
CREATE POLICY "Public can view published articles" ON articles
    FOR SELECT
    USING (status = 'published' AND (submission_status = 'approved' OR submission_status IS NULL));

-- 2. Authenticated users can CREATE articles (they become authors)
CREATE POLICY "Authenticated users can create articles" ON articles
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        (author_id = auth.uid() OR author_id IS NULL)
    );

-- 3. Authors can VIEW their own articles (any status)
CREATE POLICY "Authors can view own articles" ON articles
    FOR SELECT
    USING (auth.uid() = author_id);

-- 4. Authors can UPDATE their own articles ONLY if:
--    - Article is in 'draft' status, OR
--    - Article is in 'review' status and not yet published
CREATE POLICY "Authors can update own drafts" ON articles
    FOR UPDATE
    USING (
        auth.uid() = author_id AND
        status IN ('draft', 'review') AND
        (published_date IS NULL OR status = 'draft')
    )
    WITH CHECK (
        auth.uid() = author_id AND
        status IN ('draft', 'review')
    );

-- 5. Editors can VIEW all articles (for moderation)
CREATE POLICY "Editors can view all articles" ON articles
    FOR SELECT
    USING (
        is_editor() OR
        auth.uid() = author_id
    );

-- 6. Editors can UPDATE articles for moderation (review, approve, reject)
-- Note: Status transition validation is handled by trigger in state_machine_enforcement migration
-- This policy allows editors to update articles; the trigger enforces valid transitions
CREATE POLICY "Editors can moderate articles" ON articles
    FOR UPDATE
    USING (is_editor())
    WITH CHECK (is_editor());

-- 7. Editors can PUBLISH articles (change status to 'published')
CREATE POLICY "Editors can publish articles" ON articles
    FOR UPDATE
    USING (
        is_editor() AND
        status IN ('draft', 'review')
    )
    WITH CHECK (
        is_editor() AND
        status = 'published' AND
        submission_status = 'approved'
    );

-- 8. Admins have FULL access (create, read, update, delete)
CREATE POLICY "Admins have full access" ON articles
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- 9. Service role bypass (for automated systems)
CREATE POLICY "Service role bypass" ON articles
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Add comment
COMMENT ON TABLE user_roles IS 'Role-based access control for users (admin, editor, author, viewer)';
COMMENT ON FUNCTION get_user_role IS 'Returns user role with fallback to viewer';
COMMENT ON FUNCTION is_admin IS 'Returns true if user is admin';
COMMENT ON FUNCTION is_editor IS 'Returns true if user is editor or admin';
