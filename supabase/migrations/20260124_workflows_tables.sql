-- =============================================
-- WORKFLOW AUTOMATION TABLES
-- Purpose: Store workflow definitions, runs, and logs
-- Part of No-Code Automation Builder
-- =============================================

-- ============================================
-- 1. WORKFLOWS TABLE
-- Stores workflow definitions (trigger -> conditions -> actions)
-- ============================================

CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic info
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    
    -- Workflow status
    is_enabled BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT false, -- System workflows can't be deleted
    
    -- Trigger configuration
    trigger_type TEXT NOT NULL CHECK (trigger_type IN (
        'article_created',
        'article_updated',
        'article_status_changed',
        'quality_passed',
        'quality_failed',
        'scheduled',
        'manual',
        'webhook',
        'scraper_completed',
        'revenue_threshold'
    )),
    trigger_config JSONB DEFAULT '{}'::jsonb,
    -- Example: {
    --   "schedule": "0 9 * * *", -- cron for scheduled
    --   "status_from": "review", "status_to": "approved", -- for status_changed
    --   "min_quality_score": 85 -- for quality_passed
    -- }
    
    -- Conditions (all must be true to execute)
    conditions JSONB DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"field": "category", "operator": "equals", "value": "credit-cards"},
    --   {"field": "quality_score", "operator": "gte", "value": 80},
    --   {"field": "status", "operator": "in", "value": ["review", "approved"]}
    -- ]
    
    -- Actions to execute (in order)
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"type": "publish", "config": {}},
    --   {"type": "notify", "config": {"channel": "slack", "message": "Article published!"}},
    --   {"type": "add_to_queue", "config": {"queue": "social_media"}}
    -- ]
    
    -- Execution settings
    run_limit INT DEFAULT 0, -- 0 = unlimited
    cooldown_seconds INT DEFAULT 0, -- Minimum seconds between runs
    timeout_seconds INT DEFAULT 300, -- Max execution time
    retry_count INT DEFAULT 3,
    retry_delay_seconds INT DEFAULT 60,
    
    -- Statistics
    total_runs INT DEFAULT 0,
    successful_runs INT DEFAULT 0,
    failed_runs INT DEFAULT 0,
    last_run_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    
    -- Metadata
    created_by TEXT DEFAULT 'system',
    tags TEXT[] DEFAULT '{}',
    priority INT DEFAULT 50, -- 1-100, higher = runs first
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for workflows
CREATE INDEX IF NOT EXISTS idx_workflows_enabled ON public.workflows(is_enabled) WHERE is_enabled = true;
CREATE INDEX IF NOT EXISTS idx_workflows_trigger ON public.workflows(trigger_type);
CREATE INDEX IF NOT EXISTS idx_workflows_priority ON public.workflows(priority DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_slug ON public.workflows(slug);
CREATE INDEX IF NOT EXISTS idx_workflows_tags ON public.workflows USING GIN(tags);

-- ============================================
-- 2. WORKFLOW_RUNS TABLE
-- Stores execution history
-- ============================================

CREATE TABLE IF NOT EXISTS public.workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Workflow reference
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    
    -- Run status
    status TEXT NOT NULL CHECK (status IN (
        'pending',
        'running',
        'completed',
        'failed',
        'cancelled',
        'timed_out',
        'skipped'
    )) DEFAULT 'pending',
    
    -- Trigger context
    trigger_type TEXT NOT NULL,
    trigger_data JSONB DEFAULT '{}'::jsonb,
    -- Example: {
    --   "article_id": "uuid",
    --   "previous_status": "draft",
    --   "new_status": "review"
    -- }
    
    -- Input/Output
    input_data JSONB DEFAULT '{}'::jsonb,
    output_data JSONB DEFAULT '{}'::jsonb,
    
    -- Action results
    actions_executed INT DEFAULT 0,
    actions_total INT DEFAULT 0,
    action_results JSONB DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"action": "publish", "status": "success", "duration_ms": 150},
    --   {"action": "notify", "status": "success", "duration_ms": 80}
    -- ]
    
    -- Error handling
    error_message TEXT,
    error_details JSONB,
    retry_count INT DEFAULT 0,
    
    -- Performance
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INT,
    
    -- Metadata
    initiated_by TEXT DEFAULT 'system', -- 'system', 'user:id', 'schedule'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for workflow_runs
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow ON public.workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON public.workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_created ON public.workflow_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_trigger ON public.workflow_runs(trigger_type);

-- ============================================
-- 3. WORKFLOW_LOGS TABLE
-- Detailed step-by-step execution logs
-- ============================================

CREATE TABLE IF NOT EXISTS public.workflow_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    run_id UUID NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
    
    -- Log entry
    level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')) DEFAULT 'info',
    step TEXT, -- 'trigger', 'condition_1', 'action_1', etc.
    message TEXT NOT NULL,
    
    -- Context
    data JSONB DEFAULT '{}'::jsonb,
    duration_ms INT,
    
    -- Timestamp
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for workflow_logs
CREATE INDEX IF NOT EXISTS idx_workflow_logs_run ON public.workflow_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_workflow ON public.workflow_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_level ON public.workflow_logs(level);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_logged ON public.workflow_logs(logged_at DESC);

-- ============================================
-- 4. WORKFLOW_TEMPLATES TABLE (Optional)
-- Pre-built workflow templates
-- ============================================

CREATE TABLE IF NOT EXISTS public.workflow_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Template info
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- 'content', 'notification', 'integration', etc.
    
    -- Template definition
    trigger_type TEXT NOT NULL,
    trigger_config JSONB DEFAULT '{}'::jsonb,
    conditions JSONB DEFAULT '[]'::jsonb,
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Metadata
    is_featured BOOLEAN DEFAULT false,
    use_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for templates
CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON public.workflow_templates(category);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to update workflow timestamp
CREATE OR REPLACE FUNCTION update_workflow_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for workflows updated_at
CREATE TRIGGER trigger_workflows_updated
    BEFORE UPDATE ON public.workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_workflow_timestamp();

-- Function to update workflow statistics after run
CREATE OR REPLACE FUNCTION update_workflow_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update on status change to completed or failed
    IF NEW.status IN ('completed', 'failed', 'cancelled', 'timed_out') AND OLD.status = 'running' THEN
        UPDATE public.workflows
        SET
            total_runs = total_runs + 1,
            successful_runs = CASE WHEN NEW.status = 'completed' THEN successful_runs + 1 ELSE successful_runs END,
            failed_runs = CASE WHEN NEW.status IN ('failed', 'timed_out') THEN failed_runs + 1 ELSE failed_runs END,
            last_run_at = NEW.completed_at,
            last_success_at = CASE WHEN NEW.status = 'completed' THEN NEW.completed_at ELSE last_success_at END,
            last_failure_at = CASE WHEN NEW.status IN ('failed', 'timed_out') THEN NEW.completed_at ELSE last_failure_at END
        WHERE id = NEW.workflow_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for workflow stats
CREATE TRIGGER trigger_workflow_run_stats
    AFTER UPDATE ON public.workflow_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_workflow_stats();

-- Function to get workflow with run history
CREATE OR REPLACE FUNCTION get_workflow_with_history(p_workflow_id UUID, p_limit INT DEFAULT 10)
RETURNS TABLE (
    workflow_id UUID,
    workflow_name TEXT,
    is_enabled BOOLEAN,
    trigger_type TEXT,
    total_runs INT,
    success_rate DECIMAL,
    recent_runs JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id as workflow_id,
        w.name as workflow_name,
        w.is_enabled,
        w.trigger_type,
        w.total_runs,
        CASE 
            WHEN w.total_runs > 0 THEN ROUND((w.successful_runs::DECIMAL / w.total_runs) * 100, 2)
            ELSE 0
        END as success_rate,
        COALESCE(
            (SELECT jsonb_agg(
                jsonb_build_object(
                    'id', r.id,
                    'status', r.status,
                    'started_at', r.started_at,
                    'duration_ms', r.duration_ms
                )
                ORDER BY r.created_at DESC
            )
            FROM public.workflow_runs r
            WHERE r.workflow_id = w.id
            LIMIT p_limit),
            '[]'::jsonb
        ) as recent_runs
    FROM public.workflows w
    WHERE w.id = p_workflow_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get pending scheduled workflows
CREATE OR REPLACE FUNCTION get_pending_scheduled_workflows()
RETURNS TABLE (
    workflow_id UUID,
    workflow_name TEXT,
    schedule TEXT,
    last_run_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.name,
        w.trigger_config->>'schedule',
        w.last_run_at
    FROM public.workflows w
    WHERE w.is_enabled = true
        AND w.trigger_type = 'scheduled'
        AND w.trigger_config->>'schedule' IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. INSERT DEFAULT TEMPLATES
-- ============================================

INSERT INTO public.workflow_templates (name, description, category, trigger_type, trigger_config, conditions, actions)
VALUES
    (
        'Auto-Publish High Quality',
        'Automatically publish articles with quality score above 85',
        'content',
        'quality_passed',
        '{"min_quality_score": 85}'::jsonb,
        '[]'::jsonb,
        '[{"type": "publish", "config": {}}, {"type": "notify", "config": {"message": "Article auto-published"}}]'::jsonb
    ),
    (
        'Review Notification',
        'Send notification when article moves to review',
        'notification',
        'article_status_changed',
        '{"status_to": "review"}'::jsonb,
        '[]'::jsonb,
        '[{"type": "notify", "config": {"channel": "email", "message": "Article ready for review"}}]'::jsonb
    ),
    (
        'Schedule Social Media',
        'Add published articles to social media queue',
        'content',
        'article_status_changed',
        '{"status_to": "published"}'::jsonb,
        '[]'::jsonb,
        '[{"type": "add_to_queue", "config": {"queue": "social_media"}}, {"type": "schedule_repurpose", "config": {"formats": ["twitter", "linkedin"]}}]'::jsonb
    ),
    (
        'Daily Content Refresh Check',
        'Check for stale content every morning',
        'content',
        'scheduled',
        '{"schedule": "0 9 * * *"}'::jsonb,
        '[]'::jsonb,
        '[{"type": "check_stale_content", "config": {"max_age_days": 90}}, {"type": "notify", "config": {"message": "Stale content report ready"}}]'::jsonb
    ),
    (
        'Revenue Alert',
        'Alert when article revenue drops significantly',
        'notification',
        'revenue_threshold',
        '{"threshold_type": "drop", "percentage": 30}'::jsonb,
        '[]'::jsonb,
        '[{"type": "notify", "config": {"channel": "slack", "priority": "high", "message": "Revenue drop detected"}}]'::jsonb
    )
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (solo operator model)
CREATE POLICY "workflows_all_authenticated" ON public.workflows
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "workflow_runs_all_authenticated" ON public.workflow_runs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "workflow_logs_all_authenticated" ON public.workflow_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "workflow_templates_all_authenticated" ON public.workflow_templates
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 8. COMMENTS
-- ============================================

COMMENT ON TABLE public.workflows IS 'Stores no-code workflow automation definitions with trigger-condition-action pattern';
COMMENT ON TABLE public.workflow_runs IS 'Stores workflow execution history and results';
COMMENT ON TABLE public.workflow_logs IS 'Stores detailed step-by-step execution logs for debugging';
COMMENT ON TABLE public.workflow_templates IS 'Pre-built workflow templates for quick setup';

COMMENT ON COLUMN public.workflows.trigger_type IS 'Event that starts the workflow: article_created, scheduled, manual, etc.';
COMMENT ON COLUMN public.workflows.conditions IS 'Array of conditions that must all be true for actions to execute';
COMMENT ON COLUMN public.workflows.actions IS 'Array of actions to execute in order when workflow is triggered';
