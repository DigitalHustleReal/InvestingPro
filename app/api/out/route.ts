import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Use Service Role to allow writing to affiliate_clicks without RLS blocking
// and to read products that might be hidden/inactive
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('id');
    const userId = searchParams.get('u'); // Optional User ID
    const sourcePage = searchParams.get('src') || 'unknown';

    if (!productId) {
        return new NextResponse("Missing Product ID", { status: 400 });
    }

    try {
        // 1. Fetch Link (Prioritize Credit Cards as primary affiliate driver)
        let targetUrl = '';
        
        // Try Credit Card Table
        const { data: cc } = await supabase
            .from('credit_cards')
            .select('apply_link')
            .eq('product_id', productId)
            .single();

        if (cc && cc.apply_link && cc.apply_link !== '#') {
            targetUrl = cc.apply_link;
        } else {
            // Fallback: Check 'affiliate_products' if used (legacy support)
            // For now, return 404 to indicate content gap
            return new NextResponse("Product Link Not Found in Database", { status: 404 });
        }

        // 2. Generate Click ID (UUID)
        const clickId = crypto.randomUUID();

        // 3. Append Sub ID to Target URL 
        // Logic depends on the affiliate network (Impact, Cuelinks, vCommission)
        // Standard pattern is usually &sub1= or &aff_sub=
        const separator = targetUrl.includes('?') ? '&' : '?';
        const finalUrl = `${targetUrl}${separator}sub1=${clickId}${userId ? `&sub2=${userId}` : ''}`;

        // 4. Log Click (Critical for Attribution)
        const { error: logError } = await supabase.from('affiliate_clicks').insert({
            id: clickId,
            product_id: productId,
            user_id: userId || null, // null if guest
            source_page: sourcePage,
            sub_id: clickId // Used to match conversion reports later
        });

        if (logError) {
            console.error("Failed to log click:", logError);
            // We still redirect the user, don't block them because logging failed
        }

        // 5. Redirect User
        return NextResponse.redirect(finalUrl);

    } catch (error) {
        console.error("Click Tracking Error catch:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
