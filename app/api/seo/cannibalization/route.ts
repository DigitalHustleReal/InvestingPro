/**
 * Keyword Cannibalization Detection API
 * 
 * GET /api/seo/cannibalization
 * - Get full cannibalization report
 * 
 * GET /api/seo/cannibalization?articleId=xxx
 * - Check cannibalization for specific article
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { detectCannibalization, checkArticleCannibalization, getCannibalizationRecommendations } from '@/lib/seo/cannibalization-detector';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/seo/cannibalization
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

        // Check specific article
        if (articleId) {
            const result = await checkArticleCannibalization(articleId);
            
            // Add recommendations for each issue
            const issuesWithRecommendations = result.issues.map(issue => ({
                ...issue,
                recommendations: getCannibalizationRecommendations(issue)
            }));

            return NextResponse.json({
                success: true,
                hasIssue: result.hasIssue,
                issues: issuesWithRecommendations
            });
        }

        // Full report
        const report = await detectCannibalization({
            minCompetitors: 2,
            checkPublishedOnly: true
        });

        // Add recommendations for each issue
        const issuesWithRecommendations = report.issues.map(issue => ({
            ...issue,
            recommendations: getCannibalizationRecommendations(issue)
        }));

        return NextResponse.json({
            success: true,
            ...report,
            issues: issuesWithRecommendations
        });
    } catch (error) {
        logger.error('Error detecting cannibalization', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
