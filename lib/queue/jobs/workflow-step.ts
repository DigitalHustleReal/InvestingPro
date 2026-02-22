/**
 * Workflow Step Execution Job
 * Executes individual workflow steps via Inngest
 */

import { inngest } from '../inngest-client';
import { logger } from '@/lib/logger';
import { storeJobStatus } from '../job-status';

export const workflowStepJob = inngest.createFunction(
  {
    id: 'workflow-execute-step',
    name: 'Execute Workflow Step',
    retries: 3,
  },
  { event: 'workflow/execute-step' },
  async ({ event, step }) => {
    const {
      workflowInstanceId,
      stepId,
      action,
      context
    } = event.data;

    const jobId = (event as any).id || `workflow-${workflowInstanceId}-${stepId}`;

    logger.info('Workflow step job started', {
      jobId,
      workflowInstanceId,
      stepId,
      action
    });

    await storeJobStatus(jobId, 'queued', event.data, 'workflow-step');

    try {
      await storeJobStatus(jobId, 'running', event.data, 'workflow-step');

      const result = await step.run(`execute-${stepId}`, async () => {
        // Import action handlers dynamically
        const {
          validateArticle,
          generateSEO,
          publishArticle,
          researchTopic,
          generateContent,
          qualityCheck,
          reviewContent
        } = await import('@/lib/workflows/actions/article-actions');

        // Map action to handler function
        const actionMap: Record<string, (ctx: any) => Promise<any>> = {
          'validateArticle': validateArticle,
          'generateSEO': generateSEO,
          'publishArticle': publishArticle,
          'researchTopic': researchTopic,
          'generateContent': generateContent,
          'qualityCheck': qualityCheck,
          'reviewContent': reviewContent
        };

        const actionFn = actionMap[action];
        if (!actionFn) {
          throw new Error(`Unknown workflow action: ${action}`);
        }

        return await actionFn(context);
      });

      await storeJobStatus(
        jobId,
        'completed',
        {},
        'workflow-step',
        result
      );

      logger.info('Workflow step job completed', {
        jobId,
        workflowInstanceId,
        stepId,
        action
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      await storeJobStatus(
        jobId,
        'failed',
        {},
        'workflow-step',
        null,
        errorMessage
      );

      logger.error('Workflow step job failed', 
        error instanceof Error ? error : new Error(errorMessage)
      );

      throw error;
    }
  }
);
