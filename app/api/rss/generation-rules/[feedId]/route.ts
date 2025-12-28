import { NextRequest, NextResponse } from 'next/server';
import { rssArticleGenerator } from '@/lib/rss-import/RSSArticleGenerator';
import { logger } from '@/lib/logger';

/**
 * Get generation rules for feed
 * GET /api/rss/generation-rules/:feedId
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { feedId: string } }
) {
    try {
        const rules = await rssArticleGenerator.getGenerationRules(params.feedId);
        
        return NextResponse.json({
            success: true,
            rules: rules || {
                keyword_strategy: 'extract',
                auto_publish: false,
                publish_as_draft: true,
                add_source_attribution: true,
                target_word_count: 1500
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch generation rules';
        logger.error('Error fetching generation rules', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Create/update generation rules
 * POST /api/rss/generation-rules/:feedId
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { feedId: string } }
) {
    try {
        const body = await request.json();
        const ruleId = await rssArticleGenerator.saveGenerationRules(params.feedId, body);
        
        return NextResponse.json({
            success: true,
            rule_id: ruleId
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save generation rules';
        logger.error('Error saving generation rules', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

