/**
 * Content Distribution Automation
 * Automatically distributes new articles to social media and email
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { postToSocialMedia } from './social-poster';
import { sendNewArticleEmail } from './email-sender';
import { sendMessagingNotification } from './messaging-notifier';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Supabase environment variables not configured');
        }
        supabaseClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    }
    return supabaseClient;
}

export interface ContentDistributionResult {
    articleId: string;
    articleTitle: string;
    socialMedia: {
        twitter: boolean;
        linkedin: boolean;
        success: boolean;
        error?: string;
    };
    email: {
        sent: boolean;
        subscribers: number;
        error?: string;
    };
    messaging: {
        telegram: {
            sent: boolean;
            successCount: number;
            failedCount: number;
            errors?: string[];
        };
        whatsapp: {
            sent: boolean;
            successCount: number;
            failedCount: number;
            errors?: string[];
        };
    };
}

/**
 * Distribute a newly published article to all channels
 */
export async function distributeContent(articleId: string): Promise<ContentDistributionResult> {
    try {
        // Get article details
        const { data: article, error: articleError } = await getSupabaseClient()
            .from('articles')
            .select('id, title, slug, excerpt, category, published_date')
            .eq('id', articleId)
            .single();

        if (articleError || !article) {
            throw new Error(`Article not found: ${articleId}`);
        }

        const articleUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in'}/article/${article.slug}`;

        // 1. Post to social media
        let socialMediaResult = {
            twitter: false,
            linkedin: false,
            success: false,
            error: undefined as string | undefined
        };

        try {
            const socialResult = await postToSocialMedia({
                articleId,
                title: article.title,
                excerpt: article.excerpt || '',
                url: articleUrl,
                category: article.category
            });

            socialMediaResult = {
                twitter: socialResult.twitter,
                linkedin: socialResult.linkedin,
                success: socialResult.twitter || socialResult.linkedin,
                error: socialResult.error
            };
        } catch (error: any) {
            logger.error('Error posting to social media', error, { articleId });
            socialMediaResult.error = error.message;
        }

        // 2. Send email to newsletter subscribers
        let emailResult = {
            sent: false,
            subscribers: 0,
            error: undefined as string | undefined
        };

        try {
            const emailSendResult = await sendNewArticleEmail({
                articleId,
                title: article.title,
                excerpt: article.excerpt || '',
                url: articleUrl,
                category: article.category
            });

            emailResult = {
                sent: emailSendResult.sent,
                subscribers: emailSendResult.subscribers,
                error: emailSendResult.error
            };
        } catch (error: any) {
            logger.error('Error sending newsletter email', error, { articleId });
            emailResult.error = error.message;
        }

        // 3. Send to Telegram/WhatsApp channels
        let messagingResult = {
            telegram: { sent: false, successCount: 0, failedCount: 0, errors: [] as string[] },
            whatsapp: { sent: false, successCount: 0, failedCount: 0, errors: [] as string[] }
        };

        try {
            const message = formatArticlePostMessage({
                title: article.title,
                excerpt: article.excerpt || '',
                url: articleUrl,
                category: article.category
            });

            const telegramChatIds = process.env.TELEGRAM_CONTENT_CHANNELS
                ? process.env.TELEGRAM_CONTENT_CHANNELS.split(',').map(id => id.trim()).filter(Boolean)
                : [];

            const whatsappNumbers = process.env.WHATSAPP_CONTENT_CHANNELS
                ? process.env.WHATSAPP_CONTENT_CHANNELS.split(',').map(num => num.trim()).filter(Boolean)
                : [];

            if (telegramChatIds.length > 0 || whatsappNumbers.length > 0) {
                const messagingSendResult = await sendMessagingNotification({
                    message,
                    recipients: {
                        telegram: telegramChatIds.length > 0 ? telegramChatIds : undefined,
                        whatsapp: whatsappNumbers.length > 0 ? whatsappNumbers : undefined
                    }
                });

                messagingResult = messagingSendResult;
            }
        } catch (error: any) {
            logger.error('Error sending messaging notification', error, { articleId });
            messagingResult.telegram.errors.push(error.message);
            messagingResult.whatsapp.errors.push(error.message);
        }

        // 4. Log distribution in database (optional - track distribution history)
        try {
            await getSupabaseClient()
                .from('articles')
                .update({
                    updated_at: new Date().toISOString()
                    // Could add distributed_at field to track when distributed
                })
                .eq('id', articleId);
        } catch (error) {
            // Non-critical, continue
            logger.warn('Failed to update article distribution timestamp', error);
        }

        return {
            articleId,
            articleTitle: article.title,
            socialMedia: socialMediaResult,
            email: emailResult,
            messaging: messagingResult
        };

    } catch (error: any) {
        logger.error('Error distributing content', error, { articleId });
        throw error;
    }
}

/**
 * Format article post message for Telegram/WhatsApp
 */
function formatArticlePostMessage(params: {
    title: string;
    excerpt: string;
    url: string;
    category: string;
}): string {
    const { title, excerpt, url, category } = params;

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

    let message = `${emoji} *${title}*\n\n`;
    
    if (excerpt) {
        // Truncate excerpt to fit in message (max ~400 chars for WhatsApp)
        const maxExcerptLength = 250;
        const truncatedExcerpt = excerpt.length > maxExcerptLength 
            ? excerpt.substring(0, maxExcerptLength) + '...'
            : excerpt;
        message += `${truncatedExcerpt}\n\n`;
    }
    
    message += `🔗 Read more: ${url}\n\n`;
    message += `_Published by InvestingPro.in_`;

    return message;
}

/**
 * Distribute all newly published articles (called by cron job)
 */
export async function distributeNewArticles(): Promise<{
    distributed: number;
    failed: number;
    results: ContentDistributionResult[];
}> {
    try {
        // Get articles published in last 24 hours that haven't been distributed
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: newArticles, error } = await getSupabaseClient()
            .from('articles')
            .select('id')
            .eq('status', 'published')
            .gte('published_date', yesterday.toISOString())
            // TODO: Add distributed_at field to filter out already distributed articles
            .order('published_date', { ascending: false })
            .limit(10); // Max 10 articles per run

        if (error) {
            throw error;
        }

        if (!newArticles || newArticles.length === 0) {
            return {
                distributed: 0,
                failed: 0,
                results: []
            };
        }

        const results: ContentDistributionResult[] = [];
        let distributed = 0;
        let failed = 0;

        for (const article of newArticles) {
            try {
                const result = await distributeContent(article.id);
                results.push(result);
                if (result.socialMedia.success || result.email.sent) {
                    distributed++;
                } else {
                    failed++;
                }
            } catch (error: any) {
                logger.error('Failed to distribute article', error, { articleId: article.id });
                failed++;
                results.push({
                    articleId: article.id,
                    articleTitle: 'Unknown',
                    socialMedia: { twitter: false, linkedin: false, success: false, error: error.message },
                    email: { sent: false, subscribers: 0, error: error.message },
                    messaging: {
                        telegram: { sent: false, successCount: 0, failedCount: 0, errors: [error.message] },
                        whatsapp: { sent: false, successCount: 0, failedCount: 0, errors: [error.message] }
                    }
                });
            }
        }

        return {
            distributed,
            failed,
            results
        };

    } catch (error: any) {
        logger.error('Error distributing new articles', error);
        throw error;
    }
}
