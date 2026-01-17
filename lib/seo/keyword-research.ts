/**
 * Keyword Research Integration
 * Integrates keyword research into content generation pipeline
 * 
 * UPDATED: Now uses real keyword API data (Ahrefs/Semrush/Ubersuggest)
 * Falls back to placeholder if no API key configured
 * 
 * FREE TIER OPTIONS:
 * - Google Trends API (free) - trend data only
 * - Ubersuggest (limited free tier)
 * - Manual keyword research
 * - AI-generated keywords (using OpenAI/Groq)
 */

import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { logger } from '@/lib/logger';
import { getKeywordData, isKeywordAPIConfigured } from '@/lib/seo/keyword-api-client';

export interface KeywordOpportunity {
    keyword: string;
    searchVolume?: number;
    difficulty: number; // 0-100
    traffic: number; // Estimated monthly traffic
    opportunityScore: number; // 0-100 (higher = better opportunity)
    cpc?: number; // Cost per click
    competition?: 'low' | 'medium' | 'high';
}

/**
 * Rank keywords by opportunity (traffic vs difficulty)
 */
export function rankKeywordOpportunities(keywords: Array<{
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
}>): KeywordOpportunity[] {
    return keywords.map(kw => {
        const searchVolume = kw.searchVolume || 0;
        const difficulty = kw.difficulty || 50; // Default to medium

        // Calculate opportunity score
        // Higher volume + lower difficulty = better opportunity
        const volumeScore = Math.min(100, (searchVolume / 10000) * 100); // Normalize to 100
        const difficultyScore = 100 - difficulty; // Lower difficulty = higher score
        const opportunityScore = (volumeScore * 0.6) + (difficultyScore * 0.4);

        // Estimate traffic (conservative estimate: 10% of search volume for position 1)
        const traffic = searchVolume > 0 ? Math.round(searchVolume * 0.1) : 0;

        // Determine competition
        let competition: 'low' | 'medium' | 'high' = 'medium';
        if (difficulty < 30) competition = 'low';
        else if (difficulty > 70) competition = 'high';

        return {
            keyword: kw.keyword,
            searchVolume,
            difficulty,
            traffic,
            opportunityScore: Number(opportunityScore.toFixed(2)),
            competition
        };
    }).sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Get keywords for content generation
 * Integrates with keyword research service and ranks by opportunity
 */
export async function getKeywordsForContentGeneration(
    primaryKeyword: string,
    articleContext?: string
): Promise<{
    primaryKeyword: string;
    recommendedKeywords: KeywordOpportunity[];
    longTailKeywords: KeywordOpportunity[];
    semanticKeywords: KeywordOpportunity[];
}> {
    try {
        // Perform keyword research
        const researchResult = await keywordResearchService.performKeywordResearch(
            primaryKeyword,
            articleContext
        );

        // Combine all keywords
        const allKeywords = [
            ...researchResult.long_tail_keywords.map(kw => ({
                keyword: kw.keyword_text,
                searchVolume: kw.search_volume,
                difficulty: kw.difficulty_score
            })),
            ...researchResult.semantic_keywords.map(kw => ({
                keyword: kw.keyword_text,
                searchVolume: kw.search_volume,
                difficulty: kw.difficulty_score
            })),
            ...researchResult.alternative_keywords.map(kw => ({
                keyword: kw.keyword_text,
                searchVolume: kw.search_volume,
                difficulty: kw.difficulty_score
            })),
            ...researchResult.lsi_keywords.map(kw => ({
                keyword: kw.keyword_text,
                searchVolume: kw.search_volume,
                difficulty: kw.difficulty_score
            }))
        ];

        // Rank by opportunity
        const ranked = rankKeywordOpportunities(allKeywords);

        // Get top 10 for content inclusion
        const recommendedKeywords = ranked.slice(0, 10);
        const longTailKeywords = ranked.filter(kw => 
            kw.keyword.split(' ').length >= 3
        ).slice(0, 5);
        const semanticKeywords = ranked.filter(kw =>
            researchResult.semantic_keywords.some(sk => sk.keyword_text === kw.keyword)
        ).slice(0, 5);

        return {
            primaryKeyword,
            recommendedKeywords,
            longTailKeywords,
            semanticKeywords
        };

    } catch (error) {
        logger.error('Error getting keywords for content generation', error, { primaryKeyword });
        // Return fallback
        return {
            primaryKeyword,
            recommendedKeywords: [{
                keyword: primaryKeyword,
                difficulty: 50,
                traffic: 0,
                opportunityScore: 50,
                competition: 'medium'
            }],
            longTailKeywords: [],
            semanticKeywords: []
        };
    }
}

/**
 * Get keyword suggestions for a category
 */
export async function getCategoryKeywords(category: string): Promise<KeywordOpportunity[]> {
    // Generate category-specific keywords
    const categoryKeywords: Record<string, string[]> = {
        'credit-cards': [
            'best credit card',
            'credit card comparison',
            'cashback credit card',
            'travel credit card',
            'credit card benefits'
        ],
        'mutual-funds': [
            'best mutual fund',
            'sip investment',
            'mutual fund comparison',
            'tax saving mutual fund',
            'mutual fund returns'
        ],
        'insurance': [
            'best insurance policy',
            'term insurance',
            'health insurance',
            'insurance comparison',
            'insurance premium calculator'
        ],
        'loans': [
            'personal loan',
            'home loan',
            'loan interest rate',
            'loan calculator',
            'loan comparison'
        ]
    };

    const keywords = categoryKeywords[category] || [];
    
    // Get real keyword data if API configured, otherwise use placeholder
    const keywordDataPromises = keywords.map(async (kw) => {
        if (isKeywordAPIConfigured()) {
            try {
                const data = await getKeywordData(kw);
                return {
                    keyword: kw,
                    searchVolume: data.searchVolume,
                    difficulty: data.difficulty
                };
            } catch (error) {
                logger.warn('Failed to get keyword data, using placeholder', { keyword: kw, error });
                // Fall back to placeholder
            }
        }
        
        // Placeholder data (will be flagged in logs)
        logger.warn('Using placeholder keyword data - real API integration required', { keyword: kw });
        return {
            keyword: kw,
            searchVolume: 0, // Flagged as placeholder
            difficulty: 50 // Medium difficulty placeholder
        };
    });

    const keywordData = await Promise.all(keywordDataPromises);
    
    // Rank opportunities using real or placeholder data
    const ranked = rankKeywordOpportunities(keywordData);

    return ranked;
}
