
import Parser from 'rss-parser';
// @ts-ignore
import googleTrends from 'google-trends-api';
import { logger } from '@/lib/logger';

const parser = new Parser();

export interface TrendSignal {
    topic: string;
    source: string;
    url?: string;
    volume?: string;
    score: number; // 0-100 relevance score
}

const FINANCE_FEEDS = [
    { name: 'MoneyControl', url: 'https://www.moneycontrol.com/rss/latestnews.xml' },
    { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms' },
    { name: 'Mint', url: 'https://www.livemint.com/rss/money' }
];

export class GhostScraper {
    
    /**
     * Scan for trending financial topics
     */
    static async scanTrends(): Promise<TrendSignal[]> {
        const trends: TrendSignal[] = [];
        
        // 1. Try Google Trends (India)
        try {
            const results = await googleTrends.dailyTrends({
                geo: 'IN',
                category: 'b' // Business
            });
            const parsed = JSON.parse(results);
            const days = parsed.default.trendingSearchesDays;
            if (days && days.length > 0) {
                days[0].trendingSearches.forEach((search: any) => {
                    trends.push({
                        topic: search.title.query,
                        source: 'Google Trends',
                        volume: search.formattedTraffic,
                        score: 90 // High relevance
                    });
                });
            }
        } catch (error) {
            logger.warn('Google Trends Scraper failed, falling back to RSS', { error: error instanceof Error ? error.message : 'Unknown' });
        }

        // 2. RSS Feeds
        if (trends.length < 5) {
            for (const feedSource of FINANCE_FEEDS) {
                try {
                    const feed = await parser.parseURL(feedSource.url);
                    // Take top 3 from each
                    feed.items.slice(0, 3).forEach(item => {
                        if (item.title && !trends.find(t => t.topic === item.title)) {
                            trends.push({
                                topic: item.title,
                                source: feedSource.name,
                                url: item.link,
                                score: 70 // Medium relevance from news
                            });
                        }
                    });
                } catch (error) {
                    logger.warn(`RSS Feed failed: ${feedSource.name}`);
                }
            }
        }

        return trends.sort((a, b) => b.score - a.score);
    }
}
