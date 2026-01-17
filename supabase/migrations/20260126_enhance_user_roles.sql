-- Enhance User Roles System
-- Adds 'author' role and permissions JSONB field
-- Updates existing user_roles table

-- Add 'author' role to CHECK constraint (requires dropping and recreating)
-- First, drop the existing constraint
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;

-- Add new constraint with 'author' role
ALTER TABLE user_roles 
ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('admin', 'editor', 'author', 'viewer'));

-- Add permissions JSONB field if it doesn't exist
ALTER TABLE user_roles 
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';

-- Create index on permissions for queries
CREATE INDEX IF NOT EXISTS idx_user_roles_permissions ON user_roles USING GIN(permissions);

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role
    FROM user_roles
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_role, 'viewer'); -- Default to viewer if no role found
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id UUID, p_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_permissions JSONB;
BEGIN
    SELECT role, permissions INTO v_role, v_permissions
    FROM user_roles
    WHERE user_id = p_user_id;
    
    -- Admin has all permissions
    IF v_role = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check explicit permission in permissions JSONB
    IF v_permissions ? p_permission THEN
        RETURN (v_permissions->>p_permission)::boolean;
    END IF;
    
    -- Default role-based permissions
    CASE v_role
        WHEN 'editor' THEN
            RETURN p_permission IN ('articles.create', 'articles.edit', 'articles.publish', 'articles.view', 'categories.manage');
        WHEN 'author' THEN
            RETURN p_permission IN ('articles.create', 'articles.edit', 'articles.view', 'own.articles.delete');
        WHEN 'viewer' THEN
            RETURN p_permission IN ('articles.view', 'categories.view');
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = p_user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is editor or admin
CREATE OR REPLACE FUNCTION is_editor_or_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = p_user_id AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION get_user_role IS 'Get user role from user_roles table (defaults to viewer)';
COMMENT ON FUNCTION user_has_permission IS 'Check if user has a specific permission';
COMMENT ON FUNCTION is_admin IS 'Check if user is admin';
COMMENT ON FUNCTION is_editor_or_admin IS 'Check if user is editor or admin';
