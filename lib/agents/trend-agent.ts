/**
 * Trend Agent
 * 
 * Detects trending topics from multiple sources:
 * - Google Trends (PRIMARY - uses google-trends-api)
 * - RSS Feeds (FALLBACK)
 * - Economic Calendar
 * 
 * Priority: Google Trends > RSS > Manual fallback
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { GhostScraper, TrendSignal } from '@/lib/scraper/ghost_scraper';
import { logger } from '@/lib/logger';
import { detectAllEvents, eventsToTrendItems } from './market-event-watcher';

export interface TrendItem {
    topic: string;
    category: string;
    source: 'google-trends' | 'social-media' | 'economic-calendar' | 'rss' | 'news';
    trendScore: number; // 0-100
    searchVolume?: number;
    growthRate?: number;
    relevanceScore: number; // 0-100
    keywords: string[];
    timestamp: Date;
}

export class TrendAgent extends BaseAgent {
    constructor() {
        super('TrendAgent');
    }
    
    /**
     * Detect trending topics using GhostScraper
     * Priority: Google Trends first, RSS as fallback
     */
    async detectTrends(context?: AgentContext): Promise<TrendItem[]> {
        const startTime = Date.now();
        const allTrends: TrendItem[] = [];
        
        try {
            logger.info('TrendAgent: Running Market Event Watcher (primary source)...');
            
            // ── SOURCE 1: Real Market Events (PRIMARY) ──────────────────────────
            // Checks Nifty/Sensex via Yahoo Finance, scans RSS headlines,
            // and applies seasonal calendar — generates event-driven content angles
            try {
                const events = await detectAllEvents();
                const eventTopics = eventsToTrendItems(events);
                
                logger.info(`TrendAgent: ${eventTopics.length} event-driven topics from MarketEventWatcher`);
                
                for (const item of eventTopics) {
                    allTrends.push({
                        topic: item.topic,
                        category: item.category,
                        source: 'economic-calendar',
                        trendScore: item.urgency,
                        relevanceScore: Math.min(100, item.urgency + 5),
                        keywords: this.extractKeywords(item.topic),
                        timestamp: new Date(),
                        growthRate: item.urgency,
                    });
                }
            } catch (error) {
                logger.warn('TrendAgent: MarketEventWatcher failed', error as Error);
            }
            
            // ── SOURCE 2: Google Trends / GhostScraper (SUPPLEMENTARY) ─────────
            try {
                const trendSignals = await GhostScraper.scanTrends();
                const googleTrends: TrendItem[] = trendSignals
                    .filter(signal => signal.topic)
                    .filter(signal => this.isPersonalFinanceTopic(signal.topic))
                    .map(signal => this.convertSignalToTrendItem(signal));
                
                logger.info(`TrendAgent: ${googleTrends.length} topics from Google Trends / RSS`);
                allTrends.push(...googleTrends);
            } catch (error) {
                logger.warn('TrendAgent: GhostScraper failed', error as Error);
            }
            
            // ── FALLBACK: Static Defaults (only if BOTH sources fail) ───────────
            if (allTrends.length === 0) {
                logger.info('TrendAgent: All external sources failed, using static defaults');
                return this.getDefaultTrends();
            }
            
            // Score and sort (event-driven topics already have high urgency scores)
            const scoredTrends = this.scoreTrends(allTrends);
            const sortedTrends = scoredTrends.sort((a, b) => {
                const scoreA = (a.trendScore * 0.7) + (a.relevanceScore * 0.3);
                const scoreB = (b.trendScore * 0.7) + (b.relevanceScore * 0.3);
                return scoreB - scoreA;
            });
            
            const executionTime = Date.now() - startTime;
            await this.logExecution(
                'trend_detection',
                { sources: ['market-events', 'google-trends', 'rss'] },
                { trends: sortedTrends.length },
                executionTime,
                true,
                undefined,
                context
            );
            
            logger.info(`TrendAgent: ${sortedTrends.length} total trends (event-driven first)`);
            return sortedTrends.slice(0, 20);
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            logger.warn('TrendAgent: Full detection failed, using defaults', error as Error);
            await this.logExecution('trend_detection', {}, {}, executionTime, false,
                error instanceof Error ? error.message : String(error), context);
            return this.getDefaultTrends();
        }
    }
    
    /**
     * Convert TrendSignal from GhostScraper to TrendItem
     */
    private convertSignalToTrendItem(signal: TrendSignal): TrendItem {
        const topic = signal.topic || 'Finance Update';
        return {
            topic,
            category: this.categorizeTopic(topic),
            source: signal.source === 'Google Trends' ? 'google-trends' : 'rss',
            trendScore: signal.score,
            searchVolume: signal.volume ? parseInt(signal.volume.replace(/[^0-9]/g, '')) || undefined : undefined,
            relevanceScore: this.calculateRelevance(topic),
            keywords: this.extractKeywords(topic),
            timestamp: new Date()
        };
    }
    
    /**
     * Get default high-value PERSONAL FINANCE trends
     * Focus: SIPs, Credit Cards, Loans, Insurance, Tax, FDs - NOT stock market
     */
    private getDefaultTrends(): TrendItem[] {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });
        
        const personalFinanceTopics = [
            // Mutual Funds / SIP
            { topic: `Best SIP Plans for ${currentYear}: Complete Guide`, category: 'mutual-funds' },
            { topic: `How to Start SIP with ₹500: Beginner's Guide`, category: 'mutual-funds' },
            { topic: `ELSS vs PPF: Which Tax Saving Investment is Better?`, category: 'mutual-funds' },
            { topic: `Best Index Funds in India ${currentYear}`, category: 'mutual-funds' },
            
            // Credit Cards
            { topic: `Best Credit Cards for ${currentMonth} ${currentYear}`, category: 'credit-cards' },
            { topic: `Best Cashback Credit Cards in India`, category: 'credit-cards' },
            { topic: `How to Increase Credit Card Limit: Complete Guide`, category: 'credit-cards' },
            { topic: `Best Travel Credit Cards with Lounge Access`, category: 'credit-cards' },
            
            // Loans
            { topic: `Home Loan Interest Rates ${currentMonth} ${currentYear}`, category: 'loans' },
            { topic: `Personal Loan vs Credit Card: Which is Better?`, category: 'loans' },
            { topic: `How to Improve CIBIL Score: Step by Step Guide`, category: 'loans' },
            { topic: `Best Education Loan Options in India`, category: 'loans' },
            
            // Insurance
            { topic: `Best Term Insurance Plans ${currentYear}`, category: 'insurance' },
            { topic: `Health Insurance for Family: Complete Guide`, category: 'insurance' },
            { topic: `Term Insurance vs Whole Life Insurance`, category: 'insurance' },
            
            // Tax Planning
            { topic: `Section 80C Deductions: Complete List ${currentYear}`, category: 'tax-planning' },
            { topic: `How to Save Tax on Salary Income`, category: 'tax-planning' },
            { topic: `Old Tax Regime vs New Tax Regime: Which to Choose?`, category: 'tax-planning' },
            
            // Fixed Deposits & Banking
            { topic: `Best FD Rates ${currentMonth} ${currentYear}`, category: 'investing-basics' },
            { topic: `Senior Citizen FD Rates: Best Options`, category: 'investing-basics' },
            { topic: `Best Savings Account Interest Rates`, category: 'investing-basics' },
            
            // Retirement
            { topic: `NPS vs PPF: Which is Better for Retirement?`, category: 'retirement' },
            { topic: `How Much Money Needed to Retire in India`, category: 'retirement' }
        ];
        
        // Shuffle and pick top 10 for variety
        const shuffled = personalFinanceTopics.sort(() => Math.random() - 0.5);
        
        return shuffled.slice(0, 10).map((item, index) => ({
            topic: item.topic,
            category: item.category,
            source: 'news' as const,
            trendScore: 85 - (index * 2), // High scores for personal finance
            relevanceScore: 90, // High relevance
            keywords: this.extractKeywords(item.topic),
            timestamp: new Date()
        }));
    }
    
    /**
     * Filter out stock market / share trading topics
     * Keep only personal finance relevant content
     */
    private isPersonalFinanceTopic(topic: string): boolean {
        const topicLower = topic.toLowerCase();
        
        // EXCLUDE stock market / trading topics
        const excludePatterns = [
            'stock', 'share', 'shares', 'nifty', 'sensex', 'bse', 'nse', 
            'target price', 'target ₹', 'target rs', 'rs target', '₹ target',
            'buy rating', 'sell rating', 'hold rating', 'outperform', 'underperform',
            'quarterly results', 'q1 results', 'q2 results', 'q3 results', 'q4 results',
            'ipo', 'fpo', 'listing', 'delisting', 'bonus share', 'stock split',
            'dividend', 'earnings', 'profit', 'loss', 'revenue', 'margin',
            'trading', 'trader', 'intraday', 'swing trade', 'f&o', 'futures', 'options',
            'technical analysis', 'chart pattern', 'support resistance', 'breakout',
            'market cap', 'pe ratio', 'eps', 'roe', 'roce',
            'broker', 'demat', 'zerodha', 'upstox', 'groww', 'angel one',
            'etf', 'gold etf', 'silver etf',
            // Company-specific stock news (exclude)
            'bajaj finance', 'bajaj finserv', 'hdfc bank stock', 'icici bank stock',
            'reliance', 'tata', 'infosys', 'tcs stock', 'wipro', 'hcl',
            'adani', 'vedanta', 'zomato', 'paytm stock',
            'market jitters', 'market bounce', 'fii', 'dii', 'foreign investor',
            'bulls', 'bears', 'bullish', 'bearish', 'rally', 'correction',
            'all-time high', 'new high', 'new low', 'crore', 'lakh crore'
        ];
        
        // Check if topic contains any exclude pattern
        for (const pattern of excludePatterns) {
            if (topicLower.includes(pattern)) {
                return false;
            }
        }
        
        // INCLUDE personal finance topics - MUST contain at least one
        const includePatterns = [
            'sip', 'mutual fund', 'credit card', 'loan', 'insurance',
            'tax', 'fd', 'fixed deposit', 'ppf', 'nps', 'epf',
            'savings', 'retirement', 'pension', 'health insurance',
            'term insurance', 'home loan', 'personal loan', 'car loan',
            'education loan', 'gold loan', 'vehicle loan',
            'elss', 'recurring deposit', 'rd', 'interest rate',
            'emi', 'cibil', 'credit score', 'budget', 'expense',
            'investment', 'investing', 'financial planning', 'money',
            'wealth', 'debt fund', 'liquid fund', 'gilt', 'government bond',
            'lic', 'ulip', 'endowment', 'premium', 'maturity',
            'best card', 'best fund', 'best plan', 'best scheme',
            'how to', 'guide', 'tips', 'benefits', 'eligibility',
            'comparison', 'vs', 'versus', 'which is better',
            'beginner', 'complete guide', 'step by step'
        ];
        
        // MUST contain at least one personal finance keyword
        for (const pattern of includePatterns) {
            if (topicLower.includes(pattern)) {
                return true;
            }
        }
        
        // If no personal finance keywords found, reject
        // This prevents generic news from slipping through
        return false;
    }
    
    /**
     * Score trends based on multiple factors
     */
    private scoreTrends(trends: TrendItem[]): TrendItem[] {
        return trends.map(trend => {
            let trendScore = trend.trendScore || 50;
            
            // Boost score based on search volume
            if (trend.searchVolume) {
                if (trend.searchVolume > 10000) trendScore += 20;
                else if (trend.searchVolume > 1000) trendScore += 10;
            }
            
            // Boost score based on growth rate
            if (trend.growthRate) {
                if (trend.growthRate > 50) trendScore += 15;
                else if (trend.growthRate > 20) trendScore += 8;
            }
            
            // Boost score based on relevance
            trendScore += (trend.relevanceScore * 0.3);
            
            return {
                ...trend,
                trendScore: Math.min(100, trendScore)
            };
        });
    }
    
    /**
     * Categorize topic into PERSONAL FINANCE category
     * NO stock market categories
     */
    private categorizeTopic(topic: string): string {
        const topicLower = topic.toLowerCase();
        
        // Mutual Funds / SIP
        if (topicLower.includes('mutual fund') || topicLower.includes('sip') || 
            topicLower.includes('elss') || topicLower.includes('index fund') ||
            topicLower.includes('mf ') || topicLower.includes('amc')) {
            return 'mutual-funds';
        }
        
        // Credit Cards
        if (topicLower.includes('credit card') || topicLower.includes('cashback card') ||
            topicLower.includes('rewards card') || topicLower.includes('travel card')) {
            return 'credit-cards';
        }
        
        // Loans
        if (topicLower.includes('loan') || topicLower.includes('emi') ||
            topicLower.includes('cibil') || topicLower.includes('credit score') ||
            topicLower.includes('mortgage') || topicLower.includes('borrowing')) {
            return 'loans';
        }
        
        // Insurance
        if (topicLower.includes('insurance') || topicLower.includes('term plan') ||
            topicLower.includes('health cover') || topicLower.includes('life cover')) {
            return 'insurance';
        }
        
        // Tax Planning
        if (topicLower.includes('tax') || topicLower.includes('80c') ||
            topicLower.includes('80d') || topicLower.includes('deduction') ||
            topicLower.includes('itr') || topicLower.includes('income tax')) {
            return 'tax-planning';
        }
        
        // Retirement / NPS / PPF
        if (topicLower.includes('retirement') || topicLower.includes('pension') ||
            topicLower.includes('nps') || topicLower.includes('ppf') ||
            topicLower.includes('epf') || topicLower.includes('provident fund')) {
            return 'retirement';
        }
        
        // Fixed Deposits / Savings
        if (topicLower.includes('fd') || topicLower.includes('fixed deposit') ||
            topicLower.includes('rd') || topicLower.includes('recurring deposit') ||
            topicLower.includes('savings account') || topicLower.includes('interest rate')) {
            return 'investing-basics';
        }
        
        // Banking
        if (topicLower.includes('bank') || topicLower.includes('upi') ||
            topicLower.includes('neft') || topicLower.includes('rtgs') ||
            topicLower.includes('account')) {
            return 'investing-basics';
        }
        
        // Default to investing basics (NOT stocks)
        return 'investing-basics';
    }
    
    /**
     * Calculate relevance score for topic
     */
    private calculateRelevance(topic: string): number {
        const financialKeywords = [
            'investment', 'finance', 'money', 'savings', 'wealth',
            'mutual fund', 'sip', 'stock', 'equity', 'debt',
            'credit card', 'loan', 'insurance', 'tax', 'retirement'
        ];
        
        const topicLower = topic.toLowerCase();
        const matches = financialKeywords.filter(keyword => topicLower.includes(keyword)).length;
        
        return Math.min(100, (matches / financialKeywords.length) * 100);
    }
    
    /**
     * Extract keywords from topic
     */
    private extractKeywords(topic: string): string[] {
        const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'what', 'how', 'why'];
        
        return topic
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.includes(word))
            .slice(0, 5);
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const trends = await this.detectTrends(context);
            
            return {
                success: true,
                data: trends,
                executionTime: Date.now() - startTime,
                metadata: { count: trends.length }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
