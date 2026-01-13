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
        
        try {
            logger.info('TrendAgent: Detecting trends (Google Trends priority)...');
            
            // Use GhostScraper which already prioritizes Google Trends
            const trendSignals = await GhostScraper.scanTrends();
            
            // Convert TrendSignal to TrendItem
            const trends: TrendItem[] = trendSignals
                .filter(signal => signal.topic) // Filter out null topics
                .map(signal => this.convertSignalToTrendItem(signal));
            
            // If no trends from external sources, use default finance topics
            if (trends.length === 0) {
                logger.info('TrendAgent: No external trends found, using default topics');
                return this.getDefaultTrends();
            }
            
            // Score and sort trends
            const scoredTrends = this.scoreTrends(trends);
            const sortedTrends = scoredTrends.sort((a, b) => {
                const scoreA = (a.trendScore * 0.6) + (a.relevanceScore * 0.4);
                const scoreB = (b.trendScore * 0.6) + (b.relevanceScore * 0.4);
                return scoreB - scoreA;
            });
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'trend_detection',
                { sources: ['google-trends', 'rss'] },
                { trends: sortedTrends.length },
                executionTime,
                true,
                undefined,
                context
            );
            
            logger.info(`TrendAgent: Detected ${sortedTrends.length} trends`);
            
            return sortedTrends.slice(0, 20); // Top 20 trends
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            logger.warn('TrendAgent: External trends failed, using defaults', error as Error);
            
            await this.logExecution(
                'trend_detection',
                {},
                {},
                executionTime,
                false,
                error instanceof Error ? error.message : String(error),
                context
            );
            
            // Return default trends instead of empty
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
     * Get default high-value finance trends when external sources fail
     */
    private getDefaultTrends(): TrendItem[] {
        const currentYear = new Date().getFullYear();
        const defaultTopics = [
            { topic: `Best SIP Plans for ${currentYear}`, category: 'mutual-funds' },
            { topic: `Top Tax Saving Investments ${currentYear}`, category: 'tax-planning' },
            { topic: `Best Credit Cards in India ${currentYear}`, category: 'credit-cards' },
            { topic: `Index Fund vs Mutual Fund Comparison`, category: 'mutual-funds' },
            { topic: `How to Start Investing for Beginners`, category: 'investing-basics' },
            { topic: `Best Fixed Deposit Rates ${currentYear}`, category: 'investing-basics' },
            { topic: `Home Loan Interest Rates Comparison`, category: 'loans' },
            { topic: `Term Insurance vs Whole Life Insurance`, category: 'insurance' }
        ];
        
        return defaultTopics.map((item, index) => ({
            topic: item.topic,
            category: item.category,
            source: 'news' as const,
            trendScore: 80 - (index * 3), // Decreasing scores
            relevanceScore: 85,
            keywords: this.extractKeywords(item.topic),
            timestamp: new Date()
        }));
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
     * Categorize topic into content category
     */
    private categorizeTopic(topic: string): string {
        const topicLower = topic.toLowerCase();
        
        if (topicLower.includes('mutual fund') || topicLower.includes('sip') || topicLower.includes('mf')) {
            return 'mutual-funds';
        }
        if (topicLower.includes('credit card') || topicLower.includes('card')) {
            return 'credit-cards';
        }
        if (topicLower.includes('loan') || topicLower.includes('emi')) {
            return 'loans';
        }
        if (topicLower.includes('insurance')) {
            return 'insurance';
        }
        if (topicLower.includes('tax') || topicLower.includes('80c')) {
            return 'tax-planning';
        }
        if (topicLower.includes('retirement') || topicLower.includes('pension')) {
            return 'retirement';
        }
        if (topicLower.includes('stock') || topicLower.includes('equity')) {
            return 'stocks';
        }
        
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
