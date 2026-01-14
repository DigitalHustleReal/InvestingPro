import { NextRequest, NextResponse } from 'next/server';
import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { titleGenerateSchema } from '@/lib/validation/schemas';

/**
 * Generate Semantic Title Variations API
 * POST /api/titles/generate
 */
export const POST = createAPIWrapper('/api/titles/generate', {
    rateLimitType: 'ai', // AI generation - strict rate limit
    trackMetrics: true,
})(
    withValidation(titleGenerateSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
    try {
        // Body is already validated by middleware
        const { original_title, primary_keyword, count = 10, article_id } = body;

        const variations = await keywordResearchService.generateTitleVariations(
            original_title,
            primary_keyword,
            count
        );

        // Save to database if article_id provided
        if (article_id) {
            const supabase = await createClient();
            await supabase.from('title_variations').insert(
                variations.map(v => ({
                    article_id,
                    title_text: v.title_text,
                    variation_type: v.variation_type,
                    seo_score: v.seo_score,
                    click_through_score: v.click_through_score,
                    length_score: v.length_score,
                    keyword_density: v.keyword_density,
                    generated_by: 'ai'
                }))
            );
        }

        return NextResponse.json({
            success: true,
            variations,
            count: variations.length
        });
    } catch (error) {
        logger.error('Error generating title variations', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
    }
)
);

