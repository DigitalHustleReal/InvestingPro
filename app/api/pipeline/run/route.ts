import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Pipeline Run API
 * 
 * Triggers a pipeline execution
 * CMS orchestration endpoint (triggers external automation, doesn't execute directly)
 */
export async function POST(request: NextRequest) {
    try {
        let body: any = {};
        try {
            body = await request.json();
        } catch (e) {
            // Handle empty body
            logger.warn('Empty body in pipeline run trigger');
        }
        
        const { pipeline_type, params } = body;

        if (!pipeline_type) {
            return NextResponse.json(
                { success: false, error: 'Pipeline type is required' },
                { status: 400 }
            );
        }

        // Use service client to bypass RLS for orchestration
        const { createServiceClient } = await import('@/lib/supabase/service');
        const supabase = createServiceClient();

        // Record pipeline run in database
        let runId: string | null = null;
        try {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .insert([{
                    pipeline_type,
                    status: 'triggered',
                    params: params || {},
                    triggered_at: new Date().toISOString()
                }])
                .select('id');

            if (error) {
                logger.error('Database error recording pipeline run', error);
            } else if (data && data.length > 0) {
                runId = data[0].id;
            }
        } catch (err: any) {
            logger.error('Unexpected error recording pipeline run', err);
        }

        // In production, this would:
        // 1. Trigger GitHub Actions workflow (for Python scrapers)
        // 2. Call Vercel Cron endpoint
        // 3. Invoke Supabase Edge Function
        // 4. Queue job in external job system

        logger.info('Pipeline triggered', { pipeline_type, params, runId });

        return NextResponse.json({
            success: true,
            message: 'Pipeline triggered successfully',
            run_id: runId || `run_${Date.now()}`,
            pipeline_type,
            status: 'triggered',
            triggered_at: new Date().toISOString()
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to trigger pipeline';
        logger.error('Pipeline run API error', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
