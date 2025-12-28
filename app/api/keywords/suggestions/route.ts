import { NextRequest, NextResponse } from 'next/server';
import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { logger } from '@/lib/logger';

/**
 * Get Keyword Suggestions API
 * POST /api/keywords/suggestions
 * 
 * Provides alternative and semantic keyword suggestions
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { primary_keyword, type = 'all', count = 10 } = body;

        if (!primary_keyword) {
            return NextResponse.json(
                { success: false, error: 'primary_keyword is required' },
                { status: 400 }
            );
        }

        const results: any = {};

        if (type === 'all' || type === 'alternative') {
            results.alternative_keywords = await keywordResearchService.generateAlternativeKeywords(
                primary_keyword,
                count
            );
        }

        if (type === 'all' || type === 'semantic') {
            results.semantic_keywords = await keywordResearchService.generateSemanticKeywords(
                primary_keyword,
                count
            );
        }

        return NextResponse.json({
            success: true,
            suggestions: results
        });
    } catch (error: any) {
        logger.error('Error generating keyword suggestions', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate suggestions' },
            { status: 500 }
        );
    }
}

