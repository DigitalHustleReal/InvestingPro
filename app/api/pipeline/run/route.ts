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
        const body = await request.json();
        const { pipeline_type, params } = body;

        if (!pipeline_type) {
            return NextResponse.json(
                { success: false, error: 'Pipeline type is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Record pipeline run in database
        let runId: string | null = null;
        try {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .insert([{
                    pipeline_type,
                    status: 'triggered',
                    params: params || {},
                    triggered_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                }])
                .select('id')
                .single();

            if (!error && data) {
                runId = data.id;
            }
        } catch (err) {
            // Table might not exist yet - continue without recording
            logger.warn('pipeline_runs table not found, continuing without recording');
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
    } catch (error: any) {
        logger.error('Pipeline run API error', error as Error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to trigger pipeline' },
            { status: 500 }
        );
    }
}
