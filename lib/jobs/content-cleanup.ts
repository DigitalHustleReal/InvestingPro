/**
 * Content Cleanup Background Job
 * 
 * Runs weekly to archive low-performing content.
 * Archives articles with:
 * - Overall score < 40
 * - Page views < 10 in last 30 days
 */

import { inngest } from '@/lib/inngest/client';
import { contentScorer } from '@/lib/content/content-scorer';
import { articleService } from '@/lib/cms/article-service';
import { logger } from '@/lib/logger';

export const contentCleanupJob = inngest.createFunction(
  {
    id: 'content-cleanup',
    name: 'Content Cleanup Job',
  },
  { cron: '0 3 * * 0' }, // Weekly on Sunday at 3 AM
  async ({ step }) => {
    const lowPerforming = await step.run('identify-low-performing', async () => {
      logger.info('Identifying low-performing content');
      
      const articles = await contentScorer.getLowPerformingArticles(
        40,  // Score threshold
        30,  // Days back
        50   // Limit
      );
      
      logger.info('Found low-performing articles', { count: articles.length });
      return articles;
    });

    if (lowPerforming.length === 0) {
      logger.info('No low-performing content found');
      return { archived: 0 };
    }

    const archived = await step.run('archive-articles', async () => {
      let count = 0;
      
      for (const article of lowPerforming) {
        try {
          await articleService.updateArticle(article.articleId, {
            status: 'archived',
          });
          count++;
        } catch (error) {
          logger.warn('Failed to archive article', {
            articleId: article.articleId,
            error: (error as Error).message,
          });
        }
      }
      
      logger.info('Archived low-performing content', { count });
      return count;
    });

    return { archived };
  }
);
