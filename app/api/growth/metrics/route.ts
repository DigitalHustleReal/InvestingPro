/**
 * Growth Metrics API
 * Returns comprehensive growth metrics including acquisition, retention, and revenue
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getConversionFunnel } from '@/lib/analytics/conversion-funnel';
import { getUserSegments, getEngagementMetrics, getTrafficSources } from '@/lib/analytics/user-behavior';
import { getRevenueMetrics } from '@/lib/analytics/revenue-tracker';
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

        // Fetch all metrics in parallel
        const [segments, engagement, trafficSources, revenueMetrics, funnel] = await Promise.all([
            getUserSegments(startDateStr, endDateStr),
            getEngagementMetrics(startDateStr, endDateStr),
            getTrafficSources(startDateStr, endDateStr),
            getRevenueMetrics(startDateStr, endDateStr),
            getConversionFunnel(startDateStr, endDateStr)
        ]);

        // Calculate acquisition metrics
        const newUsers = segments.find(s => s.segment === 'new')?.count || 0;
        const returningUsers = segments.find(s => s.segment === 'returning')?.count || 0;
        const totalVisitors = newUsers + returningUsers;

        // Calculate retention metrics
        const retentionRate = totalVisitors > 0 ? (returningUsers / totalVisitors) * 100 : 0;

        // Calculate revenue metrics
        const totalRevenue = revenueMetrics.totalRevenue || 0;
        const revenuePerUser = totalVisitors > 0 ? totalRevenue / totalVisitors : 0;
        const conversionRate = funnel.overallConversionRate || 0;
        const averageOrderValue = revenueMetrics.totalConversions > 0 
            ? totalRevenue / revenueMetrics.totalConversions 
            : 0;

        // Generate daily trends (last 30 days)
        const dailyTrends = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dailyTrends.push({
                date: date.toISOString(),
                visitors: Math.floor(Math.random() * 1000) + 500, // Placeholder - would use actual analytics
                revenue: Math.floor(Math.random() * 10000) + 5000 // Placeholder
            });
        }

        // Generate weekly trends
        const weeklyTrends = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            weeklyTrends.push({
                week: date.toISOString(),
                visitors: Math.floor(Math.random() * 5000) + 3000,
                revenue: Math.floor(Math.random() * 50000) + 30000
            });
        }

        // Generate monthly trends
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            monthlyTrends.push({
                month: date.toISOString(),
                visitors: Math.floor(Math.random() * 20000) + 15000,
                revenue: Math.floor(Math.random() * 200000) + 150000
            });
        }

        return NextResponse.json({
            acquisition: {
                totalVisitors,
                newVisitors: newUsers,
                returningVisitors: returningUsers,
                trafficSources
            },
            retention: {
                returningUsers,
                retentionRate: Number(retentionRate.toFixed(2)),
                averageSessions: engagement.pagesPerSession
            },
            revenue: {
                totalRevenue,
                revenuePerUser: Number(revenuePerUser.toFixed(2)),
                conversionRate: Number(conversionRate.toFixed(2)),
                averageOrderValue: Number(averageOrderValue.toFixed(2))
            },
            trends: {
                daily: dailyTrends,
                weekly: weeklyTrends,
                monthly: monthlyTrends
            },
            period: {
                startDate: startDateStr,
                endDate: endDateStr,
                range
            }
        });

    } catch (error: any) {
        logger.error('Error fetching growth metrics:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch growth metrics. Please try again later.'
            },
            { status: 500 }
        );
    }
}
