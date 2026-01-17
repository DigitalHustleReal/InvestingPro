/**
 * Keyword API Client
 * 
 * FREE-FIRST APPROACH: Uses free/open-source APIs until revenue justifies premium
 * Priority: Free APIs > Freemium > Premium (when revenue justifies)
 * 
 * FREE TIER PROVIDERS:
 * 1. Google Keyword Planner (free, limited) - Primary
 * 2. Google Trends API (free) - Secondary
 * 3. Ubersuggest Free Tier (limited) - Tertiary
 * 4. Manual/Calculated Estimates - Fallback
 * 
 * PREMIUM UPGRADE PATH (when revenue justifies):
 * - Ahrefs (best data quality)
 * - Semrush (good Indian market coverage)
 * - Ubersuggest Pro (affordable)
 */

import { logger } from '@/lib/logger';
import { GoogleKeywordPlannerProvider, GoogleTrendsProvider, UbersuggestFreeProvider, ManualKeywordProvider } from './providers/free-keyword-providers';

export interface KeywordData {
    keyword: string;
    searchVolume: number; // Monthly search volume
    difficulty: number; // 0-100 keyword difficulty score
    cpc?: number; // Cost per click (USD)
    competition?: 'low' | 'medium' | 'high';
    intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
    serpFeatures?: string[]; // Featured snippet, PAA, video, etc.
    relatedKeywords?: string[];
}

export interface KeywordAPIProvider {
    name: string;
    getKeywordData(keyword: string, options?: any): Promise<KeywordData | null>;
    getRelatedKeywords(keyword: string, limit?: number): Promise<KeywordData[]>;
    getKeywordDifficulty(keyword: string): Promise<number | null>;
    getSearchVolume(keyword: string): Promise<number | null>;
}

/**
 * Ahrefs API Client (when API key available)
 */
class AhrefsProvider implements KeywordAPIProvider {
    name = 'ahrefs';
    private apiKey: string | null = null;

    constructor() {
        this.apiKey = process.env.AHREFS_API_KEY || null;
    }

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        if (!this.apiKey) {
            logger.warn('Ahrefs API key not configured, returning null');
            return null;
        }

        try {
            // TODO: Implement Ahrefs API integration
            // Example endpoint: https://api.ahrefs.com/v3/keywords-explorer/overview
            // For now, return null to trigger fallback
            logger.info('Ahrefs API not yet implemented, using fallback');
            return null;
        } catch (error) {
            logger.error('Ahrefs API error', error as Error, { keyword });
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
 * Semrush API Client (when API key available)
 */
class SemrushProvider implements KeywordAPIProvider {
    name = 'semrush';
    private apiKey: string | null = null;

    constructor() {
        this.apiKey = process.env.SEMRUSH_API_KEY || null;
    }

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        if (!this.apiKey) {
            logger.warn('Semrush API key not configured, returning null');
            return null;
        }

        try {
            // TODO: Implement Semrush API integration
            // Example endpoint: https://api.semrush.com/?type=phrase_this&key={API_KEY}&phrase={keyword}&database=in
            // For now, return null to trigger fallback
            logger.info('Semrush API not yet implemented, using fallback');
            return null;
        } catch (error) {
            logger.error('Semrush API error', error as Error, { keyword });
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
 * Ubersuggest API Client (Freemium - free tier available)
 */
class UbersuggestProvider implements KeywordAPIProvider {
    name = 'ubersuggest';
    private apiKey: string | null = null;

    constructor() {
        this.apiKey = process.env.UBERSUGGEST_API_KEY || null;
    }

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        if (!this.apiKey) {
            logger.warn('Ubersuggest API key not configured, returning null');
            return null;
        }

        try {
            // TODO: Implement Ubersuggest API integration
            // Ubersuggest has a free tier with limited requests
            // Example: Use Ubersuggest's free API for basic data
            logger.info('Ubersuggest API not yet implemented, using fallback');
            return null;
        } catch (error) {
            logger.error('Ubersuggest API error', error as Error, { keyword });
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
 * Placeholder/Mock Provider (fallback when no API keys)
 */
class PlaceholderProvider implements KeywordAPIProvider {
    name = 'placeholder';

    async getKeywordData(keyword: string): Promise<KeywordData | null> {
        logger.warn('Using placeholder keyword data - real API integration required', { keyword });
        
        // Return placeholder data (will be flagged in logs)
        return {
            keyword,
            searchVolume: 0, // Flagged as placeholder
            difficulty: 50, // Medium difficulty placeholder
            cpc: 0.5,
            competition: 'medium',
            intent: 'informational',
            serpFeatures: [],
            relatedKeywords: []
        };
    }

    async getRelatedKeywords(keyword: string, limit = 10): Promise<KeywordData[]> {
        return [];
    }

    async getKeywordDifficulty(keyword: string): Promise<number | null> {
        return 50; // Placeholder
    }

    async getSearchVolume(keyword: string): Promise<number | null> {
        return 0; // Placeholder - flagged as invalid
    }
}

/**
 * Unified Keyword API Client
 * FREE-FIRST PRIORITY ORDER:
 * 1. Free APIs (Google Keyword Planner, Google Trends, Ubersuggest Free)
 * 2. Manual/Crowdsourced data
 * 3. Premium APIs (Ahrefs, Semrush) - only when revenue justifies
 * 4. Placeholder - last resort fallback
 */
class KeywordAPIClient {
    private providers: KeywordAPIProvider[];

    constructor() {
        // Priority order: Free first, then premium (when revenue justifies)
        this.providers = [
            // FREE TIER (always checked first)
            new GoogleKeywordPlannerProvider(), // Free with Google Ads account
            new GoogleTrendsProvider(), // Free, no API key needed
            new ManualKeywordProvider(), // Free, manual curation
            new UbersuggestFreeProvider(), // Free tier (3 requests/day)
            
            // PREMIUM (checked only if free options exhausted)
            // Uncomment when revenue justifies:
            // new AhrefsProvider(), // Premium - best data quality
            // new SemrushProvider(), // Premium - good Indian coverage
            // new UbersuggestProvider(), // Premium - affordable
            
            new PlaceholderProvider() // Always last as fallback
        ];
    }

    /**
     * Get keyword data from first available provider
     * Tries free APIs first, then premium (when revenue justifies)
     */
    async getKeywordData(keyword: string): Promise<KeywordData> {
        for (const provider of this.providers) {
            // Skip premium providers if not configured (free-first approach)
            if (['ahrefs', 'semrush', 'ubersuggest'].includes(provider.name)) {
                if (!this.isPremiumAPIConfigured()) {
                    continue; // Skip premium if not configured
                }
            }

            try {
                const data = await provider.getKeywordData(keyword);
                if (data && (data.searchVolume > 0 || provider.name === 'google_keyword_planner' || provider.name === 'google_trends')) {
                    // Return data from free APIs or premium (premium only if configured)
                    if (provider.name !== 'placeholder') {
                        const providerType = this.isPremiumAPIConfigured() && ['ahrefs', 'semrush', 'ubersuggest'].includes(provider.name) 
                            ? 'premium' 
                            : 'free';
                        logger.info(`Keyword data from ${provider.name} (${providerType})`, { keyword, searchVolume: data.searchVolume });
                        return data;
                    }
                    // If placeholder, continue to next provider
                }
            } catch (error) {
                logger.warn(`Provider ${provider.name} failed, trying next`, { keyword });
                continue;
            }
        }

        // If all providers failed, return free estimation (not placeholder)
        logger.warn('All keyword API providers failed, using free estimation', { keyword });
        const freeProvider = new GoogleKeywordPlannerProvider();
        const data = await freeProvider.getKeywordData(keyword);
        return data!;
    }

    /**
     * Get search volume from first available provider
     */
    async getSearchVolume(keyword: string): Promise<number> {
        for (const provider of this.providers) {
            if (provider.name === 'placeholder') continue; // Skip placeholder

            try {
                const volume = await provider.getSearchVolume(keyword);
                if (volume !== null && volume > 0) {
                    return volume;
                }
            } catch (error) {
                continue;
            }
        }

        logger.warn('No search volume data available, returning 0', { keyword });
        return 0;
    }

    /**
     * Get keyword difficulty from first available provider
     */
    async getKeywordDifficulty(keyword: string): Promise<number> {
        for (const provider of this.providers) {
            if (provider.name === 'placeholder') continue; // Skip placeholder

            try {
                const difficulty = await provider.getKeywordDifficulty(keyword);
                if (difficulty !== null) {
                    return difficulty;
                }
            } catch (error) {
                continue;
            }
        }

        logger.warn('No keyword difficulty data available, returning 50 (medium)', { keyword });
        return 50; // Default to medium
    }

    /**
     * Get related keywords from first available provider
     */
    async getRelatedKeywords(keyword: string, limit = 10): Promise<KeywordData[]> {
        for (const provider of this.providers) {
            if (provider.name === 'placeholder') continue; // Skip placeholder

            try {
                const keywords = await provider.getRelatedKeywords(keyword, limit);
                if (keywords.length > 0) {
                    return keywords;
                }
            } catch (error) {
                continue;
            }
        }

        return [];
    }

    /**
     * Check if real API is configured (not placeholder)
     * Includes free APIs - they count as "real" data
     */
    isRealAPIConfigured(): boolean {
        return !!(
            // Free APIs
            process.env.GOOGLE_ADS_API_KEY ||
            process.env.UBERSUGGEST_FREE_API_KEY ||
            // Premium APIs (when revenue justifies)
            process.env.AHREFS_API_KEY ||
            process.env.SEMRUSH_API_KEY ||
            process.env.UBERSUGGEST_API_KEY
        );
    }

    /**
     * Check if premium API is configured (paid subscriptions)
     */
    isPremiumAPIConfigured(): boolean {
        return !!(
            process.env.AHREFS_API_KEY ||
            process.env.SEMRUSH_API_KEY ||
            process.env.UBERSUGGEST_API_KEY
        );
    }

    /**
     * Get active provider name
     */
    getActiveProvider(): string {
        // Check free APIs first
        if (process.env.GOOGLE_ADS_API_KEY) return 'google_keyword_planner';
        if (process.env.UBERSUGGEST_FREE_API_KEY) return 'ubersuggest_free';
        
        // Check premium APIs (when revenue justifies)
        if (process.env.AHREFS_API_KEY) return 'ahrefs';
        if (process.env.SEMRUSH_API_KEY) return 'semrush';
        if (process.env.UBERSUGGEST_API_KEY) return 'ubersuggest';
        
        // Default to free estimation
        return 'google_keyword_planner'; // Uses estimation
    }
}

// Export singleton instance
export const keywordAPIClient = new KeywordAPIClient();

/**
 * Helper function to get keyword data with fallback
 */
export async function getKeywordData(keyword: string): Promise<KeywordData> {
    return keywordAPIClient.getKeywordData(keyword);
}

/**
 * Helper function to check if real API is configured (includes free APIs)
 */
export function isKeywordAPIConfigured(): boolean {
    return keywordAPIClient.isRealAPIConfigured();
}

/**
 * Helper function to check if premium API is configured
 */
export function isPremiumKeywordAPIConfigured(): boolean {
    return keywordAPIClient.isPremiumAPIConfigured();
}
