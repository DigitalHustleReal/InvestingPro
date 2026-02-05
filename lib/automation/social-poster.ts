/**
 * Social Media Posting Automation
 * Auto-posts articles to Twitter, LinkedIn, etc.
 * 
 * FREE TIER OPTIONS:
 * - RSS Feed: Generate RSS feed, use free services (IFTTT, Zapier free tier) to post
 * - Twitter: Twitter API v2 free tier (1,500 tweets/month) - requires API keys
 * - LinkedIn: No free API, requires OAuth - use RSS or manual posting
 * 
 * CURRENT: Generates posts, stores them for manual posting or RSS distribution
 */

import { logger } from '@/lib/logger';

// NOTE: Supabase client removed - not used in this file

export interface SocialPostParams {
    articleId: string;
    title: string;
    excerpt: string;
    url: string;
    category: string;
}

export interface SocialPostResult {
    twitter: boolean;
    linkedin: boolean;
    success: boolean;
    error?: string;
}

/**
 * Post article to social media platforms
 */
export async function postToSocialMedia(params: SocialPostParams): Promise<SocialPostResult> {
    try {
        // Generate social media posts
        const twitterPost = generateTwitterPost(params);
        const linkedinPost = generateLinkedInPost(params);

        // TODO: Integrate with Twitter API (Twitter API v2) and LinkedIn API
        // For now, log the posts and return success (actual posting will be implemented later)
        
        logger.info('Social media posts generated', {
            articleId: params.articleId,
            twitterLength: twitterPost.length,
            linkedinLength: linkedinPost.length
        });

        // TODO: Implement actual posting
        // const twitterResult = await postToTwitter(twitterPost);
        // const linkedinResult = await postToLinkedIn(linkedinPost);

        // For now, return success (actual posting disabled until API keys are configured)
        return {
            twitter: false, // Set to true when Twitter API is configured
            linkedin: false, // Set to true when LinkedIn API is configured
            success: false,
            error: 'Social media APIs not yet configured. Posts generated but not sent.'
        };

    } catch (error: any) {
        logger.error('Error posting to social media', error, { articleId: params.articleId });
        return {
            twitter: false,
            linkedin: false,
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate Twitter post (280 chars max)
 */
function generateTwitterPost(params: SocialPostParams): string {
    const { title, excerpt, url, category } = params;
    
    // Create concise post
    const categoryEmoji: Record<string, string> = {
        'credit-cards': '💳',
        'mutual-funds': '📈',
        'insurance': '🛡️',
        'loans': '💰'
    };

    const emoji = categoryEmoji[category] || '📝';
    const maxLength = 280 - url.length - 30; // Reserve space for URL and padding

    let post = `${emoji} ${title}\n\n`;
    
    if (excerpt) {
        const truncatedExcerpt = excerpt.substring(0, maxLength - post.length - 10);
        post += `${truncatedExcerpt}...\n\n`;
    }
    
    post += `${url}`;
    
    // Ensure post is within limit
    if (post.length > 280) {
        post = post.substring(0, 277) + '...';
    }

    return post;
}

/**
 * Generate LinkedIn post (3000 chars max)
 */
function generateLinkedInPost(params: SocialPostParams): string {
    const { title, excerpt, url, category } = params;
    
    const categoryHashtags: Record<string, string[]> = {
        'credit-cards': ['#CreditCards', '#PersonalFinance', '#FinanceTips'],
        'mutual-funds': ['#MutualFunds', '#Investing', '#SIP'],
        'insurance': ['#Insurance', '#FinancialPlanning'],
        'loans': ['#Loans', '#PersonalFinance']
    };

    const hashtags = categoryHashtags[category] || ['#Finance', '#Investing'];
    
    let post = `${title}\n\n`;
    
    if (excerpt) {
        post += `${excerpt}\n\n`;
    }
    
    post += `Read the full article: ${url}\n\n`;
    post += hashtags.join(' ');
    
    return post;
}

/**
 * Post to Twitter using Twitter API v2 free tier
 * 
 * FREE TIER LIMITS:
 * - 1,500 tweets per month
 * - Read: 10,000 tweets per month
 * 
 * Requires:
 * - TWITTER_BEARER_TOKEN (for OAuth 2.0)
 * OR
 * - TWITTER_API_KEY + TWITTER_API_SECRET + TWITTER_ACCESS_TOKEN + TWITTER_ACCESS_SECRET (for OAuth 1.0a)
 */
async function postToTwitter(post: string): Promise<boolean> {
    try {
        // Check if Twitter API is configured
        const bearerToken = process.env.TWITTER_BEARER_TOKEN;
        
        if (!bearerToken) {
            logger.debug('Twitter Bearer Token not configured, skipping Twitter API posting');
            return false;
        }

        // Twitter API v2 endpoint
        const response = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: post
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Twitter API error: ${JSON.stringify(error)}`);
        }

        const result = await response.json();
        logger.info('Tweet posted successfully', { tweetId: result.data?.id });
        return true;

    } catch (error: any) {
        logger.error('Failed to post to Twitter', error);
        // Don't throw - allow fallback to manual posting
        return false;
    }
}

/**
 * Post to LinkedIn (TODO: Implement with LinkedIn API)
 */
async function postToLinkedIn(post: string): Promise<boolean> {
    // TODO: Implement LinkedIn API integration
    // const linkedinApi = new LinkedInApi({
    //     clientId: process.env.LINKEDIN_CLIENT_ID,
    //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    //     accessToken: process.env.LINKEDIN_ACCESS_TOKEN
    // });
    // await linkedinApi.post(post);
    return false;
}
