/**
 * Comprehensive Article Generation Job
 * 
 * Processes comprehensive article generation (used by /api/articles/generate-comprehensive)
 * This job uses the same function as the current API route for compatibility
 */
import { inngest } from '../inngest-client';
import { logger } from '@/lib/logger';
import { storeJobStatus } from '../job-status';

export const generateComprehensiveArticleJob = inngest.createFunction(
  { 
    id: 'generate-comprehensive-article',
    name: 'Generate Comprehensive Article',
    retries: 3,
  },
  { event: 'article/generate-comprehensive' },
  async ({ event, step }) => {
    const { 
      topic, 
      category, 
      targetKeywords, 
      targetAudience, 
      contentLength, 
      wordCount, 
      prompt 
    } = event.data;
    
    // Get event ID for job tracking
    // Inngest provides event ID in the event object
    const jobId = (event as any).id || `event-${Date.now()}`;
    
    logger.info('Comprehensive article generation job started', { 
      jobId,
      topic, 
      category,
      targetKeywords 
    });
    
    // Store initial status
    await storeJobStatus(jobId, 'queued', event.data, 'article-generation');
    
    try {
      // Update to running
      await storeJobStatus(jobId, 'running', event.data, 'article-generation');
      
      const result = await step.run('generate-comprehensive-article', async () => {
        // Use the same function as the current API route
        const { generateArticleContent } = await import('@/lib/workers/articleGenerator');
        
        return await generateArticleContent({
          topic,
          category,
          targetKeywords,
          targetAudience,
          contentLength,
          wordCount,
          prompt
        });
      });
      
      const articleResponse = {
        success: true,
        article: {
          ...result,
          // Ensure compatibility with frontend expectations
          content: result.body_markdown,
          structured_content: result.structured_content,
          seo_score: 75, // Default
          headings: result.structured_content?.headings || [],
          sections: result.structured_content?.sections || [],
          tables: result.structured_content?.tables || [],
          faqs: result.structured_content?.faqs || [],
          internal_links: result.structured_content?.links || [],
          image_placeholders: result.structured_content?.images || []
        }
      };
      
      logger.info('Comprehensive article generation job completed', { 
        jobId,
        topic, 
        success: !!result,
        slug: result?.slug
      });
      
      // Store completed status
      await storeJobStatus(
        jobId, 
        'completed', 
        null, 
        'article-generation', 
        articleResponse
      );
      
      return articleResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Comprehensive article generation job failed', 
        error instanceof Error ? error : new Error(errorMessage)
      );
      
      // Store failed status
      await storeJobStatus(
        jobId, 
        'failed', 
        null, 
        'article-generation', 
        null, 
        errorMessage
      );
      
      throw error;
    }
  }
);
