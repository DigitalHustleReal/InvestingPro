/**
 * 📧 NEWSLETTER TEMPLATES LIBRARY
 * 
 * Structured templates for consistent, high-quality newsletter content
 * across different types and use cases.
 */

export interface NewsletterSection {
    id: string;
    name: string;
    required: boolean;
    maxLength?: number;
    elements: string[];
}

export interface NewsletterTemplate {
    id: string;
    name: string;
    description: string;
    newsletterType: 'weekly' | 'monthly' | 'promotional' | 'digest';
    useCases: string[];
    
    // Structure
    sections: NewsletterSection[];
    
    // Requirements
    minArticles: number;
    maxArticles: number;
    requiredElements: string[];
    
    // Style
    tone: string;
    engagementTips: string[];
    
    // Prompts
    systemPrompt: string;
    generationPromptTemplate: string;
}

// ============================================================================
// TEMPLATE 1: WEEKLY NEWSLETTER
// ============================================================================

export const WEEKLY_NEWSLETTER: NewsletterTemplate = {
    id: 'weekly_newsletter',
    name: 'Weekly Newsletter',
    description: 'Weekly roundup of articles and insights',
    newsletterType: 'weekly',
    useCases: ['Weekly content roundup', 'Regular engagement', 'Content promotion'],
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            required: true,
            elements: ['Newsletter title', 'Date', 'Branding', 'Personalized greeting']
        },
        {
            id: 'introduction',
            name: 'Introduction',
            required: true,
            maxLength: 150,
            elements: ['Welcome message', 'Week summary', 'What\'s inside']
        },
        {
            id: 'featured_articles',
            name: 'Featured Articles',
            required: true,
            elements: ['Article titles', 'Summaries', 'Links', 'Categories']
        },
        {
            id: 'quick_tips',
            name: 'Quick Tips',
            required: false,
            maxLength: 200,
            elements: ['Financial tips', 'Actionable advice', 'Quick wins']
        },
        {
            id: 'trending_topics',
            name: 'Trending Topics',
            required: false,
            maxLength: 150,
            elements: ['Current trends', 'Market updates', 'Reader interests']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 100,
            elements: ['Engagement prompt', 'Link to content', 'Social media links']
        },
        {
            id: 'footer',
            name: 'Footer',
            required: true,
            elements: ['Unsubscribe link', 'Contact info', 'Social links', 'Branding']
        }
    ],
    
    minArticles: 3,
    maxArticles: 5,
    
    requiredElements: [
        'Personalized greeting',
        'Week summary',
        '3-5 featured articles',
        'Article summaries',
        'Clear CTA',
        'Professional footer'
    ],
    
    tone: 'Conversational, engaging, friendly',
    
    engagementTips: [
        'Personalize greeting',
        'Highlight top articles',
        'Include quick tips',
        'Ask for feedback',
        'Include social media links',
        'Make it scannable'
    ],
    
    systemPrompt: `You are an expert email marketer creating engaging weekly newsletters for financial content. Your newsletters are valuable, scannable, and drive engagement.`,
    
    generationPromptTemplate: `Create a weekly newsletter with {articleCount} featured articles.

Articles:
{articles}

Requirements:
- Conversational tone
- Personalized greeting
- Week summary
- Article summaries (2-3 sentences each)
- Quick tips section
- Clear CTA
- Professional footer

Make it engaging and valuable.`
};

// ============================================================================
// TEMPLATE 2: MONTHLY NEWSLETTER
// ============================================================================

export const MONTHLY_NEWSLETTER: NewsletterTemplate = {
    id: 'monthly_newsletter',
    name: 'Monthly Newsletter',
    description: 'Monthly comprehensive digest',
    newsletterType: 'monthly',
    useCases: ['Monthly summary', 'Comprehensive digest', 'Performance report'],
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            required: true,
            elements: ['Newsletter title', 'Month/Year', 'Branding', 'Personalized greeting']
        },
        {
            id: 'introduction',
            name: 'Introduction',
            required: true,
            maxLength: 200,
            elements: ['Month summary', 'Highlights', 'What\'s inside']
        },
        {
            id: 'monthly_highlights',
            name: 'Monthly Highlights',
            required: true,
            maxLength: 300,
            elements: ['Top content', 'Key achievements', 'Notable insights']
        },
        {
            id: 'featured_articles',
            name: 'Featured Articles',
            required: true,
            elements: ['Article titles', 'Summaries', 'Links', 'Categories', 'Performance metrics']
        },
        {
            id: 'statistics',
            name: 'Statistics',
            required: true,
            maxLength: 200,
            elements: ['Articles published', 'Top performers', 'Engagement metrics', 'Growth numbers']
        },
        {
            id: 'trends',
            name: 'Trends',
            required: true,
            maxLength: 200,
            elements: ['Financial trends', 'Market updates', 'Regulatory changes']
        },
        {
            id: 'upcoming',
            name: 'Upcoming',
            required: false,
            maxLength: 150,
            elements: ['Next month preview', 'Upcoming content', 'Events']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 100,
            elements: ['Engagement prompt', 'Content library link', 'Feedback request']
        },
        {
            id: 'footer',
            name: 'Footer',
            required: true,
            elements: ['Unsubscribe link', 'Contact info', 'Social links', 'Branding']
        }
    ],
    
    minArticles: 5,
    maxArticles: 8,
    
    requiredElements: [
        'Month summary',
        'Monthly highlights',
        '5-8 featured articles',
        'Statistics section',
        'Trends section',
        'Clear CTA',
        'Professional footer'
    ],
    
    tone: 'Professional, comprehensive, authoritative',
    
    engagementTips: [
        'Highlight monthly achievements',
        'Include statistics',
        'Show trends',
        'Preview upcoming content',
        'Ask for feedback',
        'Make it comprehensive'
    ],
    
    systemPrompt: `You are an expert email marketer creating comprehensive monthly newsletters for financial content. Your newsletters are professional, data-driven, and establish authority.`,
    
    generationPromptTemplate: `Create a monthly newsletter with {articleCount} featured articles.

Articles:
{articles}

Monthly Statistics:
{statistics}

Requirements:
- Professional tone
- Month summary
- Monthly highlights
- Article summaries
- Statistics section
- Trends section
- Clear CTA
- Professional footer

Make it comprehensive and authoritative.`
};

// ============================================================================
// TEMPLATE 3: PROMOTIONAL NEWSLETTER
// ============================================================================

export const PROMOTIONAL_NEWSLETTER: NewsletterTemplate = {
    id: 'promotional_newsletter',
    name: 'Promotional Newsletter',
    description: 'Promote specific content or offers',
    newsletterType: 'promotional',
    useCases: ['Content promotion', 'Special offers', 'Campaign launch'],
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            required: true,
            elements: ['Campaign title', 'Branding', 'Personalized greeting']
        },
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            maxLength: 100,
            elements: ['Attention-grabbing opening', 'Value proposition', 'Urgency']
        },
        {
            id: 'main_offer',
            name: 'Main Offer',
            required: true,
            maxLength: 300,
            elements: ['Offer details', 'Benefits', 'Value proposition', 'Visual emphasis']
        },
        {
            id: 'benefits',
            name: 'Benefits',
            required: true,
            maxLength: 200,
            elements: ['Key benefits', 'Bullet points', 'Value points']
        },
        {
            id: 'social_proof',
            name: 'Social Proof',
            required: false,
            maxLength: 150,
            elements: ['Testimonials', 'Statistics', 'User count', 'Success stories']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 50,
            elements: ['Primary CTA button', 'Urgency', 'Clear action']
        },
        {
            id: 'footer',
            name: 'Footer',
            required: true,
            elements: ['Unsubscribe link', 'Contact info', 'Social links', 'Branding']
        }
    ],
    
    minArticles: 1,
    maxArticles: 3,
    
    requiredElements: [
        'Strong hook',
        'Clear value proposition',
        'Benefits list',
        'Prominent CTA',
        'Urgency elements',
        'Professional footer'
    ],
    
    tone: 'Engaging, persuasive, action-oriented',
    
    engagementTips: [
        'Create urgency',
        'Highlight benefits',
        'Use social proof',
        'Clear CTA',
        'Visual emphasis',
        'Mobile-optimized'
    ],
    
    systemPrompt: `You are an expert email marketer creating persuasive promotional newsletters for financial content. Your newsletters are engaging, action-oriented, and drive conversions.`,
    
    generationPromptTemplate: `Create a promotional newsletter promoting: {offerTitle}

Offer Details:
{offerDetails}

Benefits:
{benefits}

Requirements:
- Engaging hook
- Clear value proposition
- Benefits list
- Social proof (if available)
- Prominent CTA
- Urgency elements
- Professional footer

Make it persuasive and action-oriented.`
};

// ============================================================================
// TEMPLATE 4: CONTENT DIGEST
// ============================================================================

export const CONTENT_DIGEST: NewsletterTemplate = {
    id: 'content_digest',
    name: 'Content Digest',
    description: 'Quick digest of recent content',
    newsletterType: 'digest',
    useCases: ['Quick content roundup', 'Daily digest', 'Content discovery'],
    
    sections: [
        {
            id: 'header',
            name: 'Header',
            required: true,
            elements: ['Digest title', 'Date', 'Branding']
        },
        {
            id: 'introduction',
            name: 'Introduction',
            required: true,
            maxLength: 100,
            elements: ['Brief welcome', 'Content overview']
        },
        {
            id: 'article_list',
            name: 'Article List',
            required: true,
            elements: ['Article titles', 'Brief summaries', 'Links', 'Categories', 'Read time']
        },
        {
            id: 'quick_reads',
            name: 'Quick Reads',
            required: false,
            maxLength: 150,
            elements: ['Short articles', 'Quick tips', 'Brief insights']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 50,
            elements: ['Read more link', 'Content library', 'Engagement prompt']
        },
        {
            id: 'footer',
            name: 'Footer',
            required: true,
            elements: ['Unsubscribe link', 'Contact info', 'Social links']
        }
    ],
    
    minArticles: 5,
    maxArticles: 10,
    
    requiredElements: [
        'Brief introduction',
        'Article list with summaries',
        'Quick reads section',
        'Clear CTA',
        'Simple footer'
    ],
    
    tone: 'Friendly, concise, scannable',
    
    engagementTips: [
        'Keep it brief',
        'Make it scannable',
        'Include read times',
        'Clear article links',
        'Quick reads section',
        'Simple CTA'
    ],
    
    systemPrompt: `You are an expert email marketer creating concise content digests for financial content. Your digests are scannable, valuable, and help readers discover content quickly.`,
    
    generationPromptTemplate: `Create a content digest with {articleCount} articles.

Articles:
{articles}

Requirements:
- Brief introduction
- Article list with summaries
- Include read times
- Quick reads section
- Clear CTA
- Simple footer

Make it scannable and concise.`
};

// ============================================================================
// TEMPLATE SELECTOR
// ============================================================================

export function selectNewsletterTemplate(newsletterType: string): NewsletterTemplate {
    const templates: Record<string, NewsletterTemplate> = {
        'weekly': WEEKLY_NEWSLETTER,
        'monthly': MONTHLY_NEWSLETTER,
        'promotional': PROMOTIONAL_NEWSLETTER,
        'digest': CONTENT_DIGEST
    };
    
    return templates[newsletterType] || WEEKLY_NEWSLETTER;
}

export function getAllNewsletterTemplates(): NewsletterTemplate[] {
    return [
        WEEKLY_NEWSLETTER,
        MONTHLY_NEWSLETTER,
        PROMOTIONAL_NEWSLETTER,
        CONTENT_DIGEST
    ];
}
