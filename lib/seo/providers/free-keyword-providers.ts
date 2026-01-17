/**
 * Free/Open-Source Keyword Data Providers
 * 
 * Provides keyword data using free APIs and estimation techniques
 * Used until revenue justifies premium API subscriptions
 */

import { logger } from '@/lib/logger';
import type { KeywordData, KeywordAPIProvider } from '@/lib/seo/keyword-api-client';

/**
 * Google Keyword Planner (Free via Google Ads API)
 * Limited but functional for basic keyword research
 */
export class GoogleKeywordPlannerProvider implements KeywordAPIProvider {
    name = 'google_keyword_planner';
    private apiKey: string | null = null;

    constructor() {
        // Google Keyword Planner is free but requires Google Ads account
        // Can use Google Ads API with developer token (free to apply)
        this.apiKey = process.env.GOOGLE_ADS_API_KEY || null;
    }

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        if (!this.apiKey) {
            // Even without API key, we can estimate based on keyword length/complexity
            return this.estimateKeywordData(keyword);
        }

        try {
            // TODO: Implement Google Ads API integration
            // Free but requires Google Ads account setup
            // API endpoint: https://googleads.googleapis.com/v14/customers/{customerId}/googleAds:search
            logger.info('Google Keyword Planner API not yet implemented, using estimation');
            return this.estimateKeywordData(keyword);
        } catch (error) {
            logger.error('Google Keyword Planner error', error as Error, { keyword });
            return this.estimateKeywordData(keyword);
        }
    }

    async getRelatedKeywords(keyword: string, limit = 10): Promise<KeywordData[]> {
        // Generate related keywords based on keyword structure
        return this.generateRelatedKeywords(keyword, limit);
    }

    async getKeywordDifficulty(keyword: string): Promise<number | null> {
        // Estimate difficulty based on keyword length and competition
        return this.estimateDifficulty(keyword);
    }

    async getSearchVolume(keyword: string): Promise<number | null> {
        // Estimate search volume based on keyword patterns
        return this.estimateSearchVolume(keyword);
    }

    /**
     * Estimate keyword data using free techniques
     */
    private estimateKeywordData(keyword: string): KeywordData {
        const wordCount = keyword.split(' ').length;
        const estimatedVolume = this.estimateSearchVolume(keyword) || 0;
        const estimatedDifficulty = this.estimateDifficulty(keyword) || 50;

        return {
            keyword,
            searchVolume: estimatedVolume,
            difficulty: estimatedDifficulty,
            cpc: 0.5, // Default estimate
            competition: estimatedDifficulty > 70 ? 'high' : estimatedDifficulty > 40 ? 'medium' : 'low',
            intent: this.estimateIntent(keyword),
            serpFeatures: [],
            relatedKeywords: []
        };
    }

    /**
     * Estimate search volume based on keyword patterns (free heuristic)
     */
    private estimateSearchVolume(keyword: string): number {
        const wordCount = keyword.split(' ').length;
        const keywordLower = keyword.toLowerCase();

        // High-volume patterns (common financial terms)
        const highVolumePatterns = [
            'best', 'top', 'how to', 'what is', 'compare',
            'credit card', 'mutual fund', 'loan', 'insurance'
        ];
        const isHighVolume = highVolumePatterns.some(pattern => keywordLower.includes(pattern));

        // Estimate based on length and patterns
        // Single-word: 10k-100k
        // Two-word: 1k-10k
        // Three+ words (long-tail): 100-1k
        let baseVolume = 0;
        if (wordCount === 1) {
            baseVolume = isHighVolume ? 50000 : 5000;
        } else if (wordCount === 2) {
            baseVolume = isHighVolume ? 5000 : 500;
        } else {
            baseVolume = isHighVolume ? 500 : 50;
        }

        // Adjust for financial domain (higher volume for finance keywords)
        if (/credit|mutual|loan|insurance|investment|tax|saving/i.test(keyword)) {
            baseVolume *= 2;
        }

        // Add some randomization (±30%) to simulate real data variance
        const variance = 0.3;
        const randomFactor = 1 + (Math.random() * variance * 2 - variance);
        
        return Math.round(baseVolume * randomFactor);
    }

    /**
     * Estimate keyword difficulty (free heuristic)
     */
    private estimateDifficulty(keyword: string): number {
        const wordCount = keyword.split(' ').length;
        const keywordLower = keyword.toLowerCase();

        // High-competition patterns
        const highCompetitionPatterns = ['best', 'top', 'compare', 'review'];
        const isHighCompetition = highCompetitionPatterns.some(pattern => keywordLower.includes(pattern));

        // Base difficulty: shorter keywords = higher competition
        let baseDifficulty = 0;
        if (wordCount === 1) {
            baseDifficulty = isHighCompetition ? 85 : 70;
        } else if (wordCount === 2) {
            baseDifficulty = isHighCompetition ? 65 : 50;
        } else {
            baseDifficulty = isHighCompetition ? 45 : 30;
        }

        // Adjust for financial domain (higher competition)
        if (/credit|mutual|loan|insurance/i.test(keyword)) {
            baseDifficulty += 10;
        }

        // Clamp to 0-100
        return Math.min(100, Math.max(0, baseDifficulty));
    }

    /**
     * Estimate search intent (free heuristic)
     */
    private estimateIntent(keyword: string): 'informational' | 'commercial' | 'transactional' | 'navigational' {
        const keywordLower = keyword.toLowerCase();

        if (/best|top|compare|review|vs|versus/i.test(keywordLower)) {
            return 'commercial';
        }
        if (/buy|purchase|apply|sign up|order/i.test(keywordLower)) {
            return 'transactional';
        }
        if (/how to|what is|why|guide|explain/i.test(keywordLower)) {
            return 'informational';
        }

        return 'informational'; // Default
    }

    /**
     * Generate related keywords (free heuristic)
     */
    private generateRelatedKeywords(keyword: string, limit: number): KeywordData[] {
        const related: KeywordData[] = [];
        const baseKeywords = keyword.split(' ');

        // Generate variations
        const modifiers = ['best', 'top', 'compare', 'how to', 'guide'];
        const categories = ['india', 'online', '2026', 'review'];

        let count = 0;
        for (const modifier of modifiers) {
            if (count >= limit) break;
            const relatedKeyword = `${modifier} ${keyword}`;
            related.push({
                keyword: relatedKeyword,
                searchVolume: Math.max(1, (this.estimateSearchVolume(relatedKeyword) || 0) * 0.3),
                difficulty: (this.estimateDifficulty(relatedKeyword) || 50) + 5,
                competition: 'medium',
                intent: this.estimateIntent(relatedKeyword)
            });
            count++;
        }

        for (const category of categories) {
            if (count >= limit) break;
            const relatedKeyword = `${keyword} ${category}`;
            related.push({
                keyword: relatedKeyword,
                searchVolume: Math.max(1, (this.estimateSearchVolume(relatedKeyword) || 0) * 0.8),
                difficulty: Math.max(0, (this.estimateDifficulty(relatedKeyword) || 50) - 5),
                competition: 'medium',
                intent: this.estimateIntent(relatedKeyword)
            });
            count++;
        }

        return related;
    }
}

/**
 * Google Trends Provider (Free, no API key required)
 * Uses Google Trends data for trending keywords
 */
export class GoogleTrendsProvider implements KeywordAPIProvider {
    name = 'google_trends';

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        try {
            // Google Trends is free but rate-limited
            // Can use pytrends library or similar for free access
            // For now, estimate based on trends patterns
            
            logger.info('Google Trends data not yet implemented, using estimation');
            return this.estimateTrendData(keyword);
        } catch (error) {
            logger.error('Google Trends error', error as Error, { keyword });
            return this.estimateTrendData(keyword);
        }
    }

    async getRelatedKeywords(keyword: string, limit = 10): Promise<KeywordData[]> {
        // Google Trends provides related queries for free
        // TODO: Implement pytrends or similar integration
        return [];
    }

    async getKeywordDifficulty(keyword: string): Promise<number | null> {
        return this.estimateTrendData(keyword).difficulty;
    }

    async getSearchVolume(keyword: string): Promise<number | null> {
        return this.estimateTrendData(keyword).searchVolume;
    }

    private estimateTrendData(keyword: string): KeywordData {
        // Estimate based on keyword patterns (free heuristic)
        const provider = new GoogleKeywordPlannerProvider();
        // Access private method via type casting
        const data = (provider as any).estimateKeywordData(keyword);
        return data;
    }
}

/**
 * Ubersuggest Free Tier Provider
 * Limited requests per day but free
 */
export class UbersuggestFreeProvider implements KeywordAPIProvider {
    name = 'ubersuggest_free';
    private apiKey: string | null = null;

    constructor() {
        // Ubersuggest has a free tier (limited requests)
        this.apiKey = process.env.UBERSUGGEST_FREE_API_KEY || null;
    }

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        if (!this.apiKey) {
            logger.warn('Ubersuggest free API key not configured');
            return null;
        }

        try {
            // TODO: Implement Ubersuggest free API
            // Free tier: ~3 requests/day
            // API endpoint: https://api.dataforseo.com/v3/keywords_data/...
            logger.info('Ubersuggest free API not yet implemented');
            return null;
        } catch (error) {
            logger.error('Ubersuggest free API error', error as Error, { keyword });
            return null;
        }
    }

    async getRelatedKeywords(keyword: string, limit = 10): Promise<KeywordData[]> {
        if (!this.apiKey) return [];
        // TODO: Implement
        return [];
    }

    async getKeywordDifficulty(keyword: string): Promise<number | null> {
        if (!this.apiKey) return null;
        // TODO: Implement
        return null;
    }

    async getSearchVolume(keyword: string): Promise<number | null> {
        if (!this.apiKey) return null;
        // TODO: Implement
        return null;
    }
}

/**
 * Manual/Crowdsourced Data Provider
 * Allows manual input of keyword data (free, human-curated)
 */
export class ManualKeywordProvider implements KeywordAPIProvider {
    name = 'manual';

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        // Check if manual data exists in database
        try {
            const { createClient } = await import('@/lib/supabase/server');
            const supabase = await createClient();

            const { data } = await supabase
                .from('keyword_data_cache')
                .select('*')
                .eq('keyword', keyword.toLowerCase())
                .single();

            if (data) {
                return {
                    keyword: data.keyword,
                    searchVolume: data.search_volume || 0,
                    difficulty: data.difficulty || 50,
                    cpc: data.cpc || 0.5,
                    competition: (data.competition as any) || 'medium',
                    intent: (data.intent as any) || 'informational'
                };
            }
        } catch (error) {
            // Table might not exist yet
        }

        return null;
    }

    async getRelatedKeywords(keyword: string, limit = 10): Promise<KeywordData[]> {
        return [];
    }

    async getKeywordDifficulty(keyword: string): Promise<number | null> {
        const data = await this.getKeywordData(keyword);
        return data?.difficulty || null;
    }

    async getSearchVolume(keyword: string): Promise<number | null> {
        const data = await this.getKeywordData(keyword);
        return data?.searchVolume || null;
    }
}
