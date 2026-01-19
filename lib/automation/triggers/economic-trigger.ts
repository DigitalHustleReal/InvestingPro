
import { trendsService } from '@/lib/trends/TrendsService';
import { logger } from '@/lib/logger';

/**
 * 🚨 ECONOMIC TRIGGER
 * 
 * Monitors the economy for high-impact events that require immediate content coverage.
 * Unlike the weekly planner, this triggers "Emergency" or "News" content.
 * 
 * TRACKED EVENTS:
 * - RBI Repo Rate Changes
 * - GDP Data Releases
 * - Inflation (CPI/WPI) Data
 * - Union Budget / Interim Budget
 * - Special Market Events (Sensex Crash/Rally)
 */

export interface EconomicEvent {
    title: string;
    type: 'RBI' | 'GDP' | 'INFLATION' | 'BUDGET' | 'MARKET_CRASH' | 'OTHER';
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    source_url: string;
}

const IMPACT_KEYWORDS = {
    'RBI': ['rbi', 'repo rate', 'shaktikanta das', 'monetary policy'],
    'GDP': ['gdp growth', 'india gdp', 'quarterly growth'],
    'INFLATION': ['cpi inflation', 'retail inflation', 'wholesale inflation'],
    'BUDGET': ['union budget', 'interim budget', 'ministry of finance', 'nirmala sitharaman'],
    'MARKET_CRASH': ['sensex crash', 'nifty crash', 'market bloodbath', 'black monday', 'market correction']
};

export class EconomicTrigger {
    
    /**
     * Check for active economic events and trigger content if found
     */
    async checkAndTrigger(dryRun: boolean = false): Promise<string[]> {
        logger.info('🚨 EconomicTrigger: Scanning for impact events...');
        
        try {
            // 1. Get real-time economy trends
            const trends = await trendsService.getTrendingTopics('economy');
            const impactEvents: EconomicEvent[] = [];

            // 2. Analyze each trend for impact
            for (const trend of trends) {
                const classification = this.classifyEvent(trend.keyword.toLowerCase());
                
                if (classification) {
                    impactEvents.push({
                        title: trend.keyword,
                        type: classification.type,
                        priority: classification.priority,
                        source_url: trend.related_articles[0]?.link || ''
                    });
                }
            }

            logger.info(`EconomicTrigger: Found ${impactEvents.length} impact events`);

            // 3. Trigger Content Generation for Critical/High events
            const generatedSlugs: string[] = [];

            for (const event of impactEvents) {
                if (event.priority === 'CRITICAL' || event.priority === 'HIGH') {
                    const topic = this.generateHeadline(event);
                    logger.info(`🚨 TRIGGERING EMERGENCY CONTENT: "${topic}"`);

                    if (!dryRun) {
                        try {
                            // Dynamic import to avoid server-only issues in CLI
                            const { generateArticleCore } = await import('@/lib/automation/article-generator');
                            const result = await generateArticleCore(topic, (msg) => {
                                logger.info(`[Auto-Trigger]: ${msg}`);
                            });
                            
                            if (result.success && result.article) {
                                generatedSlugs.push(result.article.slug);
                            }
                        } catch (err) {
                            logger.error('Failed to auto-generate article', err as Error);
                        }
                    } else {
                        generatedSlugs.push(`[DRY-RUN] ${topic}`);
                    }
                }
            }

            return generatedSlugs;

        } catch (error) {
            logger.error('EconomicTrigger failed', error as Error);
            return [];
        }
    }

    /**
     * Classify a topic string into an Event Type
     */
    private classifyEvent(topic: string): { type: EconomicEvent['type'], priority: EconomicEvent['priority'] } | null {
        for (const [type, keywords] of Object.entries(IMPACT_KEYWORDS)) {
            if (keywords.some(k => topic.includes(k))) {
                // Determine priority
                let priority: EconomicEvent['priority'] = 'HIGH';
                
                if (type === 'BUDGET') priority = 'CRITICAL';
                if (type === 'RBI' && topic.includes('unchanged')) priority = 'MEDIUM'; // Less urgent if no change
                if (type === 'RBI' && (topic.includes('hike') || topic.includes('cut'))) priority = 'CRITICAL';

                return { type: type as EconomicEvent['type'], priority };
            }
        }
        return null;
    }

    /**
     * Generate a compelling "News" style headline
     */
    private generateHeadline(event: EconomicEvent): string {
        const year = new Date().getFullYear();
        
        switch (event.type) {
            case 'RBI':
                return `RBI MPC Meet ${year}: Impact on your Home Loan EMI and FDs`;
            case 'GDP':
                return `India GDP Data Q${Math.floor((new Date().getMonth() + 3) / 3)}: What it means for Investors`;
            case 'INFLATION':
                return `Rising Inflation in India: How to protect your portfolio in ${year}`;
            case 'BUDGET':
                return `Union Budget ${year}: Key Highlights and Tax Changes Explained`;
            case 'MARKET_CRASH':
                return `Market Crash Alert: 5 Safe Stocks to Buy in this Correction`;
            default:
                return `${event.title}: Complete Guide for Investors`;
        }
    }
}

export const economicTrigger = new EconomicTrigger();
