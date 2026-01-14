import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/admin/health', {
    rateLimitType: 'admin',
    trackMetrics: true,
})(async (request: NextRequest) => {
    try {
        const health = api.integrations.Core.getAIHealth();
        return NextResponse.json({ 
            timestamp: new Date().toISOString(),
            providers: health 
        });
    } catch (error: any) {
        logger.error('Admin health check error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
});
