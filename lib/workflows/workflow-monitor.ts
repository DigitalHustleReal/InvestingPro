/**
 * Workflow Monitor
 * Utilities for monitoring and debugging workflows
 */

import { workflowRepository } from './workflow-repository';
import { WorkflowInstance, WorkflowState } from './types';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface WorkflowMetrics {
  total: number;
  byState: Record<WorkflowState, number>;
  averageDuration: number;
  successRate: number;
  failureRate: number;
}

export class WorkflowMonitor {
  /**
   * Get workflow metrics
   */
  async getMetrics(workflowId?: string, timeRange?: { start: string; end: string }): Promise<WorkflowMetrics> {
    const supabase = await createClient();
    
    let query = supabase
      .from('workflow_instances')
      .select('state, started_at, completed_at');

    if (workflowId) {
      query = query.eq('workflow_id', workflowId);
    }

    if (timeRange) {
      query = query.gte('started_at', timeRange.start).lte('started_at', timeRange.end);
    }

    const { data, error } = await query;

    if (error || !data) {
      return {
        total: 0,
        byState: {
          pending: 0,
          running: 0,
          completed: 0,
          failed: 0,
          cancelled: 0,
          paused: 0
        },
        averageDuration: 0,
        successRate: 0,
        failureRate: 0
      };
    }

    const total = data.length;
    const byState: Record<WorkflowState, number> = {
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      paused: 0
    };

    let totalDuration = 0;
    let completedCount = 0;
    let failedCount = 0;

    data.forEach(instance => {
      const state = instance.state as WorkflowState;
      byState[state] = (byState[state] || 0) + 1;

      if (instance.completed_at && instance.started_at) {
        const duration = new Date(instance.completed_at).getTime() - new Date(instance.started_at).getTime();
        totalDuration += duration;
        completedCount++;
      }

      if (state === 'failed') {
        failedCount++;
      }
    });

    const averageDuration = completedCount > 0 ? totalDuration / completedCount : 0;
    const successRate = total > 0 ? ((total - failedCount) / total) * 100 : 0;
    const failureRate = total > 0 ? (failedCount / total) * 100 : 0;

    return {
      total,
      byState,
      averageDuration,
      successRate,
      failureRate
    };
  }

  /**
   * Get active workflows
   */
  async getActiveWorkflows(): Promise<WorkflowInstance[]> {
    return await workflowRepository.getActiveInstances();
  }

  /**
   * Get failed workflows
   */
  async getFailedWorkflows(limit: number = 10): Promise<WorkflowInstance[]> {
    return await workflowRepository.getFailedInstances(limit);
  }

  /**
   * Get workflow execution summary
   */
  async getExecutionSummary(instanceId: string): Promise<{
    instance: WorkflowInstance | null;
    history: any[];
    duration: number | null;
    stepsCompleted: number;
    stepsFailed: number;
  }> {
    const instance = await workflowRepository.getInstance(instanceId);
    const history = await workflowRepository.getHistory(instanceId);

    if (!instance) {
      return {
        instance: null,
        history: [],
        duration: null,
        stepsCompleted: 0,
        stepsFailed: 0
      };
    }

    const duration = instance.completedAt && instance.startedAt
      ? new Date(instance.completedAt).getTime() - new Date(instance.startedAt).getTime()
      : null;

    const stepsCompleted = instance.completedSteps.length;
    const stepsFailed = instance.failedSteps.length;

    return {
      instance,
      history,
      duration,
      stepsCompleted,
      stepsFailed
    };
  }

  /**
   * Debug workflow execution
   */
  async debugWorkflow(instanceId: string): Promise<{
    instance: WorkflowInstance | null;
    issues: string[];
    recommendations: string[];
  }> {
    const instance = await workflowRepository.getInstance(instanceId);
    const history = await workflowRepository.getHistory(instanceId);

    if (!instance) {
      return {
        instance: null,
        issues: ['Workflow instance not found'],
        recommendations: []
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for failed steps
    if (instance.failedSteps.length > 0) {
      issues.push(`Failed steps: ${instance.failedSteps.join(', ')}`);
      recommendations.push('Review failed step errors in execution history');
    }

    // Check for stuck workflows
    if (instance.state === 'running') {
      const runningTime = Date.now() - new Date(instance.startedAt).getTime();
      if (runningTime > 3600000) { // 1 hour
        issues.push('Workflow has been running for over 1 hour');
        recommendations.push('Check if workflow is stuck or step is waiting for manual intervention');
      }
    }

    // Check for paused workflows
    if (instance.state === 'paused') {
      issues.push('Workflow is paused waiting for manual step');
      recommendations.push('Complete manual step to resume workflow');
    }

    // Check execution history for errors
    const errors = history.filter(h => h.state === 'failed');
    if (errors.length > 0) {
      issues.push(`${errors.length} step(s) failed during execution`);
      recommendations.push('Review error details in execution history');
    }

    return {
      instance,
      issues,
      recommendations
    };
  }
}

/**
 * Singleton instance
 */
export const workflowMonitor = new WorkflowMonitor();
