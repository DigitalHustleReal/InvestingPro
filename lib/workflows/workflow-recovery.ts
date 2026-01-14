/**
 * Workflow Recovery
 * Recovers and resumes failed or paused workflows
 */

import { WorkflowInstance, WorkflowDefinition } from './types';
import { workflowRepository } from './workflow-repository';
import { workflowExecutor } from './workflow-engine';
import { logger } from '@/lib/logger';

export interface RecoveryOptions {
  resumeFromStep?: string; // Resume from specific step
  skipFailedSteps?: boolean; // Skip steps that failed
  retryFailedSteps?: boolean; // Retry failed steps
  resetContext?: boolean; // Reset workflow context
}

class WorkflowRecovery {
  /**
   * Recover a failed workflow
   */
  async recoverWorkflow(
    instanceId: string,
    options: RecoveryOptions = {}
  ): Promise<WorkflowInstance> {
    const instance = await workflowRepository.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance not found: ${instanceId}`);
    }

    if (instance.state === 'completed') {
      throw new Error('Workflow is already completed');
    }

    logger.info('Recovering workflow', {
      instanceId,
      currentState: instance.state,
      options,
    });

    // Get workflow definition
    const definition = await workflowRepository.getDefinition(
      instance.workflowId,
      instance.workflowVersion
    );
    if (!definition) {
      throw new Error(`Workflow definition not found: ${instance.workflowId}`);
    }

    // Reset context if requested
    if (options.resetContext) {
      instance.context = {};
    }

    // Handle failed steps
    if (options.skipFailedSteps) {
      // Mark failed steps as skipped and continue
      instance.failedSteps = [];
      logger.info('Skipping failed steps', { instanceId });
    } else if (options.retryFailedSteps) {
      // Remove from failed steps to allow retry
      instance.failedSteps = [];
      logger.info('Retrying failed steps', { instanceId });
    }

    // Resume from specific step
    if (options.resumeFromStep) {
      // Remove completed steps after resume point
      const resumeIndex = instance.completedSteps.indexOf(options.resumeFromStep);
      if (resumeIndex >= 0) {
        instance.completedSteps = instance.completedSteps.slice(0, resumeIndex);
      }
      logger.info('Resuming from step', {
        instanceId,
        stepId: options.resumeFromStep,
      });
    }

    // Reset state
    instance.state = 'running';
    instance.error = undefined;
    instance.currentStep = options.resumeFromStep;

    // Save updated instance
    await workflowRepository.saveInstance(instance);

    try {
      // Resume execution
      await this.resumeExecution(definition, instance);

      instance.state = 'completed';
      instance.completedAt = new Date().toISOString();
      await workflowRepository.saveInstance(instance);

      logger.info('Workflow recovered successfully', { instanceId });
    } catch (error) {
      instance.state = 'failed';
      instance.error = error instanceof Error ? error.message : String(error);
      instance.completedAt = new Date().toISOString();
      await workflowRepository.saveInstance(instance);

      logger.error('Workflow recovery failed', error instanceof Error ? error : new Error(String(error)), {
        instanceId,
      });

      throw error;
    }

    return instance;
  }

  /**
   * Resume workflow execution
   */
  private async resumeExecution(
    definition: WorkflowDefinition,
    instance: WorkflowInstance
  ): Promise<void> {
    // Use workflow executor's internal step execution
    // This is a simplified version - in production, would call executor's resume method
    const executor = workflowExecutor as any;
    if (executor.executeSteps) {
      await executor.executeSteps(definition, instance);
    } else {
      throw new Error('Workflow executor does not support resume');
    }
  }

  /**
   * Resume a paused workflow
   */
  async resumePausedWorkflow(
    instanceId: string,
    stepResult?: any
  ): Promise<WorkflowInstance> {
    const instance = await workflowRepository.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance not found: ${instanceId}`);
    }

    if (instance.state !== 'paused') {
      throw new Error(`Workflow is not paused: ${instance.state}`);
    }

    if (!instance.currentStep) {
      throw new Error('No current step to resume from');
    }

    logger.info('Resuming paused workflow', {
      instanceId,
      currentStep: instance.currentStep,
    });

    // Store step result if provided
    if (stepResult !== undefined) {
      instance.context[instance.currentStep] = stepResult;
      instance.completedSteps.push(instance.currentStep);
    }

    // Get workflow definition
    const definition = await workflowRepository.getDefinition(
      instance.workflowId,
      instance.workflowVersion
    );
    if (!definition) {
      throw new Error(`Workflow definition not found: ${instance.workflowId}`);
    }

    // Resume execution
    instance.state = 'running';
    instance.currentStep = undefined;
    await workflowRepository.saveInstance(instance);

    try {
      await this.resumeExecution(definition, instance);

      instance.state = 'completed';
      instance.completedAt = new Date().toISOString();
      await workflowRepository.saveInstance(instance);

      logger.info('Paused workflow resumed successfully', { instanceId });
    } catch (error) {
      instance.state = 'failed';
      instance.error = error instanceof Error ? error.message : String(error);
      instance.completedAt = new Date().toISOString();
      await workflowRepository.saveInstance(instance);

      logger.error('Failed to resume paused workflow', error instanceof Error ? error : new Error(String(error)), {
        instanceId,
      });

      throw error;
    }

    return instance;
  }

  /**
   * Get recoverable workflows
   */
  async getRecoverableWorkflows(): Promise<WorkflowInstance[]> {
    // Get failed and paused workflows
    const failed = await workflowRepository.getInstancesByState('failed');
    const paused = await workflowRepository.getInstancesByState('paused');

    return [...failed, ...paused];
  }
}

// Export singleton instance
export const workflowRecovery = new WorkflowRecovery();
