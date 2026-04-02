import { logger } from '../logger';

/**
 * 🎯 HEADLINE ANALYZER - SERP Domination Tool
 * 
 * Analyzes and optimizes headlines for maximum CTR and SERP performance.
 * Based on proven headline formulas from CoSchedule, Sharethrough, and BuzzSumo.
 * 
 * FEATURES:
 * - 0-100 scoring system
 * - Word balance analysis (common, uncommon, emotional, power)
 * - Length optimization
 * - Sentiment analysis
 * - AI-generated alternatives
 * - EMV (Emotional Marketing Value) calculation
 * 
 * NO EXTERNAL API NEEDED - Uses existing Gemini integration
 */

// Power words that increase engagement
const POWER_WORDS = [
    'ultimate', 'essential', 'complete', 'proven', 'guaranteed', 'exclusive',
    'secret', 'powerful', 'amazing', 'incredible', 'outstanding', 'extraordinary',
    'revolutionary', 'breakthrough', 'innovative', 'advanced', 'premium', 'elite',
    'critical', 'crucial', 'vital', 'important', 'massive', 'huge'
];

// Emotional words that trigger response
const EMOTIONAL_WORDS = [
    'free', 'new', 'save', 'easy', 'simple', 'fast', 'quick', 'instant',
    'best', 'top', 'worst', 'never', 'always', 'must', 'need', 'should',
    'fear', 'safe', 'secure', 'trust', 'love', 'hate', 'happy', 'sad',
    'angry', 'surprised', 'excited', 'worried', 'confident', 'scared'
];

// Common words (neutral - don't add much value)
const COMMON_WORDS = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'after',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might'
];

export interface HeadlineAnalysis {
    score: number; // 0-100
    grade: 'poor' | 'fair' | 'good' | 'great' | 'excellent';
    sentiment: 'positive' | 'neutral' | 'negative';
    
    wordBalance: {
        common: number;
        uncommon: number;
        emotional: number;
        power: number;
    };
    
    length: {
        characters: number;
        words: number;
        optimal: boolean;
        recommendation: string;
    };
    
    emv: {
        score: number; // 0-100% (Emotional Marketing Value)
        level: 'low' | 'medium' | 'high' | 'viral';
    };
    
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
}

export interface HeadlineAlternatives {
    original: string;
    originalScore: number;
    alternatives: {
        headline: string;
        score: number;
        reason: string;
    }[];
}

/**
 * Analyze a headline and return detailed scoring
 */
export function analyzeHeadline(headline: string): HeadlineAnalysis {
    const words = headline.toLowerCase().split(/\s+/);
    const charCount = headline.length;
    const wordCount = words.length;

    // 1. Word Balance Analysis
    let commonCount = 0;
    let uncommonCount = 0;
    let emotionalCount = 0;
    let powerCount = 0;

    words.forEach(word => {
        const cleanWord = word.replace(/[^a-z]/g, '');
        
        if (COMMON_WORDS.includes(cleanWord)) {
            commonCount++;
        } else {
            uncommonCount++;
        }
        
        if (EMOTIONAL_WORDS.includes(cleanWord)) {
            emotionalCount++;
        }
        
        if (POWER_WORDS.includes(cleanWord)) {
            powerCount++;
        }
    });

    const wordBalance = {
        common: Math.round((commonCount / wordCount) * 100),
        uncommon: Math.round((uncommonCount / wordCount) * 100),
        emotional: Math.round((emotionalCount / wordCount) * 100),
        power: Math.round((powerCount / wordCount) * 100)
    };

    // 2. EMV Score (Emotional Marketing Value)
    const emvScore = wordBalance.emotional + wordBalance.power;
    const emvLevel = 
        emvScore < 20 ? 'low' : 
        emvScore < 40 ? 'medium' : 
        emvScore < 60 ? 'high' : 'viral';

    // 3. Length Analysis
    const optimalCharRange = [40, 65]; // Google SERP sweet spot
    const optimalWordRange = [6, 12];
    
    const charOptimal = charCount >= optimalCharRange[0] && charCount <= optimalCharRange[1];
    const wordOptimal = wordCount >= optimalWordRange[0] && wordCount <= optimalWordRange[1];
    const lengthOptimal = charOptimal && wordOptimal;

    let lengthRecommendation = '';
    if (charCount < optimalCharRange[0]) {
        lengthRecommendation = `Too short (${charCount} chars). Aim for ${optimalCharRange[0]}-${optimalCharRange[1]}.`;
    } else if (charCount > optimalCharRange[1]) {
        lengthRecommendation = `Too long (${charCount} chars). May get truncated in Google. Aim for ${optimalCharRange[0]}-${optimalCharRange[1]}.`;
    } else if (wordCount < optimalWordRange[0]) {
        lengthRecommendation = `Too few words (${wordCount}). Aim for ${optimalWordRange[0]}-${optimalWordRange[1]}.`;
    } else if (wordCount > optimalWordRange[1]) {
        lengthRecommendation = `Too many words (${wordCount}). Keep it concise: ${optimalWordRange[0]}-${optimalWordRange[1]}.`;
    } else {
        lengthRecommendation = 'Perfect length!';
    }

    // 4. Sentiment Analysis (simple)
    const positiveWords = ['best', 'top', 'great', 'amazing', 'excellent', 'free', 'easy', 'simple', 'fast'];
    const negativeWords = ['worst', 'bad', 'terrible', 'avoid', 'never', 'fail', 'mistake', 'wrong'];
    
    let sentimentScore = 0;
    words.forEach(word => {
        if (positiveWords.includes(word)) sentimentScore++;
        if (negativeWords.includes(word)) sentimentScore--;
    });
    
    const sentiment = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';

    // 5. Calculate Overall Score
    let score = 50; // Base score

    // Length bonus (max +20)
    if (lengthOptimal) score += 20;
    else if (charOptimal || wordOptimal) score += 10;
    else score += 5;

    // Word balance bonus (max +30)
    if (wordBalance.uncommon >= 30) score += 10; // Good variety
    if (wordBalance.emotional >= 10 && wordBalance.emotional <= 40) score += 10; // Sweet spot
    if (wordBalance.power > 0) score += 10; // Has power words

    // EMV bonus (max +20)
    score += Math.min(20, emvScore / 3);

    // Sentiment bonus (max +10)
    if (sentiment === 'positive') score += 10;
    else if (sentiment === 'neutral') score += 5;

    // Numbers bonus (+10 if has year/number)
    if (/\d{4}|[0-9]+/.test(headline)) score += 10;

    // Cap at 100
    score = Math.min(100, Math.round(score));

    // 6. Grade
    const grade = 
        score >= 80 ? 'excellent' :
        score >= 70 ? 'great' :
        score >= 60 ? 'good' :
        score >= 50 ? 'fair' : 'poor';

    // 7. Strengths & Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (lengthOptimal) strengths.push('Perfect length for Google SERPs');
    else weaknesses.push(lengthRecommendation);

    if (emvScore >= 40) strengths.push(`Strong emotional appeal (${emvScore}% EMV)`);
    else if (emvScore < 20) weaknesses.push('Low emotional impact - add power/emotional words');

    if (/\d{4}/.test(headline)) strengths.push('Contains year (signals freshness)');
    else weaknesses.push('Consider adding year for timeliness');

    if (wordBalance.power > 0) strengths.push('Uses power words effectively');
    else weaknesses.push('Missing power words (e.g., "ultimate", "complete", "proven")');

    if (sentiment === 'positive') strengths.push('Positive sentiment drives clicks');
    else if (sentiment === 'negative') weaknesses.push('Negative sentiment may reduce CTR');

    // 8. Suggestions
    const suggestions: string[] = [];
    
    if (score < 70) {
        if (emvScore < 30) suggestions.push('Add emotional triggers: "best", "ultimate", "complete"');
        if (wordBalance.power === 0) suggestions.push('Use power words: "proven", "essential", "critical"');
        if (!lengthOptimal) suggestions.push(lengthRecommendation);
        if (!/\d{4}/.test(headline)) suggestions.push('Add current year for freshness');
        if (!/how to|best|top|guide|complete/.test(headline.toLowerCase())) {
            suggestions.push('Consider proven formats: "How to...", "Best...", "Complete Guide to..."');
        }
    }

    return {
        score,
        grade,
        sentiment,
        wordBalance,
        length: {
            characters: charCount,
            words: wordCount,
            optimal: lengthOptimal,
            recommendation: lengthRecommendation
        },
        emv: {
            score: emvScore,
            level: emvLevel
        },
        suggestions,
        strengths,
        weaknesses
    };
}

/**
 * Generate better headline alternatives using AI
 */
export async function generateBetterHeadlines(
    originalHeadline: string,
    targetScore: number = 80
): Promise<HeadlineAlternatives> {
    const originalAnalysis = analyzeHeadline(originalHeadline);

    // If already excellent, return it
    if (originalAnalysis.score >= targetScore) {
        logger.info('Headline already excellent', { score: originalAnalysis.score });
        return {
            original: originalHeadline,
            originalScore: originalAnalysis.score,
            alternatives: []
        };
    }

    try {
        // Use AI to generate better versions
        const { api } = await import('../api');
        
        const prompt = `You are a headline optimization expert specializing in Indian financial content.

Current headline: "${originalHeadline}"
Current score: ${originalAnalysis.score}/100

Issues:
${originalAnalysis.weaknesses.join('\n')}

Generate 5 BETTER headlines that:
1. Are 40-65 characters long
2. Use power words (ultimate, complete, proven, essential)
3. Use emotional triggers (best, top, save, free, easy)
4. Include year (2026) for freshness
5. Follow proven formats: "How to...", "Best...", "Complete Guide..."
6. Target Indian audience specifically

Return JSON:
{
  "headlines": [
    { "text": "headline 1", "reason": "why it's better" },
    { "text": "headline 2", "reason": "why it's better" },
    ...5 total
  ]
}`;

        const result = await api.integrations.Core.InvokeLLM({
            prompt,
            operation: 'generate_headlines'
        });

        const data = typeof result === 'string' ? JSON.parse(result) : result;
        const generatedHeadlines = data.headlines || data.content?.headlines || [];

        // Analyze each generated headline
        const alternatives = generatedHeadlines.map((h: any) => {
            const headline = h.text || h.headline || h;
            const analysis = analyzeHeadline(headline);
            return {
                headline,
                score: analysis.score,
                reason: h.reason || `Score: ${analysis.score}/100`
            };
        });

        // Sort by score (highest first)
        alternatives.sort((a: any, b: any) => b.score - a.score);

        return {
            original: originalHeadline,
            originalScore: originalAnalysis.score,
            alternatives
        };

    } catch (error) {
        logger.error('Failed to generate headline alternatives', error as Error);
        
        // Fallback: Return rule-based alternatives
        return {
            original: originalHeadline,
            originalScore: originalAnalysis.score,
            alternatives: generateFallbackHeadlines(originalHeadline)
        };
    }
}

/**
 * Generate rule-based alternatives if AI fails
 */
function generateFallbackHeadlines(original: string): { headline: string; score: number; reason: string }[] {
    const alternatives: string[] = [];
    const baseTopic = original.replace(/^(how to|best|top|complete guide to?|ultimate)/i, '').trim();
    const year = new Date().getFullYear();

    alternatives.push(`How to ${baseTopic} - Complete Guide ${year}`);
    alternatives.push(`Best ${baseTopic} in India ${year}`);
    alternatives.push(`Ultimate Guide to ${baseTopic} (${year})`);
    alternatives.push(`${baseTopic}: Complete Beginner's Guide ${year}`);
    alternatives.push(`Top ${baseTopic} Strategies for ${year}`);

    return alternatives.map(h => {
        const analysis = analyzeHeadline(h);
        return {
            headline: h,
            score: analysis.score,
            reason: `Score: ${analysis.score}/100`
        };
    });
}

/**
 * Optimize a headline automatically
 * Returns the best version (either original or AI-generated)
 */
export async function optimizeHeadline(headline: string, targetScore: number = 75): Promise<{
    optimized: string;
    score: number;
    improved: boolean;
    alternatives: HeadlineAlternatives;
}> {
    const alternatives = await generateBetterHeadlines(headline, targetScore);
    
    // Find best headline
    const best = alternatives.alternatives.length > 0
        ? alternatives.alternatives[0]
        : { headline, score: alternatives.originalScore, reason: 'Original' };

    const improved = best.score > alternatives.originalScore;

    logger.info('Headline optimization complete', {
        original: headline,
        optimized: best.headline,
        scoreImprovement: best.score - alternatives.originalScore,
        improved
    });

    return {
        optimized: best.headline,
        score: best.score,
        improved,
        alternatives
    };
}
