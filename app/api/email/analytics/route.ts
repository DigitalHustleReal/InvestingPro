/**
 * Email Analytics API
 * Returns email performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getEmailMetrics } from '@/lib/email/analytics';
import { requireAdmin } from '@/lib/auth/admin-auth';

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        try {
            await requireAdmin();
        } catch (authError: any) {
            if (authError.message.includes('Unauthorized')) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Authentication required' },
                    { status: 401 }
                );
            }
            if (authError.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: 'Forbidden', message: 'Admin access required' },
                    { status: 403 }
                );
            }
            throw authError;
        }

        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get('range') || '30d';

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        
        switch (range) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        // Get email metrics
        const metrics = await getEmailMetrics(startDateStr, endDateStr);

        return NextResponse.json(metrics);

    } catch (error: any) {
        logger.error('Error fetching email analytics:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch email analytics. Please try again later.'
            },
            { status: 500 }
        );
    }
}
