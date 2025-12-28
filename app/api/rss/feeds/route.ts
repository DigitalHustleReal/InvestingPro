import { NextRequest, NextResponse } from 'next/server';
import { rssImportService } from '@/lib/rss-import/RSSImportService';
import { logger } from '@/lib/logger';

/**
 * Get all RSS feeds
 * GET /api/rss/feeds
 */
export async function GET(request: NextRequest) {
    try {
        const feeds = await rssImportService.getFeeds();
        return NextResponse.json({
            success: true,
            feeds
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feeds';
        logger.error('Error fetching RSS feeds', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Create new RSS feed
 * POST /api/rss/feeds
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const feedId = await rssImportService.createFeed(body);
        
        return NextResponse.json({
            success: true,
            feed_id: feedId
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create feed';
        logger.error('Error creating RSS feed', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

