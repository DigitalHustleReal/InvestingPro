import { NextRequest, NextResponse } from 'next/server';
import { rssImportService } from '@/lib/rss-import/RSSImportService';
import { logger } from '@/lib/logger';

/**
 * Get RSS import jobs for a feed
 * GET /api/rss/feeds/:id/jobs
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const jobs = await rssImportService.getImportJobs(id);
        
        return NextResponse.json({
            success: true,
            jobs
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch import jobs';
        logger.error('Error fetching import jobs', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
