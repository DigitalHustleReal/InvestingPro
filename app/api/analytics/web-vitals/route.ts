/**
 * Web Vitals API Endpoint
 * 
 * Receives and stores Core Web Vitals metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, value, id, rating, delta, url, timestamp } = body;

        // Validate required fields
        if (!name || value === undefined || !rating) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Missing required fields: name, value, rating',
                    },
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Store in web_vitals table (create if doesn't exist)
        const { error } = await supabase
            .from('web_vitals')
            .insert({
                metric_name: name,
                metric_value: value,
                metric_id: id || null,
                rating: rating,
                delta: delta || null,
                url: url || null,
                timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
            });

        if (error) {
            // If table doesn't exist, log but don't fail
            if (error.code === '42P01') {
                logger.warn('web_vitals table does not exist - metrics not stored', { name, value });
                return NextResponse.json({ success: true, message: 'Metric received (table not found)' });
            }

            logger.error('Failed to store web vitals metric', error as Error, { name, value });
            // Don't fail the request - metrics are non-critical
            return NextResponse.json({ success: true, message: 'Metric received (storage failed)' });
        }

        // Log slow metrics in development
        if (process.env.NODE_ENV === 'development' && rating !== 'good') {
            logger.info('Web Vital metric', { name, value, rating, url });
        }

        return NextResponse.json({ success: true, message: 'Metric stored' });
    } catch (error) {
        logger.error('Web vitals API error', error as Error);
        // Return success even on error - don't block client
        return NextResponse.json({ success: true, message: 'Metric received' }, { status: 200 });
    }
}
