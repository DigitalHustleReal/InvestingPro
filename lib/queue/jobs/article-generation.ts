/**
 * Article Generation Job
 * Processes article generation in the background queue
 */
import { inngest } from '../inngest-client';
import { generateArticleCore } from '@/lib/automation/article-generator';
import { logger } from '@/lib/logger';

export const generateArticleJob = inngest.createFunction(
  { 
    id: 'generate-article',
    name: 'Generate Article',
    retries: 3, // Retry up to 3 times on failure
  },
  { event: 'article/generate' },
  async ({ event, step }) => {
    const { topic, options } = event.data;
    
    logger.info('Article generation job started', { topic, options });
    
    try {
      const result = await step.run('generate-article', async () => {
        return await generateArticleCore(
          topic, 
          (msg: string) => logger.info('Article generation', { msg }),
          options || {}
        );
      });
      
      logger.info('Article generation job completed', { 
        topic, 
        success: result.success,
        articleId: result.article?.id 
      });
      
      return result;
    } catch (error) {
      logger.error('Article generation job failed', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
);
