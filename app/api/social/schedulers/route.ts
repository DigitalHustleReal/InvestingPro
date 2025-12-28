import { NextRequest, NextResponse } from 'next/server';
import { socialSchedulerService } from '@/lib/social-media/SocialSchedulerService';
import { logger } from '@/lib/logger';

/**
 * Get all social schedulers
 * GET /api/social/schedulers
 */
export async function GET(request: NextRequest) {
    try {
        const schedulers = await socialSchedulerService.getSchedulers();
        
        return NextResponse.json({
            success: true,
            schedulers
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schedulers';
        logger.error('Error fetching social schedulers', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Create/update social scheduler
 * POST /api/social/schedulers
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const schedulerId = await socialSchedulerService.saveScheduler(body);
        
        return NextResponse.json({
            success: true,
            scheduler_id: schedulerId
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save scheduler';
        logger.error('Error saving social scheduler', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

