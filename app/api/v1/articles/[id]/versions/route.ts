/**
 * Article Version History API
 * 
 * GET /api/v1/articles/:id/versions
 * 
 * Returns version history for an article
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { getArticleVersionHistory } from '@/lib/cms/version-service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (
        request: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) => {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    },
                },
                { status: 401 }
            );
        }

        // Check admin or author access
        const { data: article } = await supabase
            .from('articles')
            .select('author_id')
            .eq('id', id)
            .single();

        if (!article) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Article not found',
                    },
                },
                { status: 404 }
            );
        }

        // Check if user is admin or author
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const isAdmin = profile?.role === 'admin';
        const isAuthor = article.author_id === user.id;

        if (!isAdmin && !isAuthor) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You do not have permission to view version history',
                    },
                },
                { status: 403 }
            );
        }

        // Get version history
        const history = await getArticleVersionHistory(id, limit, offset);

        if (!history) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FETCH_FAILED',
                        message: 'Failed to fetch version history',
                    },
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: history,
        });
    }, 'article-versions')
);
