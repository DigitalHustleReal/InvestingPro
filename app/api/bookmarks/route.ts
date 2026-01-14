import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bookmarkService } from '@/lib/services';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { bookmarkSchema } from '@/lib/validation/schemas';
import { sanitizeText } from '@/lib/middleware/input-sanitization';

export const GET = createAPIWrapper('/api/bookmarks', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
    requireAuth: true, // Bookmarks require authentication
})(async (request: NextRequest) => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
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
        logger.error('Bookmarks API GET error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
});

export const POST = createAPIWrapper('/api/bookmarks', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
    requireAuth: true,
})(
    withValidation(bookmarkSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Body is already validated by middleware
        const { articleId, notes, action, progress, readTime } = body;

        // Sanitize user inputs
        const sanitizedNotes = notes ? sanitizeText(notes) : notes;

        if (action === 'progress' && articleId) {
            // Update reading progress
            await bookmarkService.updateProgress(user.id, articleId, progress || 0, readTime || 0);
            return NextResponse.json({ success: true });
        }

        const success = await bookmarkService.addBookmark(user.id, articleId, sanitizedNotes);
        return NextResponse.json({ success });

    } catch (error) {
        logger.error('Bookmarks API POST error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
    }
)
);

export const DELETE = createAPIWrapper('/api/bookmarks', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
    requireAuth: true,
})(async (request: NextRequest) => {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { articleId } = body;

        if (!articleId) {
            return NextResponse.json({ error: 'articleId required' }, { status: 400 });
        }

        const success = await bookmarkService.removeBookmark(user.id, articleId);
        return NextResponse.json({ success });

    } catch (error) {
        logger.error('Bookmarks API DELETE error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
});
