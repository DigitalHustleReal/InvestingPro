/**
 * Affiliate Conversion Postback Webhook
 * 
 * Receives conversion notifications from affiliate networks
 * Updates the affiliate_clicks table with conversion data
 * 
 * Supported parameters (from various networks):
 * - click_id: Original click ID from our system
 * - transaction_id: Network's transaction identifier
 * - amount: Commission amount earned
 * - status: approved, pending, rejected
 * - product_id: Product that converted
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Postback secret for validation (set in env)
const POSTBACK_SECRET = process.env.AFFILIATE_POSTBACK_SECRET || 'investingpro_secret_2026';

interface PostbackPayload {
    click_id?: string;
    transaction_id?: string;
    amount?: number;
    commission?: number;
    status?: 'approved' | 'pending' | 'rejected';
    product_id?: string;
    partner_slug?: string;
    conversion_type?: 'application' | 'purchase' | 'signup';
}

export async function GET(request: NextRequest) {
    // Some networks send GET requests
    return handlePostback(request, 'GET');
}

export async function POST(request: NextRequest) {
    return handlePostback(request, 'POST');
}

async function handlePostback(request: NextRequest, method: string) {
    const startTime = Date.now();
    
    try {
        // 1. Validate secret (basic security)
        const searchParams = request.nextUrl.searchParams;
        const secret = searchParams.get('secret') || searchParams.get('key');
        
        if (secret !== POSTBACK_SECRET) {
            console.warn('[Postback] Invalid secret attempted');
            return NextResponse.json(
                { error: 'Invalid authentication' },
                { status: 401 }
            );
        }
        
        // 2. Parse payload (from query params or body)
        let payload: PostbackPayload = {};
        
        if (method === 'GET') {
            payload = {
                click_id: searchParams.get('click_id') || searchParams.get('clickid') || undefined,
                transaction_id: searchParams.get('transaction_id') || searchParams.get('txn_id') || undefined,
                amount: parseFloat(searchParams.get('amount') || searchParams.get('payout') || '0'),
                commission: parseFloat(searchParams.get('commission') || '0'),
                status: (searchParams.get('status') || 'approved') as any,
                product_id: searchParams.get('product_id') || undefined,
                partner_slug: searchParams.get('partner') || searchParams.get('network') || undefined,
                conversion_type: (searchParams.get('type') || 'application') as any
            };
        } else {
            const body = await request.json().catch(() => ({}));
            payload = {
                click_id: body.click_id || body.clickid,
                transaction_id: body.transaction_id || body.txn_id,
                amount: parseFloat(body.amount || body.payout || 0),
                commission: parseFloat(body.commission || 0),
                status: body.status || 'approved',
                product_id: body.product_id,
                partner_slug: body.partner || body.network,
                conversion_type: body.type || 'application'
            };
        }
        
        // 3. Validate required fields
        if (!payload.click_id && !payload.transaction_id) {
            return NextResponse.json(
                { error: 'Missing click_id or transaction_id' },
                { status: 400 }
            );
        }
        
        // 4. Log the postback
        console.log(`[Postback] Received: click=${payload.click_id}, amount=${payload.amount}, status=${payload.status}`);
        
        // 5. Update the click record if we have click_id
        if (payload.click_id) {
            const { error: updateError } = await supabase
                .from('affiliate_clicks')
                .update({
                    converted: payload.status === 'approved',
                    conversion_status: payload.status,
                    commission_earned: payload.commission || payload.amount || 0,
                    conversion_type: payload.conversion_type,
                    transaction_id: payload.transaction_id,
                    converted_at: new Date().toISOString()
                })
                .eq('id', payload.click_id);
            
            if (updateError) {
                console.error('[Postback] Update failed:', updateError);
            }
        }
        
        // 6. Also update the affiliate_links aggregate (if we can match)
        if (payload.click_id && payload.status === 'approved') {
            // Get the link_id from the click
            const { data: clickData } = await supabase
                .from('affiliate_clicks')
                .select('link_id')
                .eq('id', payload.click_id)
                .single();
            
            if (clickData?.link_id) {
                await supabase.rpc('increment_affiliate_conversions', { 
                    link_id: clickData.link_id,
                    revenue_amount: payload.commission || payload.amount || 0
                });
            }
        }
        
        // 7. Log to conversions table for analytics
        try {
            const { error: conversionError } = await supabase.from('affiliate_conversions').insert({
                click_id: payload.click_id,
                transaction_id: payload.transaction_id,
                product_id: payload.product_id,
                partner_slug: payload.partner_slug,
                amount: payload.amount,
                commission: payload.commission,
                status: payload.status,
                conversion_type: payload.conversion_type,
                raw_payload: payload,
                received_at: new Date().toISOString()
            });
            // Table might not exist yet, that's okay - ignore errors
            if (conversionError) {
                // Silently ignore - table might not exist
            }
        } catch (error) {
            // Silently ignore - table might not exist
        }
        
        const processingTime = Date.now() - startTime;
        console.log(`[Postback] Processed in ${processingTime}ms`);
        
        // 8. Return success (networks expect specific responses)
        return NextResponse.json({
            success: true,
            message: 'Conversion recorded',
            click_id: payload.click_id,
            processing_time_ms: processingTime
        });
        
    } catch (error) {
        console.error('[Postback] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
