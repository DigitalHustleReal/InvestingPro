import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Vercel Cron Job: Scrape Mutual Funds Daily
 * Runs at 6 PM IST (12:30 PM UTC)
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/scrape-mutual-funds",
 *     "schedule": "30 12 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (Vercel sends this)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized cron access attempt');
            return new NextResponse('Unauthorized', { status: 401 });
        }

        logger.info('Starting scheduled mutual funds scrape');

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        // Trigger scraper
        const response = await fetch(`${baseUrl}/api/scraper/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'mutual_funds',
                secret: process.env.SCRAPER_SECRET,
            }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            logger.error('Cron job failed', new Error(result.error || 'Unknown error'));
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 500 }
            );
        }

        logger.info('Cron job completed successfully', { output: result.output?.substring(0, 100) });

        return NextResponse.json({
            success: true,
            message: 'Mutual funds scrape completed',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        logger.error('Cron job execution failed', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}

