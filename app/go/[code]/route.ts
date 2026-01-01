import { NextRequest, NextResponse } from 'next/server';
import { affiliateService } from '@/lib/monetization/affiliate-service';
import { logger } from '@/lib/logger';

export async function GET(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const shortCode = params.code;
        
        if (!shortCode) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Get the affiliate link
        const link = await affiliateService.getLinkByShortCode(shortCode);

        if (!link) {
            logger.warn('Affiliate link not found', { shortCode });
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Record the click (async, don't wait)
        const articleId = req.nextUrl.searchParams.get('article') || undefined;
        affiliateService.recordClick(link.id, {
            articleId,
            referrer: req.headers.get('referer') || undefined,
            userAgent: req.headers.get('user-agent') || undefined
        }).catch(() => {});

        // Redirect to destination
        return NextResponse.redirect(link.destination_url);

    } catch (error) {
        logger.error('Affiliate redirect failed', error as Error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}
