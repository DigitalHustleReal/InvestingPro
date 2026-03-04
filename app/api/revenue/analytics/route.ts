/**
 * Revenue Analytics API
 * Returns comprehensive revenue analytics including trends, breakdowns, and insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getRevenueMetrics } from '@/lib/analytics/revenue-tracker';
import { requireAdmin } from '@/lib/auth/admin-auth';

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        // Check admin authentication
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
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

        // Get revenue metrics
        const metrics = await getRevenueMetrics(startDate, endDate);

        return NextResponse.json(metrics);

    } catch (error: any) {
        logger.error('Error fetching revenue analytics:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch revenue analytics. Please try again later.'
            },
            { status: 500 }
        );
    }
}
