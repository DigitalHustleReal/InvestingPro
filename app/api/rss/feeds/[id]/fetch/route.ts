import { NextRequest, NextResponse } from 'next/server';
import { rssImportService } from '@/lib/rss-import/RSSImportService';
import { logger } from '@/lib/logger';

/**
 * Manually fetch RSS feed items
 * POST /api/rss/feeds/:id/fetch
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await rssImportService.importFeedItems(params.id);
        
        return NextResponse.json({
            success: true,
            job
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

