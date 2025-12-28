import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/rates/live
 * Get live financial rates for calculators
 * 
 * Query params:
 * - type: 'fd' | 'loan_personal' | 'loan_home' | 'savings' | 'inflation'
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const rateType = searchParams.get('type') || 'all';

        const supabase = await createClient();

        let query = supabase
            .from('live_rates')
            .select('*')
            .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString())
            .order('scraped_at', { ascending: false });

        if (rateType !== 'all') {
            query = query.eq('rate_type', rateType);
        }

        const { data: rates, error } = await query;

        if (error) {
            throw error;
        }

        // Get latest inflation rate
        const { data: inflationData } = await supabase
            .from('inflation_data')
            .select('*')
            .order('year', { ascending: false })
            .order('month', { ascending: false })
            .limit(1)
            .single();

        return NextResponse.json({
            success: true,
            rates: rates || [],
            inflation: inflationData || null,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        logger.error('Error fetching live rates', error as Error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch rates'
            },
            { status: 500 }
        );
    }
}

