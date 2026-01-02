
import { NextRequest, NextResponse } from 'next/server';
import { affiliateService } from '@/lib/monetization/affiliate-service';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/client';

export async function GET(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const codeOrSlug = params.code;
        
        if (!codeOrSlug) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // 1. Try Affiliate Links (Shortcodes)
        const link = await affiliateService.getLinkByShortCode(codeOrSlug);
        if (link) {
            const articleId = req.nextUrl.searchParams.get('article') || undefined;
            affiliateService.recordClick(link.id, {
                articleId,
                referrer: req.headers.get('referer') || undefined,
                userAgent: req.headers.get('user-agent') || undefined
            }).catch(() => {});
            return NextResponse.redirect(link.destination_url);
        }

        // 2. Try Products (Slugs) as Fallback
        const supabase = createClient();
        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('slug', codeOrSlug)
            .single();

        if (product && (product.affiliate_link || product.official_link)) {
            const destination = product.affiliate_link || product.official_link;
            return NextResponse.redirect(destination || '/');
        }

        logger.warn('Monetization link not found', { codeOrSlug });
        return NextResponse.redirect(new URL('/', req.url));

    } catch (error) {
        logger.error('Affiliate redirect failed', error as Error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}
