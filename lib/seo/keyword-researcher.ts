/**
 * Keyword Researcher
 * Discovers related keywords and LSI terms
 */

export interface KeywordResearchResult {
    primary: string;
    secondary: string[];
    lsi: string[];
    longTail: string[];
    related: string[];
    suggestions: string[];
}

/**
 * Research keywords for a topic
 */
export async function researchKeywords(
    topic: string,
    category: string
): Promise<KeywordResearchResult> {
    // Primary keyword is the topic itself
    const primary = topic.toLowerCase();
    
    // Generate secondary keywords
    const secondary = generateSecondaryKeywords(topic, category);
    
    // Generate LSI (Latent Semantic Indexing) keywords
    const lsi = generateLSIKeywords(topic, category);
    
    // Generate long-tail keywords
    const longTail = generateLongTailKeywords(topic, category);
    
    // Generate related keywords
    const related = generateRelatedKeywords(topic, category);
    
    // Generate suggestions
    const suggestions = generateKeywordSuggestions(topic, category);
    
    return {
        primary,
        secondary,
        lsi,
        longTail,
        related,
        suggestions
    };
}

/**
 * Generate secondary keywords
 */
function generateSecondaryKeywords(topic: string, category: string): string[] {
    const keywords: string[] = [];
    const topicLower = topic.toLowerCase();
    
    // Category-specific secondary keywords
    const categoryKeywords: Record<string, string[]> = {
        'tax-planning': ['income tax', 'tax saving', 'tax deduction', 'tax regime', 'tax calculator'],
        'mutual-funds': ['SIP', 'mutual fund', 'investment', 'returns', 'NAV', 'portfolio'],
        'credit-cards': ['credit card', 'rewards', 'cashback', 'credit score', 'annual fee'],
        'loans': ['loan', 'EMI', 'interest rate', 'eligibility', 'repayment'],
        'insurance': ['insurance', 'premium', 'coverage', 'claim', 'policy'],
        'stocks': ['stock market', 'shares', 'trading', 'investment', 'portfolio'],
        'banking': ['bank account', 'savings', 'interest rate', 'deposit', 'withdrawal']
    };
    
    const baseKeywords = categoryKeywords[category] || [];
    keywords.push(...baseKeywords);
    
    // Add year for timely content
    const currentYear = new Date().getFullYear();
    keywords.push(`${topic} ${currentYear}`);
    keywords.push(`${topic} ${currentYear + 1}`);
    
    return keywords.slice(0, 10);
}

/**
 * Generate LSI keywords
 */
function generateLSIKeywords(topic: string, category: string): string[] {
    const lsi: string[] = [];
    
    // LSI keywords by category
    const lsiMap: Record<string, string[]> = {
        'tax-planning': [
            'old tax regime',
            'new tax regime',
            'section 80C',
            'section 80D',
            'standard deduction',
            'tax exemption',
            'tax slab',
            'income tax return',
            'ITR filing',
            'tax rebate'
        ],
        'mutual-funds': [
            'equity fund',
            'debt fund',
            'hybrid fund',
            'ELSS',
            'index fund',
            'fund manager',
            'expense ratio',
            'exit load',
            'dividend',
            'growth option'
        ],
        'credit-cards': [
            'credit limit',
            'billing cycle',
            'grace period',
            'minimum due',
            'reward points',
            'lounge access',
            'fuel surcharge',
            'interest free period',
            'credit utilization',
            'card benefits'
        ],
        'loans': [
            'principal amount',
            'tenure',
            'processing fee',
            'prepayment',
            'foreclosure',
            'credit score',
            'CIBIL score',
            'loan approval',
            'down payment',
            'loan disbursement'
        ],
        'insurance': [
            'sum assured',
            'maturity benefit',
            'death benefit',
            'riders',
            'policy term',
            'waiting period',
            'claim settlement',
            'premium payment',
            'policy lapse',
            'surrender value'
        ]
    };
    
    const baseLSI = lsiMap[category] || [];
    lsi.push(...baseLSI);
    
    return lsi.slice(0, 15);
}

/**
 * Generate long-tail keywords
 */
function generateLongTailKeywords(topic: string, category: string): string[] {
    const longTail: string[] = [];
    
    // Question-based long-tail
    longTail.push(`how to ${topic}`);
    longTail.push(`what is ${topic}`);
    longTail.push(`${topic} explained`);
    longTail.push(`${topic} guide`);
    longTail.push(`${topic} for beginners`);
    
    // Comparison long-tail
    longTail.push(`${topic} vs`);
    longTail.push(`best ${topic}`);
    longTail.push(`top ${topic}`);
    
    // Action-based long-tail
    longTail.push(`${topic} calculator`);
    longTail.push(`${topic} comparison`);
    longTail.push(`${topic} benefits`);
    
    return longTail.slice(0, 12);
}

/**
 * Generate related keywords
 */
function generateRelatedKeywords(topic: string, category: string): string[] {
    const related: string[] = [];
    
    // Related topics by category
    const relatedMap: Record<string, string[]> = {
        'tax-planning': ['tax saving tips', 'tax planning strategies', 'income tax calculation', 'tax filing'],
        'mutual-funds': ['SIP investment', 'mutual fund returns', 'best mutual funds', 'fund selection'],
        'credit-cards': ['best credit cards', 'credit card comparison', 'card benefits', 'rewards program'],
        'loans': ['loan eligibility', 'EMI calculator', 'loan comparison', 'interest rates'],
        'insurance': ['insurance plans', 'policy comparison', 'claim process', 'premium calculation']
    };
    
    const baseRelated = relatedMap[category] || [];
    related.push(...baseRelated);
    
    return related.slice(0, 10);
}

/**
 * Generate keyword suggestions
 */
function generateKeywordSuggestions(topic: string, category: string): string[] {
    const suggestions: string[] = [];
    
    suggestions.push(`Use "${topic}" in title and first paragraph`);
    suggestions.push(`Include secondary keywords naturally throughout content`);
    suggestions.push(`Add LSI keywords to improve semantic relevance`);
    suggestions.push(`Use long-tail keywords in H2/H3 headings`);
    suggestions.push(`Include related keywords in conclusion`);
    
    return suggestions;
}

/**
 * Calculate keyword density
 */
export function calculateKeywordDensity(content: string, keyword: string): number {
    const contentLower = content.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    // Count occurrences
    const occurrences = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    
    // Count total words
    const words = content.split(/\s+/).length;
    
    // Calculate density (percentage)
    const density = words > 0 ? (occurrences / words) * 100 : 0;
    
    return density;
}

/**
 * Check if keywords are well-distributed
 */
export function analyzeKeywordDistribution(content: string, keywords: string[]): {
    inTitle: boolean;
    inFirstParagraph: boolean;
    inHeadings: boolean;
    inConclusion: boolean;
    density: number;
    suggestions: string[];
} {
    const contentLower = content.toLowerCase();
    const firstParagraph = content.substring(0, 500).toLowerCase();
    const lastParagraph = content.substring(content.length - 500).toLowerCase();
    
    const primaryKeyword = keywords[0]?.toLowerCase() || '';
    
    const inTitle = contentLower.includes(primaryKeyword);
    const inFirstParagraph = firstParagraph.includes(primaryKeyword);
    const inHeadings = /<h[23]>.*?<\/h[23]>/gi.test(content) && 
                       content.match(/<h[23]>.*?<\/h[23]>/gi)?.some(h => 
                           h.toLowerCase().includes(primaryKeyword)
                       ) || false;
    const inConclusion = lastParagraph.includes(primaryKeyword);
    
    const density = calculateKeywordDensity(content, primaryKeyword);
    
    const suggestions: string[] = [];
    if (!inTitle) suggestions.push('Add primary keyword to title');
    if (!inFirstParagraph) suggestions.push('Include keyword in first paragraph');
    if (!inHeadings) suggestions.push('Use keyword in at least one heading');
    if (!inConclusion) suggestions.push('Mention keyword in conclusion');
    if (density < 0.5) suggestions.push('Increase keyword density (currently too low)');
    if (density > 3) suggestions.push('Reduce keyword density (currently too high, may be keyword stuffing)');
    
    return {
        inTitle,
        inFirstParagraph,
        inHeadings,
        inConclusion,
        density,
        suggestions
    };
}
