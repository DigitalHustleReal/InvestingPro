/**
 * Conversion Tracking API
 * GET: Get conversion funnel data
 * POST: Track a conversion event
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getConversionFunnel, getConversionFunnelByCategory } from '@/lib/analytics/conversion-funnel';
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
        const category = searchParams.get('category') || 'all';
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Validate dates
        if (startDateParam && isNaN(Date.parse(startDateParam))) {
            return NextResponse.json(
                { error: 'Invalid startDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        if (endDateParam && isNaN(Date.parse(endDateParam))) {
            return NextResponse.json(
                { error: 'Invalid endDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        const startDate = startDateParam || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = endDateParam || new Date().toISOString();

        if (new Date(startDate) > new Date(endDate)) {
            return NextResponse.json(
                { error: 'startDate must be before endDate' },
                { status: 400 }
            );
        }

        // Get conversion funnel
        const funnel = category === 'all'
            ? await getConversionFunnel(startDate, endDate)
            : await getConversionFunnelByCategory(category, startDate, endDate);

        return NextResponse.json(funnel);

    } catch (error: any) {
        logger.error('Error fetching conversion funnel:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch conversion funnel data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
