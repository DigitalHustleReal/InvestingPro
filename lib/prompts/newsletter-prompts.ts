/**
 * 📧 NEWSLETTER PROMPT GENERATOR
 * 
 * 100% Automated, Engaging Newsletter Content Prompts
 * 
 * Features:
 * - Multiple newsletter types (weekly, monthly, promotional)
 * - Content curation from articles
 * - Personalization
 * - Engagement optimization
 * - Brand consistency
 */

export interface NewsletterPromptOptions {
    newsletterType: 'weekly' | 'monthly' | 'promotional' | 'digest';
    articles: Array<{ title: string; excerpt: string; url: string; category: string }>;
    category?: string;
    personalization?: {
        subscriberName?: string;
        preferences?: string[];
    };
    includeStats?: boolean;
    includeTrends?: boolean;
    tone?: 'professional' | 'conversational' | 'friendly';
}

export interface GeneratedNewsletterPrompt {
    prompt: string;
    newsletterType: string;
    structure: string[];
    sections: Array<{ name: string; content: string }>;
    cta: string;
}

// ============================================================================
// NEWSLETTER TYPE DEFINITIONS
// ============================================================================

const NEWSLETTER_TYPES = {
    weekly: {
        name: 'Weekly Newsletter',
        description: 'Weekly roundup of articles and insights',
        sections: ['Header', 'Introduction', 'Featured Articles', 'Quick Tips', 'Trending Topics', 'CTA', 'Footer'],
        tone: 'conversational'
    },
    monthly: {
        name: 'Monthly Newsletter',
        description: 'Monthly comprehensive digest',
        sections: ['Header', 'Introduction', 'Monthly Highlights', 'Featured Articles', 'Statistics', 'Trends', 'Upcoming', 'CTA', 'Footer'],
        tone: 'professional'
    },
    promotional: {
        name: 'Promotional Newsletter',
        description: 'Promote specific content or offers',
        sections: ['Header', 'Hook', 'Main Offer', 'Benefits', 'Social Proof', 'CTA', 'Footer'],
        tone: 'engaging'
    },
    digest: {
        name: 'Content Digest',
        description: 'Quick digest of recent content',
        sections: ['Header', 'Introduction', 'Article List', 'Quick Reads', 'CTA', 'Footer'],
        tone: 'friendly'
    }
};

// ============================================================================
// CONTENT CURATION
// ============================================================================

/**
 * Curate articles for newsletter
 */
function curateArticles(
    articles: Array<{ title: string; excerpt: string; url: string; category: string }>,
    maxArticles: number = 5
): Array<{ title: string; excerpt: string; url: string; category: string; priority: number }> {
    // Sort by priority (can be based on views, recency, etc.)
    const curated = articles
        .map(article => ({
            ...article,
            priority: calculatePriority(article)
        }))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, maxArticles);
    
    return curated;
}

function calculatePriority(article: { title: string; excerpt: string; category: string }): number {
    let priority = 50; // Base priority
    
    // Boost priority for certain categories
    const highPriorityCategories = ['mutual-funds', 'investing-basics', 'tax-planning'];
    if (highPriorityCategories.includes(article.category)) {
        priority += 20;
    }
    
    // Boost for longer excerpts (more content)
    if (article.excerpt.length > 150) {
        priority += 10;
    }
    
    return priority;
}

// ============================================================================
// PROMPT GENERATION
// ============================================================================

/**
 * Generate newsletter prompt
 */
export function generateNewsletterPrompt(options: NewsletterPromptOptions): GeneratedNewsletterPrompt {
    const {
        newsletterType,
        articles,
        category,
        personalization,
        includeStats = true,
        includeTrends = true,
        tone
    } = options;
    
    const typeDef = NEWSLETTER_TYPES[newsletterType];
    const selectedTone = tone || typeDef.tone;
    
    // Curate articles
    const curatedArticles = curateArticles(articles, newsletterType === 'monthly' ? 8 : 5);
    
    // Build sections
    const sections = buildNewsletterSections({
        newsletterType,
        typeDef,
        curatedArticles,
        category,
        personalization,
        includeStats,
        includeTrends,
        tone: selectedTone
    });
    
    // Generate CTA
    const cta = generateNewsletterCTA(newsletterType, category);
    
    // Build prompt
    const prompt = buildNewsletterPrompt({
        newsletterType: typeDef.name,
        typeDescription: typeDef.description,
        sections,
        curatedArticles,
        personalization,
        includeStats,
        includeTrends,
        tone: selectedTone,
        cta
    });
    
    return {
        prompt,
        newsletterType,
        structure: typeDef.sections,
        sections,
        cta
    };
}

/**
 * Build newsletter sections
 */
function buildNewsletterSections(params: {
    newsletterType: string;
    typeDef: typeof NEWSLETTER_TYPES[string];
    curatedArticles: Array<{ title: string; excerpt: string; url: string; category: string }>;
    category?: string;
    personalization?: { subscriberName?: string; preferences?: string[] };
    includeStats: boolean;
    includeTrends: boolean;
    tone: string;
}): Array<{ name: string; content: string }> {
    const { newsletterType, curatedArticles, personalization, includeStats, includeTrends, tone } = params;
    
    const sections: Array<{ name: string; content: string }> = [];
    
    // Header section
    sections.push({
        name: 'Header',
        content: `Create a professional newsletter header with:
- Newsletter title
- Date
- Branding
- ${personalization?.subscriberName ? `Personalized greeting: "Hi ${personalization.subscriberName}!"` : 'General greeting'}`
    });
    
    // Introduction section
    sections.push({
        name: 'Introduction',
        content: `Write a ${tone} introduction (100-150 words) that:
- Welcomes readers
- Sets expectations for the newsletter
- Highlights what's inside
- Creates engagement`
    });
    
    // Featured articles section
    sections.push({
        name: 'Featured Articles',
        content: `Create article summaries for ${curatedArticles.length} featured articles:
${curatedArticles.map((article, i) => `
${i + 1}. ${article.title}
   - Category: ${article.category}
   - Excerpt: ${article.excerpt.substring(0, 100)}...
   - Write 2-3 sentence summary
   - Include call-to-action to read more
`).join('')}`
    });
    
    // Stats section (if included)
    if (includeStats && newsletterType === 'monthly') {
        sections.push({
            name: 'Statistics',
            content: `Include monthly statistics:
- Articles published
- Top performing content
- Reader engagement metrics
- Growth numbers`
        });
    }
    
    // Trends section (if included)
    if (includeTrends) {
        sections.push({
            name: 'Trending Topics',
            content: `Highlight trending topics:
- Current financial trends
- Market updates
- Regulatory changes
- Reader interests`
        });
    }
    
    // CTA section
    sections.push({
        name: 'Call-to-Action',
        content: `Create an engaging CTA that:
- Encourages engagement
- Promotes specific content
- Asks for feedback
- Includes social media links`
    });
    
    // Footer section
    sections.push({
        name: 'Footer',
        content: `Create newsletter footer with:
- Unsubscribe link
- Contact information
- Social media links
- Branding`
    });
    
    return sections;
}

/**
 * Build newsletter prompt
 */
function buildNewsletterPrompt(params: {
    newsletterType: string;
    typeDescription: string;
    sections: Array<{ name: string; content: string }>;
    curatedArticles: Array<{ title: string; excerpt: string; url: string; category: string }>;
    personalization?: { subscriberName?: string; preferences?: string[] };
    includeStats: boolean;
    includeTrends: boolean;
    tone: string;
    cta: string;
}): string {
    const { newsletterType, typeDescription, sections, curatedArticles, personalization, includeStats, includeTrends, tone, cta } = params;
    
    let prompt = `Create a ${newsletterType} newsletter\n\n`;
    
    prompt += `NEWSLETTER TYPE: ${newsletterType}\n`;
    prompt += `Description: ${typeDescription}\n`;
    prompt += `Tone: ${tone}\n\n`;
    
    if (personalization?.subscriberName) {
        prompt += `PERSONALIZATION:\n`;
        prompt += `- Subscriber name: ${personalization.subscriberName}\n`;
        if (personalization.preferences) {
            prompt += `- Preferences: ${personalization.preferences.join(', ')}\n`;
        }
        prompt += `\n`;
    }
    
    prompt += `FEATURED ARTICLES (${curatedArticles.length}):\n`;
    curatedArticles.forEach((article, i) => {
        prompt += `${i + 1}. ${article.title}\n`;
        prompt += `   Category: ${article.category}\n`;
        prompt += `   Excerpt: ${article.excerpt.substring(0, 150)}...\n`;
        prompt += `   URL: ${article.url}\n\n`;
    });
    
    prompt += `NEWSLETTER STRUCTURE:\n`;
    sections.forEach((section, i) => {
        prompt += `${i + 1}. ${section.name}\n`;
        prompt += `   ${section.content}\n\n`;
    });
    
    prompt += `WRITING REQUIREMENTS:\n`;
    prompt += `- ${tone} tone throughout\n`;
    prompt += `- Engaging and valuable content\n`;
    prompt += `- Clear section headers\n`;
    prompt += `- Scannable format (use bullet points)\n`;
    prompt += `- Include links to articles\n`;
    prompt += `- Mobile-friendly formatting\n`;
    prompt += `- Professional yet approachable\n`;
    prompt += `\n`;
    
    if (includeStats) {
        prompt += `INCLUDE STATISTICS:\n`;
        prompt += `- Monthly metrics\n`;
        prompt += `- Engagement numbers\n`;
        prompt += `- Growth statistics\n`;
        prompt += `\n`;
    }
    
    if (includeTrends) {
        prompt += `INCLUDE TRENDING TOPICS:\n`;
        prompt += `- Current financial trends\n`;
        prompt += `- Market updates\n`;
        prompt += `- Reader interests\n`;
        prompt += `\n`;
    }
    
    prompt += `CTA: ${cta}\n\n`;
    
    prompt += `OUTPUT FORMAT:\n`;
    prompt += `Return HTML email format with:\n`;
    prompt += `- Professional header\n`;
    prompt += `- Engaging introduction\n`;
    prompt += `- Article summaries with links\n`;
    prompt += `- Statistics (if applicable)\n`;
    prompt += `- Trending topics (if applicable)\n`;
    prompt += `- Clear CTA\n`;
    prompt += `- Professional footer\n`;
    
    return prompt.trim();
}

/**
 * Generate newsletter CTA
 */
function generateNewsletterCTA(newsletterType: string, category?: string): string {
    const ctas: Record<string, string> = {
        weekly: 'Read the full articles and stay updated with the latest financial insights',
        monthly: 'Explore our comprehensive content library and plan your financial future',
        promotional: 'Take action now and start your financial journey',
        digest: 'Dive deeper into these topics and expand your financial knowledge'
    };
    
    return ctas[newsletterType] || 'Explore more content';
}

// ============================================================================
// EXPORT
// ============================================================================

export const newsletterPromptGenerator = {
    generate: generateNewsletterPrompt,
    curateArticles
};
