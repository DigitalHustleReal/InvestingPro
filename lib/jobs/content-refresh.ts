/**
 * Content Refresh Background Job
 * 
 * Weekly job that refreshes old articles with new product data.
 * Updates rates, offers, and comparison tables.
 * 
 * SCHEDULE: Weekly (every Sunday at 3 AM)
 * FOCUS: Credit Cards + Mutual Funds only
 * STRATEGY: Refresh articles older than 90 days
 */

import { inngest } from '@/lib/inngest/client';
import { logger } from '@/lib/logger';
import { refreshBothCategories } from '@/lib/automation/content-refresh';

/**
 * Weekly Content Refresh Job
 * Refreshes old articles with new product data
 */
export const contentRefreshJob = inngest.createFunction(
    {
        id: 'content-refresh',
        name: 'Weekly Content Refresh Job',
        description: 'Refreshes old articles with new product data (rates, offers, etc.)'
    },
    { cron: '0 3 * * 0' }, // Every Sunday at 3 AM
    async ({ step }) => {
        const results = {
            creditCards: { refreshed: 0, failed: 0, errors: [] as string[] },
            mutualFunds: { refreshed: 0, failed: 0, errors: [] as string[] }
        };

        // Step 1: Refresh Credit Cards articles
        await step.run('refresh-credit-cards', async () => {
            logger.info('Starting content refresh for Credit Cards');
            
            try {
                const refreshResults = await refreshBothCategories(90, 15);
                
                results.creditCards.refreshed = refreshResults['credit-cards'].filter(r => r.success).length;
                results.creditCards.failed = refreshResults['credit-cards'].filter(r => !r.success).length;
                
                refreshResults['credit-cards'].forEach(result => {
                    if (!result.success && result.error) {
                        results.creditCards.errors.push(`${result.article_title}: ${result.error}`);
                    }
                });

                logger.info(`Credit Cards: ${results.creditCards.refreshed} articles refreshed`);
            } catch (error) {
                logger.error('Credit Cards content refresh failed', error as Error);
                results.creditCards.errors.push((error as Error).message);
            }
        });

        // Step 2: Refresh Mutual Funds articles
        await step.run('refresh-mutual-funds', async () => {
            logger.info('Starting content refresh for Mutual Funds');
            
            try {
                const refreshResults = await refreshBothCategories(90, 15);
                
                results.mutualFunds.refreshed = refreshResults['mutual-funds'].filter(r => r.success).length;
                results.mutualFunds.failed = refreshResults['mutual-funds'].filter(r => !r.success).length;
                
                refreshResults['mutual-funds'].forEach(result => {
                    if (!result.success && result.error) {
                        results.mutualFunds.errors.push(`${result.article_title}: ${result.error}`);
                    }
                });

                logger.info(`Mutual Funds: ${results.mutualFunds.refreshed} articles refreshed`);
            } catch (error) {
                logger.error('Mutual Funds content refresh failed', error as Error);
                results.mutualFunds.errors.push((error as Error).message);
            }
        });

        // Step 3: Log summary
        await step.run('log-summary', async () => {
            const totalRefreshed = results.creditCards.refreshed + results.mutualFunds.refreshed;
            const totalFailed = results.creditCards.failed + results.mutualFunds.failed;

            logger.info('Content Refresh Job Summary', {
                creditCards: {
                    refreshed: results.creditCards.refreshed,
                    failed: results.creditCards.failed
                },
                mutualFunds: {
                    refreshed: results.mutualFunds.refreshed,
                    failed: results.mutualFunds.failed
                },
                total: {
                    refreshed: totalRefreshed,
                    failed: totalFailed
                },
                errors: [...results.creditCards.errors, ...results.mutualFunds.errors]
            });

            if (totalRefreshed === 0 && totalFailed > 0) {
                logger.warn(`Content refresh failed for all articles. Check errors.`);
            }
        });

        return results;
    }
);
