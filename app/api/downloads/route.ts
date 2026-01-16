/**
 * Downloads API
 * Handles download requests and file generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableDownloads, trackDownload } from '@/lib/downloads/download-service';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');

        const downloads = await getAvailableDownloads(category || undefined);

        return NextResponse.json({
            success: true,
            downloads,
            count: downloads.length
        });

    } catch (error: any) {
        logger.error('Error fetching downloads', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch downloads',
                message: error.message
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { resourceId, email, name, source } = body;

        if (!resourceId || !email) {
            return NextResponse.json(
                { success: false, error: 'Resource ID and email are required' },
                { status: 400 }
            );
        }

        const result = await trackDownload({
            resourceId,
            email,
            name,
            source: source || 'website'
        });

        return NextResponse.json({
            success: true,
            downloadUrl: result.downloadUrl,
            resource: result.resource
        });

    } catch (error: any) {
        logger.error('Error processing download', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process download',
                message: error.message
            },
            { status: 500 }
        );
    }
}
