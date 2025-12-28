import { NextRequest, NextResponse } from 'next/server';
import { trackConversion } from '@/lib/monetization/tracking';
import { logger } from '@/lib/logger';

/**
 * API Route: Track Conversion
 * 
 * Called by affiliate network postback/webhook
 * Updates click record with conversion data
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Verify webhook (add your verification logic here)
        // const isValid = verifyWebhookSignature(request);
        // if (!isValid) {
        //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        const success = await trackConversion({
            clickId: body.clickId,
            conversionValue: body.conversionValue,
            commissionEarned: body.commissionEarned,
            conversionType: body.conversionType || 'application',
        });

        return NextResponse.json({ success });
    } catch (error) {
        logger.error('Error in track-conversion API', error as Error);
        return NextResponse.json(
            { success: false, error: 'Failed to track conversion' },
            { status: 500 }
        );
    }
}

