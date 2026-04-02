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
    emailNewsletter?: string;
    youtubeScript?: string;
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

        // Generate email newsletter format
        const emailNewsletter = generateEmailNewsletter(title, excerpt, content, url, category);

        // Generate YouTube script
        const youtubeScript = generateYouTubeScript(title, content, category);

        return {
            twitterThread,
            linkedinPost,
            instagramCaption,
            twitterPost,
            emailNewsletter,
            youtubeScript
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

/**
 * Generate email newsletter format
 */
function generateEmailNewsletter(
    title: string,
    excerpt: string,
    content: string,
    url: string,
    category: string
): string {
    const categoryLabels: Record<string, string> = {
        'credit-cards': 'Credit Cards',
        'mutual-funds': 'Mutual Funds',
        'insurance': 'Insurance',
        'loans': 'Loans',
        'tax-planning': 'Tax Planning',
        'retirement': 'Retirement Planning',
        'investing-basics': 'Investing Basics',
        'stocks': 'Stock Market'
    };

    const categoryLabel = categoryLabels[category] || 'Finance';

    // Extract key points for email
    const keyPoints = extractKeyPoints(content).slice(0, 3);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">${title}</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${categoryLabel}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        ${excerpt ? `<p style="color: #64748b; font-size: 16px; margin-bottom: 20px;">${excerpt}</p>` : ''}
        
        ${keyPoints.length > 0 ? `
        <h3 style="color: #0f172a; margin-top: 30px;">Key Takeaways:</h3>
        <ul style="color: #64748b; padding-left: 20px;">
            ${keyPoints.map(point => `<li style="margin-bottom: 10px;">${point}</li>`).join('')}
        </ul>
        ` : ''}
        
        <div style="margin: 30px 0;">
            <a href="${url}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Read Full Article →
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            You're receiving this because you subscribed to InvestingPro newsletter.<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/unsubscribe" style="color: #0d9488;">Unsubscribe</a>
        </p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Generate YouTube script
 */
function generateYouTubeScript(
    title: string,
    content: string,
    category: string
): string {
    // Extract key sections from content
    const sections = content.split(/\n\n+/).filter(s => s.trim().length > 50);
    const intro = sections[0] || '';
    const mainPoints = sections.slice(1, 5) || [];
    const conclusion = sections[sections.length - 1] || '';

    let script = `# ${title}\n\n`;
    script += `## Introduction (0:00 - 0:30)\n\n`;
    script += `${intro.substring(0, 300)}...\n\n`;
    script += `## Main Content (0:30 - 5:00)\n\n`;

    mainPoints.forEach((point, index) => {
        script += `### Point ${index + 1}\n`;
        script += `${point.substring(0, 200)}...\n\n`;
    });

    script += `## Conclusion (5:00 - 5:30)\n\n`;
    script += `${conclusion.substring(0, 200)}...\n\n`;
    script += `## Call to Action\n\n`;
    script += `Visit InvestingPro.in for more financial insights and comparisons.\n`;
    script += `Don't forget to like, subscribe, and hit the bell icon for notifications!\n`;

    return script;
}
