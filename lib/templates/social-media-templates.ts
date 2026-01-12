/**
 * 📱 SOCIAL MEDIA TEMPLATES LIBRARY
 * 
 * Structured templates for consistent, high-quality social media content
 * across different platforms and content types.
 */

export interface SocialMediaSection {
    id: string;
    name: string;
    required: boolean;
    maxLength?: number;
    elements: string[];
}

export interface SocialMediaTemplate {
    id: string;
    name: string;
    description: string;
    platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
    contentType: 'post' | 'thread' | 'carousel' | 'story';
    useCases: string[];
    
    // Structure
    sections: SocialMediaSection[];
    
    // Requirements
    characterLimit: number;
    optimalLength: number;
    hashtagLimit: number;
    requiredElements: string[];
    
    // Style
    tone: string;
    engagementTips: string[];
    
    // Prompts
    systemPrompt: string;
    generationPromptTemplate: string;
}

// ============================================================================
// TEMPLATE 1: TWITTER POST
// ============================================================================

export const TWITTER_POST: SocialMediaTemplate = {
    id: 'twitter_post',
    name: 'Twitter/X Post',
    description: 'Single tweet optimized for engagement',
    platform: 'twitter',
    contentType: 'post',
    useCases: ['Article promotion', 'Quick tip', 'Statistic share', 'Question'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            maxLength: 50,
            elements: ['Attention-grabbing opening', 'Question', 'Statistic', 'Bold statement']
        },
        {
            id: 'content',
            name: 'Content',
            required: true,
            maxLength: 200,
            elements: ['Key point', 'Value proposition', 'Insight', 'Tip']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: false,
            maxLength: 30,
            elements: ['Link', 'Question', 'Engagement prompt']
        }
    ],
    
    characterLimit: 280,
    optimalLength: 240,
    hashtagLimit: 3,
    
    requiredElements: [
        'Hook in first line',
        'Clear value proposition',
        'Engagement element (question or statistic)',
        'Hashtags (max 3)',
        'Line breaks for readability'
    ],
    
    tone: 'Conversational, engaging, concise',
    
    engagementTips: [
        'Use questions to drive engagement',
        'Include numbers/statistics',
        'Add emojis sparingly',
        'Use line breaks',
        'Ask for retweets/shares'
    ],
    
    systemPrompt: `You are a social media expert creating engaging Twitter/X posts for financial content. Your posts are concise, valuable, and drive engagement.`,
    
    generationPromptTemplate: `Create a Twitter/X post based on: "{articleTitle}"

Key points: {keyPoints}
Statistics: {statistics}

Requirements:
- Max 280 characters (optimal: 240)
- Hook in first line
- Clear value proposition
- Include engagement element
- Use line breaks
- Max 3 hashtags: {hashtags}
- CTA: {cta}

Make it engaging and shareable.`
};

// ============================================================================
// TEMPLATE 2: TWITTER THREAD
// ============================================================================

export const TWITTER_THREAD: SocialMediaTemplate = {
    id: 'twitter_thread',
    name: 'Twitter/X Thread',
    description: 'Multi-tweet thread for detailed content',
    platform: 'twitter',
    contentType: 'thread',
    useCases: ['Article summary', 'How-to guide', 'Listicle', 'Educational content'],
    
    sections: [
        {
            id: 'tweet_1',
            name: 'Tweet 1 - Hook',
            required: true,
            maxLength: 250,
            elements: ['Hook', 'Topic introduction', 'Thread preview']
        },
        {
            id: 'tweet_2_n',
            name: 'Tweets 2-N - Content',
            required: true,
            maxLength: 250,
            elements: ['Key points', 'One point per tweet', 'Numbering (2/5, 3/5)']
        },
        {
            id: 'final_tweet',
            name: 'Final Tweet',
            required: true,
            maxLength: 250,
            elements: ['Summary', 'CTA', 'Hashtags', 'Link']
        }
    ],
    
    characterLimit: 280,
    optimalLength: 240,
    hashtagLimit: 3,
    
    requiredElements: [
        'Hook in first tweet',
        'Numbered tweets (1/5, 2/5, etc.)',
        'One key point per tweet',
        'Summary in final tweet',
        'Hashtags in final tweet',
        'CTA in final tweet'
    ],
    
    tone: 'Educational, engaging, conversational',
    
    engagementTips: [
        'Start with strong hook',
        'Number all tweets',
        'One idea per tweet',
        'Use questions',
        'Include statistics',
        'End with clear CTA'
    ],
    
    systemPrompt: `You are a social media expert creating engaging Twitter/X threads for financial content. Your threads are educational, well-structured, and drive engagement.`,
    
    generationPromptTemplate: `Create a Twitter/X thread ({tweetCount} tweets) based on: "{articleTitle}"

Key points: {keyPoints}
Statistics: {statistics}

Structure:
- Tweet 1: Hook + topic introduction
- Tweets 2-{tweetCount - 1}: One key point per tweet
- Final tweet: Summary + CTA + hashtags

Requirements:
- Max 280 chars per tweet
- Number tweets (1/{tweetCount}, 2/{tweetCount}, etc.)
- One idea per tweet
- Use line breaks
- Max 3 hashtags: {hashtags}
- CTA: {cta}

Make it educational and engaging.`
};

// ============================================================================
// TEMPLATE 3: LINKEDIN POST
// ============================================================================

export const LINKEDIN_POST: SocialMediaTemplate = {
    id: 'linkedin_post',
    name: 'LinkedIn Post',
    description: 'Professional post optimized for LinkedIn',
    platform: 'linkedin',
    contentType: 'post',
    useCases: ['Professional insights', 'Industry news', 'Thought leadership', 'Article promotion'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            maxLength: 100,
            elements: ['Attention-grabbing opening', 'Question', 'Insight', 'Bold statement']
        },
        {
            id: 'content',
            name: 'Content',
            required: true,
            maxLength: 1200,
            elements: ['Key insights', 'Professional perspective', 'Data/statistics', 'Personal experience']
        },
        {
            id: 'bullets',
            name: 'Key Points',
            required: true,
            maxLength: 500,
            elements: ['Bullet points', 'Key takeaways', 'Actionable insights']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 100,
            elements: ['Question', 'Engagement prompt', 'Link to article']
        }
    ],
    
    characterLimit: 3000,
    optimalLength: 1500,
    hashtagLimit: 5,
    
    requiredElements: [
        'Professional hook',
        'Clear insights',
        'Bullet points for key takeaways',
        'Statistics/data',
        'Engagement question',
        'Hashtags (3-5)',
        'Line breaks for readability'
    ],
    
    tone: 'Professional, insightful, authoritative',
    
    engagementTips: [
        'Share professional insights',
        'Use bullet points',
        'Include statistics',
        'Ask engaging questions',
        'Share personal experience',
        'Use professional hashtags'
    ],
    
    systemPrompt: `You are a thought leader creating professional LinkedIn posts for financial content. Your posts are insightful, authoritative, and drive professional engagement.`,
    
    generationPromptTemplate: `Create a LinkedIn post based on: "{articleTitle}"

Key insights: {keyPoints}
Statistics: {statistics}

Requirements:
- Professional tone
- Clear hook
- Bullet points for key takeaways
- Include statistics
- Ask engaging question
- Use 3-5 hashtags: {hashtags}
- CTA: {cta}
- Optimal length: 1500 characters

Make it professional and insightful.`
};

// ============================================================================
// TEMPLATE 4: FACEBOOK POST
// ============================================================================

export const FACEBOOK_POST: SocialMediaTemplate = {
    id: 'facebook_post',
    name: 'Facebook Post',
    description: 'Engaging post optimized for Facebook',
    platform: 'facebook',
    contentType: 'post',
    useCases: ['Article promotion', 'Community engagement', 'Question', 'Tip sharing'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            maxLength: 100,
            elements: ['Attention-grabbing opening', 'Question', 'Personal story', 'Bold statement']
        },
        {
            id: 'content',
            name: 'Content',
            required: true,
            maxLength: 1500,
            elements: ['Main message', 'Value proposition', 'Tips/insights', 'Personal touch']
        },
        {
            id: 'question',
            name: 'Engagement Question',
            required: true,
            maxLength: 100,
            elements: ['Question to drive comments', 'Opinion poll', 'Experience sharing']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 50,
            elements: ['Link to article', 'Comment prompt', 'Share request']
        }
    ],
    
    characterLimit: 5000,
    optimalLength: 2000,
    hashtagLimit: 3,
    
    requiredElements: [
        'Engaging hook',
        'Conversational tone',
        'Value proposition',
        'Engagement question',
        'Link to article',
        'Hashtags (2-3)',
        'Line breaks'
    ],
    
    tone: 'Conversational, friendly, engaging',
    
    engagementTips: [
        'Ask questions',
        'Use conversational language',
        'Share personal insights',
        'Include links',
        'Use emojis',
        'Request comments/shares'
    ],
    
    systemPrompt: `You are a social media expert creating engaging Facebook posts for financial content. Your posts are conversational, valuable, and drive community engagement.`,
    
    generationPromptTemplate: `Create a Facebook post based on: "{articleTitle}"

Key points: {keyPoints}
Statistics: {statistics}

Requirements:
- Conversational tone
- Engaging hook
- Clear value proposition
- Ask engaging question
- Include link to article
- Use 2-3 hashtags: {hashtags}
- CTA: {cta}
- Optimal length: 2000 characters

Make it conversational and engaging.`
};

// ============================================================================
// TEMPLATE 5: INSTAGRAM POST
// ============================================================================

export const INSTAGRAM_POST: SocialMediaTemplate = {
    id: 'instagram_post',
    name: 'Instagram Post',
    description: 'Visual-first post optimized for Instagram',
    platform: 'instagram',
    contentType: 'post',
    useCases: ['Visual content', 'Quote card', 'Tip sharing', 'Story promotion'],
    
    sections: [
        {
            id: 'caption',
            name: 'Caption',
            required: true,
            maxLength: 150,
            elements: ['Hook', 'Main message', 'Value proposition']
        },
        {
            id: 'bullets',
            name: 'Key Points',
            required: true,
            maxLength: 500,
            elements: ['Bullet points', 'Tips', 'Key takeaways']
        },
        {
            id: 'hashtags',
            name: 'Hashtags',
            required: true,
            maxLength: 500,
            elements: ['Niche hashtags', 'Trending hashtags', 'Branded hashtags']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            maxLength: 50,
            elements: ['Link in bio', 'Comment prompt', 'Save/share request']
        }
    ],
    
    characterLimit: 2200,
    optimalLength: 150,
    hashtagLimit: 30,
    
    requiredElements: [
        'Short, engaging caption',
        'Bullet points for key points',
        'Emojis strategically',
        'Line breaks',
        'Hashtags (10-30)',
        'CTA',
        'Link in bio mention'
    ],
    
    tone: 'Visual-first, engaging, emoji-friendly',
    
    engagementTips: [
        'Keep caption short (150 chars)',
        'Use emojis',
        'Include line breaks',
        'Use many hashtags (10-30)',
        'Ask for saves/shares',
        'Mention link in bio'
    ],
    
    systemPrompt: `You are a social media expert creating engaging Instagram posts for financial content. Your posts are visual-first, concise, and drive engagement.`,
    
    generationPromptTemplate: `Create an Instagram post caption based on: "{articleTitle}"

Key points: {keyPoints}
Statistics: {statistics}

Requirements:
- Short caption (150 chars optimal)
- Use emojis strategically
- Include line breaks
- Bullet points for key points
- Use 10-30 hashtags: {hashtags}
- CTA: {cta}
- Mention "Link in bio"

Make it visual-first and engaging.`
};

// ============================================================================
// TEMPLATE SELECTOR
// ============================================================================

export function selectSocialMediaTemplate(
    platform: string,
    contentType: string = 'post'
): SocialMediaTemplate {
    const templates: Record<string, SocialMediaTemplate> = {
        'twitter_post': TWITTER_POST,
        'twitter_thread': TWITTER_THREAD,
        'linkedin_post': LINKEDIN_POST,
        'facebook_post': FACEBOOK_POST,
        'instagram_post': INSTAGRAM_POST
    };
    
    const key = `${platform}_${contentType}`;
    return templates[key] || TWITTER_POST;
}

export function getAllSocialMediaTemplates(): SocialMediaTemplate[] {
    return [
        TWITTER_POST,
        TWITTER_THREAD,
        LINKEDIN_POST,
        FACEBOOK_POST,
        INSTAGRAM_POST
    ];
}
