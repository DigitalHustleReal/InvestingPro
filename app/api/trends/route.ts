import { NextRequest, NextResponse } from 'next/server';
import { trendsService } from '@/lib/trends/TrendsService';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * Get Trending Topics API
 * GET /api/trends?category=markets
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = (searchParams.get('category') as 'markets' | 'personal-finance' | 'technology') || 'markets';

    try {
        const trends = await trendsService.getTrendingTopics(category);
        return NextResponse.json({ success: true, trends });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trends' },
            { status: 500 }
        );
    }
}
