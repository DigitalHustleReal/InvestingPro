/**
 * Weekly Data Update Cron Job
 * Automatically scrapes and updates product data (credit cards, mutual funds)
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/weekly-data-update",
 *     "schedule": "0 2 * * 1" // Every Monday 2 AM
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllCreditCards } from '@/scripts/scrapers/credit-card-scraper';
import { scrapeAllMutualFunds } from '@/scripts/scrapers/mutual-fund-scraper';
import { processCreditCards, processMutualFunds } from '@/lib/automation/data-pipeline';
import { logger } from '@/lib/logger';
import { sendMessagingNotification } from '@/lib/automation/messaging-notifier';

// Verify cron secret (for Vercel Cron Jobs)
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
        return true; // Allow if no secret configured (for local development)
    }

    return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        if (!verifyCronSecret(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        logger.info('Weekly data update started');

        const startTime = Date.now();
        const errors: string[] = [];
        const results = {
            creditCards: {
                scraped: 0,
                processed: 0,
                loaded: 0,
                updated: 0,
                failed: 0,
                qualityScore: 0
            },
            mutualFunds: {
                scraped: 0,
                processed: 0,
                loaded: 0,
                updated: 0,
                failed: 0,
                qualityScore: 0
            }
        };

        // 1. Scrape Credit Cards
        try {
            logger.info('Scraping credit cards...');
            const scrapedCards = await scrapeAllCreditCards();
            results.creditCards.scraped = scrapedCards.length;

            if (scrapedCards.length > 0) {
                const pipelineResult = await processCreditCards(scrapedCards);
                results.creditCards.processed = pipelineResult.validated;
                results.creditCards.loaded = pipelineResult.loaded;
                results.creditCards.updated = pipelineResult.updated;
                results.creditCards.failed = pipelineResult.failed;
                results.creditCards.qualityScore = pipelineResult.qualityScore;

                if (pipelineResult.errors.length > 0) {
                    errors.push(...pipelineResult.errors.slice(0, 10)); // Limit error count
                }

                logger.info('Credit cards processing complete', {
                    scraped: results.creditCards.scraped,
                    loaded: results.creditCards.loaded,
                    updated: results.creditCards.updated,
                    failed: results.creditCards.failed,
                    qualityScore: results.creditCards.qualityScore
                });
            }
        } catch (error: any) {
            const errorMsg = `Credit card scraping failed: ${error.message}`;
            errors.push(errorMsg);
            logger.error('Credit card scraping error', error);
        }

        // 2. Scrape Mutual Funds
        try {
            logger.info('Scraping mutual funds...');
            const scrapedFunds = await scrapeAllMutualFunds();
            results.mutualFunds.scraped = scrapedFunds.length;

            if (scrapedFunds.length > 0) {
                const pipelineResult = await processMutualFunds(scrapedFunds);
                results.mutualFunds.processed = pipelineResult.validated;
                results.mutualFunds.loaded = pipelineResult.loaded;
                results.mutualFunds.updated = pipelineResult.updated;
                results.mutualFunds.failed = pipelineResult.failed;
                results.mutualFunds.qualityScore = pipelineResult.qualityScore;

                if (pipelineResult.errors.length > 0) {
                    errors.push(...pipelineResult.errors.slice(0, 10));
                }

                logger.info('Mutual funds processing complete', {
                    scraped: results.mutualFunds.scraped,
                    loaded: results.mutualFunds.loaded,
                    updated: results.mutualFunds.updated,
                    failed: results.mutualFunds.failed,
                    qualityScore: results.mutualFunds.qualityScore
                });
            }
        } catch (error: any) {
            const errorMsg = `Mutual fund scraping failed: ${error.message}`;
            errors.push(errorMsg);
            logger.error('Mutual fund scraping error', error);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const totalProcessed = results.creditCards.processed + results.mutualFunds.processed;
        const totalLoaded = results.creditCards.loaded + results.mutualFunds.loaded;
        const totalUpdated = results.creditCards.updated + results.mutualFunds.updated;
        const totalFailed = results.creditCards.failed + results.mutualFunds.failed;

        // 3. Send notification if configured
        const hasErrors = errors.length > 0 || totalFailed > 0;
        if (process.env.DATA_UPDATE_NOTIFICATION_ENABLED === 'true') {
            try {
                const message = `📊 *Weekly Data Update Complete*\n\n` +
                    `✅ Credit Cards: ${results.creditCards.loaded} new, ${results.creditCards.updated} updated\n` +
                    `✅ Mutual Funds: ${results.mutualFunds.loaded} new, ${results.mutualFunds.updated} updated\n` +
                    `⏱️ Duration: ${duration}s\n` +
                    `${hasErrors ? `⚠️ Errors: ${totalFailed} failed` : '✅ All successful'}`;

                await sendMessagingNotification({
                    message,
                    recipients: {
                        telegram: process.env.DATA_UPDATE_TELEGRAM_CHATS?.split(',').map(s => s.trim()).filter(Boolean),
                        whatsapp: process.env.DATA_UPDATE_WHATSAPP_NUMBERS?.split(',').map(s => s.trim()).filter(Boolean)
                    }
                });
            } catch (notifError) {
                logger.warn('Failed to send data update notification', { error: notifError instanceof Error ? notifError.message : String(notifError) });
            }
        }

        return NextResponse.json({
            success: totalFailed === 0,
            message: `Processed ${totalProcessed} products (${totalLoaded} new, ${totalUpdated} updated)`,
            duration: `${duration}s`,
            results,
            errors: errors.slice(0, 10), // Limit to 10 errors in response
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        logger.error('Error in weekly data update cron', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update data',
                message: error.message
            },
            { status: 500 }
        );
    }
}
