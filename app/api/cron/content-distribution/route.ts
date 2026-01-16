/**
 * Content Distribution Cron Job
 * Auto-distributes newly published articles to social media and email
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/content-distribution",
 *     "schedule": "0 */6 * * *" // Every 6 hours
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { distributeNewArticles } from '@/lib/automation/content-distribution';
import { logger } from '@/lib/logger';

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

        logger.info('Content distribution cron started');

        // Distribute new articles
        const result = await distributeNewArticles();

        return NextResponse.json({
            success: true,
            message: `Distributed ${result.distributed} article(s)`,
            distributed: result.distributed,
            failed: result.failed,
            results: result.results,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        logger.error('Error in content distribution cron', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to distribute content',
                message: error.message
            },
            { status: 500 }
        );
    }
}
