/**
 * Content Scoring Background Job
 * 
 * Runs daily to score all published articles.
 * Identifies underperforming content for cleanup.
 */

import { inngest } from '@/lib/inngest/client';
import { contentScorer } from '@/lib/content/content-scorer';
import { logger } from '@/lib/logger';

export const contentScoringJob = inngest.createFunction(
  {
    id: 'content-scoring',
    name: 'Content Scoring Job',
  },
  { cron: '0 2 * * *' }, // Daily at 2 AM
  async ({ step }) => {
    await step.run('score-all-articles', async () => {
      logger.info('Starting content scoring job');
      
      try {
        await contentScorer.scoreAllArticles();
        logger.info('Content scoring job completed successfully');
      } catch (error) {
        logger.error('Content scoring job failed', error as Error);
        throw error;
      }
    });
  }
);
