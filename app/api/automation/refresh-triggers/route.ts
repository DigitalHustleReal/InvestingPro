import { NextRequest, NextResponse } from 'next/server';
import { processRefreshTriggers, checkRankingDropTriggers, checkStaleContentTriggers } from '@/lib/automation/refresh-triggers';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/automation/refresh-triggers
 * Check for refresh triggers (manual trigger or cron)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify authentication (admin only)
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // Allow service role for cron jobs
            const authHeader = request.headers.get('authorization');
            const serviceKey = process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const { searchParams } = new URL(request.url);
        const checkType = searchParams.get('type') || 'all'; // 'all' | 'rankings' | 'stale'

        let triggers = [];

        if (checkType === 'rankings' || checkType === 'all') {
            const rankingTriggers = await checkRankingDropTriggers(3);
            triggers.push(...rankingTriggers);
        }

        if (checkType === 'stale' || checkType === 'all') {
            const staleTriggers = await checkStaleContentTriggers(90);
            triggers.push(...staleTriggers);
        }

        return NextResponse.json({
            success: true,
            triggers,
            count: triggers.length,
            checkedAt: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error checking refresh triggers', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/automation/refresh-triggers
 * Process refresh triggers (manual trigger or cron)
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication (admin only or cron)
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // Allow service role for cron jobs
            const authHeader = request.headers.get('authorization');
            const serviceKey = process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const result = await processRefreshTriggers();

        return NextResponse.json({
            success: true,
            ...result,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Error processing refresh triggers', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
