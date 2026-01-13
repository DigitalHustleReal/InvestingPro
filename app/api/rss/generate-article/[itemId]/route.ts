import { NextRequest, NextResponse } from 'next/server';
import { rssArticleGenerator } from '@/lib/rss-import/RSSArticleGenerator';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Generate article from RSS item
 * POST /api/rss/generate-article/:itemId
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;
        const supabase = await createClient();

        // Get RSS item
        const { data: rssItem, error: itemError } = await supabase
            .from('rss_feed_items')
            .select('*')
            .eq('id', itemId)
            .single();

        if (itemError || !rssItem) {
            return NextResponse.json(
                { success: false, error: 'RSS item not found' },
                { status: 404 }
            );
        }

        // Get generation rules for feed
        const rules = await rssArticleGenerator.getGenerationRules(rssItem.feed_id);

        // Generate article
        const result = await rssArticleGenerator.generateFromRSSItem(rssItem, rules || {});

        return NextResponse.json({
            success: true,
            article_id: result.article_id,
            structured_content: result.structured_content
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate article';
        logger.error('Error generating article from RSS item', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
