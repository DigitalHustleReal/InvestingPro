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
        // 1. Fetch Link
        const { data: link, error } = await supabase
            .from('affiliate_links')
            .select('id, destination_url, is_active')
            .eq('slug', slug)
            .single();

        if (error || !link || !link.is_active) {
            // Link not found or inactive
            return NextResponse.redirect(new URL('/404', request.url));
        }

        // 2. Async Track Click (Fire and Forget)
        // We don't await this to speed up redirect
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referer = request.headers.get('referer') || 'direct';
        
        // Update counter
        supabase.rpc('increment_affiliate_click', { link_row_id: link.id });
        
        // Log detailed click
        supabase.from('affiliate_clicks').insert({
            link_id: link.id,
            user_agent: userAgent,
            referer: referer
        });

        // 3. Redirect
        return NextResponse.redirect(link.destination_url);

    } catch (err) {
        console.error('Redirect error:', err);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
