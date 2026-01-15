import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Use Service Role to allow writing to affiliate_clicks without RLS blocking
// and to read products that might be hidden/inactive
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const linkId = searchParams.get('link_id');
    const productId = searchParams.get('id');
    const userId = searchParams.get('u'); // Optional User ID
    const sourcePage = searchParams.get('src') || 'unknown';

    if (!productId && !linkId) {
        return new NextResponse("Missing Product ID or Link ID", { status: 400 });
    }

    try {
        let targetUrl = '';
        const finalLinkId = linkId;

        // CASE 1: Direct Affiliate Link ID (Preferred)
        if (linkId) {
            const { data: link } = await supabase
                .from('affiliate_links')
                .select('destination_url, partner_id')
                .eq('id', linkId)
                .single();
            
            if (link) {
                targetUrl = link.destination_url;
            } else {
                 return new NextResponse("Affiliate Link Not Found", { status: 404 });
            }
        } 
        // CASE 2: Legacy/Product ID Lookup
        else if (productId) {
            // Try Credit Card Table
            const { data: cc } = await supabase
                .from('credit_cards')
                .select('apply_link')
                .eq('product_id', productId)
                .single();

            if (cc && cc.apply_link && cc.apply_link !== '#') {
                targetUrl = cc.apply_link;
                // Ideally we should find/create a link_id for this product to track it properly in the new schema
                // For now, we'll log it with null link_id but valid product_id
            } else {
                return new NextResponse("Product Link Not Found in Database", { status: 404 });
            }
        }

        // 2. Generate Click ID (UUID)
        const clickId = crypto.randomUUID();

        // 3. Append Sub ID to Target URL 
        const separator = targetUrl.includes('?') ? '&' : '?';
        const finalUrl = `${targetUrl}${separator}sub1=${clickId}${userId ? `&sub2=${userId}` : ''}`;

        // 4. Log Click
        // We use the new schema 'affiliate_clicks'
        const { error: logError } = await supabase.from('affiliate_clicks').insert({
            id: clickId,
            link_id: finalLinkId || null,
            product_id: productId || null,
            user_id: userId || null,
            source_page: sourcePage,
            destination_url: targetUrl,
            user_agent: request.headers.get('user-agent'),
            referrer: request.headers.get('referer'),
            ip_hash: 'anonymized' // We don't store raw IP for privacy usually, or handle it via edge function
        });

        if (logError) {
            console.error("Failed to log click:", logError);
        }

        // 5. Redirect User
        return NextResponse.redirect(finalUrl);

    } catch (error) {
        console.error("Click Tracking Error catch:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
