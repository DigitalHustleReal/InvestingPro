/**
 * Workflow Engine
 * Executes declarative workflows with step management
 */

import { 
  WorkflowDefinition, 
  WorkflowInstance, 
  WorkflowExecutionHistory,
  WorkflowState,
  WorkflowStep 
} from './types';
import { logger } from '@/lib/logger';
import { inngest } from '@/lib/queue/inngest-client';
import { workflowRepository } from './workflow-repository';
import { randomUUID } from 'crypto';
import { getDistributedLock } from '@/lib/locks/distributed-lock';

/**
 * Workflow Executor
 */
export class WorkflowExecutor {
  /**
   * Execute a workflow
   * Protected by distributed lock to prevent duplicate execution
   */
  async execute(
    definition: WorkflowDefinition,
    context: Record<string, any> = {}
  ): Promise<WorkflowInstance | null> {
    const lockManager = getDistributedLock();
    const lockKey = `workflow:${definition.id}`;

    // Use distributed lock to prevent duplicate workflow execution
    return await lockManager.withLock(
      lockKey,
      async () => {
        const instance: WorkflowInstance = {
          id: randomUUID(),
          workflowId: definition.id,
          workflowVersion: definition.version,
          state: 'pending',
          completedSteps: [],
          failedSteps: [],
          context,
          startedAt: new Date().toISOString()
        };

        // Save initial state
        await workflowRepository.saveInstance(instance);

        try {
          instance.state = 'running';
          await workflowRepository.saveInstance(instance);
          
          // Execute steps in order (respecting dependencies)
          await this.executeSteps(definition, instance);

          instance.state = 'completed';
          instance.completedAt = new Date().toISOString();
          await workflowRepository.saveInstance(instance);
          
          logger.info('Workflow completed', { 
            workflowId: definition.id,
            instanceId: instance.id 
          });
        } catch (error) {
          instance.state = 'failed';
          instance.error = error instanceof Error ? error.message : String(error);
          instance.completedAt = new Date().toISOString();
          await workflowRepository.saveInstance(instance);
          
          logger.error('Workflow failed', error instanceof Error ? error : new Error(String(error)), {
            workflowId: definition.id,
            instanceId: instance.id
          });
        }

        return instance;
      },
      {
        ttl: 600, // 10 minutes (enough for most workflows)
        extendable: true, // Allow extension for long-running workflows
        retry: {
          maxAttempts: 0, // Don't retry, skip if locked
        },
      }
    );
  }

  /**
   * Execute workflow steps
   */
  private async executeSteps(
    definition: WorkflowDefinition,
    instance: WorkflowInstance
  ): Promise<void> {
    const executed = new Set<string>();
    const readySteps = new Set<string>();

    // Find steps ready to execute (no dependencies or dependencies completed)
    const findReadySteps = () => {
      definition.steps.forEach(step => {
        if (executed.has(step.id)) return;
        
        const dependenciesMet = !step.dependsOn || 
          step.dependsOn.every(dep => executed.has(dep));
        
        if (dependenciesMet) {
          readySteps.add(step.id);
        }
      });
    };

    // Execute steps until all are done
    while (executed.size < definition.steps.length) {
      findReadySteps();

      if (readySteps.size === 0) {
        // Circular dependency or missing step
        const remaining = definition.steps
          .filter(s => !executed.has(s.id))
          .map(s => s.id);
        throw new Error(`Cannot execute workflow: circular dependency or missing steps: ${remaining.join(', ')}`);
      }

      // Execute all ready steps (can be parallel)
      const stepPromises = Array.from(readySteps).map(stepId => {
        const step = definition.steps.find(s => s.id === stepId)!;
        return this.executeStep(step, instance, definition);
      });

      await Promise.all(stepPromises);

      // Mark as executed
      readySteps.forEach(id => executed.add(id));
      readySteps.clear();
    }
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    instance: WorkflowInstance,
    definition: WorkflowDefinition
  ): Promise<void> {
    const startTime = Date.now();
    instance.currentStep = step.id;
    await workflowRepository.saveInstance(instance);

    // Save step start history
    await workflowRepository.saveHistory({
      id: randomUUID(),
      workflowInstanceId: instance.id,
      stepId: step.id,
      state: 'started',
      input: instance.context,
      timestamp: new Date().toISOString()
    });

    logger.info('Workflow step started', {
      workflowId: definition.id,
      instanceId: instance.id,
      stepId: step.id,
      stepName: step.name
    });

    try {
      // Check if manual step
      if (step.manual) {
        // For manual steps, pause workflow and wait for external trigger
        instance.state = 'paused';
        await workflowRepository.saveInstance(instance);
        logger.info('Workflow paused for manual step', {
          workflowId: definition.id,
          instanceId: instance.id,
          stepId: step.id
        });
        return;
      }

      // Execute step action
      const result = await this.executeAction(step, instance);

      // Store result in context
      instance.context[step.id] = result;
      instance.completedSteps.push(step.id);
      await workflowRepository.saveInstance(instance);

      const duration = Date.now() - startTime;
      
      // Save step completion history
      await workflowRepository.saveHistory({
        id: randomUUID(),
        workflowInstanceId: instance.id,
        stepId: step.id,
        state: 'completed',
        input: instance.context,
        output: result,
        duration,
        timestamp: new Date().toISOString()
      });

      logger.info('Workflow step completed', {
        workflowId: definition.id,
        instanceId: instance.id,
        stepId: step.id,
        duration
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Save step failure history
      await workflowRepository.saveHistory({
        id: randomUUID(),
        workflowInstanceId: instance.id,
        stepId: step.id,
        state: 'failed',
        input: instance.context,
        error: errorMessage,
        duration,
        timestamp: new Date().toISOString()
      });

      logger.error('Workflow step failed', error instanceof Error ? error : new Error(errorMessage), {
        workflowId: definition.id,
        instanceId: instance.id,
        stepId: step.id,
        duration
      });

      // Handle error based on step configuration
      if (step.onError === 'retry' && step.retry) {
        // Implement retry logic
        const retryConfig = {
          maxAttempts: step.retry.maxAttempts,
          backoff: step.retry.backoff,
          delay: step.retry.delay,
          maxDelay: step.retry.delay * 10, // Cap at 10x initial delay
          jitter: true,
        };

        try {
          const { RetryStrategy } = await import('./retry-strategy');
          const result = await RetryStrategy.execute(
            () => this.executeAction(step, instance),
            retryConfig,
            (attempt, retryError) => {
              logger.warn('Retrying workflow step', {
                workflowId: definition.id,
                instanceId: instance.id,
                stepId: step.id,
                attempt,
                maxAttempts: retryConfig.maxAttempts,
                error: retryError.message,
              });

              // Save retry history
              workflowRepository.saveHistory({
                id: randomUUID(),
                workflowInstanceId: instance.id,
                stepId: step.id,
                state: 'started',
                input: instance.context,
                retryAttempt: attempt,
                timestamp: new Date().toISOString(),
              }).catch(err => logger.error('Failed to save retry history', err));
            }
          );

          // Retry succeeded - continue as normal
          instance.context[step.id] = result;
          instance.completedSteps.push(step.id);
          await workflowRepository.saveInstance(instance);

          const duration = Date.now() - startTime;
          await workflowRepository.saveHistory({
            id: randomUUID(),
            workflowInstanceId: instance.id,
            stepId: step.id,
            state: 'completed',
            input: instance.context,
            output: result,
            duration,
            timestamp: new Date().toISOString(),
          });

          logger.info('Workflow step completed after retry', {
            workflowId: definition.id,
            instanceId: instance.id,
            stepId: step.id,
            duration,
          });

          return; // Success after retry
        } catch (retryError) {
          // All retries exhausted
          logger.error('Workflow step failed after all retries', retryError instanceof Error ? retryError : new Error(String(retryError)), {
            workflowId: definition.id,
            instanceId: instance.id,
            stepId: step.id,
            maxAttempts: retryConfig.maxAttempts,
          });

          // Fall through to error handling
          throw retryError;
        }
      } else if (step.onError === 'skip') {
        logger.warn('Skipping failed step', { stepId: step.id });
        
        // Save skipped history
        await workflowRepository.saveHistory({
          id: randomUUID(),
          workflowInstanceId: instance.id,
          stepId: step.id,
          state: 'skipped',
          input: instance.context,
          error: errorMessage,
          duration,
          timestamp: new Date().toISOString()
        });
        
        return; // Continue workflow
      } else if (step.onError === 'rollback') {
        // Execute rollback
        try {
          const { workflowRollback } = await import('./workflow-rollback');
          await workflowRollback.rollbackWorkflow(instance.id, step.id);
          
          logger.info('Workflow rolled back', {
            workflowId: definition.id,
            instanceId: instance.id,
            stepId: step.id,
          });
        } catch (rollbackError) {
          logger.error('Rollback failed', rollbackError instanceof Error ? rollbackError : new Error(String(rollbackError)), {
            workflowId: definition.id,
            instanceId: instance.id,
            stepId: step.id,
          });
        }
        
        throw error; // Still fail the workflow after rollback
      } else {
        // Default: fail workflow
        instance.failedSteps.push(step.id);
        await workflowRepository.saveInstance(instance);
        throw error;
      }
    }
  }

  /**
   * Execute a step action
   */
  private async executeAction(
    step: WorkflowStep,
    instance: WorkflowInstance
  ): Promise<any> {
    // Check if action should be queued (async)
    if (step.timeout && step.timeout > 30000) {
      // Long-running action - use queue
      return await this.executeAsyncAction(step, instance);
    }

    // Synchronous action - execute directly
    return await this.executeSyncAction(step, instance);
  }

  /**
   * Execute synchronous action
   */
  private async executeSyncAction(
    step: WorkflowStep,
    instance: WorkflowInstance
  ): Promise<any> {
    // Import action handlers dynamically to avoid circular dependencies
    const {
      validateArticle,
      generateSEO,
      publishArticle,
      researchTopic,
      generateContent,
      qualityCheck,
      reviewContent
    } = await import('./actions/article-actions');

    // Map action to handler function
    const actionMap: Record<string, (context: any) => Promise<any>> = {
      'validateArticle': validateArticle,
      'generateSEO': generateSEO,
      'publishArticle': publishArticle,
      'researchTopic': researchTopic,
      'generateContent': generateContent,
      'qualityCheck': qualityCheck,
      'reviewContent': reviewContent
    };

    const actionFn = actionMap[step.action];
    if (!actionFn) {
      throw new Error(`Unknown action: ${step.action}`);
    }

    return await actionFn(instance.context);
  }

  /**
   * Execute asynchronous action via queue
   */
  private async executeAsyncAction(
    step: WorkflowStep,
    instance: WorkflowInstance
  ): Promise<any> {
    // Queue the action via Inngest
    const result = await inngest.send({
      name: 'workflow/execute-step',
      data: {
        workflowInstanceId: instance.id,
        stepId: step.id,
        action: step.action,
        context: instance.context
      }
    });

    // Return job ID - actual result will be stored in workflow instance
    return { jobId: result.ids[0] };
  }
}

/**
 * Singleton instance
 */
export const workflowExecutor = new WorkflowExecutor();
