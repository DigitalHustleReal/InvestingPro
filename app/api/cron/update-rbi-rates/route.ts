/**
 * Cron Job: Update RBI Policy Rates
 * 
 * Runs daily to fetch and update RBI policy rates
 * Called by Vercel Cron: /api/cron/update-rbi-rates
 * 
 * Schedule: Daily at 6 AM IST (12:30 AM UTC)
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateRBIRates, scrapeRBIRates, getDefaultRBIRates } from '@/lib/data-sources/rbi-api';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/cron/update-rbi-rates
 * Updates RBI policy rates in database
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (if set)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized RBI rates update attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('Starting RBI policy rates update...');

        // Try to scrape RBI website first
        let rates = await scrapeRBIRates();
        
        // If scraping fails, use defaults (will be updated manually or via better scraper)
        if (!rates) {
            logger.warn('RBI scraping not available, using default rates');
            rates = getDefaultRBIRates();
        }

        // Update database
        const success = await updateRBIRates(rates);

        if (success) {
            logger.info('RBI policy rates updated successfully', { rates });
            return NextResponse.json({
                success: true,
                message: 'RBI rates updated',
                rates,
                timestamp: new Date().toISOString()
            });
        } else {
            logger.error('Failed to update RBI rates in database');
            return NextResponse.json(
                { error: 'Failed to update RBI rates' },
                { status: 500 }
            );
        }
    } catch (error) {
        logger.error('Error updating RBI rates', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
