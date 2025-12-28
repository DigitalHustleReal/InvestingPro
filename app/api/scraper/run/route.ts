import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '@/lib/logger';

const execAsync = promisify(exec);

/**
 * API Route to trigger Python scraper
 * Secured with secret key
 */
export async function POST(request: NextRequest) {
    try {
        const { type, secret } = await request.json();

        // Security: Verify secret key
        if (secret !== process.env.SCRAPER_SECRET) {
            logger.warn('Unauthorized scraper access attempt', { type });
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Validate type
        const validTypes = ['mutual_funds', 'credit_cards', 'loans', 'reviews'];
        if (!type || !validTypes.includes(type)) {
            return NextResponse.json(
                { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
                { status: 400 }
            );
        }

        logger.info('Starting scraper', { type });

        // Run Python scraper
        const scraperPath = process.cwd() + '/lib/scraper';
        const command = `cd ${scraperPath} && python pipeline.py --type ${type}`;

        const { stdout, stderr } = await execAsync(command, {
            timeout: 300000, // 5 minute timeout
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        });

        if (stderr && !stderr.includes('Warning')) {
            logger.error('Scraper error', new Error(stderr), { type });
            return NextResponse.json(
                {
                    success: false,
                    error: stderr,
                    output: stdout,
                },
                { status: 500 }
            );
        }

        logger.info('Scraper completed successfully', { type, outputLength: stdout.length });

        return NextResponse.json({
            success: true,
            output: stdout,
            warnings: stderr || null,
        });
    } catch (error: any) {
        logger.error('Scraper execution failed', error, {});
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// GET endpoint for health check
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Scraper API is running',
        timestamp: new Date().toISOString(),
    });
}

