/**
 * Cache Stats API
 * Returns cache hit/miss statistics
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Dynamic import to avoid server/client boundary issues
        const { cacheMonitor } = await import('@/lib/cache/cache-monitor');
        const stats = cacheMonitor.getCacheStats();
        
        return NextResponse.json({
            hits: stats.hits,
            misses: stats.misses,
            ratio: stats.ratio,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching cache stats:', error);
        return NextResponse.json(
            { 
                hits: 0,
                misses: 0,
                ratio: 0,
                error: 'Failed to fetch cache stats' 
            },
            { status: 200 } // Return 200 with empty data to not break dashboard
        );
    }
}
