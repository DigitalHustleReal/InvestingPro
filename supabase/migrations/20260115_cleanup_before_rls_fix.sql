-- Cleanup Script - Run BEFORE 20260115_fix_rls_policies.sql
-- This ensures all existing functions are dropped to avoid conflicts
-- IMPORTANT: Drop policies FIRST, then functions (policies depend on functions)

-- ============================================
-- STEP 1: Drop ALL policies that depend on is_admin/is_editor functions
-- ============================================

-- Articles table policies (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN
        DROP POLICY IF EXISTS "Editors can do everything" ON articles;
        DROP POLICY IF EXISTS "Admin full access articles" ON articles;
        DROP POLICY IF EXISTS "Public can view articles" ON articles;
        DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON articles;
        DROP POLICY IF EXISTS "Users can submit articles" ON articles;
        DROP POLICY IF EXISTS "Users can view own submissions" ON articles;
        DROP POLICY IF EXISTS "Users can edit own drafts" ON articles;
        DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
        DROP POLICY IF EXISTS "Admins have full access" ON articles;
        DROP POLICY IF EXISTS "Editors can view all articles" ON articles;
        DROP POLICY IF EXISTS "Editors can moderate articles" ON articles;
        DROP POLICY IF EXISTS "Editors can publish articles" ON articles;
        DROP POLICY IF EXISTS "Service role bypass" ON articles;
    END IF;
END $$;

-- User profiles table policies (these depend on is_admin(uuid))
-- Only drop if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
        DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
        DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    END IF;
END $$;

-- System settings policies (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_settings') THEN
        DROP POLICY IF EXISTS "Admins can manage settings" ON system_settings;
        DROP POLICY IF EXISTS "Admins can view settings" ON system_settings;
    END IF;
END $$;

-- User roles policies (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
        DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
    END IF;
END $$;

-- ============================================
-- STEP 2: Now drop functions (no dependencies)
-- ============================================

-- Drop all existing function variants (use CASCADE to force drop)
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_editor(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_editor() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS assign_workflow(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS resolve_workflow(uuid) CASCADE;
DROP FUNCTION IF EXISTS validate_article_status_transition(text, text, text) CASCADE;

-- ============================================
-- STEP 3: Drop triggers that might depend on functions
-- ============================================

-- Only drop trigger if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN
        DROP TRIGGER IF EXISTS enforce_article_status_transition_trigger ON articles;
    END IF;
END $$;

-- Note: This script is safe to run multiple times
-- It only drops functions/policies if they exist
-- Run this BEFORE 20260115_fix_rls_policies.sql
