import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/queue/inngest-client';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { articleGenerateSchema } from '@/lib/validation/schemas';

/**
 * Generate Comprehensive Article API (Queue-based)
 * 
 * This route now uses Inngest queue for async processing.
 * Returns immediately with a job ID for status tracking.
 */
export const POST = createAPIWrapper('/api/articles/generate-comprehensive', {
    rateLimitType: 'ai', // AI generation - strict rate limit
    trackMetrics: true,
    idempotent: true, // Enable idempotency to prevent duplicate article generation
    idempotencyTTL: 86400, // 24 hours - cache responses for a day
})(
    withValidation(articleGenerateSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
            try {
                // Body is already validated by middleware
                const { 
                    topic, 
                    category, 
                    targetKeywords, 
                    targetAudience, 
                    contentLength, 
                    wordCount, 
                    prompt 
                } = body;

                // Send to queue instead of processing synchronously
                const result = await inngest.send({
                    name: 'article/generate-comprehensive',
                    data: {
                        topic,
                        category,
                        targetKeywords,
                        targetAudience,
                        contentLength,
                        wordCount,
                        prompt
                    },
                });

                logger.info('Article generation queued', { 
                    eventIds: result.ids,
                    topic,
                    jobId: result.ids[0]
                });

                // Return immediately with job ID
                return NextResponse.json({
                    success: true,
                    message: 'Article generation queued',
                    jobId: result.ids[0],
                    status: 'queued',
                    // Provide status endpoint URL
                    statusUrl: `/api/jobs/${result.ids[0]}/status`
                });

            } catch (error: unknown) {
                logger.error('Article generation queue error', error instanceof Error ? error : new Error(String(error)));
                throw error; // Let API wrapper handle error response
            }
        }
    )
);
