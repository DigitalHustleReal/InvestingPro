/**
 * Bulk Generation Job
 * Processes multiple article generations in parallel
 */
import { inngest } from '../inngest-client';
import { generateArticleCore } from '@/lib/automation/article-generator';
import { logger } from '@/lib/logger';
import { storeJobStatus } from '../job-status';

export const bulkGenerateJob = inngest.createFunction(
  { 
    id: 'bulk-generate',
    name: 'Bulk Generate Articles',
    retries: 2, // Fewer retries for bulk operations
  },
  { event: 'content/bulk-generate' },
  async ({ event, step }) => {
    const { topics, options } = event.data;
    
    // Get event ID for job tracking
    // Inngest provides event ID in the event object
    const jobId = (event as any).id || `event-${Date.now()}`;
    
    logger.info('Bulk generation job started', { 
      jobId,
      topicCount: topics?.length || 0,
      options 
    });
    
    if (!topics || topics.length === 0) {
      throw new Error('No topics provided for bulk generation');
    }
    
    // Store initial status
    await storeJobStatus(jobId, 'queued', event.data, 'bulk-generation');
    
    try {
      // Update to running
      await storeJobStatus(jobId, 'running', event.data, 'bulk-generation');
      
      // Process articles sequentially to avoid rate limits
      // Inngest will handle concurrency control
      const results = await step.run('generate-all', async () => {
        const results = [];
        
        for (const topic of topics) {
          try {
            const result = await generateArticleCore(
              topic,
              (msg: string) => logger.info('Bulk generation', { topic, msg }),
              options || {}
            );
            results.push({ topic, ...result });
          } catch (error) {
            logger.error('Bulk generation item failed', { 
              topic, 
              error: error instanceof Error ? error.message : String(error) 
            });
            results.push({ 
              topic, 
              success: false, 
              error: error instanceof Error ? error.message : String(error) 
            });
          }
        }
        
        return results;
      });
      
      const successCount = results.filter(r => r.success).length;
      const jobResult = {
        total: results.length,
        success: successCount,
        failed: results.length - successCount,
        results
      };
      
      logger.info('Bulk generation job completed', { 
        jobId,
        total: results.length,
        success: successCount,
        failed: results.length - successCount
      });
      
      // Store completed status
      await storeJobStatus(
        jobId, 
        'completed', 
        null, 
        'bulk-generation', 
        jobResult
      );
      
      return jobResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Bulk generation job failed', 
        error instanceof Error ? error : new Error(errorMessage)
      );
      
      // Store failed status
      await storeJobStatus(
        jobId, 
        'failed', 
        null, 
        'bulk-generation', 
        null, 
        errorMessage
      );
      
      throw error;
    }
  }
);
