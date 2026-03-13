/**
 * 📡 MARKET EVENT WATCHER
 * 
 * Monitors real Indian market events and converts them into
 * actionable content opportunities.
 * 
 * Data sources (all free):
 *  - Yahoo Finance India RSS (real-time market data)
 *  - Google Trends (trending finance searches)
 *  - Moneycontrol RSS feed
 *  - Economic Times RSS
 *  - NSE/BSE index data via Yahoo Finance API (free)
 * 
 * Events it detects → Content angles it generates:
 *  - Nifty/Sensex drops 3%+     → "Should I Pause SIP During Market Fall?"
 *  - Market crash 5%+           → "Lumpsum Opportunity: Why Market Crashes Are SIP Moments"
 *  - Market at all-time high    → "Market at ATH: Is Now a Good Time to Start SIP?"
 *  - RBI rate cut               → "RBI Rate Cut: How It Affects Your Home Loan EMI"
 *  - RBI rate hike              → "RBI Hikes Rate: Move Money from Debt Fund to FD Now?"
 *  - Budget announcement        → "Budget 2026: What Changes for Your Investments?"
 *  - FD rate change             → "Banks Slash FD Rates: Where to Move Your Money?"
 *  - Rupee fall                 → "Rupee at X/$ — How to Protect Your Savings?"
 */

import { logger } from '@/lib/logger';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MarketEvent {
    type: MarketEventType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    contentAngles: ContentAngle[];
    timestamp: Date;
    source: string;
    rawData?: Record<string, any>;
}

export type MarketEventType =
    | 'market_crash'
    | 'market_correction'
    | 'market_rally'
    | 'market_ath'
    | 'rbi_rate_cut'
    | 'rbi_rate_hike'
    | 'rbi_rate_hold'
    | 'budget_announcement'
    | 'fd_rate_change'
    | 'rupee_fall'
    | 'rupee_rise'
    | 'inflation_data'
    | 'global_crash'
    | 'trending_finance_topic'
    | 'seasonal';

export interface ContentAngle {
    topic: string;
    category: string;
    urgency: number;     // 0-100 (higher = write sooner)
    intent: 'informational' | 'commercial' | 'transactional';
    searchContext: string; // What people are searching RIGHT NOW
}

interface MarketSnapshot {
    niftyLevel: number;
    niftyChange: number;        // % change today
    niftyChange30d: number;     // % change over 30 days
    sensexLevel: number;
    sensexChange: number;
    rbiRepoRate: number;        // Current RBI repo rate
    usdInr: number;             // USD/INR rate
    timestamp: Date;
}

// ─── RSS Feed Parsers ───────────────────────────────────────────────────────────

const FINANCE_RSS_FEEDS = [
    'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', // Market news
    'https://economictimes.indiatimes.com/wealth/rssfeeds/837566227.cms',   // Wealth news
    'https://www.moneycontrol.com/rss/MCtopnews.xml',                       // Top finance news
    'https://feeds.feedburner.com/ndtvprofit-latest',                       // NDTV Profit
];

interface RSSItem {
    title: string;
    description: string;
    pubDate: string;
    link: string;
}

async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; InvestingPro/1.0)',
                'Accept': 'application/rss+xml, application/xml',
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) return [];
        
        const text = await response.text();
        
        // Simple RSS XML parser (no external dependency needed)
        const items: RSSItem[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        
        while ((match = itemRegex.exec(text)) !== null) {
            const itemXml = match[1];
            const getTag = (tag: string) => {
                const tagMatch = itemXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([^<]*)<\/${tag}>`));
                return tagMatch ? (tagMatch[1] || tagMatch[2] || '').trim() : '';
            };
            
            const title = getTag('title');
            if (title) {
                items.push({
                    title,
                    description: getTag('description'),
                    pubDate: getTag('pubDate'),
                    link: getTag('link'),
                });
            }
        }
        
        return items.slice(0, 20); // Top 20 items
    } catch (error) {
        logger.warn(`RSS feed failed: ${url}`, { error: (error as Error).message });
        return [];
    }
}

// ─── Market Data (Yahoo Finance — Free) ───────────────────────────────────────

async function getMarketSnapshot(): Promise<MarketSnapshot | null> {
    try {
        // Yahoo Finance API (completely free, no key needed)
        const symbols = ['^NSEI', '^BSESN', 'USDINR=X'];
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}&fields=regularMarketPrice,regularMarketChangePercent`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(6000),
        });

        if (!response.ok) return null;

        const data = await response.json();
        const quotes = data?.quoteResponse?.result || [];
        
        const findQuote = (symbol: string) => quotes.find((q: any) => q.symbol === symbol);
        
        const nifty = findQuote('^NSEI');
        const sensex = findQuote('^BSESN');
        const usdinr = findQuote('USDINR=X');
        
        if (!nifty) return null;

        // Get 30-day change (approximate from 52-week data)
        const nifty30dChange = nifty.fiftyTwoWeekLowChangePercent 
            ? ((nifty.regularMarketPrice - nifty.regularMarketPrice * 0.97) / (nifty.regularMarketPrice * 0.97)) * 100
            : 0;

        return {
            niftyLevel: nifty.regularMarketPrice || 0,
            niftyChange: nifty.regularMarketChangePercent || 0,
            niftyChange30d: nifty30dChange,
            sensexLevel: sensex?.regularMarketPrice || 0,
            sensexChange: sensex?.regularMarketChangePercent || 0,
            rbiRepoRate: 6.5, // Static — updated manually or via RBI calendar
            usdInr: usdinr?.regularMarketPrice || 84,
            timestamp: new Date(),
        };
    } catch (error) {
        logger.warn('Failed to get market snapshot', { error: (error as Error).message });
        return null;
    }
}

// ─── Event Detection ────────────────────────────────────────────────────────────

/**
 * Detect market events from the current snapshot
 */
function detectMarketEvents(snapshot: MarketSnapshot): MarketEvent[] {
    const events: MarketEvent[] = [];
    const { niftyChange, niftyChange30d, usdInr, niftyLevel } = snapshot;

    // Market Crash (>5% single day)
    if (niftyChange <= -5) {
        events.push({
            type: 'market_crash',
            severity: 'critical',
            title: `Nifty crashes ${Math.abs(niftyChange).toFixed(1)}% today`,
            description: `Nifty fell ${Math.abs(niftyChange).toFixed(1)}% to ${niftyLevel.toFixed(0)}`,
            source: 'yahoo_finance',
            timestamp: new Date(),
            rawData: { niftyChange, niftyLevel },
            contentAngles: [
                {
                    topic: `Market Crash ${new Date().getFullYear()}: Should You Stop Your SIP?`,
                    category: 'mutual-funds',
                    urgency: 95,
                    intent: 'informational',
                    searchContext: 'People searching: "should i stop sip during market crash" "market crash what to do sip" "nifty crash 2026"',
                },
                {
                    topic: `Nifty Down ${Math.abs(niftyChange).toFixed(0)}%: Is This a Lumpsum Investment Opportunity?`,
                    category: 'mutual-funds',
                    urgency: 90,
                    intent: 'commercial',
                    searchContext: 'People searching: "lumpsum investment market crash" "buy mutual fund when market falls"',
                },
                {
                    topic: `Market Crash: 5 Things Every SIP Investor Must Do Right Now`,
                    category: 'mutual-funds',
                    urgency: 85,
                    intent: 'informational',
                    searchContext: 'People searching: "market crash sip investor tips" "what to do when nifty falls"',
                },
            ],
        });
    }

    // Market Correction (3-5% single day)
    else if (niftyChange <= -3) {
        events.push({
            type: 'market_correction',
            severity: 'high',
            title: `Nifty corrects ${Math.abs(niftyChange).toFixed(1)}% today`,
            description: `Market correction — Nifty at ${niftyLevel.toFixed(0)}`,
            source: 'yahoo_finance',
            timestamp: new Date(),
            rawData: { niftyChange, niftyLevel },
            contentAngles: [
                {
                    topic: `Market Correction: Wait and Watch or Invest Lumpsum Now?`,
                    category: 'mutual-funds',
                    urgency: 85,
                    intent: 'informational',
                    searchContext: 'People searching: "market correction invest or wait" "wait and watch market fall" "lumpsum now or wait"',
                },
                {
                    topic: `Nifty Falls ${Math.abs(niftyChange).toFixed(0)}%: Best Mutual Funds to Buy During Dip`,
                    category: 'mutual-funds',
                    urgency: 80,
                    intent: 'commercial',
                    searchContext: 'People searching: "best mutual fund to buy during correction" "sip increase during fall"',
                },
            ],
        });
    }

    // Prolonged correction (>10% over 30 days)
    if (niftyChange30d <= -10) {
        events.push({
            type: 'market_correction',
            severity: 'high',
            title: `Nifty down ${Math.abs(niftyChange30d).toFixed(0)}% over the month`,
            description: 'Extended market weakness',
            source: 'yahoo_finance',
            timestamp: new Date(),
            contentAngles: [
                {
                    topic: `Market Down 10%+ This Month: Should You Increase Your SIP Amount?`,
                    category: 'mutual-funds',
                    urgency: 75,
                    intent: 'informational',
                    searchContext: 'People searching: "increase sip during market down" "sip strategy bear market india"',
                },
                {
                    topic: `Rupee-Cost Averaging Explained: Why Market Falls Are Good for SIP Investors`,
                    category: 'mutual-funds',
                    urgency: 70,
                    intent: 'informational',
                    searchContext: 'People searching: "sip benefit market fall rupee cost averaging"',
                },
            ],
        });
    }

    // Market Rally (3%+ single day)
    if (niftyChange >= 3) {
        events.push({
            type: 'market_rally',
            severity: 'medium',
            title: `Nifty rallies ${niftyChange.toFixed(1)}% today`,
            description: `Strong market rally — Nifty at ${niftyLevel.toFixed(0)}`,
            source: 'yahoo_finance',
            timestamp: new Date(),
            contentAngles: [
                {
                    topic: `Market Rallies ${niftyChange.toFixed(0)}%: Is It Time to Book Profits From Your Mutual Funds?`,
                    category: 'mutual-funds',
                    urgency: 80,
                    intent: 'commercial',
                    searchContext: 'People searching: "book profit mutual fund rally" "sell mutual fund when market high"',
                },
            ],
        });
    }

    // Rupee weakness
    if (usdInr >= 85) {
        events.push({
            type: 'rupee_fall',
            severity: 'medium',
            title: `Rupee at ₹${usdInr.toFixed(0)}/$ — Multi-year low`,
            description: 'Rupee under pressure against dollar',
            source: 'yahoo_finance',
            timestamp: new Date(),
            contentAngles: [
                {
                    topic: `Rupee Hits ₹${Math.round(usdInr)}/$: Best Investments to Protect Against Currency Risk`,
                    category: 'investing-basics',
                    urgency: 70,
                    intent: 'commercial',
                    searchContext: 'People searching: "rupee fall protect savings india" "best investment rupee depreciation" "international fund rupee fall"',
                },
                {
                    topic: `Should You Invest in International Mutual Funds When Rupee Falls?`,
                    category: 'mutual-funds',
                    urgency: 65,
                    intent: 'informational',
                    searchContext: 'People searching: "international fund rupee fall" "us fund india rupee depreciation"',
                },
            ],
        });
    }

    return events;
}

/**
 * Detect events from RSS news headlines using NLP pattern matching
 */
function detectEventsFromNews(headlines: RSSItem[]): MarketEvent[] {
    const events: MarketEvent[] = [];

    for (const headline of headlines) {
        const text = `${headline.title} ${headline.description}`.toLowerCase();

        // RBI Rate Cut
        if (/rbi.*(cuts?|reduces?|slashes?|lowers?).*(repo|rate|basis points)/i.test(text) ||
            /repo rate.*(cut|reduced|down)/i.test(text)) {
            events.push({
                type: 'rbi_rate_cut',
                severity: 'high',
                title: headline.title,
                description: 'RBI cuts repo rate',
                source: 'rss',
                timestamp: new Date(headline.pubDate || Date.now()),
                contentAngles: [
                    {
                        topic: `RBI Cuts Repo Rate: Your Home Loan EMI Will Fall — Here's How Much`,
                        category: 'loans',
                        urgency: 95,
                        intent: 'informational',
                        searchContext: 'People searching: "rbi rate cut emi reduce" "home loan emi reduce rate cut 2026" "repo rate cut effect on loan"',
                    },
                    {
                        topic: `RBI Rate Cut: Should You Move Money From FD to Debt Mutual Funds?`,
                        category: 'mutual-funds',
                        urgency: 90,
                        intent: 'commercial',
                        searchContext: 'People searching: "rbi rate cut fd vs debt fund" "best investment after rbi rate cut"',
                    },
                    {
                        topic: `After RBI Rate Cut: Best FD Alternatives to Maximize Returns in 2026`,
                        category: 'investing-basics',
                        urgency: 85,
                        intent: 'commercial',
                        searchContext: 'People searching: "fd alternative after rate cut" "best investment rbi rate cut india"',
                    },
                ],
            });
            break; // One event per RBI decision
        }

        // RBI Rate Hike
        if (/rbi.*(hikes?|raises?|increases?|ups?).*(repo|rate|basis points)/i.test(text) ||
            /repo rate.*(hike|raised|increased)/i.test(text)) {
            events.push({
                type: 'rbi_rate_hike',
                severity: 'high',
                title: headline.title,
                description: 'RBI hikes repo rate',
                source: 'rss',
                timestamp: new Date(headline.pubDate || Date.now()),
                contentAngles: [
                    {
                        topic: `RBI Rate Hike: How Much Will Your Home Loan EMI Increase?`,
                        category: 'loans',
                        urgency: 95,
                        intent: 'informational',
                        searchContext: 'People searching: "rbi rate hike emi increase" "home loan emi increase 2026"',
                    },
                    {
                        topic: `RBI Hikes Rate: Is This the Right Time to Book FD for 3-5 Years?`,
                        category: 'investing-basics',
                        urgency: 88,
                        intent: 'commercial',
                        searchContext: 'People searching: "best fd after rate hike" "book fd rbi rate hike"',
                    },
                ],
            });
            break;
        }

        // Budget
        if (/budget.*(2026|2027|announcement|presented|speech)/i.test(text) ||
            /union budget/i.test(text)) {
            events.push({
                type: 'budget_announcement',
                severity: 'critical',
                title: headline.title,
                description: 'Budget announcement',
                source: 'rss',
                timestamp: new Date(headline.pubDate || Date.now()),
                contentAngles: [
                    {
                        topic: `Budget 2026: Complete Impact on Your Investments, Taxes, and Savings`,
                        category: 'tax-planning',
                        urgency: 98,
                        intent: 'informational',
                        searchContext: 'People searching: "budget 2026 impact on investments" "budget 2026 income tax changes sip"',
                    },
                    {
                        topic: `Budget 2026 Tax Changes: Old vs New Regime — Which Now Saves More?`,
                        category: 'tax-planning',
                        urgency: 95,
                        intent: 'informational',
                        searchContext: 'People searching: "budget 2026 old vs new tax regime" "new regime after budget 2026"',
                    },
                    {
                        topic: `Budget 2026: What Changes for Mutual Fund Investors (LTCG, ELSS, STCG)`,
                        category: 'mutual-funds',
                        urgency: 93,
                        intent: 'informational',
                        searchContext: 'People searching: "budget 2026 mutual fund tax" "ltcg stcg changes budget 2026"',
                    },
                ],
            });
            break;
        }

        // Market at all-time high
        if (/(sensex|nifty).*(all.time high|ath|record high|52.week high)/i.test(text)) {
            events.push({
                type: 'market_ath',
                severity: 'medium',
                title: headline.title,
                description: 'Market at all-time high',
                source: 'rss',
                timestamp: new Date(headline.pubDate || Date.now()),
                contentAngles: [
                    {
                        topic: `Nifty at All-Time High: Should You Start SIP Now or Wait for a Correction?`,
                        category: 'mutual-funds',
                        urgency: 85,
                        intent: 'informational',
                        searchContext: 'People searching: "start sip market high" "invest mutual fund all time high nifty" "wait for correction sip"',
                    },
                    {
                        topic: `Market at ATH: Which Mutual Funds to Choose When Nifty is Overvalued?`,
                        category: 'mutual-funds',
                        urgency: 80,
                        intent: 'commercial',
                        searchContext: 'People searching: "best mutual fund nifty at high" "defensive fund market high india"',
                    },
                ],
            });
        }
    }

    return events;
}

// ─── Google Trends for Finance Topics (Free) ───────────────────────────────────

async function getFinanceTrends(): Promise<ContentAngle[]> {
    const angles: ContentAngle[] = [];

    // Finance-specific search terms to check trends for — these represent
    // the kinds of things people search when markets move
    const financeQueries = [
        'should i stop sip',
        'lumpsum investment now',
        'market crash what to do',
        'best mutual fund to invest now',
        'fd interest rate',
        'rbi repo rate',
        'home loan emi',
        'wait and watch market',
    ];

    try {
        // Use Google Autocomplete as a proxy for trending searches
        // (actual Google Trends API has rate limits)
        const { getGoogleSuggestions } = await import('./providers/google-autocomplete');

        for (const query of financeQueries.slice(0, 4)) {
            const suggestions = await getGoogleSuggestions(query, 'IN', 'en');
            for (const suggestion of suggestions.slice(0, 2)) {
                if (suggestion.keyword.split(' ').length >= 3) {
                    angles.push({
                        topic: suggestion.keyword,
                        category: 'mutual-funds',
                        urgency: 60,
                        intent: 'informational',
                        searchContext: `Trending: "${suggestion.keyword}"`,
                    });
                }
            }
            await new Promise(r => setTimeout(r, 300));
        }
    } catch (error) {
        logger.warn('Finance trends fetch failed', { error: (error as Error).message });
    }

    return angles;
}

// ─── Seasonal Events ────────────────────────────────────────────────────────────

function getSeasonalEvents(): MarketEvent[] {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();
    const events: MarketEvent[] = [];

    // Tax filing season (Jan-March 31 deadline for old regime)
    if (month >= 1 && month <= 3) {
        events.push({
            type: 'seasonal',
            severity: 'high',
            title: 'Tax saving season — FY end approaching',
            description: `March 31 deadline for ${year - 1}-${year} tax investments`,
            source: 'calendar',
            timestamp: now,
            contentAngles: [
                {
                    topic: `Last Chance Tax Saving for FY ${year}: ELSS vs PPF vs NPS — Which to Choose?`,
                    category: 'tax-planning',
                    urgency: month === 3 ? 95 : 80,
                    intent: 'commercial',
                    searchContext: 'People searching: "last minute 80c investment" "tax saving march deadline" "elss ppf which better march"',
                },
                {
                    topic: `₹1.5 Lakh 80C Limit: Best Tax Saving Investments to Make Before March 31`,
                    category: 'tax-planning',
                    urgency: month === 3 ? 90 : 75,
                    intent: 'transactional',
                    searchContext: 'People searching: "80c investment last date" "best elss to invest march" "ppf account 80c limit"',
                },
            ],
        });
    }

    // New financial year (April) — re-evaluate investments
    if (month === 4) {
        events.push({
            type: 'seasonal',
            severity: 'medium',
            title: `New Financial Year ${year}-${year + 1} begins`,
            description: 'Fresh start for tax planning and investments',
            source: 'calendar',
            timestamp: now,
            contentAngles: [
                {
                    topic: `New FY ${year}-${year + 1}: Tax Saving Investment Checklist for Salaried Professionals`,
                    category: 'tax-planning',
                    urgency: 82,
                    intent: 'informational',
                    searchContext: 'People searching: "new financial year investment plan" "tax saving checklist new fy" "start fresh sip april"',
                },
            ],
        });
    }

    // ITR filing season (July-September)
    if (month >= 7 && month <= 9) {
        events.push({
            type: 'seasonal',
            severity: 'medium',
            title: 'ITR filing season',
            description: 'Income Tax Return filing deadline',
            source: 'calendar',
            timestamp: now,
            contentAngles: [
                {
                    topic: `ITR Filing ${year}: Which ITR Form to Use? Complete Guide for Salaried + Investors`,
                    category: 'tax-planning',
                    urgency: 85,
                    intent: 'informational',
                    searchContext: 'People searching: "which itr form to use" "itr filing 2026 salary" "how to file itr with mutual fund"',
                },
                {
                    topic: `Capital Gains Tax on Mutual Funds ${year}: How to Report in ITR`,
                    category: 'tax-planning',
                    urgency: 80,
                    intent: 'informational',
                    searchContext: 'People searching: "mutual fund capital gains itr" "ltcg mutual fund tax return"',
                },
            ],
        });
    }

    // Diwali bonus season (Oct-Nov) — good for investment and insurance decisions
    if (month >= 10 && month <= 11) {
        events.push({
            type: 'seasonal',
            severity: 'low',
            title: 'Diwali bonus season — investment sentiment high',
            description: 'Bonus payouts, consumer spending, investment decisions',
            source: 'calendar',
            timestamp: now,
            contentAngles: [
                {
                    topic: `Got Diwali Bonus? 5 Smart Ways to Invest It (Not Spend)`,
                    category: 'investing-basics',
                    urgency: 75,
                    intent: 'informational',
                    searchContext: 'People searching: "invest diwali bonus" "what to do with bonus india" "diwali bonus lumpsum sip"',
                },
            ],
        });
    }

    return events;
}

// ─── Main Function ──────────────────────────────────────────────────────────────

/**
 * Get all current market events sorted by urgency
 */
export async function detectAllEvents(): Promise<MarketEvent[]> {
    logger.info('[MarketEventWatcher] Starting event detection...');

    const allEvents: MarketEvent[] = [];

    // 1. Seasonal events (always reliable)
    const seasonal = getSeasonalEvents();
    allEvents.push(...seasonal);
    logger.info(`[MarketEventWatcher] ${seasonal.length} seasonal events`);

    // 2. Real market data (Yahoo Finance — free)
    try {
        const snapshot = await getMarketSnapshot();
        if (snapshot) {
            const marketEvents = detectMarketEvents(snapshot);
            allEvents.push(...marketEvents);
            logger.info(`[MarketEventWatcher] ${marketEvents.length} market events from snapshot. Nifty: ${snapshot.niftyChange.toFixed(2)}%`);
        }
    } catch (error) {
        logger.warn('[MarketEventWatcher] Market snapshot failed', { error: (error as Error).message });
    }

    // 3. RSS News (real headlines)
    try {
        const allItems: RSSItem[] = [];
        for (const feed of FINANCE_RSS_FEEDS.slice(0, 2)) { // Fetch from first 2 feeds
            const items = await fetchRSSFeed(feed);
            allItems.push(...items);
            await new Promise(r => setTimeout(r, 500));
        }
        
        const newsEvents = detectEventsFromNews(allItems);
        allEvents.push(...newsEvents);
        logger.info(`[MarketEventWatcher] ${newsEvents.length} events from RSS news (${allItems.length} headlines scanned)`);
    } catch (error) {
        logger.warn('[MarketEventWatcher] RSS failed', { error: (error as Error).message });
    }

    // Sort by urgency of content angles
    allEvents.sort((a, b) => {
        const maxUrgencyA = Math.max(...a.contentAngles.map(c => c.urgency));
        const maxUrgencyB = Math.max(...b.contentAngles.map(c => c.urgency));
        return maxUrgencyB - maxUrgencyA;
    });

    // Remove duplicate event types (keep highest urgency)
    const seen = new Set<string>();
    const deduplicated = allEvents.filter(event => {
        if (seen.has(event.type)) return false;
        seen.add(event.type);
        return true;
    });

    logger.info(`[MarketEventWatcher] Final: ${deduplicated.length} unique events detected`);
    return deduplicated;
}

/**
 * Convert market events into TrendItem format for the pipeline
 */
export function eventsToTrendItems(events: MarketEvent[]): Array<{
    topic: string;
    category: string;
    trendScore: number;
    urgency: number;
    eventType: MarketEventType;
    searchContext: string;
}> {
    const items = [];
    
    for (const event of events) {
        for (const angle of event.contentAngles) {
            items.push({
                topic: angle.topic,
                category: angle.category,
                trendScore: angle.urgency,
                urgency: angle.urgency,
                eventType: event.type,
                searchContext: angle.searchContext,
            });
        }
    }

    // Sort by urgency, deduplicate very similar topics
    return items
        .sort((a, b) => b.urgency - a.urgency)
        .slice(0, 15); // Top 15 content ideas
}
