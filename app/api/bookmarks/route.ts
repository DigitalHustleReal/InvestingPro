import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bookmarkService } from '@/lib/engagement/bookmark-service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const articleId = searchParams.get('articleId');
        const type = searchParams.get('type') || 'check';

        if (articleId && type === 'check') {
            // Check if specific article is bookmarked
            const isBookmarked = await bookmarkService.isBookmarked(user.id, articleId);
            return NextResponse.json({ isBookmarked });
        }

        if (type === 'list') {
            // Get all bookmarks
            const bookmarks = await bookmarkService.getUserBookmarks(user.id);
            return NextResponse.json({ bookmarks });
        }

        if (type === 'stats') {
            // Get reading stats
            const stats = await bookmarkService.getReadingStats(user.id);
            return NextResponse.json(stats);
        }

        if (type === 'history') {
            // Get reading history
            const history = await bookmarkService.getReadingHistory(user.id);
            return NextResponse.json({ history });
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    } catch (error) {
        logger.error('Bookmarks API GET error', error as Error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { articleId, notes, action, progress, readTime } = body;

        if (action === 'progress' && articleId) {
            // Update reading progress
            await bookmarkService.updateProgress(user.id, articleId, progress || 0, readTime || 0);
            return NextResponse.json({ success: true });
        }

        if (!articleId) {
            return NextResponse.json({ error: 'articleId required' }, { status: 400 });
        }

        const success = await bookmarkService.addBookmark(user.id, articleId, notes);
        return NextResponse.json({ success });

    } catch (error) {
        logger.error('Bookmarks API POST error', error as Error);
        return NextResponse.json({ error: 'Failed to bookmark' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { articleId } = body;

        if (!articleId) {
            return NextResponse.json({ error: 'articleId required' }, { status: 400 });
        }

        const success = await bookmarkService.removeBookmark(user.id, articleId);
        return NextResponse.json({ success });

    } catch (error) {
        logger.error('Bookmarks API DELETE error', error as Error);
        return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 });
    }
}
