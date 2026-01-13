/**
 * Feedback Loop Agent
 * 
 * Tracks performance, identifies patterns, and updates strategy
 * This is the "learning" component of the autonomous CMS
 */

import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';
import { multiProviderAI } from '@/lib/ai/providers/multi-provider';

export interface PerformanceData {
    articleId: string;
    views: number;
    engagement: number;
    rankings: number[];
    conversions: number;
    revenue: number;
    qualityScore: number;
    timestamp: Date;
}

export interface PerformancePattern {
    category: string;
    keyword: string;
    averagePerformance: number;
    performanceScore: number; // 0-100
    sampleSize: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

export interface StrategyWeights {
    categories: Record<string, number>; // Weight multiplier
    keywords: Record<string, number>;
    contentTypes: Record<string, number>;
    publishingTimes: Record<string, number>;
}

/**
 * Feedback Loop Agent - The Learning Component
 */
export class FeedbackLoopAgent {
    private supabase = createServiceClient();
    
    /**
     * Get performance data for all articles
     */
    async getPerformanceData(days: number = 90): Promise<PerformanceData[]> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        // Get articles with performance metrics
        const { data: articles, error } = await this.supabase
            .from('articles')
            .select(`
                id,
                category,
                tags,
                views,
                quality_score,
                created_at,
                content_performance (
                    metric_type,
                    metric_value,
                    metric_date
                )
            `)
            .gte('created_at', cutoffDate.toISOString())
            .eq('status', 'published');
        
        if (error) {
            logger.error('Failed to fetch performance data', error);
            return [];
        }
        
        // Transform to PerformanceData format
        const performanceData: PerformanceData[] = [];
        
        for (const article of articles || []) {
            const metrics = article.content_performance || [];
            
            // Calculate aggregated metrics
            const views = article.views || 0;
            const engagement = this.calculateEngagement(metrics);
            const rankings = this.extractRankings(metrics);
            const conversions = this.extractConversions(metrics);
            const revenue = this.extractRevenue(metrics);
            
            performanceData.push({
                articleId: article.id,
                views,
                engagement,
                rankings,
                conversions,
                revenue,
                qualityScore: article.quality_score || 0,
                timestamp: new Date(article.created_at)
            });
        }
        
        return performanceData;
    }
    
    /**
     * Identify performance patterns
     */
    async identifyPatterns(performanceData: PerformanceData[]): Promise<PerformancePattern[]> {
        // Group by category and keyword
        const grouped = new Map<string, PerformanceData[]>();
        
        for (const data of performanceData) {
            // Get article details
            const { data: article } = await this.supabase
                .from('articles')
                .select('category, tags')
                .eq('id', data.articleId)
                .single();
            
            if (!article) continue;
            
            const category = article.category;
            const keyword = article.tags?.[0] || 'unknown';
            const key = `${category}:${keyword}`;
            
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(data);
        }
        
        // Analyze each group
        const patterns: PerformancePattern[] = [];
        
        for (const [key, data] of grouped.entries()) {
            const [category, keyword] = key.split(':');
            
            if (data.length < 3) continue; // Need at least 3 samples
            
            // Calculate average performance
            const avgPerformance = this.calculateAveragePerformance(data);
            const performanceScore = this.calculatePerformanceScore(data);
            const trend = this.identifyTrend(data);
            
            patterns.push({
                category,
                keyword,
                averagePerformance: avgPerformance,
                performanceScore,
                sampleSize: data.length,
                trend
            });
        }
        
        return patterns;
    }
    
    /**
     * Update feedback loop with new performance data
     */
    async updateFeedbackLoop(): Promise<void> {
        logger.info('Updating feedback loop...');
        
        // Get recent performance data
        const performanceData = await this.getPerformanceData(30); // Last 30 days
        
        // Identify patterns
        const patterns = await this.identifyPatterns(performanceData);
        
        // Update strategy weights
        await this.updateStrategyWeights(patterns);
        
        logger.info('Feedback loop updated', { patterns: patterns.length });
    }
    
    /**
     * Update strategy weights based on performance patterns
     */
    async updateStrategyWeights(patterns: PerformancePattern[]): Promise<void> {
        for (const pattern of patterns) {
            // Calculate weight multiplier based on performance score
            // High performers (80+) get 1.5x weight
            // Low performers (<50) get 0.5x weight
            const weightMultiplier = pattern.performanceScore >= 80 
                ? 1.5 
                : pattern.performanceScore >= 60 
                    ? 1.0 
                    : pattern.performanceScore >= 40 
                        ? 0.7 
                        : 0.5;
            
            // Update category weight
            await this.supabase
                .from('content_strategy_weights')
                .upsert({
                    category: pattern.category,
                    keyword: pattern.keyword,
                    performance_score: pattern.performanceScore,
                    weight_multiplier: weightMultiplier,
                    last_updated: new Date().toISOString()
                }, {
                    onConflict: 'category,keyword'
                });
        }
    }
    
    /**
     * Get strategy weights for content prioritization
     */
    async getStrategyWeights(): Promise<Record<string, number>> {
        try {
            const { data, error } = await this.supabase
                .from('content_strategy_weights')
                .select('category, weight_multiplier');
            
            if (error || !data) {
                // Return default weights
                return {
                    'mutual-funds': 1.0,
                    'credit-cards': 1.0,
                    'loans': 1.0,
                    'insurance': 1.0,
                    'tax-planning': 1.0,
                    'retirement': 1.0,
                    'investing-basics': 1.0,
                    'stocks': 1.0
                };
            }
            
            const weights: Record<string, number> = {};
            for (const row of data) {
                weights[row.category] = row.weight_multiplier || 1.0;
            }
            
            return weights;
        } catch (error) {
            logger.warn('FeedbackLoopAgent: Failed to get strategy weights', error as Error);
            // Return default weights on error
            return {
                'mutual-funds': 1.0,
                'credit-cards': 1.0,
                'loans': 1.0,
                'insurance': 1.0,
                'tax-planning': 1.0,
                'retirement': 1.0,
                'investing-basics': 1.0,
                'stocks': 1.0
            };
        }
    }
    
    /**
     * Calculate average performance
     */
    private calculateAveragePerformance(data: PerformanceData[]): number {
        const total = data.reduce((sum, d) => {
            return sum + (
                d.views * 0.3 +
                d.engagement * 0.3 +
                d.conversions * 0.2 +
                d.revenue * 0.2
            );
        }, 0);
        
        return total / data.length;
    }
    
    /**
     * Calculate performance score (0-100)
     */
    private calculatePerformanceScore(data: PerformanceData[]): number {
        const avgViews = data.reduce((sum, d) => sum + d.views, 0) / data.length;
        const avgEngagement = data.reduce((sum, d) => sum + d.engagement, 0) / data.length;
        const avgConversions = data.reduce((sum, d) => sum + d.conversions, 0) / data.length;
        const avgRevenue = data.reduce((sum, d) => sum + d.revenue, 0) / data.length;
        const avgQuality = data.reduce((sum, d) => sum + d.qualityScore, 0) / data.length;
        
        // Normalize and weight
        const viewsScore = Math.min(avgViews / 1000, 1) * 20; // Max 20 points
        const engagementScore = Math.min(avgEngagement / 100, 1) * 20; // Max 20 points
        const conversionsScore = Math.min(avgConversions / 10, 1) * 20; // Max 20 points
        const revenueScore = Math.min(avgRevenue / 100, 1) * 20; // Max 20 points
        const qualityScore = avgQuality * 0.2; // Max 20 points
        
        return Math.round(viewsScore + engagementScore + conversionsScore + revenueScore + qualityScore);
    }
    
    /**
     * Identify trend (increasing, decreasing, stable)
     */
    private identifyTrend(data: PerformanceData[]): 'increasing' | 'decreasing' | 'stable' {
        // Sort by timestamp
        const sorted = [...data].sort((a, b) => 
            a.timestamp.getTime() - b.timestamp.getTime()
        );
        
        if (sorted.length < 2) return 'stable';
        
        // Calculate performance for first half vs second half
        const midpoint = Math.floor(sorted.length / 2);
        const firstHalf = sorted.slice(0, midpoint);
        const secondHalf = sorted.slice(midpoint);
        
        const firstAvg = this.calculateAveragePerformance(firstHalf);
        const secondAvg = this.calculateAveragePerformance(secondHalf);
        
        const change = (secondAvg - firstAvg) / firstAvg;
        
        if (change > 0.1) return 'increasing';
        if (change < -0.1) return 'decreasing';
        return 'stable';
    }
    
    /**
     * Calculate engagement from metrics
     */
    private calculateEngagement(metrics: any[]): number {
        // Sum engagement-related metrics
        return metrics
            .filter(m => ['time_on_page', 'scroll_depth', 'social_shares'].includes(m.metric_type))
            .reduce((sum, m) => sum + (m.metric_value || 0), 0);
    }
    
    /**
     * Extract rankings from metrics
     */
    private extractRankings(metrics: any[]): number[] {
        return metrics
            .filter(m => m.metric_type === 'ranking')
            .map(m => m.metric_value)
            .filter((r): r is number => typeof r === 'number');
    }
    
    /**
     * Extract conversions from metrics
     */
    private extractConversions(metrics: any[]): number {
        return metrics
            .filter(m => m.metric_type === 'conversion')
            .reduce((sum, m) => sum + (m.metric_value || 0), 0);
    }
    
    /**
     * Extract revenue from metrics
     */
    private extractRevenue(metrics: any[]): number {
        return metrics
            .filter(m => m.metric_type === 'revenue')
            .reduce((sum, m) => sum + (m.metric_value || 0), 0);
    }
}
