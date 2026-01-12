/**
 * Trend Agent
 * 
 * Detects trending topics from multiple sources:
 * - Google Trends
 * - Social Media (Twitter, LinkedIn)
 * - Economic Calendar
 * - RSS Feeds
 * - News Aggregators
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { TrendsService } from '@/lib/trends/TrendsService';
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
    private trendsService: TrendsService;
    
    constructor() {
        super('TrendAgent');
        this.trendsService = new TrendsService();
    }
    
    /**
     * Detect trending topics
     */
    async detectTrends(context?: AgentContext): Promise<TrendItem[]> {
        const startTime = Date.now();
        
        try {
            logger.info('TrendAgent: Detecting trends...');
            
            // Detect from multiple sources
            const [rssTrends, googleTrends, socialTrends] = await Promise.all([
                this.detectFromRSS(),
                this.detectFromGoogleTrends(),
                this.detectFromSocialMedia()
            ]);
            
            // Combine and score trends
            const allTrends = [...rssTrends, ...googleTrends, ...socialTrends];
            const scoredTrends = this.scoreTrends(allTrends);
            
            // Sort by relevance and trend score
            const sortedTrends = scoredTrends.sort((a, b) => {
                const scoreA = (a.trendScore * 0.6) + (a.relevanceScore * 0.4);
                const scoreB = (b.trendScore * 0.6) + (b.relevanceScore * 0.4);
                return scoreB - scoreA;
            });
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'trend_detection',
                { sources: ['rss', 'google-trends', 'social-media'] },
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
            await this.logExecution(
                'trend_detection',
                {},
                {},
                executionTime,
                false,
                error instanceof Error ? error.message : String(error),
                context
            );
            
            return this.handleError(error, context).data || [];
        }
    }
    
    /**
     * Detect trends from RSS feeds
     */
    private async detectFromRSS(): Promise<TrendItem[]> {
        try {
            const trends = await this.trendsService.getTrendingTopics();
            
            return trends.map(trend => ({
                topic: trend.title,
                category: this.categorizeTopic(trend.title),
                source: 'rss' as const,
                trendScore: 70, // Default score
                relevanceScore: this.calculateRelevance(trend.title),
                keywords: this.extractKeywords(trend.title),
                timestamp: new Date()
            }));
        } catch (error) {
            logger.warn('Failed to detect RSS trends', error as Error);
            return [];
        }
    }
    
    /**
     * Detect trends from Google Trends
     */
    private async detectFromGoogleTrends(): Promise<TrendItem[]> {
        // In production, integrate with Google Trends API
        // For now, return empty array
        return [];
    }
    
    /**
     * Detect trends from social media
     */
    private async detectFromSocialMedia(): Promise<TrendItem[]> {
        // In production, integrate with Twitter/LinkedIn APIs
        // For now, return empty array
        return [];
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
