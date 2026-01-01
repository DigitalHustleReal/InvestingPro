import { NextRequest, NextResponse } from 'next/server';
import { processLatestPipelineRun } from '@/lib/workers/pipelineWorker';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60s execution

/**
 * Validates request authorization
 */
function isAuthorized(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // 1. Check Cron Secret (for Vercel Cron)
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
        return true;
    }
    
    // 2. Check for Development mode
    if (process.env.NODE_ENV === 'development') {
        return true;
    }
    
    // 3. Allow internal calls (if header present) - weak check
    if (request.headers.get('x-internal-trigger') === 'true') {
        return true;
    }

    return false;
}

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await processLatestPipelineRun();
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        logger.error('Pipeline process failed', error);
        return NextResponse.json(
             { success: false, error: error.message },
             { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Perform same work as GET
    return GET(request);
}
