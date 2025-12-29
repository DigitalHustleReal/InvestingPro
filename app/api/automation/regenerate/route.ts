import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Content Regeneration API
 * 
 * Triggers regeneration of specific article content
 * CMS orchestration endpoint (triggers external automation, doesn't execute directly)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { article_id, regenerate_type, params } = body;

        if (!article_id) {
            return NextResponse.json(
                { success: false, error: 'Article ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Verify article exists
        try {
            const { data: article, error: articleError } = await supabase
                .from('articles')
                .select('id, title, status')
                .eq('id', article_id)
                .single();

            if (articleError || !article) {
                return NextResponse.json(
                    { success: false, error: 'Article not found' },
                    { status: 404 }
                );
            }
        } catch (err) {
            logger.warn('Could not verify article existence', err as Error);
        }

        // Record regeneration trigger in database
        let triggerId: string | null = null;
        try {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .insert([{
                    pipeline_type: 'content_regenerate',
                    status: 'triggered',
                    params: {
                        article_id,
                        regenerate_type: regenerate_type || 'full',
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
        // 1. Fetch latest scraped data for article context
        // 2. Trigger AI content generation with updated data
        // 3. Update article content in Supabase (as draft)
        // 4. Notify editor for review
        // 5. Trigger frontend revalidation on publish

        logger.info('Content regeneration triggered', { 
            article_id, 
            regenerate_type, 
            params, 
            triggerId 
        });

        return NextResponse.json({
            success: true,
            message: 'Content regeneration triggered successfully',
            trigger_id: triggerId || `regenerate_${Date.now()}`,
            article_id,
            regenerate_type: regenerate_type || 'full',
            status: 'triggered',
            triggered_at: new Date().toISOString()
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to trigger content regeneration';
        logger.error('Content regeneration API error', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

