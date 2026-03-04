/**
 * Stock Photos API Route - Server-side proxy
 * Searches Pexels and Pixabay without exposing API keys to browser
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');

    logger.info('📸 Stock Photos API called:', { query, page });
    logger.info('🔑 API Keys configured:', {
        pexels: !!PEXELS_API_KEY,
        pixabay: !!PIXABAY_API_KEY
    });

    if (!query) {
        return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    // Check if at least one API key is configured
    if (!PEXELS_API_KEY && !PIXABAY_API_KEY) {
        logger.error('❌ No API keys configured!');
        return NextResponse.json({
            error: 'Stock photo APIs not configured. Add PEXELS_API_KEY and/or PIXABAY_API_KEY to .env',
            photos: []
        }, { status: 200 }); // Return 200 with empty array for graceful degradation
    }

    try {
        const results = await Promise.allSettled([
            searchPexels(query, page),
            searchPixabay(query, page)
        ]);

        const photos: any[] = [];
        
        results.forEach((result, index) => {
            const source = index === 0 ? 'Pexels' : 'Pixabay';
            if (result.status === 'fulfilled') {
                logger.info(`✅ ${source}: ${result.value.length} photos`);
                photos.push(...result.value);
            } else {
                logger.error(`❌ ${source} failed:`, result.reason);
            }
        });

        logger.info(`📊 Total photos returned: ${photos.length}`);
        return NextResponse.json({ photos });
    } catch (error: any) {
        logger.error('❌ Stock photo search error:', error);
        return NextResponse.json({ error: 'Search failed', photos: [] }, { status: 500 });
    }
}

async function searchPexels(query: string, page: number) {
    if (!PEXELS_API_KEY) {
        logger.info('⏭️  Skipping Pexels - no API key');
        return [];
    }

    try {
        logger.info(`🔍 Searching Pexels for: "${query}"`);
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );

        if (!response.ok) {
            logger.error(`Pexels API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        logger.info(`Pexels raw response:`, { total: data.total_results, photos: data.photos?.length });

        return data.photos?.map((photo: any) => ({
            id: `pexels-${photo.id}`,
            url: photo.src.large,
            thumbnailUrl: photo.src.medium,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            width: photo.width,
            height: photo.height,
            source: 'pexels',
            downloadUrl: photo.src.original
        })) || [];
    } catch (error) {
        logger.error('Pexels search failed:', error);
        return [];
    }
}

async function searchPixabay(query: string, page: number) {
    if (!PIXABAY_API_KEY) return [];

    try {
        const response = await fetch(
            `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20&page=${page}`
        );

        if (!response.ok) return [];

        const data = await response.json();

        return data.hits?.map((photo: any) => ({
            id: `pixabay-${photo.id}`,
            url: photo.largeImageURL,
            thumbnailUrl: photo.webformatURL,
            photographer: photo.user,
            photographerUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}`,
            width: photo.imageWidth,
            height: photo.imageHeight,
            source: 'pixabay',
            downloadUrl: photo.largeImageURL
        })) || [];
    } catch (error) {
        logger.error('Pixabay search failed:', error);
        return [];
    }
}
