-- Workflow Engine Schema
-- State machine and workflow persistence

-- Workflow Definitions Table
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    description TEXT,
    definition JSONB NOT NULL, -- WorkflowDefinition JSON
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, version)
);

-- Workflow Instances Table
CREATE TABLE IF NOT EXISTS workflow_instances (
    id UUID PRIMARY KEY,
    workflow_id TEXT NOT NULL,
    workflow_version TEXT NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'paused')),
    current_step TEXT,
    completed_steps TEXT[] DEFAULT '{}',
    failed_steps TEXT[] DEFAULT '{}',
    context JSONB DEFAULT '{}',
    result JSONB,
    error TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Execution History Table
CREATE TABLE IF NOT EXISTS workflow_execution_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('started', 'completed', 'failed', 'skipped')),
    input JSONB,
    output JSONB,
    error TEXT,
    duration INTEGER, -- Milliseconds
    retry_attempt INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- State Transitions Table (for content lifecycle)
CREATE TABLE IF NOT EXISTS state_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'article', 'workflow', etc.
    entity_id UUID NOT NULL,
    from_state TEXT NOT NULL,
    to_state TEXT NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_instances_workflow_id ON workflow_instances(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_state ON workflow_instances(state);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_started_at ON workflow_instances(started_at);
CREATE INDEX IF NOT EXISTS idx_workflow_history_instance_id ON workflow_execution_history(workflow_instance_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_step_id ON workflow_execution_history(step_id);
CREATE INDEX IF NOT EXISTS idx_state_transitions_entity ON state_transitions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_state_transitions_timestamp ON state_transitions(timestamp);

-- RLS Policies
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_execution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_transitions ENABLE ROW LEVEL SECURITY;

-- Public read access to active workflow definitions
CREATE POLICY "Public can view active workflow definitions"
ON workflow_definitions FOR SELECT
USING (is_active = true);

-- Authenticated users can view their own workflow instances
CREATE POLICY "Users can view own workflow instances"
ON workflow_instances FOR SELECT
USING (auth.uid()::text = (metadata->>'userId')::text OR auth.jwt() ->> 'role' = 'admin');

-- Authenticated users can create workflow instances
CREATE POLICY "Users can create workflow instances"
ON workflow_instances FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Admins have full access
CREATE POLICY "Admins can manage workflows"
ON workflow_definitions FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage workflow instances"
ON workflow_instances FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view workflow history"
ON workflow_execution_history FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view state transitions"
ON state_transitions FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

-- Functions
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_workflow_definitions_updated_at
    BEFORE UPDATE ON workflow_definitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_instances_updated_at
    BEFORE UPDATE ON workflow_instances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
