/**
 * 🎯 GOOGLE-ALIGNED QUALITY STANDARDS
 * 
 * Based on actual Google ranking criteria (2026):
 * - E-E-A-T Framework (Experience, Expertise, Authoritativeness, Trustworthiness)
 * - Realistic plagiarism thresholds (Google allows 10-30% for citations/quotes)
 * - Content quality signals that actually correlate with rankings
 * 
 * Sources:
 * - Google Search Quality Rater Guidelines
 * - Google E-E-A-T documentation
 * - YMYL (Your Money Your Life) content standards
 */

// ============================================================================
// GOOGLE E-E-A-T STANDARDS
// ============================================================================

export const GOOGLE_EEAT_STANDARDS = {
    // Minimum scores for auto-publish (YMYL content - finance)
    MIN_EEAT_OVERALL: 65,           // Overall E-E-A-T score
    MIN_EXPERIENCE: 50,             // Real examples, case studies
    MIN_EXPERTISE: 65,              // Technical accuracy (higher for finance)
    MIN_AUTHORITATIVENESS: 55,      // Citations, external authority
    MIN_TRUSTWORTHINESS: 75,        // CRITICAL for YMYL (finance/health)
    
    // Excellence thresholds (aim for these)
    TARGET_EEAT_OVERALL: 80,
    TARGET_EXPERIENCE: 70,
    TARGET_EXPERTISE: 80,
    TARGET_AUTHORITATIVENESS: 75,
    TARGET_TRUSTWORTHINESS: 90
};

// ============================================================================
// PLAGIARISM THRESHOLDS (GOOGLE-ALIGNED)
// ============================================================================

export const GOOGLE_PLAGIARISM_STANDARDS = {
    // Exact matching (verbatim copying)
    SAFE_EXACT_MATCH: 15,           // Up to 15% OK (quotes, citations, data)
    WARNING_EXACT_MATCH: 30,        // 15-30% needs review
    REJECT_EXACT_MATCH: 40,         // >40% is plagiarism
    
    // Semantic matching (same ideas, different words)
    SAFE_SEMANTIC_MATCH: 40,        // Up to 40% OK if unique value added
    WARNING_SEMANTIC_MATCH: 60,     // 40-60% borderline
    REJECT_SEMANTIC_MATCH: 70,      // >70% is duplicate content
    
    // Special cases for financial content
    ALLOWED_DATA_MATCH: 25,         // Statistics, regulatory data
    ALLOWED_DEFINITION_MATCH: 30,   // Official definitions (SEBI, RBI)
    ALLOWED_COMMON_PHRASES: 10,     // Common financial terminology
    
    // Citation handling
    MAX_QUOTED_CONTENT: 20,         // Max % of content that can be direct quotes
    MIN_QUOTE_LENGTH: 10            // Ignore matches <10 words (common phrases)
};

// ============================================================================
// CONTENT QUALITY STANDARDS
// ============================================================================

export const GOOGLE_CONTENT_STANDARDS = {
    // Word count (aligned with content depth standards)
    MIN_WORD_COUNT: 1500,           // Minimum for comprehensive articles
    TARGET_WORD_COUNT: 2500,        // Sweet spot for most topics
    MAX_WORD_COUNT: 5000,           // Too long can hurt engagement
    
    // Readability (Flesch Reading Ease)
    MIN_READING_LEVEL: 8,           // 8th grade (accessible)
    MAX_READING_LEVEL: 14,          // Don't be too academic
    TARGET_READING_LEVEL: 10,       // 10th grade ideal for finance
    
    // Structure
    MIN_HEADINGS: 5,                // Minimum H2/H3 structure
    MIN_PARAGRAPHS: 10,
    MAX_PARAGRAPH_LENGTH: 150,      // Words per paragraph
    
    // Engagement signals
    MIN_IMAGES: 2,
    MIN_INTERNAL_LINKS: 3,
    MIN_EXTERNAL_LINKS: 2,          // To authoritative sources
    
    // E-E-A-T signals
    MIN_CITATIONS: 5,               // RBI, SEBI, AMFI, etc.
    MIN_DATA_POINTS: 10,            // Specific numbers, stats
    MIN_EXAMPLES: 5,                // Real-world examples
    
    // Technical SEO
    MIN_TITLE_LENGTH: 50,
    MAX_TITLE_LENGTH: 60,
    MIN_META_DESC_LENGTH: 150,
    MAX_META_DESC_LENGTH: 160
};

// ============================================================================
// DUPLICATE DETECTION STANDARDS
// ============================================================================

export const GOOGLE_DUPLICATE_STANDARDS = {
    // Keyword overlap thresholds
    BLOCK_KEYWORD_OVERLAP: 85,      // >85% overlap = duplicate
    WARN_KEYWORD_OVERLAP: 60,       // 60-85% = too similar
    SAFE_KEYWORD_OVERLAP: 40,       // <40% = different enough
    
    // Semantic similarity (cosine similarity 0-1)
    BLOCK_SEMANTIC_SIMILARITY: 0.90,    // >0.90 = duplicate
    WARN_SEMANTIC_SIMILARITY: 0.75,     // 0.75-0.90 = very similar
    SAFE_SEMANTIC_SIMILARITY: 0.60,     // <0.60 = different
    
    // Title similarity
    BLOCK_TITLE_SIMILARITY: 0.85,
    WARN_TITLE_SIMILARITY: 0.70,
    
    // Allow multiple articles IF:
    ALLOW_IF_DIFFERENT_CATEGORY: true,
    ALLOW_IF_DIFFERENT_DEPTH: true,     // Beginner vs Advanced
    ALLOW_IF_DIFFERENT_ANGLE: true,     // What vs How vs Why
    ALLOW_IF_DIFFERENT_YEAR: true       // 2026 vs 2027 guides
};

// ============================================================================
// YMYL (YOUR MONEY YOUR LIFE) STANDARDS
// ============================================================================

export const YMYL_STANDARDS = {
    // Financial content is YMYL - higher standards required
    CATEGORIES: ['mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax'],
    
    // Additional requirements for YMYL
    REQUIRE_DISCLAIMERS: true,
    REQUIRE_AUTHOR_CREDENTIALS: true,
    REQUIRE_RECENT_UPDATE_DATE: true,
    REQUIRE_FACT_CHECKING: true,
    REQUIRE_REGULATORY_CITATIONS: true,
    
    // Higher thresholds
    MIN_TRUSTWORTHINESS: 75,        // vs 70 for non-YMYL
    MIN_EXPERTISE: 65,              // vs 60 for non-YMYL
    MIN_CITATIONS: 5,               // vs 3 for non-YMYL
    
    // Red flags (auto-reject)
    REJECT_IF_FINANCIAL_ADVICE: true,       // Must be informational only
    REJECT_IF_GUARANTEED_RETURNS: true,
    REJECT_IF_NO_DISCLAIMERS: true,
    REJECT_IF_OUTDATED: 12              // Months since last update
};

// ============================================================================
// SCORING WEIGHTS (BASED ON GOOGLE'S KNOWN FACTORS)
// ============================================================================

export const GOOGLE_RANKING_WEIGHTS = {
    // Primary factors
    CONTENT_DEPTH: 0.30,            // 30% - Comprehensive beats shallow
    EEAT_SIGNALS: 0.25,             // 25% - Especially for YMYL
    USER_ENGAGEMENT: 0.20,          // 20% - Time on page, bounce rate
    TECHNICAL_SEO: 0.15,            // 15% - Speed, mobile, schema
    BACKLINKS: 0.10                 // 10% - Quality over quantity
};

// ============================================================================
// COMPOSITE SCORING FUNCTION
// ============================================================================

export function calculateGoogleAlignedScore(metrics: {
    eeat_score: number;
    word_count: number;
    readability: number;
    citations: number;
    internal_links: number;
    external_links: number;
    images: number;
    exact_match_plagiarism: number;
    semantic_match_plagiarism: number;
    is_ymyl: boolean;
}): {
    score: number;
    verdict: 'AUTO_PUBLISH' | 'NEEDS_REVIEW' | 'REJECT';
    reasons: string[];
} {
    const reasons: string[] = [];
    let score = 0;
    
    // E-E-A-T (25% weight)
    const eeatScore = Math.min(100, metrics.eeat_score);
    score += eeatScore * GOOGLE_RANKING_WEIGHTS.EEAT_SIGNALS;
    
    if (eeatScore >= GOOGLE_EEAT_STANDARDS.TARGET_EEAT_OVERALL) {
        reasons.push('✅ Excellent E-E-A-T score');
    } else if (eeatScore < GOOGLE_EEAT_STANDARDS.MIN_EEAT_OVERALL) {
        reasons.push('❌ E-E-A-T score too low');
    }
    
    // Content Depth (30% weight)
    let depthScore = 0;
    if (metrics.word_count >= GOOGLE_CONTENT_STANDARDS.TARGET_WORD_COUNT) {
        depthScore = 100;
        reasons.push('✅ Comprehensive word count');
    } else if (metrics.word_count >= GOOGLE_CONTENT_STANDARDS.MIN_WORD_COUNT) {
        depthScore = 70 + ((metrics.word_count - GOOGLE_CONTENT_STANDARDS.MIN_WORD_COUNT) / (GOOGLE_CONTENT_STANDARDS.TARGET_WORD_COUNT - GOOGLE_CONTENT_STANDARDS.MIN_WORD_COUNT)) * 30;
    } else {
        depthScore = 40;
        reasons.push('❌ Content too short');
    }
    score += depthScore * GOOGLE_RANKING_WEIGHTS.CONTENT_DEPTH;
    
    // Technical SEO (15% weight)
    let technicalScore = 60; // Base score
    if (metrics.citations >= GOOGLE_CONTENT_STANDARDS.MIN_CITATIONS) technicalScore += 10;
    if (metrics.internal_links >= GOOGLE_CONTENT_STANDARDS.MIN_INTERNAL_LINKS) technicalScore += 10;
    if (metrics.external_links >= GOOGLE_CONTENT_STANDARDS.MIN_EXTERNAL_LINKS) technicalScore += 10;
    if (metrics.images >= GOOGLE_CONTENT_STANDARDS.MIN_IMAGES) technicalScore += 10;
    score += technicalScore * GOOGLE_RANKING_WEIGHTS.TECHNICAL_SEO;
    
    // Readability (part of user engagement - 20% weight)
    let readabilityScore = 100;
    if (metrics.readability < GOOGLE_CONTENT_STANDARDS.MIN_READING_LEVEL || 
        metrics.readability > GOOGLE_CONTENT_STANDARDS.MAX_READING_LEVEL) {
        readabilityScore = 60;
        reasons.push('⚠️ Readability could be improved');
    }
    score += readabilityScore * GOOGLE_RANKING_WEIGHTS.USER_ENGAGEMENT;
    
    // Plagiarism penalty
    if (metrics.exact_match_plagiarism > GOOGLE_PLAGIARISM_STANDARDS.SAFE_EXACT_MATCH) {
        const penalty = Math.min(40, (metrics.exact_match_plagiarism - GOOGLE_PLAGIARISM_STANDARDS.SAFE_EXACT_MATCH) * 2);
        score -= penalty;
        reasons.push(`⚠️ High exact match plagiarism (${metrics.exact_match_plagiarism}%)`);
    }
    
    // YMYL stricter standards
    if (metrics.is_ymyl) {
        if (metrics.eeat_score < YMYL_STANDARDS.MIN_EXPERTISE) {
            score -= 15;
            reasons.push('❌ YMYL content needs higher expertise');
        }
    }
    
    // Final score (0-100)
    score = Math.max(0, Math.min(100, score));
    
    // Verdict
    let verdict: 'AUTO_PUBLISH' | 'NEEDS_REVIEW' | 'REJECT';
    if (score >= 70 && 
        metrics.eeat_score >= GOOGLE_EEAT_STANDARDS.MIN_EEAT_OVERALL &&
        metrics.exact_match_plagiarism <= GOOGLE_PLAGIARISM_STANDARDS.WARNING_EXACT_MATCH) {
        verdict = 'AUTO_PUBLISH';
    } else if (score >= 55) {
        verdict = 'NEEDS_REVIEW';
    } else {
        verdict = 'REJECT';
    }
    
    return { score, verdict, reasons };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isYMYLContent(category: string): boolean {
    return YMYL_STANDARDS.CATEGORIES.includes(category);
}

export function shouldBlockDuplicate(
    keywordOverlap: number,
    semanticSimilarity: number,
    sameCategory: boolean
): { block: boolean; reason: string } {
    if (keywordOverlap >= GOOGLE_DUPLICATE_STANDARDS.BLOCK_KEYWORD_OVERLAP && sameCategory) {
        return { block: true, reason: 'Too much keyword overlap with existing article' };
    }
    
    if (semanticSimilarity >= GOOGLE_DUPLICATE_STANDARDS.BLOCK_SEMANTIC_SIMILARITY && sameCategory) {
        return { block: true, reason: 'Content too similar to existing article' };
    }
    
    return { block: false, reason: 'Content sufficiently unique' };
}

export function getPlagiarismVerdict(
    exactMatch: number,
    semanticMatch: number
): 'SAFE' | 'WARNING' | 'REJECT' {
    // CORRECTED SYNTAX: exactMatch (no space)
    if (exactMatch >= GOOGLE_PLAGIARISM_STANDARDS.REJECT_EXACT_MATCH ||
        semanticMatch >= GOOGLE_PLAGIARISM_STANDARDS.REJECT_SEMANTIC_MATCH) {
        return 'REJECT';
    }
    
    if (exactMatch >= GOOGLE_PLAGIARISM_STANDARDS.WARNING_EXACT_MATCH ||
        semanticMatch >= GOOGLE_PLAGIARISM_STANDARDS.WARNING_SEMANTIC_MATCH) {
        return 'WARNING';
    }
    
    return 'SAFE';
}
