import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Scraper Trigger API
 * 
 * Triggers scraper automation for data collection
 * CMS orchestration endpoint (triggers external scraper execution, doesn't execute directly)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { scraper_type, target, params } = body;

        if (!scraper_type) {
            return NextResponse.json(
                { success: false, error: 'Scraper type is required' },
                { status: 400 }
            );
        }

        const { createServiceClient } = await import('@/lib/supabase/service');
        const supabase = createServiceClient();

        // Record scraper trigger in database
        let triggerId: string | null = null;
        try {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .insert([{
                    pipeline_type: `scraper_${scraper_type}`,
                    status: 'triggered',
                    params: {
                        scraper_type,
                        target,
                        ...params
                    },
                    triggered_at: new Date().toISOString()
                }])
                .select('id');

            if (error) {
                logger.error('Database error recording scraper trigger', error);
            } else if (data && data.length > 0) {
                triggerId = data[0].id;
            }
        } catch (err: any) {
            logger.error('Unexpected error recording scraper trigger', err);
        }

        // Trigger background processing immediately (simulated)
        // This allows the local "Content Factory" to start working
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cron/process-pipeline`, {
            method: 'POST',
            headers: { 'x-internal-trigger': 'true' }
        }).catch(e => logger.error('Background kickoff failed', e));

        // In production, this would:
        // 1. Trigger GitHub Actions workflow for Python scrapers
        // 2. Call external scraper service API
        // 3. Queue job in job system (e.g., Bull, Celery)
        // 4. Invoke Supabase Edge Function

        logger.info('Scraper triggered', { scraper_type, target, params, triggerId });

        return NextResponse.json({
            success: true,
            message: 'Scraper triggered successfully',
            trigger_id: triggerId || `trigger_${Date.now()}`,
            scraper_type,
            target,
            status: 'triggered',
            triggered_at: new Date().toISOString()
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to trigger scraper';
        logger.error('Scraper trigger API error', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

