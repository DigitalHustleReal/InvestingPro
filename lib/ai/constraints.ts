/**
 * AI Drafting Constraints System
 * 
 * STRICT RULES for AI content generation on InvestingPro.in
 * 
 * AI MAY:
 * - Summarize factual data from verified sources
 * - Explain formulas and calculations
 * - Generate FAQs from content
 * - Generate metadata (titles, descriptions, tags)
 * 
 * AI MAY NOT:
 * - Recommend products
 * - Rank products
 * - Use subjective language
 * - Make financial predictions
 * - Provide buy/sell/hold recommendations
 */

export interface AIDataSource {
    source_type: 'supabase' | 'rbi' | 'sebi' | 'amfi' | 'official_site' | 'scraped';
    source_url?: string;
    source_name: string;
    last_verified: string;
    confidence: number; // 0.0 - 1.0
}

export interface AIChangeLog {
    timestamp: string;
    change_type: 'created' | 'updated' | 'reviewed' | 'published';
    changed_by?: string; // User email or 'ai'
    changes: string[];
    previous_version?: string;
}

export interface AIConfidence {
    overall: number; // 0.0 - 1.0
    data_quality: number; // Quality of source data
    factual_accuracy: number; // Confidence in factual claims
    completeness: number; // How complete the data is
    recency: number; // How recent the data is
}

export interface AIContentMetadata {
    data_sources: AIDataSource[];
    confidence: AIConfidence;
    change_log: AIChangeLog[];
    generated_at: string;
    generated_by: 'ai';
    requires_review: boolean;
    review_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
    forbidden_phrases_found: string[];
    allowed_operations: string[];
}

/**
 * Forbidden phrases that AI must never use
 */
export const FORBIDDEN_PHRASES = [
    'we recommend',
    'you should',
    'you must',
    'best option',
    'guaranteed returns',
    'guaranteed',
    'risk-free',
    'safe investment',
    'must buy',
    'must sell',
    'should invest',
    'should avoid',
    'top pick',
    'best choice',
    'worst choice',
    'avoid this',
    'buy now',
    'sell now',
    'hold this',
    'financial advice',
    'investment advice',
    'trading advice',
    'we advise',
    'our recommendation',
    'expert recommendation',
    'professional advice'
];

/**
 * Allowed phrases for informational content
 */
export const ALLOWED_PHRASES = [
    'this product offers',
    'according to the data',
    'users may consider',
    'information shows',
    'data indicates',
    'based on available information',
    'the product features',
    'this product includes',
    'as per the documentation',
    'the data suggests',
    'available information indicates'
];

/**
 * Allowed AI operations
 */
export const ALLOWED_AI_OPERATIONS = [
    'summarize_factual_data',
    'explain_formula',
    'generate_faqs',
    'generate_metadata',
    'extract_key_points',
    'categorize_content',
    'sentiment_analysis',
    'pros_cons_extraction',
    'generate_article',
    'generate_social_posts',
    'generate_glossary',
    'optimize_seo'
];

/**
 * Forbidden AI operations
 */
export const FORBIDDEN_AI_OPERATIONS = [
    'recommend_product',
    'rank_product',
    'compare_products_subjectively',
    'predict_returns',
    'predict_performance',
    'provide_financial_advice',
    'suggest_investment_strategy',
    'evaluate_risk_subjectively'
];

/**
 * Validate AI output against constraints
 * 
 * STRICT VALIDATION - Returns errors for any violations
 */
export function validateAIContent(
    content: string,
    operation: string
): {
    valid: boolean;
    forbidden_phrases_found: string[];
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];
    const forbidden_phrases_found: string[] = [];
    
    // Check if operation is forbidden
    if (FORBIDDEN_AI_OPERATIONS.includes(operation)) {
        errors.push(`Operation "${operation}" is FORBIDDEN. AI cannot perform this operation.`);
    }
    
    // Check if operation is in allowed list (unless it's 'general')
    if (operation !== 'general' && !ALLOWED_AI_OPERATIONS.includes(operation)) {
        warnings.push(`Operation "${operation}" is not explicitly in the allowed list. Proceed with caution.`);
    }
    
    // Check for forbidden phrases - STRICT
    const contentLower = content.toLowerCase();
    for (const phrase of FORBIDDEN_PHRASES) {
        if (contentLower.includes(phrase)) {
            forbidden_phrases_found.push(phrase);
        }
    }
    
    if (forbidden_phrases_found.length > 0) {
        errors.push(`CRITICAL: Found ${forbidden_phrases_found.length} forbidden phrase(s) in content. Content requires revision.`);
    }
    
    // Check for subjective language patterns
    const subjectivePatterns = [
        /\b(best|worst|top|bottom)\s+\w+/gi,
        /\b(should|must|need to)\s+(invest|buy|sell|hold)/gi,
        /\b(recommend|suggest|advise)\s+/gi,
        /\b(guaranteed|promised|assured)\s+/gi
    ];
    
    for (const pattern of subjectivePatterns) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            warnings.push(`Potential subjective language detected: ${matches[0]}`);
        }
    }
    
    return {
        valid: errors.length === 0,
        forbidden_phrases_found,
        errors,
        warnings
    };
}

/**
 * Calculate confidence score based on data sources
 */
export function calculateConfidence(dataSources: AIDataSource[]): AIConfidence {
    if (dataSources.length === 0) {
        return {
            overall: 0.0,
            data_quality: 0.0,
            factual_accuracy: 0.0,
            completeness: 0.0,
            recency: 0.0
        };
    }
    
    // Calculate average confidence from sources
    const avgSourceConfidence = dataSources.reduce((sum, ds) => sum + ds.confidence, 0) / dataSources.length;
    
    // Determine data quality based on source types
    const officialSources = dataSources.filter(ds => 
        ['rbi', 'sebi', 'amfi', 'official_site'].includes(ds.source_type)
    );
    const dataQuality = officialSources.length > 0 ? 0.9 : 0.6;
    
    // Calculate recency (how recent the data is)
    const now = new Date();
    const avgRecency = dataSources.reduce((sum, ds) => {
        const verifiedDate = new Date(ds.last_verified);
        const daysSince = (now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);
        // Recency score: 1.0 if < 7 days, 0.8 if < 30 days, 0.6 if < 90 days, 0.4 if < 180 days, 0.2 otherwise
        const recencyScore = daysSince < 7 ? 1.0 : 
                           daysSince < 30 ? 0.8 : 
                           daysSince < 90 ? 0.6 : 
                           daysSince < 180 ? 0.4 : 0.2;
        return sum + recencyScore;
    }, 0) / dataSources.length;
    
    // Factual accuracy based on source type and confidence
    const factualAccuracy = avgSourceConfidence * dataQuality;
    
    // Completeness based on number of sources
    const completeness = Math.min(1.0, dataSources.length / 3); // 3+ sources = complete
    
    // Overall confidence is weighted average
    const overall = (
        avgSourceConfidence * 0.3 +
        dataQuality * 0.25 +
        factualAccuracy * 0.25 +
        completeness * 0.1 +
        avgRecency * 0.1
    );
    
    return {
        overall: Math.round(overall * 100) / 100,
        data_quality: Math.round(dataQuality * 100) / 100,
        factual_accuracy: Math.round(factualAccuracy * 100) / 100,
        completeness: Math.round(completeness * 100) / 100,
        recency: Math.round(avgRecency * 100) / 100
    };
}

/**
 * Create initial change log entry
 */
export function createChangeLog(
    changeType: 'created' | 'updated' | 'reviewed' | 'published',
    changes: string[],
    changedBy?: string
): AIChangeLog {
    return {
        timestamp: new Date().toISOString(),
        change_type: changeType,
        changed_by: changedBy || 'ai',
        changes
    };
}

/**
 * Generate system prompt with strict constraints
 */
export function generateSystemPrompt(operation: string): string {
    const allowedOps = ALLOWED_AI_OPERATIONS.filter(op => operation.includes(op) || operation === 'general');
    const isAllowed = allowedOps.length > 0 || ALLOWED_AI_OPERATIONS.some(op => operation.includes(op));
    
    if (!isAllowed && !operation.includes('general')) {
        throw new Error(`Operation "${operation}" is not allowed. Allowed operations: ${ALLOWED_AI_OPERATIONS.join(', ')}`);
    }
    
    return `You are a support tool for InvestingPro.in, an Indian financial comparison platform.

ABSOLUTE RULES - YOU MUST FOLLOW THESE:
1. You are NOT a financial advisor. Use informational language ONLY.
2. Do NOT provide financial advice, recommendations, or suggestions.
3. Base all content ONLY on the provided verified data.
4. Include citations for all factual claims.
5. Use educational, neutral tone.
6. Mark output as draft requiring human review.

FORBIDDEN PHRASES (NEVER USE THESE):
${FORBIDDEN_PHRASES.map(p => `- "${p}"`).join('\n')}

ALLOWED PHRASES (USE THESE INSTEAD):
${ALLOWED_PHRASES.map(p => `- "${p}"`).join('\n')}

ALLOWED OPERATIONS:
${ALLOWED_AI_OPERATIONS.map(op => `- ${op}`).join('\n')}

FORBIDDEN OPERATIONS:
${FORBIDDEN_AI_OPERATIONS.map(op => `- ${op}`).join('\n')}

CURRENT OPERATION: ${operation}

You MUST:
- List all data sources used
- Include confidence level (0.0-1.0) for each claim
- Use only factual, verified information
- Avoid any subjective language
- Never recommend, rank, or compare products subjectively

Always respond in valid JSON format with citations, data sources, and confidence levels.`;
}

