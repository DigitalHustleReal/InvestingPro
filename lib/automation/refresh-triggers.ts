/**
 * Auto-Refresh Triggers
 * 
 * Monitors content performance and automatically triggers refresh when:
 * - Rankings drop significantly (> 3 positions)
 * - SERP features change (new featured snippet, PAA, etc.)
 * - Content becomes stale (no updates in X days)
 * - Performance metrics decline
 */

import { logger } from '@/lib/logger';
import { checkRankingDrops, getLatestRanking, type RankingAlert } from '@/lib/analytics/rankings-tracker';
import { articleService } from '@/lib/cms/article-service';
import { serpAnalyzer } from '@/lib/research/serp-analyzer';

export interface RefreshTrigger {
    articleId: string;
    articleSlug: string;
    triggerReason: 'ranking_drop' | 'serp_change' | 'stale_content' | 'performance_decline';
    severity: 'critical' | 'warning' | 'info';
    details: {
        keyword?: string;
        previousPosition?: number;
        currentPosition?: number;
        change?: number;
        message: string;
    };
    triggeredAt: string;
}

export interface RefreshResult {
    articleId: string;
    refreshed: boolean;
    reason?: string;
    newContent?: boolean;
    republished?: boolean;
}

/**
 * Check for articles that need refresh based on ranking drops
 */
export async function checkRankingDropTriggers(
    threshold: number = 3
): Promise<RefreshTrigger[]> {
    try {
        const alerts = await checkRankingDrops(threshold);
        const triggers: RefreshTrigger[] = [];

        // Convert ranking alerts to refresh triggers
        for (const alert of alerts) {
            // Find article by URL/slug
            const article = await findArticleByUrl(alert.url);
            if (!article) {
                logger.warn('Article not found for ranking alert', { url: alert.url, keyword: alert.keyword });
                continue;
            }

            triggers.push({
                articleId: article.id,
                articleSlug: article.slug,
                triggerReason: 'ranking_drop',
                severity: alert.severity,
                details: {
                    keyword: alert.keyword,
                    previousPosition: alert.previousPosition,
                    currentPosition: alert.currentPosition,
                    change: alert.change,
                    message: alert.message
                },
                triggeredAt: new Date().toISOString()
            });
        }

        return triggers;

    } catch (error) {
        logger.error('Failed to check ranking drop triggers', error as Error);
        return [];
    }
}

/**
 * Check for stale content (no updates in X days)
 */
export async function checkStaleContentTriggers(
    daysThreshold: number = 90
): Promise<RefreshTrigger[]> {
    try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

        // Get published articles that haven't been updated recently
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, slug, title, updated_at, published_date')
            .eq('status', 'published')
            .lt('updated_at', cutoffDate.toISOString())
            .order('updated_at', { ascending: true })
            .limit(50); // Limit to avoid overwhelming

        if (error || !articles) {
            logger.error('Failed to fetch stale articles', error as Error);
            return [];
        }

        const triggers: RefreshTrigger[] = articles.map(article => ({
            articleId: article.id,
            articleSlug: article.slug,
            triggerReason: 'stale_content',
            severity: 'warning',
            details: {
                message: `Content hasn't been updated in ${daysThreshold} days. Consider refreshing for SEO.`
            },
            triggeredAt: new Date().toISOString()
        }));

        return triggers;

    } catch (error) {
        logger.error('Failed to check stale content triggers', error as Error);
        return [];
    }
}

/**
 * Trigger content refresh for an article
 */
export async function triggerContentRefresh(
    articleId: string,
    reason: string,
    options?: {
        reanalyzeSERP?: boolean;
        regenerateContent?: boolean;
        republish?: boolean;
    }
): Promise<RefreshResult> {
    try {
        logger.info('Triggering content refresh', { articleId, reason, options });

        // Get article
        const article = await articleService.getById(articleId);
        if (!article) {
            return {
                articleId,
                refreshed: false,
                reason: 'Article not found'
            };
        }

        let newContent = false;
        let republished = false;

        // 1. Re-analyze SERP if requested
        if (options?.reanalyzeSERP && article.slug) {
            try {
                // Extract primary keyword from article (could be from title, tags, or metadata)
                const primaryKeyword = article.title || article.slug.replace(/-/g, ' ');
                const serpBrief = await serpAnalyzer(primaryKeyword);

                logger.info('SERP re-analyzed', {
                    articleId,
                    keyword: primaryKeyword,
                    gaps: serpBrief.content_gaps.length
                });

                // TODO: Use SERP analysis to update content
                // For now, just log the analysis
                newContent = true;
            } catch (error) {
                logger.error('Failed to re-analyze SERP', error as Error, { articleId });
            }
        }

        // 2. Regenerate content if requested (using AI)
        if (options?.regenerateContent) {
            try {
                // TODO: Integrate with content generation pipeline
                // For now, just mark as needing refresh
                logger.info('Content regeneration requested', { articleId });
                newContent = true;
            } catch (error) {
                logger.error('Failed to regenerate content', error as Error, { articleId });
            }
        }

        // 3. Republish if requested
        if (options?.republish && article.status === 'published') {
            try {
                // Update published_date to trigger re-indexing
                const { createClient } = await import('@/lib/supabase/server');
                const supabase = await createClient();

                await supabase
                    .from('articles')
                    .update({
                        updated_at: new Date().toISOString(),
                        published_date: new Date().toISOString()
                    })
                    .eq('id', articleId);

                logger.info('Article republished', { articleId });
                republished = true;
            } catch (error) {
                logger.error('Failed to republish article', error as Error, { articleId });
            }
        }

        return {
            articleId,
            refreshed: newContent || republished,
            reason: reason,
            newContent,
            republished
        };

    } catch (error) {
        logger.error('Failed to trigger content refresh', error as Error, { articleId });
        return {
            articleId,
            refreshed: false,
            reason: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Process all refresh triggers (called by cron job)
 */
export async function processRefreshTriggers(): Promise<{
    processed: number;
    refreshed: number;
    errors: number;
}> {
    try {
        logger.info('Processing refresh triggers...');

        // 1. Check ranking drops
        const rankingTriggers = await checkRankingDropTriggers(3);
        logger.info(`Found ${rankingTriggers.length} ranking drop triggers`);

        // 2. Check stale content
        const staleTriggers = await checkStaleContentTriggers(90);
        logger.info(`Found ${staleTriggers.length} stale content triggers`);

        // Combine all triggers
        const allTriggers = [...rankingTriggers, ...staleTriggers];

        // Process triggers (prioritize critical)
        const criticalTriggers = allTriggers.filter(t => t.severity === 'critical');
        const otherTriggers = allTriggers.filter(t => t.severity !== 'critical');

        let refreshed = 0;
        let errors = 0;

        // Process critical triggers first
        for (const trigger of criticalTriggers) {
            try {
                const result = await triggerContentRefresh(
                    trigger.articleId,
                    trigger.details.message,
                    {
                        reanalyzeSERP: trigger.triggerReason === 'ranking_drop',
                        regenerateContent: trigger.severity === 'critical',
                        republish: trigger.severity === 'critical'
                    }
                );

                if (result.refreshed) {
                    refreshed++;
                }
            } catch (error) {
                errors++;
                logger.error('Failed to process refresh trigger', error as Error, { trigger });
            }
        }

        // Process other triggers (limit to avoid overwhelming)
        const limit = 10; // Process max 10 non-critical triggers per run
        for (const trigger of otherTriggers.slice(0, limit)) {
            try {
                const result = await triggerContentRefresh(
                    trigger.articleId,
                    trigger.details.message,
                    {
                        reanalyzeSERP: trigger.triggerReason === 'ranking_drop',
                        regenerateContent: false, // Don't auto-regenerate for warnings
                        republish: false
                    }
                );

                if (result.refreshed) {
                    refreshed++;
                }
            } catch (error) {
                errors++;
                logger.error('Failed to process refresh trigger', error as Error, { trigger });
            }
        }

        logger.info('Refresh triggers processed', {
            processed: allTriggers.length,
            refreshed,
            errors
        });

        return {
            processed: allTriggers.length,
            refreshed,
            errors
        };

    } catch (error) {
        logger.error('Failed to process refresh triggers', error as Error);
        return {
            processed: 0,
            refreshed: 0,
            errors: 1
        };
    }
}

/**
 * Find article by URL/slug
 */
async function findArticleByUrl(url: string): Promise<{ id: string; slug: string } | null> {
    try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();

        // Extract slug from URL
        const urlParts = url.split('/');
        const slug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

        const { data, error } = await supabase
            .from('articles')
            .select('id, slug')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            slug: data.slug
        };

    } catch (error) {
        logger.error('Failed to find article by URL', error as Error, { url });
        return null;
    }
}

/**
 * Schedule refresh trigger check (to be called by cron)
 */
export async function scheduleRefreshCheck(): Promise<void> {
    try {
        logger.info('Scheduled refresh check started');
        await processRefreshTriggers();
        logger.info('Scheduled refresh check completed');
    } catch (error) {
        logger.error('Scheduled refresh check failed', error as Error);
    }
}
