import { NextRequest, NextResponse } from 'next/server';
import { socialSchedulerService } from '@/lib/social-media/SocialSchedulerService';
import { logger } from '@/lib/logger';

/**
 * Get accounts for scheduler
 * GET /api/social/schedulers/:id/accounts
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const accounts = await socialSchedulerService.getAccounts(params.id);
        
        return NextResponse.json({
            success: true,
            accounts
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch accounts';
        logger.error('Error fetching social media accounts', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Add account to scheduler
 * POST /api/social/schedulers/:id/accounts
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const accountId = await socialSchedulerService.saveAccount({
            ...body,
            scheduler_id: params.id
        });
        
        return NextResponse.json({
            success: true,
            account_id: accountId
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save account';
        logger.error('Error saving social media account', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

