/**
 * Article Scheduling API
 * 
 * POST /api/admin/articles/[id]/schedule - Schedule article
 * DELETE /api/admin/articles/[id]/schedule - Cancel schedule
 * GET /api/admin/articles/[id]/schedule - Get schedule info
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scheduleArticle, cancelScheduledArticle } from '@/lib/automation/scheduler';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/articles/[id]/schedule
 * Schedule article for future publishing
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { publishAt, socialPosts } = body;

        if (!publishAt) {
            return NextResponse.json(
                { error: 'publishAt is required' },
                { status: 400 }
            );
        }

        const result = await scheduleArticle(id, {
            publishAt,
            socialPosts
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to schedule article' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Article scheduled successfully',
            scheduledPublishAt: result.scheduledPublishAt
        });
    } catch (error) {
        logger.error('Error scheduling article', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/articles/[id]/schedule
 * Cancel scheduled article
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await cancelScheduledArticle(id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to cancel schedule' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Schedule cancelled successfully'
        });
    } catch (error) {
        logger.error('Error cancelling schedule', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/admin/articles/[id]/schedule
 * Get schedule information
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: article, error } = await supabase
            .from('articles')
            .select('id, scheduled_publish_at, status, editorial_notes')
            .eq('id', id)
            .single();

        if (error || !article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            scheduled: article.status === 'scheduled' && article.scheduled_publish_at !== null,
            scheduledPublishAt: article.scheduled_publish_at,
            socialPosts: (article.editorial_notes as any)?.scheduled_social_posts || []
        });
    } catch (error) {
        logger.error('Error getting schedule info', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
