/**
 * Workflow Rollback
 * Implements rollback logic for failed workflow steps
 */

import { WorkflowInstance, WorkflowStep } from './types';
import { workflowRepository } from './workflow-repository';
import { logger } from '@/lib/logger';

export interface RollbackAction {
  stepId: string;
  action: string; // Rollback action to execute
  context?: Record<string, any>;
}

class WorkflowRollback {
  /**
   * Rollback a workflow to a previous state
   */
  async rollbackWorkflow(
    instanceId: string,
    toStepId?: string
  ): Promise<WorkflowInstance> {
    const instance = await workflowRepository.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance not found: ${instanceId}`);
    }

    logger.info('Rolling back workflow', {
      instanceId,
      toStepId,
      currentState: instance.state,
    });

    // Get workflow definition
    const definition = await workflowRepository.getDefinition(
      instance.workflowId,
      instance.workflowVersion
    );
    if (!definition) {
      throw new Error(`Workflow definition not found: ${instance.workflowId}`);
    }

    // Determine rollback point
    const rollbackPoint = toStepId || this.findRollbackPoint(instance, definition);

    if (!rollbackPoint) {
      throw new Error('Cannot determine rollback point');
    }

    // Execute rollback actions for steps after rollback point
    const stepsToRollback = this.getStepsToRollback(instance, definition, rollbackPoint);
    
    for (const step of stepsToRollback) {
      try {
        await this.rollbackStep(step, instance);
      } catch (error) {
        logger.error('Failed to rollback step', error instanceof Error ? error : new Error(String(error)), {
          instanceId,
          stepId: step.id,
        });
        // Continue with other rollbacks even if one fails
      }
    }

    // Update instance state
    const rollbackIndex = instance.completedSteps.indexOf(rollbackPoint);
    if (rollbackIndex >= 0) {
      instance.completedSteps = instance.completedSteps.slice(0, rollbackIndex);
    }

    // Remove failed steps
    instance.failedSteps = [];
    instance.state = 'running';
    instance.currentStep = rollbackPoint;
    instance.error = undefined;

    await workflowRepository.saveInstance(instance);

    logger.info('Workflow rolled back successfully', {
      instanceId,
      rollbackPoint,
    });

    return instance;
  }

  /**
   * Find the best rollback point
   */
  private findRollbackPoint(
    instance: WorkflowInstance,
    definition: any
  ): string | null {
    // Find the last successful step before the first failed step
    if (instance.failedSteps.length > 0) {
      const firstFailedStep = instance.failedSteps[0];
      const failedIndex = instance.completedSteps.indexOf(firstFailedStep);
      
      if (failedIndex > 0) {
        return instance.completedSteps[failedIndex - 1];
      }
    }

    // If no failed steps, rollback to beginning
    return instance.completedSteps.length > 0 ? instance.completedSteps[0] : null;
  }

  /**
   * Get steps that need to be rolled back
   */
  private getStepsToRollback(
    instance: WorkflowInstance,
    definition: any,
    rollbackPoint: string
  ): WorkflowStep[] {
    const rollbackIndex = instance.completedSteps.indexOf(rollbackPoint);
    const stepsToRollback = instance.completedSteps.slice(rollbackIndex + 1);

    return definition.steps.filter((step: WorkflowStep) =>
      stepsToRollback.includes(step.id)
    );
  }

  /**
   * Rollback a single step
   */
  private async rollbackStep(
    step: WorkflowStep,
    instance: WorkflowInstance
  ): Promise<void> {
    // Check if step has rollback action defined
    const rollbackAction = step.metadata?.rollbackAction;
    if (!rollbackAction) {
      logger.warn('No rollback action defined for step', {
        stepId: step.id,
        instanceId: instance.id,
      });
      return;
    }

    // Execute rollback action
    // This would call the appropriate action handler
    logger.info('Executing rollback action', {
      stepId: step.id,
      rollbackAction,
      instanceId: instance.id,
    });

    // In production, this would:
    // 1. Look up the rollback action handler
    // 2. Execute it with the step's context
    // 3. Handle any errors
  }
}

// Export singleton instance
export const workflowRollback = new WorkflowRollback();
