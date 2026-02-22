/**
 * Workflow Service
 * High-level service for managing workflows
 * 
 * SERVER-ONLY: This module uses server-only APIs
 * Do not import in client components - use API routes instead
 */
// NOTE: server-only import removed to allow scripts to run

import { 
  WorkflowDefinition, 
  WorkflowInstance,
  ContentState 
} from './types';
import { workflowExecutor } from './workflow-engine';
import { workflowRepository } from './workflow-repository';
import { contentStateMachine } from './state-machine';
import { logger } from '@/lib/logger';
import { eventPublisher } from '@/lib/events/publisher';
import { EventType } from '@/lib/events/types';

export class WorkflowService {
  /**
   * Start a workflow
   */
  async startWorkflow(
    definition: WorkflowDefinition,
    context: Record<string, any> = {}
  ): Promise<WorkflowInstance> {
    // Save definition if not exists
    await workflowRepository.saveDefinition(definition);

    // Execute workflow
    const instance = await workflowExecutor.execute(definition, context);

    // Save instance
    if (instance) {
      await workflowRepository.saveInstance(instance);
    } else {
      throw new Error('Failed to start workflow execution');
    }

    // Publish workflow started event
    await eventPublisher.publish<any>({
      type: EventType.CONTENT_GENERATION_STARTED,
      payload: {
        topic: (definition as any).name,
        agentId: 'workflow-engine',
        cycleId: (instance as any).id
      },
      metadata: {
        workflowName: definition.name,
        workflowVersion: definition.version,
        workflowId: definition.id,
        instanceId: instance.id
      },
      source: 'workflow-service'
    });

    return instance;
  }

  /**
   * Get workflow instance status
   */
  async getInstanceStatus(instanceId: string): Promise<WorkflowInstance | null> {
    return await workflowRepository.getInstance(instanceId);
  }

  /**
   * Get workflow execution history
   */
  async getExecutionHistory(instanceId: string) {
    return await workflowRepository.getHistory(instanceId);
  }

  /**
   * Transition content state
   */
  async transitionContentState(
    entityType: 'article' | 'workflow',
    entityId: string,
    from: ContentState,
    to: ContentState,
    action: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Validate transition
    if (!contentStateMachine.canTransition(from, to, action, metadata)) {
      throw new Error(`Invalid state transition: Cannot ${action} from ${from} to ${to}`);
    }

    // Execute transition
    const transition = await contentStateMachine.transition(from, to, action, {
      ...metadata,
      userId
    });

    // Log transition (would be persisted to state_transitions table)
    logger.info('State transition executed', {
      entityType,
      entityId,
      from,
      to,
      action,
      userId
    });

    // Publish state transition event
    await eventPublisher.publish<any>({
      type: EventType.ARTICLE_UPDATED, // Or specific state transition event
      payload: {
        entityType,
        entityId,
        from,
        to,
        action
      },
      metadata: {
        userId,
        ...metadata
      },
      source: 'workflow-service'
    });
  }

  /**
   * Get valid next states
   */
  getValidNextStates(from: ContentState, action?: string): ContentState[] {
    return contentStateMachine.getValidNextStates(from, action);
  }

  /**
   * Get valid actions
   */
  getValidActions(from: ContentState): string[] {
    return contentStateMachine.getValidActions(from);
  }

  /**
   * Recover a failed workflow
   */
  async recoverWorkflow(
    instanceId: string,
    options?: {
      resumeFromStep?: string;
      skipFailedSteps?: boolean;
      retryFailedSteps?: boolean;
      resetContext?: boolean;
    }
  ): Promise<WorkflowInstance> {
    const { workflowRecovery } = await import('./workflow-recovery');
    return await workflowRecovery.recoverWorkflow(instanceId, options || {});
  }

  /**
   * Resume a paused workflow
   */
  async resumePausedWorkflow(
    instanceId: string,
    stepResult?: any
  ): Promise<WorkflowInstance> {
    const { workflowRecovery } = await import('./workflow-recovery');
    return await workflowRecovery.resumePausedWorkflow(instanceId, stepResult);
  }

  /**
   * Schedule a workflow
   */
  async scheduleWorkflow(
    definition: WorkflowDefinition,
    context: Record<string, any> = {},
    scheduleConfig: {
      scheduleAt?: Date;
      scheduleIn?: number;
      cron?: string;
      timezone?: string;
    }
  ) {
    const { workflowScheduler } = await import('./workflow-scheduler');
    return await workflowScheduler.scheduleWorkflow(definition, context, scheduleConfig);
  }

  /**
   * Cancel a scheduled workflow
   */
  async cancelScheduledWorkflow(scheduledId: string): Promise<boolean> {
    const { workflowScheduler } = await import('./workflow-scheduler');
    return await workflowScheduler.cancelScheduledWorkflow(scheduledId);
  }
}

/**
 * Singleton instance
 */
export const workflowService = new WorkflowService();
