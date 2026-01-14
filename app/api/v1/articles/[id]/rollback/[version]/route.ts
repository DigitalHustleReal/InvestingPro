/**
 * Article Rollback API
 * 
 * POST /api/v1/articles/:id/rollback/:version
 * 
 * Restores an article to a specific version
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { restoreArticleVersion } from '@/lib/cms/version-service';
import { logger } from '@/lib/logger';
import { invalidateArticleCache } from '@/lib/cache/cache-invalidation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandler(
    withTracing(async (
        request: NextRequest,
        { params }: { params: Promise<{ id: string; version: string }> }
    ) => {
        const { id, version } = await params;
        const versionNumber = parseInt(version, 10);

        if (isNaN(versionNumber)) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid version number',
                    },
                },
                { status: 400 }
            );
        }

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
                        message: 'You do not have permission to rollback this article',
                    },
                },
                { status: 403 }
            );
        }

        // Verify version exists
        const { data: versionData } = await supabase
            .from('article_versions')
            .select('version_number')
            .eq('article_id', id)
            .eq('version_number', versionNumber)
            .single();

        if (!versionData) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: `Version ${versionNumber} not found for this article`,
                    },
                },
                { status: 404 }
            );
        }

        // Perform rollback
        const result = await restoreArticleVersion(id, versionNumber);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'ROLLBACK_FAILED',
                        message: result.error || 'Failed to restore article version',
                    },
                },
                { status: 500 }
            );
        }

        // Invalidate cache
        try {
            await invalidateArticleCache(id);
        } catch (cacheError) {
            logger.warn('Failed to invalidate cache after rollback', cacheError as Error);
        }

        logger.info('Article rolled back successfully', {
            articleId: id,
            versionNumber,
            newVersionId: result.newVersionId,
            userId: user.id,
        });

        return NextResponse.json({
            success: true,
            data: {
                article_id: id,
                restored_to_version: versionNumber,
                new_version_id: result.newVersionId,
            },
        });
    }, 'article-rollback')
);
