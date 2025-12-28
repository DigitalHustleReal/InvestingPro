import { NextRequest, NextResponse } from 'next/server';
import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { logger } from '@/lib/logger';

/**
 * Generate Long-Tail Keywords API
 * POST /api/keywords/generate
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { primary_keyword, count = 15 } = body;

        if (!primary_keyword) {
            return NextResponse.json(
                { success: false, error: 'primary_keyword is required' },
                { status: 400 }
            );
        }

        const keywords = await keywordResearchService.generateLongTailKeywords(
            primary_keyword,
            count
        );

        return NextResponse.json({
            success: true,
            keywords,
            count: keywords.length
        });
    } catch (error: any) {
        logger.error('Error generating long-tail keywords', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate keywords' },
            { status: 500 }
        );
    }
}

