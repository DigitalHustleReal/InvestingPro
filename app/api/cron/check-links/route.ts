/**
 * Cron Job: Check Broken Links
 * 
 * Runs weekly to check all published articles for broken links
 * Called by Vercel Cron: /api/cron/check-links
 * 
 * Schedule: Weekly on Sunday at 3 AM IST (21:30 UTC Saturday)
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAllArticlesLinks } from '@/lib/automation/link-checker';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/cron/check-links
 * Check all published articles for broken links
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (if set)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized link checking attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('Starting weekly broken link check...');

        const report = await checkAllArticlesLinks({
            limit: 500 // Check up to 500 articles per run
        });

        logger.info('Broken link check completed', {
            totalLinks: report.totalLinks,
            brokenLinks: report.brokenLinks,
            internalBroken: report.internalBroken,
            externalBroken: report.externalBroken
        });

        return NextResponse.json({
            success: true,
            message: 'Link health check completed',
            ...report,
            healthScore: report.totalLinks > 0
                ? ((report.totalLinks - report.brokenLinks) / report.totalLinks) * 100
                : 100,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error checking links', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
