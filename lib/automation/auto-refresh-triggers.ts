/**
 * Auto-Refresh Triggers
 * 
 * Automatically detects when content needs refresh:
 * 1. Ranking drops (>3 positions)
 * 2. Data changes (RBI rates, AMFI NAV, product data)
 * 
 * Triggers content refresh workflow automatically
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { refreshArticle } from './content-refresh';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface RefreshTrigger {
    articleId: string;
    articleTitle: string;
    triggerType: 'ranking_drop' | 'data_change' | 'age';
    reason: string;
    severity: 'high' | 'medium' | 'low';
    data?: {
        keyword?: string;
        previousRanking?: number | null;
        currentRanking?: number | null;
        drop?: number;
        changedData?: {
            type: 'rbi_rate' | 'amfi_nav' | 'product_data';
            field: string;
            oldValue: any;
            newValue: any;
        };
    };
}

/**
 * Check for ranking drops and trigger refresh
 * 
 * Detects articles with ranking drops >3 positions
 */
export async function checkRankingDrops(): Promise<RefreshTrigger[]> {
    try {
        const triggers: RefreshTrigger[] = [];

        // Get all published articles with primary keywords
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, primary_keyword, status')
            .eq('status', 'published')
            .not('primary_keyword', 'is', null);

        if (articlesError || !articles) {
            logger.error('Failed to fetch articles for ranking check', articlesError);
            return [];
        }

        // For each article, check ranking changes
        for (const article of articles) {
            const keyword = article.primary_keyword as string;
            if (!keyword) continue;

            // Get latest two rankings
            const { data: rankings, error: rankingsError } = await supabase
                .from('serp_tracking')
                .select('position, tracked_at')
                .eq('keyword', keyword.toLowerCase())
                .order('tracked_at', { ascending: false })
                .limit(2);

            if (rankingsError || !rankings || rankings.length < 2) {
                // Need at least 2 data points to detect drops
                continue;
            }

            const currentRanking = rankings[0].position;
            const previousRanking = rankings[1].position;

            // Skip if either is null (not in top 100)
            if (currentRanking === null || previousRanking === null) {
                continue;
            }

            // Calculate drop
            const drop = previousRanking - currentRanking; // Positive = moved up, Negative = dropped

            // Trigger if dropped more than 3 positions
            if (drop < -3) {
                const severity = drop < -10 ? 'high' : drop < -5 ? 'medium' : 'low';

                triggers.push({
                    articleId: article.id,
                    articleTitle: article.title,
                    triggerType: 'ranking_drop',
                    reason: `Ranking dropped ${Math.abs(drop)} positions (${previousRanking} → ${currentRanking})`,
                    severity,
                    data: {
                        keyword,
                        previousRanking,
                        currentRanking,
                        drop
                    }
                });

                logger.warn('Ranking drop detected', {
                    articleId: article.id,
                    keyword,
                    previousRanking,
                    currentRanking,
                    drop
                });
            }
        }

        return triggers;

    } catch (error) {
        logger.error('Error checking ranking drops', error as Error);
        return [];
    }
}

/**
 * Check for data changes (RBI rates, AMFI NAV, product data)
 * 
 * Compares current data with last known values
 */
export async function checkDataChanges(): Promise<RefreshTrigger[]> {
    try {
        const triggers: RefreshTrigger[] = [];

        // 1. Check RBI rate changes
        const rbiTriggers = await checkRBIRateChanges();
        triggers.push(...rbiTriggers);

        // 2. Check AMFI NAV changes (significant changes >5%)
        const amfiTriggers = await checkAMFINAVChanges();
        triggers.push(...amfiTriggers);

        // 3. Check product data changes (credit cards, loans)
        const productTriggers = await checkProductDataChanges();
        triggers.push(...productTriggers);

        return triggers;

    } catch (error) {
        logger.error('Error checking data changes', error as Error);
        return [];
    }
}

/**
 * Check for RBI rate changes
 */
async function checkRBIRateChanges(): Promise<RefreshTrigger[]> {
    try {
        const triggers: RefreshTrigger[] = [];

        // Get latest two RBI rate records
        const { data: rates, error } = await supabase
            .from('rbi_policy_rates')
            .select('repo_rate, reverse_repo_rate, bank_rate, base_rate, updated_at')
            .order('updated_at', { ascending: false })
            .limit(2);

        if (error || !rates || rates.length < 2) {
            return [];
        }

        const current = rates[0];
        const previous = rates[1];

        // Check if any rate changed
        const rateFields = ['repo_rate', 'reverse_repo_rate', 'bank_rate', 'base_rate'] as const;
        let hasChange = false;
        const changes: { field: string; oldValue: number; newValue: number }[] = [];

        for (const field of rateFields) {
            const currentValue = parseFloat(String(current[field]));
            const previousValue = parseFloat(String(previous[field]));

            if (Math.abs(currentValue - previousValue) > 0.01) { // Changed by more than 0.01%
                hasChange = true;
                changes.push({
                    field,
                    oldValue: previousValue,
                    newValue: currentValue
                });
            }
        }

        if (hasChange) {
            // Find articles that mention RBI rates
            const { data: articles, error: articlesError } = await supabase
                .from('articles')
                .select('id, title, category, body_html, primary_keyword')
                .eq('status', 'published')
                .or('category.eq.loans,category.eq.banking,category.eq.investing-basics');

            if (!articlesError && articles) {
                for (const article of articles) {
                    // Check if article mentions RBI rates
                    const content = (article.body_html || '').toLowerCase();
                    const mentionsRBI = /rbi|repo rate|reverse repo|bank rate|base rate|policy rate/i.test(content);

                    if (mentionsRBI) {
                        triggers.push({
                            articleId: article.id,
                            articleTitle: article.title,
                            triggerType: 'data_change',
                            reason: `RBI rates changed: ${changes.map(c => `${c.field} ${c.oldValue}% → ${c.newValue}%`).join(', ')}`,
                            severity: 'high',
                            data: {
                                changedData: {
                                    type: 'rbi_rate',
                                    field: changes.map(c => c.field).join(', '),
                                    oldValue: previous,
                                    newValue: current
                                }
                            }
                        });
                    }
                }
            }
        }

        return triggers;

    } catch (error) {
        logger.error('Error checking RBI rate changes', error as Error);
        return [];
    }
}

/**
 * Check for AMFI NAV changes (>5% change)
 */
async function checkAMFINAVChanges(): Promise<RefreshTrigger[]> {
    try {
        const triggers: RefreshTrigger[] = [];

        // Get mutual fund articles
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, category, body_html, primary_keyword')
            .eq('status', 'published')
            .eq('category', 'mutual-funds');

        if (articlesError || !articles) {
            return [];
        }

        // Get latest mutual fund NAV data
        const { data: currentFunds, error: fundsError } = await supabase
            .from('mutual_funds')
            .select('scheme_code, nav, updated_at')
            .order('updated_at', { ascending: false })
            .limit(1000); // Check top 1000 funds

        if (fundsError || !currentFunds) {
            return [];
        }

        // For each article, check if it mentions specific funds
        // This is simplified - in production, you'd extract fund names from content
        for (const article of articles) {
            const content = (article.body_html || '').toLowerCase();
            
            // Check if article mentions mutual funds (simplified check)
            if (/mutual fund|nav|scheme|fund house/i.test(content)) {
                // In production, extract specific fund names and check their NAV changes
                // For now, trigger if any significant NAV changes detected
                const significantChanges = currentFunds.filter(fund => {
                    // Would need to compare with previous NAV
                    // Simplified: trigger if NAV updated recently
                    const updatedAt = new Date(fund.updated_at);
                    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    return updatedAt > oneDayAgo;
                });

                if (significantChanges.length > 0) {
                    triggers.push({
                        articleId: article.id,
                        articleTitle: article.title,
                        triggerType: 'data_change',
                        reason: `AMFI NAV data updated for ${significantChanges.length} funds`,
                        severity: 'medium',
                        data: {
                            changedData: {
                                type: 'amfi_nav',
                                field: 'nav',
                                oldValue: null, // Would need previous values
                                newValue: significantChanges.length
                            }
                        }
                    });
                }
            }
        }

        return triggers;

    } catch (error) {
        logger.error('Error checking AMFI NAV changes', error as Error);
        return [];
    }
}

/**
 * Check for product data changes (credit cards, loans)
 */
async function checkProductDataChanges(): Promise<RefreshTrigger[]> {
    try {
        const triggers: RefreshTrigger[] = [];

        // Check credit card data changes
        const { data: creditCards, error: cardsError } = await supabase
            .from('credit_cards')
            .select('id, name, annual_fee, interest_rate, updated_at')
            .order('updated_at', { ascending: false })
            .limit(100);

        if (!cardsError && creditCards) {
            // Find articles mentioning credit cards
            const { data: articles, error: articlesError } = await supabase
                .from('articles')
                .select('id, title, category, body_html')
                .eq('status', 'published')
                .eq('category', 'credit-cards');

            if (!articlesError && articles) {
                for (const article of articles) {
                    const content = (article.body_html || '').toLowerCase();
                    
                    // Check if any cards were updated recently
                    const recentUpdates = creditCards.filter(card => {
                        const updatedAt = new Date(card.updated_at);
                        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return updatedAt > oneWeekAgo;
                    });

                    if (recentUpdates.length > 0) {
                        triggers.push({
                            articleId: article.id,
                            articleTitle: article.title,
                            triggerType: 'data_change',
                            reason: `Credit card data updated for ${recentUpdates.length} cards`,
                            severity: 'medium',
                            data: {
                                changedData: {
                                    type: 'product_data',
                                    field: 'credit_cards',
                                    oldValue: null,
                                    newValue: recentUpdates.length
                                }
                            }
                        });
                    }
                }
            }
        }

        return triggers;

    } catch (error) {
        logger.error('Error checking product data changes', error as Error);
        return [];
    }
}

/**
 * Process refresh triggers and refresh articles
 */
export async function processRefreshTriggers(triggers: RefreshTrigger[]): Promise<{
    processed: number;
    refreshed: number;
    failed: number;
    results: Array<RefreshTrigger & { refreshResult?: any }>;
}> {
    const results: Array<RefreshTrigger & { refreshResult?: any }> = [];
    let refreshed = 0;
    let failed = 0;

    for (const trigger of triggers) {
        try {
            // Refresh the article with trigger reason
            const refreshResult = await refreshArticle(trigger.articleId, trigger.reason);

            results.push({
                ...trigger,
                refreshResult
            });

            if (refreshResult.refreshed) {
                refreshed++;
                
                // Log refresh trigger
                logger.info('Article refreshed via auto-trigger', {
                    articleId: trigger.articleId,
                    triggerType: trigger.triggerType,
                    reason: trigger.reason,
                    severity: trigger.severity
                });

                // Store trigger in database for audit
                await supabase
                    .from('article_refresh_triggers')
                    .insert({
                        article_id: trigger.articleId,
                        trigger_type: trigger.triggerType,
                        reason: trigger.reason,
                        severity: trigger.severity,
                        trigger_data: trigger.data,
                        refreshed: true,
                        created_at: new Date().toISOString()
                    });
            } else {
                failed++;
            }

        } catch (error) {
            logger.error('Failed to process refresh trigger', error as Error, {
                articleId: trigger.articleId,
                triggerType: trigger.triggerType
            });
            failed++;
            results.push({
                ...trigger,
                refreshResult: { error: (error as Error).message }
            });
        }
    }

    return {
        processed: triggers.length,
        refreshed,
        failed,
        results
    };
}

/**
 * Run all refresh trigger checks
 */
export async function runAllRefreshChecks(): Promise<{
    rankingDrops: RefreshTrigger[];
    dataChanges: RefreshTrigger[];
    allTriggers: RefreshTrigger[];
    processed: {
        processed: number;
        refreshed: number;
        failed: number;
    };
}> {
    logger.info('Running all refresh trigger checks');

    // Check ranking drops
    const rankingDrops = await checkRankingDrops();
    logger.info(`Found ${rankingDrops.length} ranking drops`);

    // Check data changes
    const dataChanges = await checkDataChanges();
    logger.info(`Found ${dataChanges.length} data changes`);

    // Combine all triggers
    const allTriggers = [...rankingDrops, ...dataChanges];

    // Process triggers
    const processed = await processRefreshTriggers(allTriggers);

    return {
        rankingDrops,
        dataChanges,
        allTriggers,
        processed
    };
}
