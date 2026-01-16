/**
 * SEO Tracking API
 * Track keyword rankings and get SEO insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackKeywordRanking, getRankingHistory, getAllTrackedKeywords } from '@/lib/seo/serp-tracker';
import { requireAdmin } from '@/lib/auth/admin-auth';

/**
 * POST /api/seo/track
 * Track ranking for a keyword
 */
export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        try {
            await requireAdmin();
        } catch (authError: any) {
            if (authError.message.includes('Unauthorized')) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Authentication required' },
                    { status: 401 }
                );
            }
            if (authError.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: 'Forbidden', message: 'Admin access required' },
                    { status: 403 }
                );
            }
            throw authError;
        }

        const body = await request.json();
        const { keyword, url } = body;

        if (!keyword) {
            return NextResponse.json(
                { error: 'keyword is required' },
                { status: 400 }
            );
        }

        const result = await trackKeywordRanking(keyword, url);

        return NextResponse.json({
            success: true,
            tracking: result
        });

    } catch (error: any) {
        console.error('Error tracking keyword ranking:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to track keyword ranking. Please try again later.'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/seo/track
 * Get ranking history or all tracked keywords
 */
export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        try {
            await requireAdmin();
        } catch (authError: any) {
            if (authError.message.includes('Unauthorized')) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Authentication required' },
                    { status: 401 }
                );
            }
            if (authError.message.includes('Forbidden')) {
                return NextResponse.json(
                    { error: 'Forbidden', message: 'Admin access required' },
                    { status: 403 }
                );
            }
            throw authError;
        }

        const searchParams = request.nextUrl.searchParams;
        const keyword = searchParams.get('keyword');
        const days = parseInt(searchParams.get('days') || '30', 10);

        if (keyword) {
            // Get ranking history for specific keyword
            const history = await getRankingHistory(keyword, days);

            return NextResponse.json({
                success: true,
                keyword,
                history,
                period: {
                    days,
                    startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString()
                }
            });
        } else {
            // Get all tracked keywords with current rankings
            const keywords = await getAllTrackedKeywords();

            return NextResponse.json({
                success: true,
                keywords,
                totalTracked: keywords.length
            });
        }

    } catch (error: any) {
        console.error('Error fetching SEO tracking data:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch SEO tracking data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
