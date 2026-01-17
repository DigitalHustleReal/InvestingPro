/**
 * Cron Job: Scrape Credit Cards
 * 
 * Runs weekly to fetch and update credit card data from bank websites
 * Called by Vercel Cron: /api/cron/scrape-credit-cards
 * 
 * Schedule: Weekly on Sunday at 2 AM IST (8:30 PM UTC Saturday)
 */

import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllCreditCards } from '@/lib/scraper/credit-card-scraper';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/cron/scrape-credit-cards
 * Scrapes credit card data from all banks
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (if set)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized credit card scraping attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('Starting credit card scraping job...');

        const result = await scrapeAllCreditCards();

        if (result.totalErrors === 0 || result.summary.saved > 0) {
            logger.info('Credit card scraping completed', result);
            return NextResponse.json({
                success: true,
                message: 'Credit card scraping completed',
                ...result,
                timestamp: new Date().toISOString()
            });
        } else {
            logger.error('Credit card scraping failed completely');
            return NextResponse.json(
                { error: 'Credit card scraping failed', ...result },
                { status: 500 }
            );
        }
    } catch (error) {
        logger.error('Error scraping credit cards', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
