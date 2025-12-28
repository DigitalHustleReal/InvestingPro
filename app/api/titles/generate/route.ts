import { NextRequest, NextResponse } from 'next/server';
import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Generate Semantic Title Variations API
 * POST /api/titles/generate
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { original_title, primary_keyword, count = 10, article_id } = body;

        if (!original_title || !primary_keyword) {
            return NextResponse.json(
                { success: false, error: 'original_title and primary_keyword are required' },
                { status: 400 }
            );
        }

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
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate title variations';
        logger.error('Error generating title variations', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

