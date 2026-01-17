/**
 * API Timing Analytics Endpoint
 * 
 * Receives and stores API response time metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { method, path, duration, status, timestamp } = body;

        // Validate required fields
        if (!method || !path || duration === undefined || status === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Missing required fields: method, path, duration, status',
                    },
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Store in api_timing table (create if doesn't exist)
        const { error } = await supabase
            .from('api_timing')
            .insert({
                method: method,
                path: path,
                duration_ms: duration,
                status_code: status,
                timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
            });

        if (error) {
            // If table doesn't exist, log but don't fail
            if (error.code === '42P01') {
                logger.debug('api_timing table does not exist - metrics not stored', { path, duration });
                return NextResponse.json({ success: true, message: 'Metric received (table not found)' });
            }

            logger.debug('Failed to store API timing metric', error as Error, { path, duration });
            // Don't fail the request - metrics are non-critical
            return NextResponse.json({ success: true, message: 'Metric received (storage failed)' });
        }

        return NextResponse.json({ success: true, message: 'Metric stored' });
    } catch (error) {
        // Return success even on error - don't block client
        return NextResponse.json({ success: true, message: 'Metric received' }, { status: 200 });
    }
}
