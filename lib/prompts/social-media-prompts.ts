/**
 * 📱 SOCIAL MEDIA PROMPT GENERATOR
 * 
 * 100% Automated, Platform-Optimized Social Media Content Prompts
 * 
 * Features:
 * - Platform-specific optimization (Twitter, LinkedIn, Facebook, Instagram)
 * - Content extraction from articles
 * - Thread generation (Twitter)
 * - Hashtag optimization
 * - Engagement optimization
 * - Brand consistency
 */

export interface SocialMediaPromptOptions {
    articleTitle: string;
    articleContent: string;
    articleExcerpt?: string;
    platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
    contentType: 'post' | 'thread' | 'carousel' | 'story';
    category: string;
    keywords?: string[];
    tone?: 'professional' | 'conversational' | 'engaging' | 'educational';
    includeCTA?: boolean;
    includeHashtags?: boolean;
}

export interface GeneratedSocialMediaPrompt {
    prompt: string;
    platform: string;
    contentType: string;
    characterLimit: number;
    hashtags: string[];
    cta: string;
    engagementTips: string[];
}

// ============================================================================
// PLATFORM SPECIFICATIONS
// ============================================================================

const PLATFORM_SPECS = {
    twitter: {
        name: 'Twitter/X',
        characterLimit: 280,
        threadLimit: 25,
        hashtagLimit: 3,
        optimalLength: 240,
        engagementTips: ['Use questions', 'Include numbers', 'Add emojis sparingly', 'Use line breaks'],
        hashtagStrategy: 'trending + niche'
    },
    linkedin: {
        name: 'LinkedIn',
        characterLimit: 3000,
        threadLimit: 1,
        hashtagLimit: 5,
        optimalLength: 1500,
        engagementTips: ['Professional tone', 'Share insights', 'Use bullet points', 'Include statistics'],
        hashtagStrategy: 'professional + industry'
    },
    facebook: {
        name: 'Facebook',
        characterLimit: 5000,
        threadLimit: 1,
        hashtagLimit: 3,
        optimalLength: 2000,
        engagementTips: ['Conversational tone', 'Ask questions', 'Use images', 'Include links'],
        hashtagStrategy: 'broad + niche'
    },
    instagram: {
        name: 'Instagram',
        characterLimit: 2200,
        threadLimit: 1,
        hashtagLimit: 30,
        optimalLength: 150,
        engagementTips: ['Visual-first', 'Use emojis', 'Include call-to-action', 'Use line breaks'],
        hashtagStrategy: 'niche + trending + branded'
    }
};

// ============================================================================
// CONTENT EXTRACTION
// ============================================================================

/**
 * Extract key points from article for social media
 */
function extractKeyPoints(content: string, maxPoints: number = 5): string[] {
    // Extract headings
    const headingMatches = content.match(/^#{1,3}\s+(.+)$/gm);
    const headings = headingMatches?.slice(0, maxPoints).map(h => h.replace(/^#+\s+/, '')) || [];
    
    // Extract bullet points
    const bulletMatches = content.match(/^[-*]\s+(.+)$/gm);
    const bullets = bulletMatches?.slice(0, maxPoints).map(b => b.replace(/^[-*]\s+/, '')) || [];
    
    // Extract key sentences (first sentence of paragraphs)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const keySentences = paragraphs.slice(0, maxPoints).map(p => {
        const firstSentence = p.split(/[.!?]/)[0];
        return firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence;
    });
    
    // Combine and deduplicate
    const allPoints = [...headings, ...bullets, ...keySentences];
    const uniquePoints = Array.from(new Set(allPoints));
    
    return uniquePoints.slice(0, maxPoints);
}

/**
 * Extract statistics from content
 */
function extractStatistics(content: string): Array<{ label: string; value: string }> {
    const stats: Array<{ label: string; value: string }> = [];
    
    // Extract percentages
    const percentageMatches = content.match(/(\d+(?:\.\d+)?)\s*%/g);
    if (percentageMatches) {
        percentageMatches.slice(0, 3).forEach(match => {
            stats.push({
                label: 'Percentage',
                value: match
            });
        });
    }
    
    // Extract numbers with context
    const numberMatches = content.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s+(lakh|crore|thousand|million|years?|months?|days?)/gi);
    if (numberMatches) {
        numberMatches.slice(0, 3).forEach(match => {
            stats.push({
                label: 'Number',
                value: match
            });
        });
    }
    
    return stats.slice(0, 5);
}

// ============================================================================
// HASHTAG GENERATION
// ============================================================================

/**
 * Generate hashtags based on category and keywords
 */
function generateHashtags(
    category: string,
    keywords: string[],
    platform: string,
    limit: number
): string[] {
    const categoryHashtags: Record<string, string[]> = {
        'mutual-funds': ['MutualFunds', 'Investing', 'SIP', 'FinancialPlanning', 'WealthBuilding'],
        'credit-cards': ['CreditCards', 'Banking', 'Rewards', 'Cashback', 'FinancialFreedom'],
        'loans': ['Loans', 'HomeLoan', 'PersonalLoan', 'Finance', 'LoanApproval'],
        'insurance': ['Insurance', 'LifeInsurance', 'HealthInsurance', 'Protection', 'FinancialSecurity'],
        'tax-planning': ['TaxPlanning', 'TaxSaving', 'Section80C', 'TaxDeduction', 'FinancialPlanning'],
        'retirement': ['RetirementPlanning', 'Pension', 'FinancialFreedom', 'WealthBuilding', 'Retirement'],
        'investing-basics': ['Investing', 'FinancialLiteracy', 'WealthBuilding', 'StockMarket', 'InvestingBasics'],
        'stocks': ['Stocks', 'StockMarket', 'Investing', 'Equity', 'Trading']
    };
    
    const baseHashtags = categoryHashtags[category] || ['Finance', 'Investing', 'Money'];
    const keywordHashtags = keywords.slice(0, 3).map(k => k.replace(/\s+/g, ''));
    
    const allHashtags = [...baseHashtags, ...keywordHashtags];
    
    // Platform-specific filtering
    if (platform === 'twitter') {
        // Shorter hashtags for Twitter
        return allHashtags.filter(h => h.length <= 20).slice(0, limit);
    } else if (platform === 'instagram') {
        // More hashtags for Instagram
        return allHashtags.slice(0, limit);
    }
    
    return allHashtags.slice(0, limit);
}

// ============================================================================
// PROMPT GENERATION
// ============================================================================

/**
 * Generate social media prompt
 */
export function generateSocialMediaPrompt(options: SocialMediaPromptOptions): GeneratedSocialMediaPrompt {
    const {
        articleTitle,
        articleContent,
        articleExcerpt,
        platform,
        contentType,
        category,
        keywords = [],
        tone = 'professional',
        includeCTA = true,
        includeHashtags = true
    } = options;
    
    const platformSpec = PLATFORM_SPECS[platform];
    
    // Extract content elements
    const keyPoints = extractKeyPoints(articleContent, 5);
    const statistics = extractStatistics(articleContent);
    const excerpt = articleExcerpt || articleContent.substring(0, 200);
    
    // Generate hashtags
    const hashtags = includeHashtags 
        ? generateHashtags(category, keywords, platform, platformSpec.hashtagLimit)
        : [];
    
    // Generate CTA
    const cta = includeCTA ? generateCTA(platform, category) : '';
    
    // Build prompt based on content type
    let prompt = '';
    
    if (contentType === 'thread' && platform === 'twitter') {
        prompt = buildTwitterThreadPrompt({
            articleTitle,
            keyPoints,
            statistics,
            platformSpec,
            hashtags,
            cta,
            tone
        });
    } else {
        prompt = buildSocialMediaPostPrompt({
            articleTitle,
            excerpt,
            keyPoints,
            statistics,
            platform,
            platformSpec,
            hashtags,
            cta,
            tone,
            contentType
        });
    }
    
    return {
        prompt,
        platform,
        contentType,
        characterLimit: platformSpec.characterLimit,
        hashtags,
        cta,
        engagementTips: platformSpec.engagementTips
    };
}

/**
 * Build Twitter thread prompt
 */
function buildTwitterThreadPrompt(params: {
    articleTitle: string;
    keyPoints: string[];
    statistics: Array<{ label: string; value: string }>;
    platformSpec: typeof PLATFORM_SPECS['twitter'];
    hashtags: string[];
    cta: string;
    tone: string;
}): string {
    const { articleTitle, keyPoints, statistics, platformSpec, hashtags, cta, tone } = params;
    
    let prompt = `Create a Twitter/X thread (${platformSpec.threadLimit} tweets max) based on: "${articleTitle}"\n\n`;
    
    prompt += `THREAD STRUCTURE:\n`;
    prompt += `Tweet 1: Hook + introduce topic (${platformSpec.optimalLength} chars)\n`;
    prompt += `Tweet 2-${Math.min(keyPoints.length + 1, platformSpec.threadLimit - 1)}: Key points (one per tweet)\n`;
    if (statistics.length > 0) {
        prompt += `Tweet ${Math.min(keyPoints.length + 2, platformSpec.threadLimit)}: Statistics/data\n`;
    }
    prompt += `Final tweet: Summary + CTA + hashtags\n\n`;
    
    prompt += `KEY POINTS TO COVER:\n`;
    keyPoints.forEach((point, i) => {
        prompt += `${i + 1}. ${point.substring(0, 100)}\n`;
    });
    prompt += `\n`;
    
    if (statistics.length > 0) {
        prompt += `STATISTICS TO INCLUDE:\n`;
        statistics.forEach((stat, i) => {
            prompt += `${i + 1}. ${stat.value}\n`;
        });
        prompt += `\n`;
    }
    
    prompt += `REQUIREMENTS:\n`;
    prompt += `- Each tweet max ${platformSpec.characterLimit} characters\n`;
    prompt += `- ${tone} tone\n`;
    prompt += `- Use line breaks for readability\n`;
    prompt += `- Number tweets (1/5, 2/5, etc.)\n`;
    prompt += `- Include emojis sparingly\n`;
    prompt += `- Make it engaging and shareable\n`;
    prompt += `- Use questions to drive engagement\n`;
    prompt += `- Include statistics where relevant\n`;
    prompt += `\n`;
    
    if (hashtags.length > 0) {
        prompt += `HASHTAGS (use in final tweet):\n`;
        prompt += hashtags.map(h => `#${h}`).join(' ') + `\n\n`;
    }
    
    prompt += `CTA: ${cta}\n\n`;
    
    prompt += `OUTPUT FORMAT:\n`;
    prompt += `Return JSON array with tweets:\n`;
    prompt += `[\n`;
    prompt += `  { "number": 1, "tweet": "..." },\n`;
    prompt += `  { "number": 2, "tweet": "..." },\n`;
    prompt += `  ...\n`;
    prompt += `]\n`;
    
    return prompt.trim();
}

/**
 * Build social media post prompt
 */
function buildSocialMediaPostPrompt(params: {
    articleTitle: string;
    excerpt: string;
    keyPoints: string[];
    statistics: Array<{ label: string; value: string }>;
    platform: string;
    platformSpec: typeof PLATFORM_SPECS[string];
    hashtags: string[];
    cta: string;
    tone: string;
    contentType: string;
}): string {
    const { articleTitle, excerpt, keyPoints, statistics, platform, platformSpec, hashtags, cta, tone, contentType } = params;
    
    let prompt = `Create a ${platformSpec.name} ${contentType} based on: "${articleTitle}"\n\n`;
    
    prompt += `ARTICLE SUMMARY:\n`;
    prompt += `${excerpt}\n\n`;
    
    prompt += `KEY POINTS:\n`;
    keyPoints.forEach((point, i) => {
        prompt += `${i + 1}. ${point.substring(0, 80)}\n`;
    });
    prompt += `\n`;
    
    if (statistics.length > 0) {
        prompt += `STATISTICS TO INCLUDE:\n`;
        statistics.forEach((stat, i) => {
            prompt += `${i + 1}. ${stat.value}\n`;
        });
        prompt += `\n`;
    }
    
    prompt += `PLATFORM REQUIREMENTS:\n`;
    prompt += `- Platform: ${platformSpec.name}\n`;
    prompt += `- Character limit: ${platformSpec.characterLimit}\n`;
    prompt += `- Optimal length: ${platformSpec.optimalLength} characters\n`;
    prompt += `- Tone: ${tone}\n`;
    prompt += `- Content type: ${contentType}\n`;
    prompt += `\n`;
    
    prompt += `WRITING REQUIREMENTS:\n`;
    platformSpec.engagementTips.forEach(tip => {
        prompt += `- ${tip}\n`;
    });
    prompt += `- Make it engaging and shareable\n`;
    prompt += `- Include a hook in the first line\n`;
    prompt += `- Use line breaks for readability\n`;
    prompt += `- Include call-to-action\n`;
    prompt += `\n`;
    
    if (platform === 'linkedin') {
        prompt += `LINKEDIN SPECIFIC:\n`;
        prompt += `- Professional tone\n`;
        prompt += `- Share insights and expertise\n`;
        prompt += `- Use bullet points for key points\n`;
        prompt += `- Include statistics\n`;
        prompt += `- Ask engaging questions\n`;
        prompt += `\n`;
    } else if (platform === 'instagram') {
        prompt += `INSTAGRAM SPECIFIC:\n`;
        prompt += `- Visual-first approach\n`;
        prompt += `- Use emojis strategically\n`;
        prompt += `- Include line breaks\n`;
        prompt += `- Make it scannable\n`;
        prompt += `- Include call-to-action\n`;
        prompt += `\n`;
    } else if (platform === 'facebook') {
        prompt += `FACEBOOK SPECIFIC:\n`;
        prompt += `- Conversational tone\n`;
        prompt += `- Ask questions\n`;
        prompt += `- Use engaging language\n`;
        prompt += `- Include links\n`;
        prompt += `\n`;
    }
    
    if (hashtags.length > 0) {
        prompt += `HASHTAGS:\n`;
        prompt += hashtags.map(h => `#${h}`).join(' ') + `\n\n`;
    }
    
    prompt += `CTA: ${cta}\n\n`;
    
    prompt += `OUTPUT FORMAT:\n`;
    prompt += `Return JSON:\n`;
    prompt += `{\n`;
    prompt += `  "post": "Full post text",\n`;
    prompt += `  "hashtags": [${hashtags.map(h => `"${h}"`).join(', ')}],\n`;
    prompt += `  "cta": "${cta}",\n`;
    prompt += `  "characterCount": <number>\n`;
    prompt += `}\n`;
    
    return prompt.trim();
}

/**
 * Generate CTA based on platform and category
 */
function generateCTA(platform: string, category: string): string {
    const ctas: Record<string, Record<string, string>> = {
        twitter: {
            'mutual-funds': 'Start your SIP journey today!',
            'credit-cards': 'Apply for the best credit card now!',
            'loans': 'Get instant loan approval!',
            'insurance': 'Protect your family today!',
            'tax-planning': 'Save more on taxes this year!',
            'retirement': 'Plan your retirement now!',
            'investing-basics': 'Start investing today!',
            'stocks': 'Begin your stock market journey!'
        },
        linkedin: {
            'mutual-funds': 'Learn more about SIP investing',
            'credit-cards': 'Explore credit card options',
            'loans': 'Compare loan options',
            'insurance': 'Get insurance quotes',
            'tax-planning': 'Optimize your tax savings',
            'retirement': 'Plan for retirement',
            'investing-basics': 'Start your investment journey',
            'stocks': 'Learn about stock investing'
        },
        facebook: {
            'mutual-funds': 'Start investing in mutual funds',
            'credit-cards': 'Find the best credit card',
            'loans': 'Get loan approval',
            'insurance': 'Protect your family',
            'tax-planning': 'Save on taxes',
            'retirement': 'Plan retirement',
            'investing-basics': 'Learn investing',
            'stocks': 'Invest in stocks'
        },
        instagram: {
            'mutual-funds': 'Start your SIP journey 💰',
            'credit-cards': 'Get the best credit card 🎯',
            'loans': 'Get instant approval ⚡',
            'insurance': 'Protect your family 🛡️',
            'tax-planning': 'Save more on taxes 💸',
            'retirement': 'Plan retirement now 🎯',
            'investing-basics': 'Start investing today 🚀',
            'stocks': 'Begin stock investing 📈'
        }
    };
    
    return ctas[platform]?.[category] || 'Learn more';
}

// ============================================================================
// EXPORT
// ============================================================================

export const socialMediaPromptGenerator = {
    generate: generateSocialMediaPrompt,
    extractKeyPoints,
    extractStatistics,
    generateHashtags
};
