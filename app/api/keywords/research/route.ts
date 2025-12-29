import { NextRequest, NextResponse } from 'next/server';
import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { logger } from '@/lib/logger';

/**
 * Perform Full Keyword Research API
 * POST /api/keywords/research
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { primary_keyword, article_id, article_context } = body;

        if (!primary_keyword) {
            return NextResponse.json(
                { success: false, error: 'primary_keyword is required' },
                { status: 400 }
            );
        }

        // Perform keyword research
        const researchResult = await keywordResearchService.performKeywordResearch(
            primary_keyword,
            article_context
        );

        // Save to database if article_id provided
        if (article_id) {
            await keywordResearchService.saveKeywords(
                article_id,
                primary_keyword,
                researchResult
            );
        }

        return NextResponse.json({
            success: true,
            research: researchResult
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to perform keyword research';
        logger.error('Error performing keyword research', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Get Keywords for Article API
 * GET /api/keywords/research?article_id=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('article_id');

        if (!articleId) {
            return NextResponse.json(
                { success: false, error: 'article_id is required' },
                { status: 400 }
            );
        }

        const researchResult = await keywordResearchService.getKeywordsForArticle(articleId);

        if (!researchResult) {
            return NextResponse.json({
                success: true,
                research: null,
                message: 'No keywords found for this article'
            });
        }

        return NextResponse.json({
            success: true,
            research: researchResult
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch keywords';
        logger.error('Error fetching keywords', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

