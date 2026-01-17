/**
 * Get Scheduled Articles API
 * 
 * GET /api/admin/articles/scheduled
 * - Get all scheduled articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getScheduledArticles } from '@/lib/automation/scheduler';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/articles/scheduled
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '100');
        const startDate = searchParams.get('startDate') || undefined;
        const endDate = searchParams.get('endDate') || undefined;

        const scheduledArticles = await getScheduledArticles({
            limit,
            startDate,
            endDate
        });

        return NextResponse.json({
            success: true,
            articles: scheduledArticles,
            count: scheduledArticles.length
        });
    } catch (error) {
        logger.error('Error fetching scheduled articles', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
