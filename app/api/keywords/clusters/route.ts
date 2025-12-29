import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Get Keyword Clusters API
 * GET /api/keywords/clusters
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('article_id');

        let query = supabase
            .from('keyword_clusters')
            .select(`
                *,
                article_keyword_clusters!inner(article_id)
            `)
            .order('authority_score', { ascending: false });

        if (articleId) {
            query = query.eq('article_keyword_clusters.article_id', articleId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            clusters: data || []
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clusters';
        logger.error('Error fetching keyword clusters', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

