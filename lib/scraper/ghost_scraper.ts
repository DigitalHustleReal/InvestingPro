import Parser from 'rss-parser';
import { logger } from '@/lib/logger';

const parser = new Parser();

export interface TrendSignal {
    topic: string;
    source: string;
    url?: string;
    volume?: string;
    score: number; // 0-100 relevance score
}

// Personal Finance focused RSS feeds
const PERSONAL_FINANCE_FEEDS = [
    { name: 'Mint Personal Finance', url: 'https://www.livemint.com/rss/money' },
    { name: 'Economic Times Personal Finance', url: 'https://economictimes.indiatimes.com/wealth/personal-finance-news/rssfeeds/49728498.cms' },
    { name: 'MoneyControl Personal Finance', url: 'https://www.moneycontrol.com/rss/personalfinance.xml' }
];

export class GhostScraper {
    
    /**
     * Scan for trending PERSONAL FINANCE topics
     * Priority: SerpApi Google Trends > RSS Feeds > Default topics
     */
    static async scanTrends(): Promise<TrendSignal[]> {
        const trends: TrendSignal[] = [];
        
        // 1. Try SerpApi Google Trends (if API key available)
        const serpApiKey = process.env.SERPAPI_API_KEY;
        if (serpApiKey) {
            try {
                const trendingNow = await this.fetchGoogleTrendsViaSerpApi(serpApiKey);
                trends.push(...trendingNow);
                logger.info(`Google Trends via SerpApi: Found ${trendingNow.length} trends`);
            } catch (error) {
                logger.warn('SerpApi Google Trends failed', { error: error instanceof Error ? error.message : 'Unknown' });
            }
        }

        // 2. RSS Feeds for Personal Finance
        if (trends.length < 5) {
            for (const feedSource of PERSONAL_FINANCE_FEEDS) {
                try {
                    const feed = await parser.parseURL(feedSource.url);
                    feed.items.slice(0, 5).forEach(item => {
                        if (item.title && !trends.find(t => t.topic === item.title)) {
                            trends.push({
                                topic: item.title,
                                source: feedSource.name,
                                url: item.link,
                                score: 75 // Good relevance from personal finance feeds
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
    
    /**
     * Fetch Google Trends via SerpApi (reliable, not blocked)
     */
    private static async fetchGoogleTrendsViaSerpApi(apiKey: string): Promise<TrendSignal[]> {
        const trends: TrendSignal[] = [];
        
        // Search for personal finance related trending topics
        const queries = [
            'best sip plans india',
            'best credit cards india',
            'home loan interest rates',
            'tax saving investments'
        ];
        
        // Use SerpApi's Google Trends endpoint
        const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(queries[0])}&geo=IN&data_type=RELATED_QUERIES&api_key=${apiKey}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`SerpApi returned ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract related queries (rising)
            if (data.related_queries?.rising) {
                data.related_queries.rising.slice(0, 5).forEach((q: any) => {
                    trends.push({
                        topic: q.query,
                        source: 'Google Trends',
                        volume: q.value,
                        score: 90
                    });
                });
            }
            
            // Extract related queries (top)
            if (data.related_queries?.top) {
                data.related_queries.top.slice(0, 5).forEach((q: any) => {
                    if (!trends.find(t => t.topic === q.query)) {
                        trends.push({
                            topic: q.query,
                            source: 'Google Trends',
                            volume: q.value,
                            score: 85
                        });
                    }
                });
            }
        } catch (error) {
            logger.warn('SerpApi Google Trends fetch failed', { error: error instanceof Error ? error.message : 'Unknown' });
        }
        
        return trends;
    }
}
