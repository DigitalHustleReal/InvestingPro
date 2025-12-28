/**
 * Vercel Cron Job: Scrape Products
 * Runs daily at 2:00 AM IST to update product data
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
        logger.info('Starting product scraping cron job');

        // Call Python scraper via API or direct execution
        // For now, we'll use a Node.js implementation or call Python script
        
        // Option 1: Use Node.js to call Python script
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        const scriptPath = process.cwd() + '/lib/scraper/product_scraper.py';
        
        const { stdout, stderr } = await execAsync(`python3 ${scriptPath}`, {
            env: {
                ...process.env,
                NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
            },
            maxBuffer: 10 * 1024 * 1024, // 10MB
        });

        if (stderr) {
            logger.error('Product scraper stderr', new Error(stderr));
        }

        logger.info('Product scraping cron job completed', { stdout });

        return NextResponse.json({
            success: true,
            message: 'Product scraping completed',
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        logger.error('Product scraping cron job failed', error);
        
        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

