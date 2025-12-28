import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/rss-feeds/[id]
 * Get specific RSS feed details
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { id } = params;

        const { data, error } = await supabase
            .from('rss_feeds')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { success: false, error: 'Feed not found' },
                { status: 404 }
            );
        }

        // Get feed items
        const { data: items } = await supabase
            .from('rss_feed_items')
            .select('*')
            .eq('feed_id', id)
            .order('pub_date', { ascending: false })
            .limit(20)
            .catch(() => ({ data: [] }));

        return NextResponse.json({
            success: true,
            feed: data,
            items: items || []
        });
    } catch (error: any) {
        logger.error('Failed to fetch RSS feed', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch feed' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/rss-feeds/[id]
 * Delete RSS feed
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { id } = params;

        const { error } = await supabase
            .from('rss_feeds')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        logger.error('Failed to delete RSS feed', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete feed' },
            { status: 500 }
        );
    }
}








