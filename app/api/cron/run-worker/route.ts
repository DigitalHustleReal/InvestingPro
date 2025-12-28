/**
 * Vercel Cron Job: Master Worker
 * Runs all scraping tasks: products, reviews, rates
 * Schedule: Daily at 1:00 AM IST
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const maxDuration = 600; // 10 minutes for full pipeline

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        logger.info('Starting master worker cron job');

        // Call Python master worker script
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        const scriptPath = process.cwd() + '/lib/scraper/master_worker.py';
        
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
            logger.error('Master worker stderr', new Error(stderr));
        }

        logger.info('Master worker cron job completed', { stdout });

        return NextResponse.json({
            success: true,
            message: 'Master worker completed',
            timestamp: new Date().toISOString(),
            output: stdout.substring(0, 1000), // First 1000 chars
        });

    } catch (error: any) {
        logger.error('Master worker cron job failed', error);
        
        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

