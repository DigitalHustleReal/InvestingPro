/**
 * Trends Service
 * Business logic for trending topics
 */
import { TrendsService } from '@/lib/trends/TrendsService';
import { logger } from '@/lib/logger';

export interface TrendsQuery {
    category?: string;
    limit?: number;
    timeframe?: 'day' | 'week' | 'month';
}

export interface TrendsServiceInterface {
    getTrending(query: TrendsQuery): Promise<{
        trends: any[];
        total: number;
    }>;
}

export class TrendsServiceImpl implements TrendsServiceInterface {
    private trendsService: TrendsService;

    constructor() {
        this.trendsService = new TrendsService();
    }

    async getTrending(query: TrendsQuery): Promise<{
        trends: any[];
        total: number;
    }> {
        try {
            const category = (query.category as 'markets' | 'personal-finance' | 'technology') || 'markets';

            // Use existing trends service (it doesn't accept limit/timeframe in current implementation)
            const trends = await this.trendsService.getTrendingTopics(category);

            // Apply limit if provided
            const limitedTrends = query.limit ? trends.slice(0, query.limit) : trends;

            return {
                trends: limitedTrends || [],
                total: (limitedTrends || []).length
            };
        } catch (error) {
            logger.error('Trends service getTrending error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const trendsService = new TrendsServiceImpl();
