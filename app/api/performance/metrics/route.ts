/**
 * Performance Metrics API
 * Returns performance metrics including Web Vitals, bundle size, Lighthouse scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getWebVitalsMetrics } from '@/lib/performance/web-vitals';
import { analyzeBundle, checkBundleBudget } from '@/lib/performance/bundle-analyzer';
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
        const [webVitals, bundleAnalysis] = await Promise.all([
            getWebVitalsMetrics(startDateStr, endDateStr),
            analyzeBundle()
        ]);

        // Check bundle budget
        const budgetCheck = checkBundleBudget(bundleAnalysis);

        // Get Lighthouse scores (placeholder - in production would use Lighthouse CI)
        const lighthouse = {
            performance: 85, // Placeholder
            accessibility: 95, // Placeholder
            bestPractices: 90, // Placeholder
            seo: 95 // Placeholder
        };

        return NextResponse.json({
            webVitals,
            bundle: {
                totalSize: bundleAnalysis.totalSize,
                gzippedSize: bundleAnalysis.gzippedSize,
                meetsBudget: budgetCheck.meetsBudget,
                violations: budgetCheck.violations
            },
            lighthouse,
            period: {
                startDate: startDateStr,
                endDate: endDateStr,
                range
            }
        });

    } catch (error: any) {
        logger.error('Error fetching performance metrics:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch performance metrics. Please try again later.'
            },
            { status: 500 }
        );
    }
}
