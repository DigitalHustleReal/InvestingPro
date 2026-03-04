import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ipoDataService } from '@/lib/data/ipo-service';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/ipo/live
 * Fetches live IPO data with caching
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const forceRefresh = searchParams.get('refresh') === 'true';

        const data = await ipoDataService.getIPOData(forceRefresh);

        return NextResponse.json({
            success: true,
            data,
            count: data.length,
            lastUpdated: data[0]?.lastUpdated || new Date(),
            source: data[0]?.dataSource || 'unknown'
        });
    } catch (error) {
        logger.error('Error in /api/ipo/live:', error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: []
        }, { status: 500 });
    }
}

/**
 * POST /api/ipo/refresh
 * Manually trigger cache refresh
 */
export async function POST(request: Request) {
    try {
        await ipoDataService.refreshCache();

        const data = await ipoDataService.getIPOData(true);

        return NextResponse.json({
            success: true,
            message: 'Cache refreshed successfully',
            recordsUpdated: data.length
        });
    } catch (error) {
        logger.error('Error refreshing IPO cache:', error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
