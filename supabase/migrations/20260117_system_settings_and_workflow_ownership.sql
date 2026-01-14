-- Phase 1: System Settings & Workflow Ownership
-- Date: January 17, 2026
-- Purpose: Add system settings table and workflow assignment

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
-- Note: is_admin() function must exist from previous migration
CREATE POLICY "Admins can manage settings" ON system_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Only admins can view settings
CREATE POLICY "Admins can view settings" ON system_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Add workflow assignment columns to workflow_instances
ALTER TABLE workflow_instances 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- Create index for assigned workflows
CREATE INDEX IF NOT EXISTS idx_workflow_instances_assigned ON workflow_instances(assigned_to) 
WHERE assigned_to IS NOT NULL;

-- Create index for unresolved assigned workflows
CREATE INDEX IF NOT EXISTS idx_workflow_instances_unresolved ON workflow_instances(assigned_to, state) 
WHERE assigned_to IS NOT NULL AND state IN ('failed', 'paused');

-- Function to assign workflow
CREATE OR REPLACE FUNCTION assign_workflow(
    workflow_instance_id UUID,
    assignee_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Get current user role
    SELECT get_user_role() INTO current_user_role;
    
    -- Only editors/admins can assign workflows
    IF current_user_role NOT IN ('editor', 'admin') THEN
        RAISE EXCEPTION 'Only editors and admins can assign workflows';
    END IF;
    
    -- Update workflow assignment
    UPDATE workflow_instances
    SET 
        assigned_to = assignee_id,
        assigned_at = NOW()
    WHERE id = workflow_instance_id;
    
    RETURN TRUE;
END;
$$;

-- Function to resolve workflow
CREATE OR REPLACE FUNCTION resolve_workflow(
    workflow_instance_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Get current user role
    SELECT get_user_role() INTO current_user_role;
    
    -- Only the assignee or an admin can resolve
    IF NOT (
        EXISTS (
            SELECT 1 FROM workflow_instances
            WHERE id = workflow_instance_id
            AND assigned_to = auth.uid()
        ) OR current_user_role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only the assignee or an admin can resolve workflows';
    END IF;
    
    -- Update workflow resolution
    UPDATE workflow_instances
    SET resolved_at = NOW()
    WHERE id = workflow_instance_id;
    
    RETURN TRUE;
END;
$$;

-- Initialize default settings
INSERT INTO system_settings (key, value, description) VALUES
    ('automation_paused', 'false', 'Whether automation is currently paused'),
    ('automation_cycle_interval_minutes', '1440', 'Interval between automation cycles in minutes (default: 24 hours)'),
    ('max_concurrent_workflows', '10', 'Maximum number of concurrent workflows'),
    ('workflow_timeout_minutes', '60', 'Timeout for workflows in minutes')
ON CONFLICT (key) DO NOTHING;

-- Add comments
COMMENT ON TABLE system_settings IS 'System-wide configuration settings';
COMMENT ON FUNCTION assign_workflow IS 'Assigns a workflow to a user';
COMMENT ON FUNCTION resolve_workflow IS 'Marks a workflow as resolved';
