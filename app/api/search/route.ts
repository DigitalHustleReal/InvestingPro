import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/services';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { searchQuerySchema } from '@/lib/validation/schemas';
import { sanitizeSearchQuery } from '@/lib/middleware/input-sanitization';

export const GET = createAPIWrapper('/api/search', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(undefined, searchQuerySchema)(
        async (request: NextRequest, _body: unknown, query: any) => {
            try {
                // Query parameters are already validated by middleware
                // Sanitize search query to prevent XSS
                const searchQuery = query?.q ? sanitizeSearchQuery(query.q) : '';
                const type = query?.type || 'search';
                const category = query?.category || undefined;
                const limit = query?.limit || 10;
                const articleId = query?.articleId;

                switch (type) {
                    case 'search':
                        const results = await searchService.search(searchQuery, {
                            category,
                            limit
                        });
                        return NextResponse.json(results);

                    case 'related':
                        if (!articleId) {
                            return NextResponse.json({ error: 'articleId required' }, { status: 400 });
                        }
                        // Use getRelatedArticles instead of getRelated
                        const relatedResults = await searchService.getRelatedArticles(articleId, limit);
                        return NextResponse.json({ results: relatedResults });

                    case 'trending':
                        const trendingResults = await searchService.getTrending(limit);
                        return NextResponse.json({ results: trendingResults });

                    case 'suggestions':
                        // getSuggestions takes no arguments in the underlying service
                        const suggestions = await searchService.getSuggestions();
                        return NextResponse.json({ suggestions });

                    default:
                        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
                }
            } catch (error) {
                logger.error('Search API error', error instanceof Error ? error : new Error(String(error)));
                throw error; // Let API wrapper handle error response
            }
        }
    )
);
