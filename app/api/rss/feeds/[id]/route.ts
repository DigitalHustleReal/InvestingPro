import { NextRequest, NextResponse } from 'next/server';
import { rssImportService } from '@/lib/rss-import/RSSImportService';
import { logger } from '@/lib/logger';

/**
 * Get single RSS feed
 * GET /api/rss/feeds/:id
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const feed = await rssImportService.getFeed(id);
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await rssImportService.updateFeed(id, body);
        
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await rssImportService.deleteFeed(id);
        
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
