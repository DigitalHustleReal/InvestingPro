/**
 * 📈 KEYWORD OPPORTUNITY RANKER
 * 
 * Combines all keyword metrics to find the best opportunities:
 * - Search volume (potential traffic)
 * - Keyword difficulty (can we rank?)
 * - Trend direction (rising = priority)
 * - Commercial intent (monetization)
 * - AI citation potential (future-proof)
 */

export interface KeywordOpportunity {
    keyword: string;
    search_volume: number;
    keyword_difficulty: number; // 0-100
    trend: 'rising' | 'stable' | 'declining';
    commercial_intent: number; // 0-100
    ai_citation_potential: number; // 0-100
    opportunity_score: number; // 0-100 (composite)
    priority: 'immediate' | 'high' | 'medium' | 'low';
    estimated_traffic: number; // Monthly visits if ranking #1
    competition_level: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
    our_ranking_probability: number; // 0-100%
}

/**
 * Calculate composite opportunity score
 */
export function calculateOpportunityScore(metrics: {
    difficulty: number;
    search_volume: number;
    cpc?: number;
    trend: 'rising' | 'stable' | 'declining';
    commercial_intent: number;
    ai_citation_potential?: number;
    our_domain_authority: number;
}): number {
    // 1. Competition Score (35% weight) - Lower difficulty = better
    const competitionScore = 100 - metrics.difficulty;
    
    // 2. Volume Score (25% weight) - Normalize to 0-100
    const volumeScore = Math.min(100, (metrics.search_volume / 10000) * 100);
    
    // 3. Trend Score (15% weight)
    const trendScore = metrics.trend === 'rising' ? 100 : 
                       metrics.trend === 'stable' ? 50 : 0;
    
    // 4. Monetization Score (15% weight)
    const monetizationScore = metrics.cpc ? Math.min(100, metrics.cpc * 5) : 
                              metrics.commercial_intent;
    
    // 5. AI Potential Score (10% weight) - Future-proofing
    const aiScore = metrics.ai_citation_potential || 50;
    
    // Weighted composite
    let score = (
        competitionScore * 0.35 +
        volumeScore * 0.25 +
        trendScore * 0.15 +
        monetizationScore * 0.15 +
        aiScore * 0.10
    );
    
    // Bonus for very low competition + decent volume
    if (metrics.difficulty < 30 && metrics.search_volume > 500) {
        score += 10; // "Quick win" bonus
    }
    
    // Penalty if difficulty too high for our DA
    if (metrics.difficulty > metrics.our_domain_authority + 20) {
        score -= 20; // Unlikely to rank
    }
    
    return Math.max(0, Math.min(100, score));
}

/**
 * Determine priority bucket
 */
export function determinePriority(opportunityScore: number): 'immediate' | 'high' | 'medium' | 'low' {
    if (opportunityScore >= 80) return 'immediate';
    if (opportunityScore >= 60) return 'high';
    if (opportunityScore >= 40) return 'medium';
    return 'low';
}

/**
 * Estimate ranking probability based on our DA vs competition
 */
export function estimateRankingProbability(
    keywordDifficulty: number,
    ourDA: number
): number {
    const difficultyGap = keywordDifficulty - ourDA;
    
    if (difficultyGap < -20) return 95; // Much easier than our DA
    if (difficultyGap < -10) return 80;
    if (difficultyGap < 0) return 65;
    if (difficultyGap < 10) return 45;
    if (difficultyGap < 20) return 25;
    return 10; // Likely too difficult
}

/**
 * Estimate traffic if we rank #1
 */
export function estimateTraffic(searchVolume: number, position: number = 1): number {
    // CTR by position (industry averages)
    const ctrByPosition: { [key: number]: number } = {
        1: 0.32, // 32% CTR for position 1
        2: 0.18,
        3: 0.11,
        4: 0.08,
        5: 0.06,
        6: 0.05,
        7: 0.04,
        8: 0.03,
        9: 0.03,
        10: 0.02
    };
    
    const ctr = ctrByPosition[position] || 0.01;
    return Math.floor(searchVolume * ctr);
}

/**
 * Batch rank keywords by opportunity
 */
export function rankKeywordOpportunities(
    keywords: Array<{
        keyword: string;
        search_volume: number;
        difficulty: number;
        trend?: 'rising' | 'stable' | 'declining';
        commercial_intent?: number;
        ai_potential?: number;
    }>,
    ourDA: number = 15
): KeywordOpportunity[] {
    return keywords
        .map(kw => {
            const opportunityScore = calculateOpportunityScore({
                difficulty: kw.difficulty,
                search_volume: kw.search_volume,
                trend: kw.trend || 'stable',
                commercial_intent: kw.commercial_intent || 50,
                ai_citation_potential: kw.ai_potential,
                our_domain_authority: ourDA
            });
            
            const competitionLevel = 
                kw.difficulty < 20 ? 'very_easy' :
                kw.difficulty < 40 ? 'easy' :
                kw.difficulty < 60 ? 'medium' :
                kw.difficulty < 80 ? 'hard' : 'very_hard';
            
            return {
                keyword: kw.keyword,
                search_volume: kw.search_volume,
                keyword_difficulty: kw.difficulty,
                trend: kw.trend || 'stable',
                commercial_intent: kw.commercial_intent || 50,
                ai_citation_potential: kw.ai_potential || 50,
                opportunity_score: opportunityScore,
                priority: determinePriority(opportunityScore),
                estimated_traffic: estimateTraffic(kw.search_volume, 3), // Conservative (position 3)
                competition_level: competitionLevel,
                our_ranking_probability: estimateRankingProbability(kw.difficulty, ourDA)
            };
        })
        .sort((a, b) => b.opportunity_score - a.opportunity_score); // Best first
}

/**
 * Filter to only winnable keywords
 */
export function filterWinnableKeywords(
    opportunities: KeywordOpportunity[],
    minProbability: number = 45
): KeywordOpportunity[] {
    return opportunities.filter(kw => 
        kw.our_ranking_probability >= minProbability &&
        kw.keyword_difficulty < 60 // Hard cap on difficulty
    );
}

/**
 * Generate content strategy from opportunities
 */
export function generateContentStrategy(
    opportunities: KeywordOpportunity[]
): {
    immediate: KeywordOpportunity[]; // Generate within 24hrs
    high: KeywordOpportunity[]; // Generate this week
    medium: KeywordOpportunity[]; // Generate this month
    estimated_monthly_traffic: number;
} {
    const immediate = opportunities.filter(k => k.priority === 'immediate');
    const high = opportunities.filter(k => k.priority === 'high');
    const medium = opportunities.filter(k => k.priority === 'medium');
    
    const estimatedTraffic = opportunities
        .filter(k => k.priority !== 'low')
        .reduce((sum, kw) => sum + kw.estimated_traffic, 0);
    
    return { immediate, high, medium, estimated_monthly_traffic: estimatedTraffic };
}
