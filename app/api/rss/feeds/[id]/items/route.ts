import { NextRequest, NextResponse } from 'next/server';
import { rssImportService } from '@/lib/rss-import/RSSImportService';
import { logger } from '@/lib/logger';

/**
 * Get RSS feed items
 * GET /api/rss/feeds/:id/items?status=pending
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status') || undefined;
        
        const items = await rssImportService.getFeedItems(id, status || undefined);
        
        return NextResponse.json({
            success: true,
            items
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feed items';
        logger.error('Error fetching RSS feed items', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
