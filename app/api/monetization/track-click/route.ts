import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliateClick } from '@/lib/monetization/tracking';
import { logger } from '@/lib/logger';

/**
 * API Route: Track Affiliate Click
 * 
 * Tracks affiliate link clicks with full context
 * Used by ContextualAffiliateLink component
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const clickId = await trackAffiliateClick({
            productId: body.productId,
            productType: body.productType,
            articleId: body.articleId,
            sourcePage: body.sourcePage || '',
            linkPosition: body.linkPosition || '',
            linkContext: body.linkContext,
            userAgent: request.headers.get('user-agent') || '',
            referrer: request.headers.get('referer') || '',
        });

        return NextResponse.json({ success: true, clickId });
    } catch (error) {
        logger.error('Error in track-click API', error as Error);
        return NextResponse.json(
            { success: false, error: 'Failed to track click' },
            { status: 500 }
        );
    }
}

