-- Fix get_user_role default argument
-- This fixes the regression where get_user_role() (no args) failed because the default was removed in 20260126

CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID DEFAULT auth.uid())
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

-- Re-apply comments
COMMENT ON FUNCTION get_user_role(UUID) IS 'Get user role from user_roles table (defaults to viewer). Defaults to current user if no ID provided.';
