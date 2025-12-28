import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import Parser from 'rss-parser';

const parser = new Parser();

/**
 * POST /api/rss-feeds/scrape
 * Scrape RSS feeds and store items
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { feedId, feedUrl } = await request.json().catch(() => ({}));

        // Get RSS feeds from database
        let query = supabase.from('rss_feeds').select('*').eq('status', 'active');
        if (feedId) query = query.eq('id', feedId);
        if (feedUrl) query = query.eq('url', feedUrl);

        const { data: feeds, error: feedsError } = await query;

        if (feedsError || !feeds || feeds.length === 0) {
            // If no feeds table exists, use default feeds
            const defaultFeeds = [
                { url: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=0', name: 'RBI News' },
                { url: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=1&smid=1', name: 'SEBI Updates' }
            ];

            const results = [];
            for (const feed of defaultFeeds) {
                try {
                    const parsed = await parser.parseURL(feed.url);
                    results.push({
                        feed: feed.name,
                        items: parsed.items.slice(0, 10).map(item => ({
                            title: item.title,
                            link: item.link,
                            pubDate: item.pubDate,
                            content: item.contentSnippet || item.content
                        }))
                    });
                } catch (err) {
                    logger.warn(`Failed to parse feed ${feed.url}`, err);
                }
            }

            return NextResponse.json({
                success: true,
                feeds: results,
                timestamp: new Date().toISOString()
            });
        }

        // Scrape all active feeds
        const results = [];
        for (const feed of feeds) {
            try {
                const parsed = await parser.parseURL(feed.url);
                
                // Store items in database if rss_feed_items table exists
                const items = parsed.items.slice(0, 20).map(item => ({
                    feed_id: feed.id,
                    title: item.title,
                    link: item.link,
                    pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    content: item.contentSnippet || item.content || '',
                    guid: item.guid || item.link
                }));

                // Try to insert items (table may not exist)
                const { error: insertError } = await supabase
                    .from('rss_feed_items')
                    .upsert(items, { onConflict: 'guid' })
                    .catch(() => ({ error: null })); // Ignore if table doesn't exist

                results.push({
                    feed: feed.name,
                    itemsCount: items.length,
                    lastFetch: new Date().toISOString()
                });
            } catch (err: any) {
                logger.warn(`Failed to scrape feed ${feed.url}`, err);
                results.push({
                    feed: feed.name,
                    error: err.message,
                    itemsCount: 0
                });
            }
        }

        return NextResponse.json({
            success: true,
            results,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        logger.error('RSS feed scraping failed', error);
        return NextResponse.json(
            { success: false, error: error.message || 'RSS scraping failed' },
            { status: 500 }
        );
    }
}








