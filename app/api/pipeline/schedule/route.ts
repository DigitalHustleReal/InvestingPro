import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/pipeline/schedule
 * Schedule automated pipeline runs
 * 
 * This endpoint can be called by:
 * - Vercel Cron Jobs
 * - External schedulers
 * - Manual triggers
 */
export async function POST(request: NextRequest) {
    try {
        const { schedule, action } = await request.json().catch(() => ({}));

        // Verify cron secret if provided
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get base URL for internal API calls
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        logger.info('Scheduled pipeline run triggered', { schedule, action });

        // Trigger pipeline run
        const pipelineResponse = await fetch(`${baseUrl}/api/pipeline/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cronSecret || 'internal'}`,
            },
            body: JSON.stringify({ action: action || 'generate' })
        });

        if (!pipelineResponse.ok) {
            const errorText = await pipelineResponse.text();
            throw new Error(`Pipeline run failed: ${pipelineResponse.status} ${errorText}`);
        }

        const pipelineData = await pipelineResponse.json();

        return NextResponse.json({
            success: true,
            message: 'Pipeline scheduled run completed',
            schedule,
            runId: pipelineData.runId,
            results: pipelineData.results,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        logger.error('Scheduled pipeline run failed', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.message || 'Scheduled pipeline run failed' 
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/pipeline/schedule
 * Get schedule configuration
 */
export async function GET(request: NextRequest) {
    try {
        // Return schedule configuration
        // In production, this could read from database
        return NextResponse.json({
            success: true,
            schedules: [
                {
                    id: 'daily-morning',
                    name: 'Daily Morning Run',
                    cron: '0 6 * * *', // 6 AM daily
                    action: 'generate',
                    enabled: true
                },
                {
                    id: 'daily-evening',
                    name: 'Daily Evening Run',
                    cron: '0 18 * * *', // 6 PM daily
                    action: 'generate',
                    enabled: true
                },
                {
                    id: 'weekly',
                    name: 'Weekly Deep Scrape',
                    cron: '0 2 * * 0', // 2 AM every Sunday
                    action: 'generate',
                    enabled: true
                }
            ],
            message: 'Schedule configuration. Use Vercel Cron or external scheduler to trigger /api/pipeline/schedule POST endpoint.'
        });
    } catch (error: any) {
        logger.error('Failed to get schedule configuration', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to get schedule' },
            { status: 500 }
        );
    }
}








