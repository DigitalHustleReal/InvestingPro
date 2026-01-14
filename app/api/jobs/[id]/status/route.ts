/**
 * Job Status API Endpoint
 * 
 * Returns the status of a background job
 * 
 * GET /api/jobs/[id]/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJobStatus } from '@/lib/queue/job-status';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/jobs/[id]/status', {
    rateLimitType: 'public',
    trackMetrics: false,
})(
    async (
        request: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) => {
        try {
            const { id } = await params;
            
            if (!id) {
                return NextResponse.json(
                    { error: 'Job ID is required' },
                    { status: 400 }
                );
            }

            const status = await getJobStatus(id);
            
            return NextResponse.json(status);
        } catch (error) {
            logger.error('Job status API error', error instanceof Error ? error : new Error(String(error)));
            return NextResponse.json(
                { error: 'Failed to get job status' },
                { status: 500 }
            );
        }
    }
);
