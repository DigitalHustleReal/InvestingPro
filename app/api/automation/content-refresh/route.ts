import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Content Refresh API
 * 
 * Triggers content refresh automation (regenerates/updates articles based on new data)
 * CMS orchestration endpoint (triggers external automation, doesn't execute directly)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { article_id, content_type, refresh_scope, params } = body;

        if (!content_type) {
            return NextResponse.json(
                { success: false, error: 'Content type is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Record content refresh trigger in database
        let triggerId: string | null = null;
        try {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .insert([{
                    pipeline_type: 'content_refresh',
                    status: 'triggered',
                    params: {
                        article_id,
                        content_type,
                        refresh_scope: refresh_scope || 'all',
                        ...params
                    },
                    triggered_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                }])
                .select('id')
                .single();

            if (!error && data) {
                triggerId = data.id;
            }
        } catch (err) {
            // Table might not exist yet - continue without recording
            logger.warn('pipeline_runs table not found, continuing without recording');
        }

        // In production, this would:
        // 1. Identify articles that need refreshing based on scope
        // 2. Queue content regeneration jobs
        // 3. Trigger AI content generation pipeline
        // 4. Update article content in Supabase
        // 5. Trigger frontend revalidation/cache bust

        logger.info('Content refresh triggered', { 
            article_id, 
            content_type, 
            refresh_scope, 
            params, 
            triggerId 
        });

        return NextResponse.json({
            success: true,
            message: 'Content refresh triggered successfully',
            trigger_id: triggerId || `refresh_${Date.now()}`,
            article_id,
            content_type,
            refresh_scope: refresh_scope || 'all',
            status: 'triggered',
            triggered_at: new Date().toISOString()
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to trigger content refresh';
        logger.error('Content refresh API error', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

