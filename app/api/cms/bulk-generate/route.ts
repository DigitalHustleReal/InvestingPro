import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/queue/inngest-client';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { bulkGenerateSchema } from '@/lib/validation/schemas';
import { createClient } from '@/lib/supabase/server';

/**
 * Bulk Content Generation API (Queue-based)
 * 
 * This route now uses Inngest queue for async processing.
 * Returns immediately with a job ID for status tracking.
 */
export const POST = createAPIWrapper('/api/cms/bulk-generate', {
    rateLimitType: 'ai', // AI generation - strict rate limit
    trackMetrics: true,
    idempotent: true, // Enable idempotency to prevent duplicate bulk operations
    idempotencyTTL: 86400, // 24 hours
})(
    withValidation(bulkGenerateSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
            try {
                // Body is already validated by middleware
                // Support both old config format and new topics format
                let topics: string[] = [];
                let options: Record<string, any> = {};

                if (body.topics && Array.isArray(body.topics)) {
                    // New format: topics array provided directly
                    topics = body.topics;
                    options = body.options || {};
                } else {
                    // Old format: config object - convert to topics
                    // For now, we'll require topics to be provided
                    // TODO: Add logic to generate topics from config if needed
                    return NextResponse.json(
                        { 
                            error: 'Topics array is required. Please provide topics array in the request body.',
                            hint: 'Send { topics: ["topic1", "topic2", ...], options: {...} }'
                        },
                        { status: 400 }
                    );
                }

                if (!topics || topics.length === 0) {
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
                        options
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
                throw error; // Let API wrapper handle error response
            }
        }
    )
);

/**
 * Get bulk generation status
 */
export const GET = createAPIWrapper('/api/cms/bulk-generate', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
})(async (request: NextRequest) => {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const cycleId = searchParams.get('cycleId');
        
        if (cycleId) {
            const { data: cycle } = await supabase
                .from('content_generation_cycles')
                .select('*')
                .eq('id', cycleId)
                .eq('cycle_type', 'bulk-generation')
                .single();
            
            return NextResponse.json({ success: true, cycle });
        }
        
        // Get recent bulk generations
        const { data: cycles } = await supabase
            .from('content_generation_cycles')
            .select('*')
            .eq('cycle_type', 'bulk-generation')
            .order('started_at', { ascending: false })
            .limit(10);
        
        return NextResponse.json({ success: true, cycles });
        
    } catch (error: any) {
        logger.error('Bulk generation GET error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
});
