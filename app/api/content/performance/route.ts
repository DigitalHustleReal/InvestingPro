/**
 * Content Performance API
 * Returns content performance metrics (views, engagement, revenue)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentPerformance, getTopPerformingContent, getContentGaps, getContentRecommendations } from '@/lib/analytics/content-performance';
import { requireAdmin } from '@/lib/auth/admin-auth';

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const adminCheck = await requireAdmin(request);
        if (adminCheck.error) {
            return adminCheck.response;
        }

        const searchParams = request.nextUrl.searchParams;
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const limitParam = searchParams.get('limit');

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
        const limit = parseInt(limitParam || '50', 10);

        if (new Date(startDate) > new Date(endDate)) {
            return NextResponse.json(
                { error: 'startDate must be before endDate' },
                { status: 400 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type'); // 'performance' | 'top' | 'gaps' | 'recommendations'
        const articleId = searchParams.get('articleId'); // For recommendations

        // Get content performance
        const performance = await getContentPerformance(startDate, endDate, limit);

        // Get additional data based on type
        let topPerforming: any[] = [];
        let contentGaps: any[] = [];
        let recommendations: any[] = [];

        if (type === 'top' || !type) {
            topPerforming = await getTopPerformingContent(startDate, endDate, 10);
        }

        if (type === 'gaps') {
            contentGaps = await getContentGaps();
        }

        if (type === 'recommendations' && articleId) {
            recommendations = await getContentRecommendations(articleId);
        }

        // Calculate summary
        const summary = {
            totalArticles: performance.length,
            totalViews: performance.reduce((sum, a) => sum + a.views, 0),
            totalRevenue: performance.reduce((sum, a) => sum + a.revenue, 0),
            totalConversions: performance.reduce((sum, a) => sum + a.conversions, 0),
            avgRevenuePerArticle: performance.length > 0 
                ? performance.reduce((sum, a) => sum + a.revenue, 0) / performance.length
                : 0,
            avgConversionRate: performance.length > 0
                ? performance.reduce((sum, a) => sum + a.conversionRate, 0) / performance.length
                : 0
        };

        return NextResponse.json({
            performance,
            topPerforming: topPerforming.length > 0 ? topPerforming : undefined,
            contentGaps: contentGaps.length > 0 ? contentGaps : undefined,
            recommendations: recommendations.length > 0 ? recommendations : undefined,
            period: {
                startDate,
                endDate
            },
            summary
        });

    } catch (error: any) {
        console.error('Error fetching content performance:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch content performance data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
