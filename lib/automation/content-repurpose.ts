/**
 * Content Repurposing
 * Converts articles into social media formats (Twitter threads, LinkedIn posts, Instagram captions)
 */

import { logger } from '@/lib/logger';

export interface RepurposedContent {
    twitterThread: string[]; // Array of tweets for a thread
    linkedinPost: string;
    instagramCaption: string;
    twitterPost: string; // Single tweet (if article is short)
}

/**
 * Repurpose article into social media formats
 */
export async function repurposeArticle(params: {
    title: string;
    content: string;
    excerpt: string;
    url: string;
    category: string;
}): Promise<RepurposedContent> {
    try {
        const { title, content, excerpt, url, category } = params;

        // Generate Twitter thread (if content is long)
        const twitterThread = generateTwitterThread(title, content, url, category);

        // Generate LinkedIn post
        const linkedinPost = generateLinkedInPost(title, excerpt, content, url, category);

        // Generate Instagram caption
        const instagramCaption = generateInstagramCaption(title, excerpt, url, category);

        // Generate single Twitter post (fallback if thread is too short)
        const twitterPost = generateTwitterPost(title, excerpt, url, category);

        return {
            twitterThread,
            linkedinPost,
            instagramCaption,
            twitterPost
        };

    } catch (error) {
        logger.error('Error repurposing article', error);
        throw error;
    }
}

/**
 * Generate Twitter thread from article
 * Splits content into multiple tweets (280 chars each)
 */
function generateTwitterThread(
    title: string,
    content: string,
    url: string,
    category: string
): string[] {
    const categoryEmoji: Record<string, string> = {
        'credit-cards': '💳',
        'mutual-funds': '📈',
        'insurance': '🛡️',
        'loans': '💰',
        'tax-planning': '📊',
        'retirement': '🎯',
        'investing-basics': '📚',
        'stocks': '📉'
    };

    const emoji = categoryEmoji[category] || '📝';
    const threads: string[] = [];

    // Tweet 1: Title and intro
    const tweet1 = `${emoji} ${title}\n\n🧵 Thread:`;
    threads.push(tweet1);

    // Extract key points from content (simplified - in production, use AI to extract)
    const keyPoints = extractKeyPoints(content);

    // Generate tweets for each key point
    let tweetNumber = 2;
    for (const point of keyPoints) {
        const tweet = `${tweetNumber}/ ${point}`;
        if (tweet.length <= 280) {
            threads.push(tweet);
            tweetNumber++;
        }
    }

    // Final tweet: CTA and URL
    const finalTweet = `${tweetNumber}/ Read the full article: ${url}\n\n#Finance #Investing`;
    threads.push(finalTweet);

    return threads;
}

/**
 * Generate LinkedIn post
 */
function generateLinkedInPost(
    title: string,
    excerpt: string,
    content: string,
    url: string,
    category: string
): string {
    const categoryHashtags: Record<string, string[]> = {
        'credit-cards': ['#CreditCards', '#PersonalFinance', '#FinanceTips', '#India'],
        'mutual-funds': ['#MutualFunds', '#Investing', '#SIP', '#WealthBuilding'],
        'insurance': ['#Insurance', '#FinancialPlanning', '#Protection'],
        'loans': ['#Loans', '#PersonalFinance', '#FinancialFreedom'],
        'tax-planning': ['#TaxPlanning', '#TaxSaving', '#Section80C'],
        'retirement': ['#RetirementPlanning', '#FinancialFreedom', '#FIRE'],
        'investing-basics': ['#Investing', '#FinancialLiteracy', '#WealthBuilding'],
        'stocks': ['#StockMarket', '#Investing', '#Equity']
    };

    const hashtags = categoryHashtags[category] || ['#Finance', '#Investing', '#India'];

    let post = `${title}\n\n`;
    
    if (excerpt) {
        post += `${excerpt}\n\n`;
    }

    // Add key insights (first 2-3 paragraphs)
    const insights = extractKeyInsights(content);
    if (insights) {
        post += `${insights}\n\n`;
    }

    post += `Read the full article: ${url}\n\n`;
    post += hashtags.join(' ');

    return post;
}

/**
 * Generate Instagram caption
 */
function generateInstagramCaption(
    title: string,
    excerpt: string,
    url: string,
    category: string
): string {
    const categoryEmoji: Record<string, string> = {
        'credit-cards': '💳',
        'mutual-funds': '📈',
        'insurance': '🛡️',
        'loans': '💰',
        'tax-planning': '📊',
        'retirement': '🎯',
        'investing-basics': '📚',
        'stocks': '📉'
    };

    const emoji = categoryEmoji[category] || '📝';

    let caption = `${emoji} ${title}\n\n`;
    
    if (excerpt) {
        // Truncate for Instagram (max 2200 chars, but keep it shorter)
        const maxLength = 500;
        const truncatedExcerpt = excerpt.length > maxLength 
            ? excerpt.substring(0, maxLength) + '...'
            : excerpt;
        caption += `${truncatedExcerpt}\n\n`;
    }

    caption += `🔗 Link in bio\n\n`;
    caption += `#Finance #Investing #PersonalFinance #India #WealthBuilding`;

    return caption;
}

/**
 * Generate single Twitter post (fallback)
 */
function generateTwitterPost(
    title: string,
    excerpt: string,
    url: string,
    category: string
): string {
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
 * Extract key points from content (simplified)
 * In production, use AI to extract key points
 */
function extractKeyPoints(content: string): string[] {
    // Simple extraction: split by paragraphs and take first few
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    return paragraphs.slice(0, 5).map(p => {
        // Clean up markdown/html
        let text = p.replace(/[#*_`]/g, '').trim();
        // Limit to 250 chars
        if (text.length > 250) {
            text = text.substring(0, 247) + '...';
        }
        return text;
    });
}

/**
 * Extract key insights (first few paragraphs)
 */
function extractKeyInsights(content: string): string {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const insights = paragraphs.slice(0, 3).join('\n\n');
    
    // Clean up markdown/html
    let text = insights.replace(/[#*_`]/g, '').trim();
    
    // Limit to 1000 chars
    if (text.length > 1000) {
        text = text.substring(0, 997) + '...';
    }
    
    return text;
}
