import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Pipeline Runs API
 * 
 * Returns list of pipeline execution runs
 * Used by CMS dashboard for automation tracking
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');

        const { createServiceClient } = await import('@/lib/supabase/service');
        const supabase = createServiceClient();

        // Query pipeline_runs table if it exists
        // Fallback to empty array if table doesn't exist yet
        let runs: any[] = [];
        
        try {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (!error && data) {
                runs = data;
            }
        } catch (err) {
            // Table might not exist yet - return empty array
            logger.warn('pipeline_runs table not found, returning empty array');
        }

        return NextResponse.json({
            success: true,
            runs,
            total: runs.length
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pipeline runs';
        logger.error('Pipeline runs API error', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}




