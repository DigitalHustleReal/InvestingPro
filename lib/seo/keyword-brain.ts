/**
 * 🧠 KEYWORD INTELLIGENCE BRAIN
 * 
 * The central decision engine for keyword selection.
 * 
 * Given a list of candidate keywords, this brain:
 * 1. Fetches real KD + search volume (DataForSEO / smart heuristic)
 * 2. Gets autocomplete expansions (Google Suggest — free)
 * 3. Checks SERP competitor DA (Moz / static lookup)
 * 4. Calculates RANKABILITY: can YOUR site rank for this?
 * 5. Scores and ranks every keyword
 * 6. Makes a definitive WRITE or SKIP decision
 * 7. Formats the winner as a properly-cased, click-worthy article title
 * 
 * No article gets generated unless the brain approves it.
 */

import { logger } from '@/lib/logger';
import { getGoogleSuggestions, getPeopleAlsoAsk, scoreAutocompleteKeyword } from './providers/google-autocomplete';
import { getKeywordMetrics, getKeywordMetricsBatch, enhancedHeuristicMetrics, type KeywordMetrics } from './providers/dataforseo-free';
import { getDomainAuthority, getYourSiteDA, type DAResult } from './providers/moz-da-checker';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface RankedKeyword {
    keyword: string;
    title: string;                     // Properly formatted article title
    
    // Scores (0-100)
    rankabilityScore: number;          // Overall score — the main decision metric
    opportunityScore: number;          // Potential upside (volume × low KD)
    
    // Raw metrics
    searchVolume: number;
    keywordDifficulty: number;
    yourSiteDA: number;
    competitorAvgDA: number;
    rankabilityGap: number;            // KD - yourSiteDA (negative = you can rank!)

    // Classification
    intent: KeywordMetrics['intent'];
    writeDecision: 'write' | 'skip' | 'maybe';
    writeReason: string;
    
    // Sources
    metricSource: 'dataforseo' | 'heuristic';
    alternatives: string[];            // Long-tail variations if main keyword is too hard
}

export interface BrainDecision {
    write: boolean;
    keyword: string;
    title: string;
    score: number;
    reason: string;
    alternatives?: string[];           // Suggested easier alternatives
}

// ─── Configuration ──────────────────────────────────────────────────────────────

const BRAIN_CONFIG = {
    // A new/growing site should target KD ≤ these thresholds
    maxKDForNewSite: 45,        // DA 0-20: very easy only
    maxKDForGrowingSite: 55,    // DA 20-40: medium acceptable
    maxKDForEstablishedSite: 70, // DA 40+: can target harder keywords
    
    // Minimum search volume to be worth writing
    minSearchVolume: 100,
    
    // Rankability gap: KD - yourDA. Negative = good opportunity
    maxRankabilityGap: 20,  // Never target if KD is 20+ points above your DA
    
    // Opportunity score minimum to proceed
    minOpportunityScore: 30,
};

// ─── Main Brain Functions ───────────────────────────────────────────────────────

/**
 * Score and rank a list of keywords
 * Returns sorted by rankabilityScore (best first)
 */
export async function scoreAndRankKeywords(
    keywords: string[],
    options: {
        category?: string;
        yourSiteDA?: number;
        targetMarket?: 'IN' | 'US' | 'GB';
    } = {}
): Promise<RankedKeyword[]> {
    if (keywords.length === 0) return [];

    logger.info(`[KeywordBrain] Scoring ${keywords.length} keywords`);

    // 1. Get your site's DA (used for gap calculation)
    const yourSiteDA = options.yourSiteDA ?? await getYourSiteDA();
    logger.info(`[KeywordBrain] Your site DA: ${yourSiteDA}`);

    // 2. Get KD + volume for all keywords in batch
    const metrics = await getKeywordMetricsBatch(keywords);
    
    // 3. Score each keyword
    const ranked = await Promise.all(metrics.map(async (metric, i) => {
        return scoreKeyword(metric, yourSiteDA, options.category || 'general');
    }));

    // 4. Sort by rankability score (best first)
    return ranked.sort((a, b) => b.rankabilityScore - a.rankabilityScore);
}

/**
 * Main decision function: should we write about this keyword?
 */
export async function shouldWriteAboutKeyword(
    keyword: string,
    options: {
        yourSiteDA?: number;
        category?: string;
    } = {}
): Promise<BrainDecision> {
    logger.info(`[KeywordBrain] Evaluating keyword: "${keyword}"`);

    // 1. Get metrics
    const metrics = await getKeywordMetrics(keyword);
    const yourSiteDA = options.yourSiteDA ?? await getYourSiteDA();

    // 2. Score it
    const scored = await scoreKeyword(metrics, yourSiteDA, options.category || 'general');

    // 3. If not great, try to find better alternatives from autocomplete
    let alternatives: string[] = [];
    if (scored.writeDecision !== 'write') {
        const suggestions = await getGoogleSuggestions(keyword);
        const longTailSuggestions = suggestions
            .filter(s => s.keyword.split(' ').length >= 4)
            .map(s => s.keyword)
            .slice(0, 5);
        
        if (longTailSuggestions.length > 0) {
            const altMetrics = await getKeywordMetricsBatch(longTailSuggestions);
            const altScored = altMetrics.map(m => ({
                keyword: m.keyword,
                kd: m.keywordDifficulty,
                vol: m.searchVolume,
            }));
            alternatives = altScored
                .filter(a => a.kd <= BRAIN_CONFIG.maxKDForGrowingSite && a.vol >= BRAIN_CONFIG.minSearchVolume)
                .map(a => a.keyword);
        }
    }

    return {
        write: scored.writeDecision === 'write',
        keyword: scored.keyword,
        title: scored.title,
        score: scored.rankabilityScore,
        reason: scored.writeReason,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
    };
}

/**
 * Expand a seed keyword into a set of candidates, score them,
 * and return the best ones to write about.
 * 
 * This is the main function called by the content pipeline.
 */
export async function expandAndSelectBestKeywords(
    seedKeyword: string,
    options: {
        count?: number;
        category?: string;
        yourSiteDA?: number;
        minOpportunityScore?: number;
    } = {}
): Promise<RankedKeyword[]> {
    const { count = 5, category, yourSiteDA, minOpportunityScore = BRAIN_CONFIG.minOpportunityScore } = options;

    logger.info(`[KeywordBrain] Expanding seed: "${seedKeyword}"`);

    // 1. Get autocomplete suggestions
    const autocomplete = await getGoogleSuggestions(seedKeyword);
    const paa = await getPeopleAlsoAsk(seedKeyword);
    
    // 2. Combine all candidates
    const candidates = [
        seedKeyword,
        ...autocomplete.map(s => s.keyword),
        ...paa,
    ];

    // Deduplicate
    const uniqueCandidates = [...new Set(candidates)].slice(0, 30);
    logger.info(`[KeywordBrain] ${uniqueCandidates.length} unique candidates after expansion`);

    // 3. Score all candidates
    const ranked = await scoreAndRankKeywords(uniqueCandidates, { category, yourSiteDA });

    // 4. Filter to only "write" decisions with minimum opportunity score
    const writeable = ranked.filter(kw => 
        kw.writeDecision !== 'skip' && 
        kw.opportunityScore >= minOpportunityScore &&
        kw.searchVolume >= BRAIN_CONFIG.minSearchVolume
    );

    logger.info(`[KeywordBrain] ${writeable.length} keywords pass the filter out of ${ranked.length}`);

    return writeable.slice(0, count);
}

// ─── Internal Scoring ──────────────────────────────────────────────────────────

async function scoreKeyword(
    metric: KeywordMetrics,
    yourSiteDA: number,
    category: string
): Promise<RankedKeyword> {
    const { keyword, searchVolume, keywordDifficulty, intent, source } = metric;

    // Rankability gap: negative = you're stronger than the competition
    const rankabilityGap = keywordDifficulty - yourSiteDA;

    // Opportunity score = Volume × (100 - KD) / 100
    // High volume + low KD = high opportunity
    const opportunityScore = Math.min(100, Math.round(
        (Math.log10(Math.max(1, searchVolume)) / Math.log10(500000)) * 50 +
        (1 - keywordDifficulty / 100) * 50
    ));

    // Rankability score = Can YOUR site actually rank?
    // Based on:
    // - How far KD is from your DA
    // - Search volume (worth the effort?)
    // - Intent (informational = easier to rank than commercial)
    let rankabilityScore = 50;
    
    // Gap penalty/bonus
    if (rankabilityGap < -20) rankabilityScore += 30;      // You're much stronger → easy win
    else if (rankabilityGap < 0) rankabilityScore += 15;   // You're stronger → good
    else if (rankabilityGap <= 10) rankabilityScore += 5;  // Roughly equal → doable
    else if (rankabilityGap <= 20) rankabilityScore -= 10; // They're slightly stronger → hard
    else rankabilityScore -= 25;                           // They're much stronger → skip

    // Volume bonus
    if (searchVolume >= 10000) rankabilityScore += 15;
    else if (searchVolume >= 1000) rankabilityScore += 8;
    else if (searchVolume >= 200) rankabilityScore += 3;
    else rankabilityScore -= 10; // Not worth writing

    // Intent bonus/penalty
    if (intent === 'informational') rankabilityScore += 10;  // Easiest to rank
    if (intent === 'commercial') rankabilityScore += 5;      // Good for conversions
    if (intent === 'transactional') rankabilityScore -= 5;   // Harder, big brands dominate

    // Long-tail bonus
    const wordCount = keyword.split(' ').length;
    if (wordCount >= 5) rankabilityScore += 10;
    else if (wordCount >= 4) rankabilityScore += 5;
    else if (wordCount <= 2) rankabilityScore -= 10;         // Short = competitive

    rankabilityScore = Math.min(100, Math.max(0, rankabilityScore));

    // Make write decision
    let writeDecision: RankedKeyword['writeDecision'];
    let writeReason: string;

    const maxKD = yourSiteDA < 20 ? BRAIN_CONFIG.maxKDForNewSite :
                  yourSiteDA < 40 ? BRAIN_CONFIG.maxKDForGrowingSite :
                  BRAIN_CONFIG.maxKDForEstablishedSite;

    if (keywordDifficulty > maxKD + 10) {
        writeDecision = 'skip';
        writeReason = `KD too high (${keywordDifficulty}) for your site DA (${yourSiteDA}). Target long-tail variants.`;
    } else if (searchVolume < BRAIN_CONFIG.minSearchVolume) {
        writeDecision = 'skip';
        writeReason = `Search volume too low (${searchVolume}/month). Not worth the effort.`;
    } else if (rankabilityGap > BRAIN_CONFIG.maxRankabilityGap) {
        writeDecision = 'skip';
        writeReason = `Rankability gap too large (${rankabilityGap}). KD ${keywordDifficulty} vs your DA ${yourSiteDA}.`;
    } else if (rankabilityScore >= 60) {
        writeDecision = 'write';
        writeReason = `✅ Great opportunity! KD ${keywordDifficulty}, Volume ${searchVolume.toLocaleString()}, Gap ${rankabilityGap > 0 ? `+${rankabilityGap}` : rankabilityGap}`;
    } else if (rankabilityScore >= 40) {
        writeDecision = 'maybe';
        writeReason = `⚠️ Moderate opportunity. KD ${keywordDifficulty}, Volume ${searchVolume.toLocaleString()}. Consider with high-quality content.`;
    } else {
        writeDecision = 'skip';
        writeReason = `Low rankability score (${rankabilityScore}). Better keywords available.`;
    }

    // Format title
    const title = formatArticleTitle(keyword, intent, category);

    return {
        keyword,
        title,
        rankabilityScore,
        opportunityScore,
        searchVolume,
        keywordDifficulty,
        yourSiteDA,
        competitorAvgDA: keywordDifficulty, // Approximation without real SERP data
        rankabilityGap,
        intent,
        writeDecision,
        writeReason,
        metricSource: source,
        alternatives: [],
    };
}

// ─── Title Formatting ───────────────────────────────────────────────────────────

/**
 * Transform a raw keyword into a proper, click-worthy article title.
 * 
 * "best sip in india" → "Best SIP Plans in India 2026: Complete Guide for Beginners"
 */
export function formatArticleTitle(
    keyword: string,
    intent: KeywordMetrics['intent'],
    category: string
): string {
    const year = new Date().getFullYear();
    const kw = keyword.trim();

    // Apply title case
    let title = toTitleCase(kw);

    // Expand common finance abbreviations
    title = title
        .replace(/\bSip\b/g, 'SIP')
        .replace(/\bElss\b/g, 'ELSS')
        .replace(/\bNps\b/g, 'NPS')
        .replace(/\bPpf\b/g, 'PPF')
        .replace(/\bFd\b/g, 'FD')
        .replace(/\bRd\b/g, 'RD')
        .replace(/\bEmi\b/g, 'EMI')
        .replace(/\bLtcg\b/g, 'LTCG')
        .replace(/\bStcg\b/g, 'STCG')
        .replace(/\bCagr\b/g, 'CAGR')
        .replace(/\bNav\b/g, 'NAV')
        .replace(/\bAmc\b/g, 'AMC')
        .replace(/\bSebi\b/g, 'SEBI')
        .replace(/\bRbi\b/g, 'RBI')
        .replace(/\bItr\b/g, 'ITR')
        .replace(/\bTds\b/g, 'TDS');

    // Add year if not present and relevant
    const hasYear = /202[4-9]|203\d/.test(title);
    
    // Add an engaging suffix based on intent
    if (intent === 'informational' && !title.toLowerCase().includes('guide') && !title.toLowerCase().includes('explain')) {
        if (!hasYear) {
            const suffixes = [
                `: Complete Guide ${year}`,
                ` — Expert Guide ${year}`,
                `: Everything You Need to Know (${year})`,
            ];
            title += suffixes[0];
        }
    } else if (intent === 'commercial' && !hasYear) {
        const suffixes = [
            ` in India ${year}: Compare & Choose`,
            ` ${year}: Top Picks & Reviews`,
            ` — Best Options in India (${year})`,
        ];
        title += suffixes[0];
    } else if (!hasYear) {
        title += ` — ${year} Update`;
    }

    // Ensure reasonable length
    if (title.length > 80) {
        title = title.substring(0, 77) + '...';
    }

    return title;
}

/**
 * Proper title case that handles Indian finance terms correctly
 */
function toTitleCase(str: string): string {
    // Words that should stay lowercase in titles
    const lowercaseWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'in', 'on', 'at', 'to', 'by', 'of', 'vs', 'via']);

    return str
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
            // Always capitalize first and last word
            if (index === 0 || !lowercaseWords.has(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        })
        .join(' ');
}

// ─── Singleton Export ───────────────────────────────────────────────────────────

export const keywordBrain = {
    scoreAndRank: scoreAndRankKeywords,
    shouldWrite: shouldWriteAboutKeyword,
    expandAndSelect: expandAndSelectBestKeywords,
    formatTitle: formatArticleTitle,
};
