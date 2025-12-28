/**
 * Vercel Cron Job: Scrape and Process Reviews
 * Runs daily at 3:00 AM IST to update reviews and scores
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        logger.info('Starting review scraping cron job');

        // Call Python review processor
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        const scriptPath = process.cwd() + '/lib/scraper/review_processor.py';
        
        const { stdout, stderr } = await execAsync(`python3 ${scriptPath}`, {
            env: {
                ...process.env,
                NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
                OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            },
            maxBuffer: 10 * 1024 * 1024, // 10MB
        });

        if (stderr) {
            logger.error('Review processor stderr', new Error(stderr));
        }

        logger.info('Review scraping cron job completed', { stdout });

        return NextResponse.json({
            success: true,
            message: 'Review processing completed',
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        logger.error('Review scraping cron job failed', error);
        
        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

