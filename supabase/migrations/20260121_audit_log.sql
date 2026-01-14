-- Comprehensive Audit Trail System
-- Tracks all admin actions and system changes for compliance and debugging

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Entity Information
    entity_type TEXT NOT NULL, -- 'article', 'workflow', 'user', 'product', 'category', etc.
    entity_id UUID, -- ID of the affected entity (nullable for system-level actions)
    
    -- Action Details
    action TEXT NOT NULL, -- 'create', 'update', 'delete', 'publish', 'unpublish', 'approve', 'reject', etc.
    action_details TEXT, -- Human-readable description of the action
    
    -- User Information
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT, -- Denormalized for easier querying
    user_name TEXT, -- Denormalized user name
    
    -- Change Tracking
    changes JSONB, -- Before/after state or change details
    old_values JSONB, -- Previous state (for updates)
    new_values JSONB, -- New state (for updates)
    
    -- Request Context
    ip_address TEXT,
    user_agent TEXT,
    request_path TEXT, -- API endpoint or page path
    request_method TEXT, -- HTTP method
    
    -- Metadata
    severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    tags TEXT[], -- Additional tags for filtering (e.g., ['admin', 'content', 'publishing'])
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_severity ON audit_log(severity);
CREATE INDEX IF NOT EXISTS idx_audit_log_tags ON audit_log USING GIN(tags); -- For array searches

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_log_entity_action ON audit_log(entity_type, action, created_at DESC);

-- RLS Policies
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
ON audit_log FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
ON audit_log FOR INSERT
WITH CHECK (true);

-- Function to log an audit event
CREATE OR REPLACE FUNCTION log_audit_event(
    p_entity_type TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_action TEXT,
    p_action_details TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_changes JSONB DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_path TEXT DEFAULT NULL,
    p_request_method TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT 'info',
    p_tags TEXT[] DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
    v_user_email TEXT;
    v_user_name TEXT;
BEGIN
    -- Get user information if user_id provided
    IF p_user_id IS NOT NULL THEN
        SELECT email, name INTO v_user_email, v_user_name
        FROM auth.users
        WHERE id = p_user_id;
        
        -- Fallback to user_profiles if name not in auth.users
        IF v_user_name IS NULL THEN
            SELECT name INTO v_user_name
            FROM user_profiles
            WHERE id = p_user_id;
        END IF;
    END IF;

    -- Insert audit log entry
    INSERT INTO audit_log (
        entity_type,
        entity_id,
        action,
        action_details,
        user_id,
        user_email,
        user_name,
        changes,
        old_values,
        new_values,
        ip_address,
        user_agent,
        request_path,
        request_method,
        severity,
        tags
    ) VALUES (
        p_entity_type,
        p_entity_id,
        p_action,
        p_action_details,
        COALESCE(p_user_id, auth.uid()),
        v_user_email,
        v_user_name,
        p_changes,
        p_old_values,
        p_new_values,
        p_ip_address,
        p_user_agent,
        p_request_path,
        p_request_method,
        p_severity,
        p_tags
    )
    RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get audit log with filters
CREATE OR REPLACE FUNCTION get_audit_log(
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_action TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id UUID,
    entity_type TEXT,
    entity_id UUID,
    action TEXT,
    action_details TEXT,
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    changes JSONB,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    request_path TEXT,
    request_method TEXT,
    severity TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id,
        al.entity_type,
        al.entity_id,
        al.action,
        al.action_details,
        al.user_id,
        al.user_email,
        al.user_name,
        al.changes,
        al.old_values,
        al.new_values,
        al.ip_address,
        al.user_agent,
        al.request_path,
        al.request_method,
        al.severity,
        al.tags,
        al.created_at
    FROM audit_log al
    WHERE
        (p_entity_type IS NULL OR al.entity_type = p_entity_type)
        AND (p_entity_id IS NULL OR al.entity_id = p_entity_id)
        AND (p_user_id IS NULL OR al.user_id = p_user_id)
        AND (p_action IS NULL OR al.action = p_action)
        AND (p_severity IS NULL OR al.severity = p_severity)
        AND (p_tags IS NULL OR al.tags && p_tags) -- Array overlap operator
        AND (p_start_date IS NULL OR al.created_at >= p_start_date)
        AND (p_end_date IS NULL OR al.created_at <= p_end_date)
    ORDER BY al.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get audit log statistics
CREATE OR REPLACE FUNCTION get_audit_statistics(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS TABLE (
    total_actions BIGINT,
    actions_by_type JSONB,
    actions_by_user JSONB,
    actions_by_severity JSONB,
    recent_activity JSONB
) AS $$
DECLARE
    v_start_date TIMESTAMP WITH TIME ZONE;
    v_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
    v_start_date := COALESCE(p_start_date, NOW() - INTERVAL '30 days');
    v_end_date := COALESCE(p_end_date, NOW());

    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM audit_log WHERE created_at BETWEEN v_start_date AND v_end_date) as total_actions,
        (
            SELECT jsonb_object_agg(entity_type, count)
            FROM (
                SELECT entity_type, COUNT(*) as count
                FROM audit_log
                WHERE created_at BETWEEN v_start_date AND v_end_date
                GROUP BY entity_type
            ) sub
        ) as actions_by_type,
        (
            SELECT jsonb_object_agg(COALESCE(user_name, user_email, 'Unknown'), count)
            FROM (
                SELECT COALESCE(user_name, user_email, 'Unknown') as user_identifier, COUNT(*) as count
                FROM audit_log
                WHERE created_at BETWEEN v_start_date AND v_end_date
                GROUP BY user_identifier
                ORDER BY count DESC
                LIMIT 10
            ) sub
        ) as actions_by_user,
        (
            SELECT jsonb_object_agg(severity, count)
            FROM (
                SELECT severity, COUNT(*) as count
                FROM audit_log
                WHERE created_at BETWEEN v_start_date AND v_end_date
                GROUP BY severity
            ) sub
        ) as actions_by_severity,
        (
            SELECT jsonb_agg(jsonb_build_object(
                'action', action,
                'entity_type', entity_type,
                'user_name', user_name,
                'created_at', created_at
            ) ORDER BY created_at DESC)
            FROM audit_log
            WHERE created_at BETWEEN v_start_date AND v_end_date
            ORDER BY created_at DESC
            LIMIT 20
        ) as recent_activity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail of all admin actions and system changes';
COMMENT ON FUNCTION log_audit_event IS 'Logs an audit event with full context';
COMMENT ON FUNCTION get_audit_log IS 'Retrieves audit log entries with filtering and pagination';
COMMENT ON FUNCTION get_audit_statistics IS 'Returns audit log statistics and summaries';
