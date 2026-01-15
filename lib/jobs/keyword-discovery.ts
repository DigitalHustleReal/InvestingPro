/**
 * Keyword Discovery Background Job
 * 
 * Weekly job that discovers new long-tail keyword opportunities
 * and automatically generates content for them.
 * 
 * SCHEDULE: Weekly (every Monday at 2 AM)
 * FOCUS: Credit Cards + Mutual Funds only
 * STRATEGY: Long-tail, decision-focused keywords with low competition
 */

import { inngest } from '@/lib/inngest/client';
import { logger } from '@/lib/logger';
import { discoverAndGenerateContentForBoth } from '@/lib/automation/keyword-content-generator';

/**
 * Weekly Keyword Discovery Job
 * Discovers new keywords and generates content
 */
export const keywordDiscoveryJob = inngest.createFunction(
    {
        id: 'keyword-discovery',
        name: 'Weekly Keyword Discovery & Content Generation',
        description: 'Discovers long-tail keyword opportunities and auto-generates content'
    },
    { cron: '0 2 * * 1' }, // Every Monday at 2 AM
    async ({ step }) => {
        const results = {
            creditCards: { discovered: 0, generated: 0, failed: 0, errors: [] as string[] },
            mutualFunds: { discovered: 0, generated: 0, failed: 0, errors: [] as string[] }
        };

        // Step 1: Discover and generate for Credit Cards
        await step.run('discover-credit-cards', async () => {
            logger.info('Starting keyword discovery for Credit Cards');
            
            try {
                const creditCardResults = await discoverAndGenerateContentForBoth(5);
                
                results.creditCards.discovered = creditCardResults['credit-cards'].length;
                results.creditCards.generated = creditCardResults['credit-cards'].filter(r => r.success).length;
                results.creditCards.failed = creditCardResults['credit-cards'].filter(r => !r.success).length;
                
                creditCardResults['credit-cards'].forEach(result => {
                    if (!result.success && result.error) {
                        results.creditCards.errors.push(`${result.keyword}: ${result.error}`);
                    }
                });

                logger.info(`Credit Cards: ${results.creditCards.generated}/${results.creditCards.discovered} articles generated`);
            } catch (error) {
                logger.error('Credit Cards keyword discovery failed', error as Error);
                results.creditCards.errors.push((error as Error).message);
            }
        });

        // Step 2: Discover and generate for Mutual Funds
        await step.run('discover-mutual-funds', async () => {
            logger.info('Starting keyword discovery for Mutual Funds');
            
            try {
                const mfResults = await discoverAndGenerateContentForBoth(5);
                
                results.mutualFunds.discovered = mfResults['mutual-funds'].length;
                results.mutualFunds.generated = mfResults['mutual-funds'].filter(r => r.success).length;
                results.mutualFunds.failed = mfResults['mutual-funds'].filter(r => !r.success).length;
                
                mfResults['mutual-funds'].forEach(result => {
                    if (!result.success && result.error) {
                        results.mutualFunds.errors.push(`${result.keyword}: ${result.error}`);
                    }
                });

                logger.info(`Mutual Funds: ${results.mutualFunds.generated}/${results.mutualFunds.discovered} articles generated`);
            } catch (error) {
                logger.error('Mutual Funds keyword discovery failed', error as Error);
                results.mutualFunds.errors.push((error as Error).message);
            }
        });

        // Step 3: Log summary
        await step.run('log-summary', async () => {
            const totalDiscovered = results.creditCards.discovered + results.mutualFunds.discovered;
            const totalGenerated = results.creditCards.generated + results.mutualFunds.generated;
            const totalFailed = results.creditCards.failed + results.mutualFunds.failed;

            logger.info('Keyword Discovery Job Summary', {
                creditCards: {
                    discovered: results.creditCards.discovered,
                    generated: results.creditCards.generated,
                    failed: results.creditCards.failed
                },
                mutualFunds: {
                    discovered: results.mutualFunds.discovered,
                    generated: results.mutualFunds.generated,
                    failed: results.mutualFunds.failed
                },
                total: {
                    discovered: totalDiscovered,
                    generated: totalGenerated,
                    failed: totalFailed
                },
                errors: [...results.creditCards.errors, ...results.mutualFunds.errors]
            });

            if (totalGenerated < totalDiscovered * 0.7) {
                logger.warn(`Only ${totalGenerated}/${totalDiscovered} articles generated. Success rate below 70%`);
            }
        });

        return results;
    }
);
