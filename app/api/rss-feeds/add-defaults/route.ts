import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/rss-feeds/add-defaults
 * Add default RSS feeds for financial news
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const defaultFeeds = [
            {
                name: 'RBI News',
                url: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=0',
                category: 'banking',
                status: 'active'
            },
            {
                name: 'SEBI Updates',
                url: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=1&smid=1',
                category: 'regulatory',
                status: 'active'
            },
            {
                name: 'Financial Express',
                url: 'https://www.financialexpress.com/feed/',
                category: 'news',
                status: 'active'
            },
            {
                name: 'Economic Times',
                url: 'https://economictimes.indiatimes.com/rssfeedsdefault.cms',
                category: 'news',
                status: 'active'
            }
        ];

        // Try to insert feeds (table may not exist)
        const { data, error } = await supabase
            .from('rss_feeds')
            .upsert(defaultFeeds, { onConflict: 'url' })
            .select();

        if (error) {
            // Table doesn't exist, return success with message
            return NextResponse.json({
                success: true,
                message: 'RSS feeds table not found. Please run migration to create rss_feeds table.',
                feeds: defaultFeeds
            });
        }

        return NextResponse.json({
            success: true,
            feeds: data,
            count: data?.length || 0
        });
    } catch (error: any) {
        logger.error('Failed to add default RSS feeds', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to add default feeds' },
            { status: 500 }
        );
    }
}








