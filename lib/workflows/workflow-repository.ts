/**
 * Workflow Repository
 * Persists workflow state and history
 */

import { createClient } from '@/lib/supabase/server';
import { 
  WorkflowDefinition, 
  WorkflowInstance, 
  WorkflowExecutionHistory 
} from './types';
import { logger } from '@/lib/logger';

export class WorkflowRepository {
  private async getClient() {
    return await createClient();
  }

  /**
   * Save workflow definition
   */
  async saveDefinition(definition: WorkflowDefinition): Promise<void> {
    const supabase = await this.getClient();
    
    const { error } = await supabase
      .from('workflow_definitions')
      .upsert({
        id: definition.id,
        name: definition.name,
        version: definition.version,
        description: definition.description,
        definition: definition as any,
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'name,version'
      });

    if (error) {
      logger.error('Failed to save workflow definition', error);
      throw new Error(`Failed to save workflow definition: ${error.message}`);
    }
  }

  /**
   * Get workflow definition
   */
  async getDefinition(name: string, version?: string): Promise<WorkflowDefinition | null> {
    const supabase = await this.getClient();
    
    let query = supabase
      .from('workflow_definitions')
      .select('*')
      .eq('name', name)
      .eq('is_active', true);

    if (version) {
      query = query.eq('version', version);
    } else {
      // Get latest version
      query = query.order('version', { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return null;
    }

    return data.definition as WorkflowDefinition;
  }

  /**
   * Save workflow instance
   */
  async saveInstance(instance: WorkflowInstance): Promise<void> {
    const supabase = await this.getClient();
    
    const { error } = await supabase
      .from('workflow_instances')
      .upsert({
        id: instance.id,
        workflow_id: instance.workflowId,
        workflow_version: instance.workflowVersion,
        state: instance.state,
        current_step: instance.currentStep,
        completed_steps: instance.completedSteps,
        failed_steps: instance.failedSteps,
        context: instance.context,
        result: instance.result,
        error: instance.error,
        started_at: instance.startedAt,
        completed_at: instance.completedAt,
        metadata: instance.metadata,
        updated_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Failed to save workflow instance', error);
      throw new Error(`Failed to save workflow instance: ${error.message}`);
    }
  }

  /**
   * Get workflow instance
   */
  async getInstance(instanceId: string): Promise<WorkflowInstance | null> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      workflowId: data.workflow_id,
      workflowVersion: data.workflow_version,
      state: data.state as WorkflowInstance['state'],
      currentStep: data.current_step,
      completedSteps: data.completed_steps || [],
      failedSteps: data.failed_steps || [],
      context: data.context || {},
      result: data.result,
      error: data.error,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      metadata: data.metadata || {}
    };
  }

  /**
   * Save execution history
   */
  async saveHistory(history: WorkflowExecutionHistory): Promise<void> {
    const supabase = await this.getClient();
    
    const { error } = await supabase
      .from('workflow_execution_history')
      .insert({
        workflow_instance_id: history.workflowInstanceId,
        step_id: history.stepId,
        state: history.state,
        input: history.input,
        output: history.output,
        error: history.error,
        duration: history.duration,
        retry_attempt: history.retryAttempt,
        timestamp: history.timestamp,
        metadata: history.metadata
      });

    if (error) {
      logger.error('Failed to save workflow history', error);
      // Don't throw - history is not critical
    }
  }

  /**
   * Get execution history for an instance
   */
  async getHistory(instanceId: string): Promise<WorkflowExecutionHistory[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('workflow_execution_history')
      .select('*')
      .eq('workflow_instance_id', instanceId)
      .order('timestamp', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      workflowInstanceId: item.workflow_instance_id,
      stepId: item.step_id,
      state: item.state as WorkflowExecutionHistory['state'],
      input: item.input,
      output: item.output,
      error: item.error,
      duration: item.duration,
      retryAttempt: item.retry_attempt || 0,
      timestamp: item.timestamp,
      metadata: item.metadata || {}
    }));
  }

  /**
   * Get active workflow instances
   */
  async getActiveInstances(): Promise<WorkflowInstance[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('workflow_instances')
      .select('*')
      .in('state', ['pending', 'running', 'paused'])
      .order('started_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(this.mapInstance);
  }

  /**
   * Get failed workflow instances
   */
  async getFailedInstances(limit: number = 10): Promise<WorkflowInstance[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('state', 'failed')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data.map(this.mapInstance);
  }

  /**
   * Get workflow instances by state
   */
  async getInstancesByState(state: WorkflowInstance['state'], limit: number = 100): Promise<WorkflowInstance[]> {
    const supabase = await this.getClient();
    
    const { data, error } = await supabase
      .from('workflow_instances')
      .select('*')
      .eq('state', state)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data.map(this.mapInstance);
  }

  /**
   * Map database row to WorkflowInstance
   */
  private mapInstance(data: any): WorkflowInstance {
    return {
      id: data.id,
      workflowId: data.workflow_id,
      workflowVersion: data.workflow_version,
      state: data.state as WorkflowInstance['state'],
      currentStep: data.current_step,
      completedSteps: data.completed_steps || [],
      failedSteps: data.failed_steps || [],
      context: data.context || {},
      result: data.result,
      error: data.error,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      metadata: data.metadata || {}
    };
  }
}

/**
 * Singleton instance
 */
export const workflowRepository = new WorkflowRepository();
