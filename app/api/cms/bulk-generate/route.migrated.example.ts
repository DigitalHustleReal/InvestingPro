/**
 * MIGRATED VERSION - Example for Queue Migration
 * 
 * This is an example of how to migrate the bulk generation route to use Inngest queue.
 * 
 * To use this:
 * 1. Backup the current route.ts file
 * 2. Replace route.ts with this migrated version
 * 3. Update frontend to handle async responses
 * 4. Test thoroughly
 */

import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/queue/inngest-client';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

/**
 * Bulk Generate API (Queue-based)
 * 
 * This route now uses Inngest queue for async processing.
 * Returns immediately with a job ID for status tracking.
 */
export const POST = createAPIWrapper('/api/cms/bulk-generate', {
    rateLimitType: 'ai',
    trackMetrics: true,
})(
    async (request: NextRequest) => {
        try {
            const body = await request.json();
            const { topics, options } = body;

            if (!topics || !Array.isArray(topics) || topics.length === 0) {
                return NextResponse.json(
                    { error: 'Topics array is required and must not be empty' },
                    { status: 400 }
                );
            }

            // Send to queue instead of processing synchronously
            const result = await inngest.send({
                name: 'content/bulk-generate',
                data: {
                    topics,
                    options: options || {}
                },
            });

            logger.info('Bulk generation queued', { 
                eventIds: result.ids,
                topicCount: topics.length,
                jobId: result.ids[0]
            });

            // Return immediately with job ID
            return NextResponse.json({
                success: true,
                message: 'Bulk generation queued',
                jobId: result.ids[0],
                status: 'queued',
                topicCount: topics.length,
                // Provide status endpoint URL
                statusUrl: `/api/jobs/${result.ids[0]}/status`
            });

        } catch (error: unknown) {
            logger.error('Bulk generation queue error', error instanceof Error ? error : new Error(String(error)));
            return NextResponse.json(
                { error: 'Failed to queue bulk generation' },
                { status: 500 }
            );
        }
    }
);
