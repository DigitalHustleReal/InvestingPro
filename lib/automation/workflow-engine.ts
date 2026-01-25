/**
 * Workflow Engine
 * 
 * Purpose: Execute workflow rules using trigger -> conditions -> actions pattern
 * 
 * Features:
 * - Event-driven workflow execution
 * - Condition evaluation
 * - Sequential action execution
 * - Error handling and retries
 * - Run logging and history
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { 
  TriggerType, 
  TriggerConfig, 
  TriggerContext,
  triggerRegistry,
  createTriggerContext,
} from './workflow-triggers';
import { 
  ActionType, 
  ActionConfig, 
  ActionContext, 
  ActionResult,
  actionRegistry,
} from './workflow-actions';

// ============================================
// TYPES
// ============================================

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  is_enabled: boolean;
  is_system: boolean;
  trigger_type: TriggerType;
  trigger_config: TriggerConfig;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  run_limit: number;
  cooldown_seconds: number;
  timeout_seconds: number;
  retry_count: number;
  retry_delay_seconds: number;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  last_run_at?: string;
  created_by: string;
  tags: string[];
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'exists' | 'not_exists';
  value: any;
}

export interface WorkflowAction {
  type: ActionType;
  config: ActionConfig;
  continue_on_error?: boolean;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timed_out' | 'skipped';
  trigger_type: TriggerType;
  trigger_data: Record<string, any>;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  actions_executed: number;
  actions_total: number;
  action_results: ActionResult[];
  error_message?: string;
  error_details?: Record<string, any>;
  retry_count: number;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  initiated_by: string;
  created_at: string;
}

export interface WorkflowLog {
  id: string;
  workflow_id: string;
  run_id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  step?: string;
  message: string;
  data?: Record<string, any>;
  duration_ms?: number;
  logged_at: string;
}

export interface ExecuteOptions {
  dryRun?: boolean;
  initiatedBy?: string;
  skipConditions?: boolean;
}

// ============================================
// WORKFLOW ENGINE CLASS
// ============================================

export class WorkflowEngine {
  private supabase = createClient();
  private runningWorkflows: Set<string> = new Set();

  // ============================================
  // MAIN EXECUTION METHODS
  // ============================================

  /**
   * Fire an event that may trigger workflows
   */
  async fireEvent(
    eventType: TriggerType,
    eventData: Record<string, any>,
    source?: string
  ): Promise<WorkflowRun[]> {
    try {
      // Find all enabled workflows with matching trigger type
      const { data: workflows, error } = await this.supabase
        .from('workflows')
        .select('*')
        .eq('is_enabled', true)
        .eq('trigger_type', eventType)
        .order('priority', { ascending: false });

      if (error) {
        logger.error('Error fetching workflows', error);
        return [];
      }

      if (!workflows || workflows.length === 0) {
        return [];
      }

      const runs: WorkflowRun[] = [];

      // Check each workflow
      for (const workflow of workflows) {
        // Check if event matches trigger config
        if (triggerRegistry.matchesEvent(eventType, eventData, workflow.trigger_config)) {
          const context = createTriggerContext(eventType, eventData, source);
          const run = await this.executeWorkflow(workflow as Workflow, context, { initiatedBy: source || 'event' });
          runs.push(run);
        }
      }

      return runs;
    } catch (error) {
      logger.error('Error firing event', error as Error);
      return [];
    }
  }

  /**
   * Execute a specific workflow
   */
  async executeWorkflow(
    workflow: Workflow,
    triggerContext: TriggerContext,
    options: ExecuteOptions = {}
  ): Promise<WorkflowRun> {
    const { dryRun = false, initiatedBy = 'system', skipConditions = false } = options;

    // Create run record
    const run = await this.createRun(workflow, triggerContext, initiatedBy);

    // Check if workflow is already running (cooldown)
    if (this.runningWorkflows.has(workflow.id)) {
      return this.updateRun(run.id, {
        status: 'skipped',
        error_message: 'Workflow is already running',
        completed_at: new Date().toISOString(),
      });
    }

    // Check cooldown
    if (workflow.cooldown_seconds > 0 && workflow.last_run_at) {
      const lastRun = new Date(workflow.last_run_at).getTime();
      const cooldownEnd = lastRun + workflow.cooldown_seconds * 1000;
      if (Date.now() < cooldownEnd) {
        return this.updateRun(run.id, {
          status: 'skipped',
          error_message: 'Workflow is in cooldown period',
          completed_at: new Date().toISOString(),
        });
      }
    }

    // Mark as running
    this.runningWorkflows.add(workflow.id);
    await this.updateRun(run.id, {
      status: 'running',
      started_at: new Date().toISOString(),
    });

    try {
      // Log start
      await this.log(workflow.id, run.id, 'info', 'trigger', `Workflow triggered: ${workflow.name}`);

      // Evaluate conditions
      if (!skipConditions && workflow.conditions.length > 0) {
        const conditionsResult = this.evaluateConditions(workflow.conditions, triggerContext.data);
        if (!conditionsResult.passed) {
          await this.log(workflow.id, run.id, 'info', 'conditions', `Conditions not met: ${conditionsResult.reason}`);
          return this.completeRun(run.id, workflow.id, 'skipped', {
            error_message: `Conditions not met: ${conditionsResult.reason}`,
          });
        }
        await this.log(workflow.id, run.id, 'info', 'conditions', 'All conditions passed');
      }

      // Execute actions
      const actionContext: ActionContext = {
        workflowId: workflow.id,
        runId: run.id,
        triggerData: triggerContext.data,
        previousResults: [],
        variables: {},
      };

      const actionResults: ActionResult[] = [];
      let actionsExecuted = 0;

      for (let i = 0; i < workflow.actions.length; i++) {
        const action = workflow.actions[i];
        
        if (dryRun) {
          await this.log(workflow.id, run.id, 'info', `action_${i}`, `[DRY RUN] Would execute: ${action.type}`);
          actionResults.push({
            actionType: action.type,
            status: 'success',
            output: { dryRun: true },
            duration_ms: 0,
          });
          actionsExecuted++;
          continue;
        }

        await this.log(workflow.id, run.id, 'info', `action_${i}`, `Executing action: ${action.type}`);
        
        const startTime = Date.now();
        const result = await actionRegistry.execute(action.type, action.config, actionContext);
        
        await this.log(
          workflow.id, 
          run.id, 
          result.status === 'failed' ? 'error' : 'info', 
          `action_${i}`,
          `Action ${action.type} ${result.status}`,
          { result, duration_ms: Date.now() - startTime }
        );

        actionResults.push(result);
        actionContext.previousResults.push(result);
        actionsExecuted++;

        // Check if we should stop on error
        if (result.status === 'failed' && !action.continue_on_error) {
          await this.log(workflow.id, run.id, 'error', `action_${i}`, `Stopping workflow due to error: ${result.error}`);
          return this.completeRun(run.id, workflow.id, 'failed', {
            actions_executed: actionsExecuted,
            action_results: actionResults,
            error_message: result.error,
          });
        }
      }

      // Complete successfully
      return this.completeRun(run.id, workflow.id, 'completed', {
        actions_executed: actionsExecuted,
        action_results: actionResults,
        output_data: { lastResult: actionResults[actionResults.length - 1] },
      });
    } catch (error) {
      logger.error('Workflow execution error', error as Error);
      await this.log(workflow.id, run.id, 'error', 'execution', `Error: ${(error as Error).message}`);
      return this.completeRun(run.id, workflow.id, 'failed', {
        error_message: (error as Error).message,
        error_details: { stack: (error as Error).stack },
      });
    } finally {
      this.runningWorkflows.delete(workflow.id);
    }
  }

  /**
   * Execute workflow by ID
   */
  async executeWorkflowById(
    workflowId: string,
    triggerData: Record<string, any> = {},
    options: ExecuteOptions = {}
  ): Promise<WorkflowRun | null> {
    const { data: workflow, error } = await this.supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (error || !workflow) {
      logger.error('Workflow not found', { workflowId });
      return null;
    }

    const context = createTriggerContext(workflow.trigger_type as TriggerType, triggerData, 'manual');
    return this.executeWorkflow(workflow as Workflow, context, options);
  }

  // ============================================
  // CONDITION EVALUATION
  // ============================================

  /**
   * Evaluate all conditions
   */
  private evaluateConditions(
    conditions: WorkflowCondition[],
    data: Record<string, any>
  ): { passed: boolean; reason?: string } {
    for (const condition of conditions) {
      const result = this.evaluateCondition(condition, data);
      if (!result) {
        return { passed: false, reason: `${condition.field} ${condition.operator} ${condition.value}` };
      }
    }
    return { passed: true };
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: WorkflowCondition, data: Record<string, any>): boolean {
    const { field, operator, value } = condition;
    const fieldValue = this.getNestedValue(data, field);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'gt':
        return Number(fieldValue) > Number(value);
      case 'gte':
        return Number(fieldValue) >= Number(value);
      case 'lt':
        return Number(fieldValue) < Number(value);
      case 'lte':
        return Number(fieldValue) <= Number(value);
      case 'in':
        return Array.isArray(value) ? value.includes(fieldValue) : false;
      case 'not_in':
        return Array.isArray(value) ? !value.includes(fieldValue) : true;
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      default:
        return false;
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // ============================================
  // RUN MANAGEMENT
  // ============================================

  /**
   * Create a new run record
   */
  private async createRun(
    workflow: Workflow,
    triggerContext: TriggerContext,
    initiatedBy: string
  ): Promise<WorkflowRun> {
    const run: Partial<WorkflowRun> = {
      workflow_id: workflow.id,
      status: 'pending',
      trigger_type: workflow.trigger_type,
      trigger_data: triggerContext.data,
      input_data: {},
      output_data: {},
      actions_executed: 0,
      actions_total: workflow.actions.length,
      action_results: [],
      retry_count: 0,
      initiated_by: initiatedBy,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('workflow_runs')
      .insert(run)
      .select()
      .single();

    if (error) {
      logger.error('Error creating workflow run', error);
      // Return a mock run for error cases
      return {
        id: `mock_${Date.now()}`,
        ...run,
      } as WorkflowRun;
    }

    return data as WorkflowRun;
  }

  /**
   * Update run record
   */
  private async updateRun(runId: string, updates: Partial<WorkflowRun>): Promise<WorkflowRun> {
    const { data, error } = await this.supabase
      .from('workflow_runs')
      .update(updates)
      .eq('id', runId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating workflow run', error);
    }

    return data as WorkflowRun;
  }

  /**
   * Complete run and update workflow stats
   */
  private async completeRun(
    runId: string,
    workflowId: string,
    status: WorkflowRun['status'],
    updates: Partial<WorkflowRun>
  ): Promise<WorkflowRun> {
    const completedAt = new Date().toISOString();
    
    const run = await this.updateRun(runId, {
      ...updates,
      status,
      completed_at: completedAt,
    });

    // Note: Workflow stats are updated via database trigger
    
    return run;
  }

  // ============================================
  // LOGGING
  // ============================================

  /**
   * Log workflow execution step
   */
  private async log(
    workflowId: string,
    runId: string,
    level: WorkflowLog['level'],
    step: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await this.supabase
        .from('workflow_logs')
        .insert({
          workflow_id: workflowId,
          run_id: runId,
          level,
          step,
          message,
          data,
          logged_at: new Date().toISOString(),
        });
    } catch (error) {
      // Don't fail workflow for logging errors
      logger.debug('Could not write workflow log', { workflowId, runId, message });
    }
  }

  // ============================================
  // WORKFLOW MANAGEMENT
  // ============================================

  /**
   * Get all workflows
   */
  async getWorkflows(options: { enabled_only?: boolean; category?: string } = {}): Promise<Workflow[]> {
    let query = this.supabase.from('workflows').select('*').order('priority', { ascending: false });

    if (options.enabled_only) {
      query = query.eq('is_enabled', true);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching workflows', error);
      return [];
    }

    return (data || []) as Workflow[];
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(id: string): Promise<Workflow | null> {
    const { data, error } = await this.supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching workflow', error);
      return null;
    }

    return data as Workflow;
  }

  /**
   * Create workflow
   */
  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow | null> {
    const { data, error } = await this.supabase
      .from('workflows')
      .insert({
        ...workflow,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating workflow', error);
      return null;
    }

    return data as Workflow;
  }

  /**
   * Update workflow
   */
  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    const { data, error } = await this.supabase
      .from('workflows')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating workflow', error);
      return null;
    }

    return data as Workflow;
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('workflows')
      .delete()
      .eq('id', id)
      .eq('is_system', false); // Can't delete system workflows

    if (error) {
      logger.error('Error deleting workflow', error);
      return false;
    }

    return true;
  }

  /**
   * Toggle workflow enabled status
   */
  async toggleWorkflow(id: string, enabled: boolean): Promise<Workflow | null> {
    return this.updateWorkflow(id, { is_enabled: enabled });
  }

  /**
   * Get workflow runs
   */
  async getWorkflowRuns(workflowId: string, limit: number = 20): Promise<WorkflowRun[]> {
    const { data, error } = await this.supabase
      .from('workflow_runs')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Error fetching workflow runs', error);
      return [];
    }

    return (data || []) as WorkflowRun[];
  }

  /**
   * Get run logs
   */
  async getRunLogs(runId: string): Promise<WorkflowLog[]> {
    const { data, error } = await this.supabase
      .from('workflow_logs')
      .select('*')
      .eq('run_id', runId)
      .order('logged_at', { ascending: true });

    if (error) {
      logger.error('Error fetching run logs', error);
      return [];
    }

    return (data || []) as WorkflowLog[];
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const workflowEngine = new WorkflowEngine();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function fireWorkflowEvent(
  eventType: TriggerType,
  eventData: Record<string, any>,
  source?: string
): Promise<WorkflowRun[]> {
  return workflowEngine.fireEvent(eventType, eventData, source);
}

export async function executeWorkflow(
  workflowId: string,
  triggerData?: Record<string, any>,
  options?: ExecuteOptions
): Promise<WorkflowRun | null> {
  return workflowEngine.executeWorkflowById(workflowId, triggerData, options);
}

export async function getWorkflows(options?: { enabled_only?: boolean }): Promise<Workflow[]> {
  return workflowEngine.getWorkflows(options);
}

export async function createWorkflow(workflow: Partial<Workflow>): Promise<Workflow | null> {
  return workflowEngine.createWorkflow(workflow);
}

export async function updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
  return workflowEngine.updateWorkflow(id, updates);
}

export async function toggleWorkflow(id: string, enabled: boolean): Promise<Workflow | null> {
  return workflowEngine.toggleWorkflow(id, enabled);
}
