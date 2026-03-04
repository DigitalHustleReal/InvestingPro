/**
 * A/B Test Event Tracking API
 * 
 * POST /api/ab-test/track
 * Tracks impressions and conversions for A/B tests
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { testId, variantId, eventType, sessionId, conversionValue, userId } = body;
        
        if (!testId || !variantId || !eventType) {
            return NextResponse.json(
                { error: 'Missing required fields: testId, variantId, eventType' },
                { status: 400 }
            );
        }
        
        if (!['impression', 'conversion'].includes(eventType)) {
            return NextResponse.json(
                { error: 'eventType must be "impression" or "conversion"' },
                { status: 400 }
            );
        }
        
        const supabase = await createClient();
        
        // Insert event
        const { error } = await supabase
            .from('ab_test_events')
            .insert({
                test_id: testId,
                variant_id: variantId,
                event_type: eventType,
                session_id: sessionId || null,
                user_id: userId || null,
                conversion_value: conversionValue || null,
            });
        
        if (error) {
            logger.error('Failed to track A/B event:', error);
            // Return success anyway - don't expose errors to client
            return NextResponse.json({ success: true });
        }
        
        return NextResponse.json({ success: true });
        
    } catch (error) {
        logger.error('Error in A/B tracking:', error);
        // Return success anyway - don't block user experience
        return NextResponse.json({ success: true });
    }
}
