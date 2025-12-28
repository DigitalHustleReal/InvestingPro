import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/social-media/stats
 * Get aggregated social media statistics
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get metrics and aggregate
        const metricsResponse = await fetch(`${request.nextUrl.origin}/api/social-media/metrics`);
        const metricsData = await metricsResponse.json().catch(() => ({ metrics: {} }));

        const metrics = metricsData.metrics || {};
        const totalFollowers = Object.values(metrics).reduce((sum: number, m: any) => 
            sum + (m.followers || m.subscribers || 0), 0
        );
        const totalEngagement = Object.values(metrics).reduce((sum: number, m: any) => 
            sum + (m.engagement || 0), 0
        ) / Object.keys(metrics).length || 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalFollowers,
                averageEngagement: totalEngagement.toFixed(2),
                activePlatforms: Object.keys(metrics).filter((k: string) => 
                    metrics[k]?.status === 'active'
                ).length,
                platforms: Object.keys(metrics).length
            },
            metrics
        });
    } catch (error: any) {
        logger.error('Failed to fetch social media stats', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}








