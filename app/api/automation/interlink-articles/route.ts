/**
 * Auto-Interlinking API
 * 
 * POST /api/automation/interlink-articles
 * - Auto-interlink a single article or batch of articles
 * 
 * GET /api/automation/interlink-articles?articleId=xxx
 * - Get interlinking suggestions for an article (dry run)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { autoInterlinkArticle, batchInterlinkArticles, findRelatedArticles } from '@/lib/automation/auto-interlinking';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/automation/interlink-articles
 * Get interlinking suggestions (dry run)
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('articleId');

        if (!articleId) {
            return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
        }

        // Get suggestions (dry run)
        const result = await autoInterlinkArticle(articleId, {
            maxLinks: 10,
            minRelevance: 0.3,
            dryRun: true
        });

        return NextResponse.json({
            success: true,
            ...result
        });
    } catch (error) {
        logger.error('Error getting interlinking suggestions', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/automation/interlink-articles
 * Auto-interlink article(s)
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { articleId, articleIds, maxLinks, minRelevance } = body;

        // Single article
        if (articleId) {
            const result = await autoInterlinkArticle(articleId, {
                maxLinks: maxLinks || 5,
                minRelevance: minRelevance || 0.3,
                dryRun: false
            });

            return NextResponse.json({
                success: true,
                ...result
            });
        }

        // Batch articles
        if (articleIds && Array.isArray(articleIds)) {
            const result = await batchInterlinkArticles(articleIds, {
                maxLinks: maxLinks || 5,
                minRelevance: minRelevance || 0.3
            });

            return NextResponse.json({
                success: true,
                ...result
            });
        }

        return NextResponse.json(
            { error: 'articleId or articleIds is required' },
            { status: 400 }
        );
    } catch (error) {
        logger.error('Error auto-interlinking articles', error as Error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
