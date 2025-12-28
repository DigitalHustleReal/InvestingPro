import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '@/lib/logger';

const execAsync = promisify(exec);

/**
 * POST /api/scraper/scrape-rates
 * Trigger rate scraper to update live rates
 * Secured with secret key
 */
export async function POST(request: NextRequest) {
    try {
        const { secret } = await request.json();

        // Security: Verify secret key
        if (secret !== process.env.SCRAPER_SECRET) {
            logger.warn('Unauthorized rate scraper access attempt');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        logger.info('Starting rate scraper');

        // Run Python rate scraper
        const scraperPath = process.cwd() + '/lib/scraper';
        const command = `cd ${scraperPath} && python rate_scraper.py`;

        const { stdout, stderr } = await execAsync(command, {
            timeout: 300000, // 5 minute timeout
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        });

        if (stderr && !stderr.includes('Warning')) {
            logger.error('Rate scraper error', new Error(stderr));
            return NextResponse.json(
                {
                    success: false,
                    error: stderr,
                    output: stdout,
                },
                { status: 500 }
            );
        }

        logger.info('Rate scraper completed successfully', { outputLength: stdout.length });

        return NextResponse.json({
            success: true,
            output: stdout,
            warnings: stderr || null,
        });
    } catch (error: any) {
        logger.error('Rate scraper execution failed', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}

