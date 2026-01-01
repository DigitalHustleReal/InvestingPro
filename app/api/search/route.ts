import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/search/service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';
        const type = searchParams.get('type') || 'search';
        const category = searchParams.get('category') || undefined;
        const limit = parseInt(searchParams.get('limit') || '10');
        const articleId = searchParams.get('articleId');

        switch (type) {
            case 'search':
                const searchResults = await searchService.search(query, {
                    limit,
                    category,
                    sortBy: searchParams.get('sortBy') as any || 'relevance'
                });
                return NextResponse.json(searchResults);

            case 'related':
                if (!articleId) {
                    return NextResponse.json({ error: 'articleId required' }, { status: 400 });
                }
                const relatedResults = await searchService.getRelatedArticles(articleId, limit);
                return NextResponse.json({ results: relatedResults });

            case 'trending':
                const trendingResults = await searchService.getTrending(limit);
                return NextResponse.json({ results: trendingResults });

            case 'suggestions':
                const suggestions = await searchService.getSuggestions();
                return NextResponse.json({ suggestions });

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

    } catch (error) {
        logger.error('Search API error', error as Error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
