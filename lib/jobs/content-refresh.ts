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
import { refreshOldArticles } from '@/lib/automation/content-refresh';

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
    async ({ step }: any) => {
        const results = {
            creditCards: { refreshed: 0, failed: 0, errors: [] as string[] },
            mutualFunds: { refreshed: 0, failed: 0, errors: [] as string[] }
        };

        // Step 1: Refresh old articles (credit cards + mutual funds)
        await step.run('refresh-old-articles', async () => {
            logger.info('Starting content refresh for old articles');

            try {
                const refreshResults = await refreshOldArticles();

                results.creditCards.refreshed = refreshResults.refreshed;
                results.creditCards.failed = refreshResults.failed;

                refreshResults.results.forEach((result: any) => {
                    if (!result.success && result.error) {
                        results.creditCards.errors.push(`${result.article_id}: ${result.error}`);
                    }
                });

                logger.info(`Articles refreshed: ${refreshResults.refreshed}, failed: ${refreshResults.failed}`);
            } catch (error) {
                logger.error('Content refresh failed', error as Error);
                results.creditCards.errors.push((error as Error).message);
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
