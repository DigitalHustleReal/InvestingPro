/**
 * Search Service
 * Business logic for search functionality
 */
import { cachedSearchService } from '@/lib/search/service.cached';
import { logger as serviceLogger } from '@/lib/logger';

export interface SearchQuery {
    q?: string;
    type?: 'all' | 'articles' | 'products';
    category?: string;
    limit?: number;
}

export interface SearchService {
    search(query: SearchQuery): Promise<{
        results: any[];
        total: number;
        type: string;
    }>;
    getRelated(query: string, limit?: number): Promise<any[]>;
    getTrending(limit?: number): Promise<any[]>;
    getSuggestions(query: string, limit?: number): Promise<string[]>;
}

export class SearchServiceImpl implements SearchService {
    async search(query: SearchQuery): Promise<{
        results: any[];
        total: number;
        type: string;
    }> {
        try {
            const searchTerm = query.q || '';
            const type = (query.type || 'all') as any;
            const limit = query.limit || 10;

            if (!searchTerm) {
                return {
                    results: [],
                    total: 0,
                    type
                };
            }

            // Use existing search service
            const results = await cachedSearchService.search(searchTerm, {
                type,
                category: query.category,
                limit
            });

            return {
                results: results.results || [],
                total: results.total || 0,
                type: query.type || 'all'
            };
        } catch (error) {
            serviceLogger.error('Search service search error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getRelated(articleIdOrQuery: string, limit: number = 5): Promise<any[]> {
        try {
            // If it's an articleId, use getRelatedArticles, otherwise search
            if (articleIdOrQuery.length === 36) { // UUID length
                const results = await cachedSearchService.getRelatedArticles(articleIdOrQuery, limit);
                return results || [];
            } else {
                const results = await cachedSearchService.search(articleIdOrQuery, {
                    type: 'articles',
                    limit
                });
                return results.results || [];
            }
        } catch (error) {
            serviceLogger.error('Search service getRelated error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getTrending(limit: number = 10): Promise<any[]> {
        try {
            // Use cached search service for trending
            const results = await cachedSearchService.getTrending(limit);
            return results || [];
        } catch (error) {
            serviceLogger.error('Search service getTrending error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
        try {
            // Use cached search service for suggestions
            const suggestions = await cachedSearchService.getSuggestions(query);
            return suggestions || [];
        } catch (error) {
            serviceLogger.error('Search service getSuggestions error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const searchServiceInstance = new SearchServiceImpl();
