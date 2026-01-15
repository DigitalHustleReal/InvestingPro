/**
 * Keyword Discovery System
 * 
 * Automated discovery of long-tail keyword opportunities in Credit Cards + Mutual Funds.
 * Focuses on decision-focused keywords with low competition and high commercial intent.
 * 
 * FEATURES:
 * - Long-tail keyword discovery (4+ words)
 * - Focus on Credit Cards + Mutual Funds
 * - Decision-focused keywords only
 * - Low competition filtering
 * - Auto-integration with content generation
 */

import { researchKeyword, findKeywordOpportunities, KeywordData } from '@/lib/research/keyword-researcher';
import { scoreKeywordDifficulty } from '@/lib/seo/keyword-difficulty-scorer';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Seed keywords for discovery
const SEED_KEYWORDS = {
    'credit-cards': [
        'best credit card',
        'credit card for',
        'credit card comparison',
        'credit card rewards',
        'credit card cashback',
        'credit card for shopping',
        'credit card for travel',
        'credit card for fuel',
        'credit card for groceries',
        'lifetime free credit card'
    ],
    'mutual-funds': [
        'best mutual fund',
        'mutual fund for',
        'mutual fund SIP',
        'mutual fund investment',
        'mutual fund for retirement',
        'mutual fund for tax saving',
        'mutual fund for beginners',
        'mutual fund comparison',
        'best SIP plan',
        'mutual fund returns'
    ]
};

interface DiscoveredKeyword {
    keyword: string;
    category: 'credit-cards' | 'mutual-funds';
    difficulty: number;
    opportunity_score: number;
    intent: 'informational' | 'commercial' | 'navigational' | 'transactional';
    word_count: number;
    is_long_tail: boolean;
    discovered_at: string;
}

/**
 * Discover long-tail keywords for a category
 */
export async function discoverLongTailKeywords(
    category: 'credit-cards' | 'mutual-funds',
    maxDifficulty: number = 40,
    minWordCount: number = 4
): Promise<DiscoveredKeyword[]> {
    logger.info(`Discovering long-tail keywords for ${category}`, { maxDifficulty, minWordCount });

    const seedKeywords = SEED_KEYWORDS[category];
    const discovered: DiscoveredKeyword[] = [];
    const seen = new Set<string>();

    for (const seed of seedKeywords) {
        try {
            // Find opportunities from seed keyword
            const opportunities = await findKeywordOpportunities(seed, maxDifficulty);

            for (const opp of opportunities) {
                const keyword = opp.keyword.toLowerCase().trim();
                const wordCount = keyword.split(' ').length;

                // Filter: Must be long-tail (4+ words) and decision-focused
                if (wordCount < minWordCount) continue;
                if (seen.has(keyword)) continue;
                if (!isDecisionFocused(keyword)) continue;

                // Check if already published
                const isPublished = await checkIfKeywordPublished(keyword, category);
                if (isPublished) continue;

                discovered.push({
                    keyword,
                    category,
                    difficulty: opp.difficulty,
                    opportunity_score: opp.opportunity_score,
                    intent: opp.intent,
                    word_count: wordCount,
                    is_long_tail: wordCount >= 4,
                    discovered_at: new Date().toISOString()
                });

                seen.add(keyword);

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            logger.error(`Failed to discover keywords from seed: ${seed}`, error as Error);
        }
    }

    // Sort by opportunity score
    discovered.sort((a, b) => b.opportunity_score - a.opportunity_score);

    logger.info(`Discovered ${discovered.length} long-tail keywords for ${category}`);

    return discovered;
}

/**
 * Check if keyword is decision-focused (not educational)
 */
function isDecisionFocused(keyword: string): boolean {
    const lower = keyword.toLowerCase();

    // Decision-focused patterns
    const decisionPatterns = [
        /best .* for/i,
        /top .* for/i,
        /.* for .* in india/i,
        /.* if you spend/i,
        /.* for .* month/i,
        /.* comparison/i,
        /.* vs .*/i,
        /.* which is better/i,
        /.* for beginners/i,
        /.* for .* year/i
    ];

    // Educational patterns to exclude
    const educationalPatterns = [
        /^what is/i,
        /^how to/i,
        /^why/i,
        /^when/i,
        /^where/i,
        /^who/i,
        /^explain/i,
        /^understanding/i,
        /^guide to/i,
        /^introduction to/i
    ];

    // Must match decision pattern
    const matchesDecision = decisionPatterns.some(pattern => pattern.test(lower));
    
    // Must NOT match educational pattern
    const matchesEducational = educationalPatterns.some(pattern => pattern.test(lower));

    return matchesDecision && !matchesEducational;
}

/**
 * Check if keyword already has published content
 */
async function checkIfKeywordPublished(
    keyword: string,
    category: 'credit-cards' | 'mutual-funds'
): Promise<boolean> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
            .from('articles')
            .select('id')
            .eq('category', category)
            .eq('status', 'published')
            .ilike('title', `%${keyword}%`)
            .limit(1);

        if (error) {
            logger.warn('Failed to check published articles', { error: error.message });
            return false; // Assume not published if check fails
        }

        return (data?.length || 0) > 0;
    } catch (error) {
        logger.error('Error checking published articles', error as Error);
        return false;
    }
}

/**
 * Save discovered keywords to database for tracking
 */
export async function saveDiscoveredKeywords(
    keywords: DiscoveredKeyword[]
): Promise<void> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Create table if it doesn't exist (via migration)
        // For now, we'll just log them
        for (const kw of keywords) {
            logger.info('Discovered keyword', {
                keyword: kw.keyword,
                category: kw.category,
                difficulty: kw.difficulty,
                opportunity_score: kw.opportunity_score
            });
        }

        // TODO: Save to keyword_discoveries table when migration is created
    } catch (error) {
        logger.error('Failed to save discovered keywords', error as Error);
    }
}

/**
 * Get top discovered keywords for content generation
 */
export async function getTopKeywordsForGeneration(
    category: 'credit-cards' | 'mutual-funds',
    limit: number = 10
): Promise<DiscoveredKeyword[]> {
    // Discover fresh keywords
    const discovered = await discoverLongTailKeywords(category, 40, 4);

    // Filter: High opportunity, low difficulty, not published
    const topKeywords = discovered
        .filter(kw => kw.opportunity_score >= 60 && kw.difficulty <= 40)
        .slice(0, limit);

    return topKeywords;
}

/**
 * Batch discover keywords for both categories
 */
export async function discoverKeywordsForBothCategories(
    limitPerCategory: number = 20
): Promise<{
    'credit-cards': DiscoveredKeyword[];
    'mutual-funds': DiscoveredKeyword[];
}> {
    logger.info('Starting keyword discovery for both categories');

    const [creditCards, mutualFunds] = await Promise.all([
        discoverLongTailKeywords('credit-cards', 40, 4),
        discoverLongTailKeywords('mutual-funds', 40, 4)
    ]);

    return {
        'credit-cards': creditCards.slice(0, limitPerCategory),
        'mutual-funds': mutualFunds.slice(0, limitPerCategory)
    };
}
