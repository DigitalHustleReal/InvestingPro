/**
 * Article Workflow Hooks
 * Integrates workflows with article lifecycle events
 * 
 * SERVER-ONLY: This module uses server-only APIs
 */
import 'server-only'; // Mark as server-only module

import { workflowService } from '../workflow-service';
import { ARTICLE_PUBLISHING_WORKFLOW } from '../definitions/article-publishing';
import { logger } from '@/lib/logger';

/**
 * Trigger article publishing workflow
 */
export async function triggerArticlePublishingWorkflow(articleId: string): Promise<string | null> {
  try {
    const instance = await workflowService.startWorkflow(
      ARTICLE_PUBLISHING_WORKFLOW,
      { articleId }
    );

    logger.info('Article publishing workflow started', {
      articleId,
      workflowInstanceId: instance.id
    });

    return instance.id;
  } catch (error) {
    logger.error('Failed to start article publishing workflow', error instanceof Error ? error : new Error(String(error)), {
      articleId
    });
    return null;
  }
}

/**
 * Trigger state transition for article
 */
export async function transitionArticleState(
  articleId: string,
  from: string,
  to: string,
  action: string,
  userId?: string
): Promise<boolean> {
  try {
    await workflowService.transitionContentState(
      'article',
      articleId,
      from as any,
      to as any,
      action,
      userId
    );

    logger.info('Article state transitioned', {
      articleId,
      from,
      to,
      action,
      userId
    });

    return true;
  } catch (error) {
    logger.error('Failed to transition article state', error instanceof Error ? error : new Error(String(error)), {
      articleId,
      from,
      to,
      action
    });
    return false;
  }
}
