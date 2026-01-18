import { NextRequest, NextResponse } from 'next/server';
import { syncGSCRankingsToDatabase } from '@/lib/seo/gsc-api';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Sync Google Search Console rankings to database
 * 
 * GET /api/seo/rankings/sync
 * - Syncs rankings for all articles' primary keywords
 * 
 * POST /api/seo/rankings/sync
 * - Body: { keywords: string[] }
 * - Syncs rankings for specific keywords
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all primary keywords from articles
        const { data: articles, error } = await supabase
            .from('articles')
            .select('primary_keyword')
            .not('primary_keyword', 'is', null)
            .eq('status', 'published');

        if (error) {
            logger.error('Failed to fetch articles for ranking sync', error);
            return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
        }

        const keywords = Array.from(
            new Set(
                (articles || [])
                    .map(a => a.primary_keyword)
                    .filter(Boolean) as string[]
            )
        );

        if (keywords.length === 0) {
            return NextResponse.json({ 
                message: 'No keywords to sync',
                synced: 0
            });
        }

        // Sync rankings
        await syncGSCRankingsToDatabase(keywords);

        return NextResponse.json({
            message: 'Rankings synced successfully',
            keywords: keywords.length,
            synced: keywords.length
        });

    } catch (error) {
        logger.error('Error syncing GSC rankings', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { keywords } = body;

        if (!keywords || !Array.isArray(keywords)) {
            return NextResponse.json(
                { error: 'keywords array required' },
                { status: 400 }
            );
        }

        // Sync rankings for specified keywords
        await syncGSCRankingsToDatabase(keywords);

        return NextResponse.json({
            message: 'Rankings synced successfully',
            keywords: keywords.length,
            synced: keywords.length
        });

    } catch (error) {
        logger.error('Error syncing GSC rankings', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
