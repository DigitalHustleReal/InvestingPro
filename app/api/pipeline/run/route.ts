import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/pipeline/run
 * Run the content pipeline (scrape → generate → review)
 */
export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json().catch(() => ({}));
        const supabase = await createClient();

        // Record pipeline run
        const runId = crypto.randomUUID();
        const runStart = new Date().toISOString();

        // Step 1: Scrape RSS Feeds
        logger.info('Pipeline: Scraping RSS feeds');
        const rssResponse = await fetch(`${request.nextUrl.origin}/api/rss-feeds/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const rssData = await rssResponse.json().catch(() => ({ success: false }));

        // Step 2: Scrape Trending Data
        logger.info('Pipeline: Fetching trending topics');
        const trendingResponse = await fetch(`${request.nextUrl.origin}/api/scraper/trending`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const trendingData = await trendingResponse.json().catch(() => ({ success: false, topics: [] }));

        // Step 3: Generate Articles (if action is 'generate')
        let generatedArticles = [];
        if (action === 'generate' && trendingData.topics) {
            logger.info('Pipeline: Generating articles from trending topics');
            const topics = trendingData.topics.slice(0, 5);
            
            for (const topic of topics) {
                try {
                    const generateResponse = await fetch(`${request.nextUrl.origin}/api/articles/generate-initial`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            topic: topic.keyword || topic.name || topic,
                            category: 'investing-basics',
                            language: 'en',
                            tone: 'informative'
                        })
                    });

                    if (generateResponse.ok) {
                        const article = await generateResponse.json();
                        generatedArticles.push(article.article);
                    }
                } catch (err) {
                    logger.warn(`Failed to generate article for topic: ${topic.keyword}`, err);
                }
            }
        }

        // Record pipeline completion
        const runEnd = new Date().toISOString();
        const duration = new Date(runEnd).getTime() - new Date(runStart).getTime();

        // Try to save pipeline run (table may not exist)
        await supabase
            .from('pipeline_runs')
            .insert([{
                id: runId,
                status: 'completed',
                started_at: runStart,
                completed_at: runEnd,
                duration_ms: duration,
                articles_generated: generatedArticles.length,
                rss_items_scraped: rssData.results?.reduce((sum: number, r: any) => sum + (r.itemsCount || 0), 0) || 0,
                trending_topics_found: trendingData.topics?.length || 0
            }])
            .catch(() => {}); // Ignore if table doesn't exist

        return NextResponse.json({
            success: true,
            runId,
            startedAt: runStart,
            completedAt: runEnd,
            duration: `${(duration / 1000).toFixed(2)}s`,
            results: {
                rssFeeds: rssData.success ? rssData.results : [],
                trendingTopics: trendingData.topics || [],
                articlesGenerated: generatedArticles.length,
                articles: generatedArticles
            }
        });
    } catch (error: any) {
        logger.error('Pipeline execution failed', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.message || 'Pipeline execution failed' 
            },
            { status: 500 }
        );
    }
}








