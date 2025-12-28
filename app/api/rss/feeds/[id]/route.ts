import { NextRequest, NextResponse } from 'next/server';
import { rssImportService } from '@/lib/rss-import/RSSImportService';
import { logger } from '@/lib/logger';

/**
 * Get single RSS feed
 * GET /api/rss/feeds/:id
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const feed = await rssImportService.getFeed(params.id);
        if (!feed) {
            return NextResponse.json(
                { success: false, error: 'Feed not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            feed
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feed';
        logger.error('Error fetching RSS feed', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Update RSS feed
 * PUT /api/rss/feeds/:id
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        await rssImportService.updateFeed(params.id, body);
        
        return NextResponse.json({
            success: true
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update feed';
        logger.error('Error updating RSS feed', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Delete RSS feed
 * DELETE /api/rss/feeds/:id
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await rssImportService.deleteFeed(params.id);
        
        return NextResponse.json({
            success: true
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete feed';
        logger.error('Error deleting RSS feed', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

