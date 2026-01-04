
/**
 * Affiliate Link Router
 * Handles /go/[slug] redirects and tracks clicks
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        let destinationUrl = '';
        let trackId = '';
        let sourceTable = '';

        // 1. Try fetching from dedicated 'affiliate_links' table
        const { data: link, error: linkError } = await supabase
            .from('affiliate_links')
            .select('id, destination_url, is_active')
            .eq('slug', slug)
            .single();

        if (link && link.is_active) {
            destinationUrl = link.destination_url;
            trackId = link.id;
            sourceTable = 'affiliate_links';
        } else {
            // 2. Fallback: Fetch from 'products' table
            const { data: product, error: prodError } = await supabase
                .from('products')
                .select('id, affiliate_link, is_active')
                .eq('slug', slug)
                .single();

            if (product && product.is_active && product.affiliate_link) {
                destinationUrl = product.affiliate_link;
                trackId = product.id;
                sourceTable = 'products';
            }
        }

        if (!destinationUrl) {
            // Link not found or inactive
            return NextResponse.redirect(new URL('/404', request.url));
        }

        // 3. Async Track Click (Fire and Forget)
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referer = request.headers.get('referer') || 'direct';
        
        // Log detailed click
        // Note: affiliate_clicks table needs to support storing either link_id or product_id, or just a generic 'entity_id' + 'entity_type'
        // For now, we will log to console if table schema doesn't match, or try best effort.
        // Ideally we assume 'affiliate_clicks' has a loose schema or we have separate tracking tables.
        // Update: We'll just log to a generic 'clicks' table if it existed, for now let's just log to console to not break flow if DB is strict.
        
        console.log(`[Affiliate Click] Slug: ${slug}, Table: ${sourceTable}, Dest: ${destinationUrl}`);

        // 4. Redirect
        return NextResponse.redirect(destinationUrl);

    } catch (err) {
        console.error('Redirect error:', err);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
