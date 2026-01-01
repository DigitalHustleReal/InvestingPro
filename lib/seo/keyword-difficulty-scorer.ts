import { logger } from '@/lib/logger';

/**
 * 🎯 KEYWORD DIFFICULTY SCORER
 * 
 * Calculates how hard it is to rank for a keyword on a scale of 0-100.
 * Uses SERP analysis to estimate competition level.
 * 
 * FEATURES:
 * - Graceful fallback if SERP API unavailable
 * - Domain Authority estimation from URL patterns
 * - Difficulty based on competitor strength
 * 
 * DIFFICULTY LEVELS:
 * - 0-30: Easy (Low competition, new sites can rank)
 * - 30-60: Medium (Mixed results, established sites needed)
 * - 60-80: Hard (High authority sites dominate)
 * - 80-100: Very Hard (Wikipedia, Government, Forbes-level)
 */

export interface DifficultyScore {
    keyword: string;
    difficulty: number; // 0-100
    level: 'easy' | 'medium' | 'hard' | 'very-hard';
    confidence: number; // 0-1 (how reliable is this score)
    competitors: CompetitorStrength[];
    recommendation: string;
}

export interface CompetitorStrength {
    url: string;
    title: string;
    estimatedDA: number; // Domain Authority estimate
    isAuthoritative: boolean;
}

/**
 * Main scoring function
 */
export async function scoreKeywordDifficulty(
    keyword: string,
    options: { 
        useRealSERP?: boolean; // Default: true if API available
        targetAuthority?: number; // Your site's DA (for recommendations)
    } = {}
): Promise<DifficultyScore> {
    const { useRealSERP = true, targetAuthority = 0 } = options;

    try {
        logger.info('Scoring keyword difficulty', { keyword });

        // 1. Get competitors from SERP
        let competitors: CompetitorStrength[] = [];
        let confidence = 0.5; // Default medium confidence

        if (useRealSERP) {
            try {
                // Lazy load serpAnalyzer to avoid API key requirement at module load
                const { serpAnalyzer } = await import('@/lib/research/serp-analyzer');
                const serpResults = await serpAnalyzer.getTopResults(keyword);
                competitors = serpResults.map(analyzeCompetitorStrength);
                confidence = 0.9; // High confidence with real data
            } catch (error) {
                logger.warn('SERP API unavailable, using heuristic', { keyword });
                // Fallback to heuristic scoring
                competitors = estimateCompetitorsFromKeyword(keyword);
                confidence = 0.4; // Lower confidence with estimates
            }
        } else {
            // Heuristic-only mode
            competitors = estimateCompetitorsFromKeyword(keyword);
            confidence = 0.3;
        }

        // 2. Calculate difficulty from competitors
        const difficulty = calculateDifficultyFromCompetitors(competitors);

        // 3. Determine level
        const level = getDifficultyLevel(difficulty);

        // 4. Generate recommendation
        const recommendation = getRecommendation(difficulty, targetAuthority, keyword);

        return {
            keyword,
            difficulty,
            level,
            confidence,
            competitors: competitors.slice(0, 5), // Top 5
            recommendation
        };

    } catch (error) {
        logger.error('Keyword difficulty scoring failed', error as Error, { keyword });
        
        // Ultimate fallback: Return medium difficulty with low confidence
        return {
            keyword,
            difficulty: 50,
            level: 'medium',
            confidence: 0.1,
            competitors: [],
            recommendation: 'Unable to score difficulty. Proceed with caution.'
        };
    }
}

/**
 * Analyze a competitor's strength based on their domain
 */
function analyzeCompetitorStrength(competitor: { url: string; title: string }): CompetitorStrength {
    const domain = extractDomain(competitor.url);
    const estimatedDA = estimateDomainAuthority(domain);
    const isAuthoritative = estimatedDA >= 60;

    return {
        url: competitor.url,
        title: competitor.title,
        estimatedDA,
        isAuthoritative
    };
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

/**
 * Estimate Domain Authority from domain patterns
 * (Heuristic-based when no API access)
 */
function estimateDomainAuthority(domain: string): number {
    // Wikipedia, Government, Educational = 90-100
    if (domain.includes('wikipedia.org') || 
        domain.includes('.gov') || 
        domain.endsWith('.edu')) {
        return 95;
    }

    // Major news/finance sites = 70-90
    const majorSites = [
        'economictimes.indiatimes.com',
        'moneycontrol.com',
        'forbes.com',
        'bloomberg.com',
        'reuters.com',
        'livemint.com',
        'business-standard.com'
    ];
    if (majorSites.some(site => domain.includes(site))) {
        return 85;
    }

    // Established finance sites = 50-70
    const establishedSites = [
        'cleartax.in',
        'valueresearchonline.com',
        'groww.in',
        'zerodha.com',
        'indiainfoline.com',
        'personalfin.com'
    ];
    if (establishedSites.some(site => domain.includes(site))) {
        return 60;
    }

    // Medium authority = 30-50
    const mediumSites = [
        'paisabazaar.com',
        'bankbazaar.com',
        'policybazaar.com'
    ];
    if (mediumSites.some(site => domain.includes(site))) {
        return 40;
    }

    // Default for unknown domains
    return 25;
}

/**
 * Calculate difficulty from competitor analysis
 */
function calculateDifficultyFromCompetitors(competitors: CompetitorStrength[]): number {
    if (competitors.length === 0) {
        return 50; // Unknown, assume medium
    }

    // Calculate average DA of top 10 (or available)
    const avgDA = competitors.reduce((sum, c) => sum + c.estimatedDA, 0) / competitors.length;

    // Count highly authoritative sites (DA > 70)
    const highAuthCount = competitors.filter(c => c.estimatedDA >= 70).length;

    // Formula: 
    // Base difficulty from average DA
    // Bonus for high-authority concentration
    const baseDifficulty = avgDA * 0.7;
    const authBonus = (highAuthCount / competitors.length) * 30;

    return Math.min(100, Math.round(baseDifficulty + authBonus));
}

/**
 * Estimate competitors when SERP data unavailable
 * Uses keyword pattern heuristics
 */
function estimateCompetitorsFromKeyword(keyword: string): CompetitorStrength[] {
    const lowerKeyword = keyword.toLowerCase();

    // Very competitive patterns
    if (lowerKeyword.includes('best') || 
        lowerKeyword.includes('top') || 
        lowerKeyword.includes('review')) {
        return [
            { url: 'economictimes.indiatimes.com', title: 'ET Article', estimatedDA: 85, isAuthoritative: true },
            { url: 'moneycontrol.com', title: 'MC Article', estimatedDA: 80, isAuthoritative: true },
            { url: 'livemint.com', title: 'Mint Article', estimatedDA: 75, isAuthoritative: true }
        ];
    }

    // Moderately competitive patterns
    if (lowerKeyword.includes('how to') || 
        lowerKeyword.includes('guide') || 
        lowerKeyword.includes('what is')) {
        return [
            { url: 'cleartax.in', title: 'ClearTax Guide', estimatedDA: 60, isAuthoritative: true },
            { url: 'groww.in', title: 'Groww Article', estimatedDA: 55, isAuthoritative: false },
            { url: 'example.com', title: 'Generic Site', estimatedDA: 30, isAuthoritative: false }
        ];
    }

    // Long-tail (easier)
    if (keyword.split(' ').length >= 4) {
        return [
            { url: 'example.com', title: 'Low Authority Site', estimatedDA: 25, isAuthoritative: false },
            { url: 'blog.example.com', title: 'Blog Post', estimatedDA: 20, isAuthoritative: false }
        ];
    }

    // Default: Medium competition
    return [
        { url: 'example.com', title: 'Medium Site', estimatedDA: 40, isAuthoritative: false },
        { url: 'another.com', title: 'Another Site', estimatedDA: 35, isAuthoritative: false }
    ];
}

/**
 * Convert numeric difficulty to level
 */
function getDifficultyLevel(difficulty: number): 'easy' | 'medium' | 'hard' | 'very-hard' {
    if (difficulty < 30) return 'easy';
    if (difficulty < 60) return 'medium';
    if (difficulty < 80) return 'hard';
    return 'very-hard';
}

/**
 * Generate strategic recommendation
 */
function getRecommendation(
    difficulty: number, 
    targetAuthority: number, 
    keyword: string
): string {
    const level = getDifficultyLevel(difficulty);
    const gap = difficulty - targetAuthority;

    if (gap <= 10) {
        return `✅ Perfect match! Target this keyword now. (Difficulty: ${difficulty}, Your DA: ${targetAuthority})`;
    }

    if (gap <= 30) {
        return `⚠️ Challenging but achievable. Create high-quality content with strong backlinks. (Gap: ${gap} points)`;
    }

    if (gap > 30) {
        return `❌ Too difficult for current authority. Focus on long-tail variations of "${keyword}" instead. (Gap: ${gap} points)`;
    }

    // Fallback
    return `Keyword difficulty: ${level} (${difficulty}/100). ${
        level === 'easy' ? 'Great opportunity!' : 
        level === 'medium' ? 'Moderate competition.' : 
        'High competition - needs strong content.'
    }`;
}

/**
 * Batch score multiple keywords (useful for content planning)
 */
export async function scoreKeywordBatch(
    keywords: string[],
    options: { targetAuthority?: number } = {}
): Promise<DifficultyScore[]> {
    const results: DifficultyScore[] = [];

    for (const keyword of keywords) {
        try {
            const score = await scoreKeywordDifficulty(keyword, options);
            results.push(score);
            
            // Rate limiting: Wait 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            logger.warn('Failed to score keyword in batch', { keyword });
            // Continue with other keywords
        }
    }

    return results;
}
