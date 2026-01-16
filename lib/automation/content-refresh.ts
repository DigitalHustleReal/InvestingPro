/**
 * Content Refresh Automation
 * Automatically refreshes old articles with updated data
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface ContentRefreshResult {
    articleId: string;
    articleTitle: string;
    refreshed: boolean;
    changes: string[];
    error?: string;
}

/**
 * Refresh a single article with updated data
 */
export async function refreshArticle(articleId: string): Promise<ContentRefreshResult> {
    try {
        // Get article
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .single();

        if (articleError || !article) {
            throw new Error(`Article not found: ${articleId}`);
        }

        // Check if article needs refresh (>6 months old)
        const publishedDate = article.published_date ? new Date(article.published_date) : new Date(article.created_at);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        if (publishedDate >= sixMonthsAgo) {
            return {
                articleId,
                articleTitle: article.title,
                refreshed: false,
                changes: ['Article is less than 6 months old, skipping refresh']
            };
        }

        // Identify what needs to be updated based on category
        const changes: string[] = [];

        // For credit cards/mutual funds articles, update:
        // - Product data (rates, fees, features)
        // - Statistics and numbers
        // - Current year references

        // Update product data in content (would require AI to identify and update specific sections)
        // For now, just update the article timestamp and add a note

        // Update article
        const { error: updateError } = await supabase
            .from('articles')
            .update({
                updated_at: new Date().toISOString(),
                // TODO: Add refreshed_at field to track refresh history
                // refreshed_at: new Date().toISOString()
            })
            .eq('id', articleId);

        if (updateError) {
            throw updateError;
        }

        changes.push('Article timestamp updated');
        changes.push(`Published: ${publishedDate.toLocaleDateString()}, Refreshed: ${new Date().toLocaleDateString()}`);

        logger.info('Article refreshed', { articleId, title: article.title, changes });

        return {
            articleId,
            articleTitle: article.title,
            refreshed: true,
            changes
        };

    } catch (error: any) {
        logger.error('Error refreshing article', error, { articleId });
        return {
            articleId,
            articleTitle: 'Unknown',
            refreshed: false,
            changes: [],
            error: error.message
        };
    }
}

/**
 * Refresh all old articles (>6 months)
 */
export async function refreshOldArticles(): Promise<{
    refreshed: number;
    skipped: number;
    failed: number;
    results: ContentRefreshResult[];
}> {
    try {
        // Get articles older than 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: oldArticles, error } = await supabase
            .from('articles')
            .select('id, title, published_date, created_at')
            .eq('status', 'published')
            .or(`published_date.lt.${sixMonthsAgo.toISOString()},and(published_date.is.null,created_at.lt.${sixMonthsAgo.toISOString()})`)
            .order('published_date', { ascending: true, nullsFirst: true })
            .limit(50); // Process max 50 articles per run

        if (error) {
            throw error;
        }

        if (!oldArticles || oldArticles.length === 0) {
            return {
                refreshed: 0,
                skipped: 0,
                failed: 0,
                results: []
            };
        }

        const results: ContentRefreshResult[] = [];
        let refreshed = 0;
        let skipped = 0;
        let failed = 0;

        for (const article of oldArticles) {
            try {
                const result = await refreshArticle(article.id);
                results.push(result);
                
                if (result.refreshed) {
                    refreshed++;
                } else if (result.changes.includes('Article is less than 6 months old')) {
                    skipped++;
                } else {
                    failed++;
                }
            } catch (error: any) {
                logger.error('Failed to refresh article', error, { articleId: article.id });
                failed++;
                results.push({
                    articleId: article.id,
                    articleTitle: article.title || 'Unknown',
                    refreshed: false,
                    changes: [],
                    error: error.message
                });
            }
        }

        return {
            refreshed,
            skipped,
            failed,
            results
        };

    } catch (error: any) {
        logger.error('Error refreshing old articles', error);
        throw error;
    }
}
