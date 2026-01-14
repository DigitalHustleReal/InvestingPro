/**
 * Event System Test Endpoint
 * POST /api/test/events - Test event publishing and persistence
 * 
 * Note: This should be disabled in production or protected by admin auth
 */
import { NextRequest, NextResponse } from 'next/server';
import { testEventFlow, getRecentEvents } from '@/lib/events/test-utils';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { logger } from '@/lib/logger';

export const POST = createAPIWrapper('/api/test/events', {
    rateLimitType: 'admin',
    trackMetrics: false, // Don't track test endpoints
})(
    async (request: NextRequest) => {
        try {
            // TODO: Add admin auth check in production
            // For now, allow in development only
            
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { error: 'Test endpoint disabled in production' },
                    { status: 403 }
                );
            }

            const result = await testEventFlow();
            
            return NextResponse.json({
                success: result.publishSuccess && result.persistenceSuccess,
                ...result
            });
        } catch (error) {
            logger.error('Event test error', error instanceof Error ? error : new Error(String(error)));
            return NextResponse.json(
                { 
                    success: false, 
                    error: error instanceof Error ? error.message : String(error) 
                },
                { status: 500 }
            );
        }
    }
);

export const GET = createAPIWrapper('/api/test/events', {
    rateLimitType: 'admin',
    trackMetrics: false,
})(
    async (request: NextRequest) => {
        try {
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { error: 'Test endpoint disabled in production' },
                    { status: 403 }
                );
            }

            const { searchParams } = new URL(request.url);
            const limit = parseInt(searchParams.get('limit') || '10', 10);

            const result = await getRecentEvents(limit);
            
            return NextResponse.json({
                success: true,
                events: result.events,
                count: result.events.length
            });
        } catch (error) {
            logger.error('Get events test error', error instanceof Error ? error : new Error(String(error)));
            return NextResponse.json(
                { 
                    success: false, 
                    error: error instanceof Error ? error.message : String(error) 
                },
                { status: 500 }
            );
        }
    }
);
