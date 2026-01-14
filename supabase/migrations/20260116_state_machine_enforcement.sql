-- Phase 1: Database-Level State Machine Enforcement
-- Date: January 16, 2026
-- Purpose: Enforce article status transitions at database level

-- Create status_history table to track all transitions
CREATE TABLE IF NOT EXISTS article_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_status_history_article ON article_status_history(article_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created ON article_status_history(created_at DESC);

-- Enable RLS
ALTER TABLE article_status_history ENABLE ROW LEVEL SECURITY;

-- Users can view status history for their own articles
CREATE POLICY "Users can view own article history" ON article_status_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM articles
            WHERE articles.id = article_status_history.article_id
            AND articles.author_id = auth.uid()
        ) OR
        is_editor()
    );

-- Function to validate status transition
CREATE OR REPLACE FUNCTION validate_article_status_transition(
    old_status TEXT,
    new_status TEXT,
    user_role TEXT DEFAULT get_user_role()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Define valid transitions based on role
    IF old_status = 'draft' THEN
        -- Authors can move draft → review
        -- Editors/Admins can move draft → review or draft → published
        IF new_status = 'review' THEN
            RETURN user_role IN ('author', 'editor', 'admin');
        ELSIF new_status = 'published' THEN
            RETURN user_role IN ('editor', 'admin');
        ELSE
            RETURN FALSE;
        END IF;
    
    ELSIF old_status = 'review' THEN
        -- Editors/Admins can move review → draft, review → published, review → rejected
        IF new_status IN ('draft', 'published', 'rejected') THEN
            RETURN user_role IN ('editor', 'admin');
        ELSE
            RETURN FALSE;
        END IF;
    
    ELSIF old_status = 'published' THEN
        -- Only admins can unpublish (published → archived or published → draft)
        IF new_status IN ('archived', 'draft') THEN
            RETURN user_role = 'admin';
        ELSE
            RETURN FALSE;
        END IF;
    
    ELSIF old_status = 'archived' THEN
        -- Only admins can restore archived articles
        IF new_status IN ('draft', 'published') THEN
            RETURN user_role = 'admin';
        ELSE
            RETURN FALSE;
        END IF;
    
    ELSIF old_status = 'rejected' THEN
        -- Authors can resubmit rejected → draft
        -- Editors can approve rejected → review
        IF new_status = 'draft' THEN
            RETURN user_role IN ('author', 'editor', 'admin');
        ELSIF new_status = 'review' THEN
            RETURN user_role IN ('editor', 'admin');
        ELSE
            RETURN FALSE;
        END IF;
    
    ELSE
        -- Unknown old status
        RETURN FALSE;
    END IF;
END;
$$;

-- Function to log status transition
CREATE OR REPLACE FUNCTION log_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only log if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
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
            'Status transition via ' || current_setting('app.status_change_reason', true)
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger to validate and log status transitions
CREATE OR REPLACE FUNCTION enforce_article_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
    is_valid BOOLEAN;
BEGIN
    -- Service role bypasses validation (for automated systems)
    IF auth.role() = 'service_role' THEN
        RETURN NEW;
    END IF;
    
    -- If status didn't change, allow update
    IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Get current user role
    current_user_role := get_user_role();
    
    -- Validate transition
    is_valid := validate_article_status_transition(OLD.status, NEW.status, current_user_role);
    
    IF NOT is_valid THEN
        RAISE EXCEPTION 'Invalid status transition from % to % for role %',
            OLD.status, NEW.status, current_user_role;
    END IF;
    
    -- Log the transition
    PERFORM log_status_transition();
    
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS enforce_article_status_transition_trigger ON articles;
CREATE TRIGGER enforce_article_status_transition_trigger
    BEFORE UPDATE ON articles
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION enforce_article_status_transition();

-- Add CHECK constraint for valid status values
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_status_check;
ALTER TABLE articles ADD CONSTRAINT articles_status_check 
    CHECK (status IN ('draft', 'review', 'published', 'archived', 'rejected'));

-- Add comment
COMMENT ON TABLE article_status_history IS 'Tracks all article status transitions for audit trail';
COMMENT ON FUNCTION validate_article_status_transition IS 'Validates if a status transition is allowed for a given role';
COMMENT ON FUNCTION enforce_article_status_transition IS 'Trigger function that enforces valid status transitions';
