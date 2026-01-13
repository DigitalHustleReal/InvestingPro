/**
 * Strategy Agent
 * 
 * Makes strategic decisions:
 * - Content selection based on performance
 * - Keyword prioritization
 * - Category weighting
 * - Content type decisions
 * - Publishing schedule optimization
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { FeedbackLoopAgent } from './feedback-loop-agent';
import { EconomicIntelligenceAgent } from './economic-intelligence-agent';
import { logger } from '@/lib/logger';
import { TrendItem } from './trend-agent';
import { KeywordResearchResult } from './keyword-agent';

export interface ContentStrategy {
    selectedTopics: Array<{
        title: string;
        category: string;
        keywords: string[];
        priority: number; // 1-10
        estimatedPerformance: number; // 0-100
    }>;
    categoryWeights: Record<string, number>; // Weight multipliers
    keywordPriorities: Record<string, number>; // Priority scores
    contentTypeDistribution: Record<string, number>; // How many of each type
    publishingSchedule: Array<{
        topic: string;
        scheduledDate: Date;
        priority: number;
    }>;
}

export class StrategyAgent extends BaseAgent {
    private feedbackLoopAgent: FeedbackLoopAgent;
    private economicAgent: EconomicIntelligenceAgent;
    
    constructor() {
        super('StrategyAgent');
        this.feedbackLoopAgent = new FeedbackLoopAgent();
        this.economicAgent = new EconomicIntelligenceAgent();
    }
    
    /**
     * Generate content strategy
     */
    async generateStrategy(context: {
        trends: TrendItem[];
        keywords: KeywordResearchResult[];
        goals?: {
            volume?: number;
            quality?: number;
            revenue?: number;
        };
        performanceData?: any;
    }): Promise<ContentStrategy> {
        const startTime = Date.now();
        
        try {
            logger.info('StrategyAgent: Generating strategy...');
            
            // Get performance data and weights
            const performanceData = context.performanceData || await this.feedbackLoopAgent.getPerformanceData();
            const patterns = await this.feedbackLoopAgent.identifyPatterns(performanceData);
            const weights = await this.feedbackLoopAgent.getStrategyWeights();
            
            // Get ROI strategy (prioritize profitable content)
            const roiStrategy = await this.economicAgent.generateROIStrategy(90);
            
            // Select topics based on trends, keywords, performance, and ROI
            const selectedTopics = await this.selectTopics(
                context.trends,
                context.keywords,
                weights,
                context.goals?.volume || 10,
                roiStrategy
            );
            
            // Generate category weights
            const categoryWeights = this.generateCategoryWeights(patterns, weights);
            
            // Generate keyword priorities
            const keywordPriorities = this.generateKeywordPriorities(context.keywords, weights);
            
            // Determine content type distribution
            const contentTypeDistribution = await this.determineContentTypeDistribution(context.goals);
            
            // Generate publishing schedule
            const publishingSchedule = this.generatePublishingSchedule(selectedTopics);
            
            const strategy: ContentStrategy = {
                selectedTopics,
                categoryWeights,
                keywordPriorities,
                contentTypeDistribution,
                publishingSchedule
            };
            
            // Log strategy to history
            await this.logStrategy(strategy);
            
            logger.info(`StrategyAgent: Generated strategy with ${selectedTopics.length} topics`);
            
            return strategy;
            
        } catch (error) {
            logger.error('StrategyAgent: Strategy generation failed', error as Error);
            throw error;
        }
    }
    
    /**
     * Select topics based on trends, keywords, performance, and ROI
     */
    private async selectTopics(
        trends: TrendItem[],
        keywords: KeywordResearchResult[],
        weights: any,
        targetCount: number,
        roiStrategy?: any
    ): Promise<ContentStrategy['selectedTopics']> {
        const topics: ContentStrategy['selectedTopics'] = [];
        
        // Handle empty inputs - generate default topics if no trends/keywords
        const safeTrends = trends || [];
        const safeKeywords = keywords || [];
        
        if (safeTrends.length === 0 && safeKeywords.length === 0) {
            // Generate default topics based on high-value categories
            const defaultCategories = ['mutual-funds', 'credit-cards', 'tax-planning'];
            for (let i = 0; i < Math.min(targetCount, defaultCategories.length); i++) {
                topics.push({
                    title: `Best ${defaultCategories[i].replace('-', ' ')} Guide ${new Date().getFullYear()}`,
                    category: defaultCategories[i],
                    keywords: [defaultCategories[i].replace('-', ' ')],
                    priority: 5,
                    estimatedPerformance: 60
                });
            }
            return topics;
        }
        
        // CASE 1: We have trends but no keywords (API key issue)
        // Generate topics from trends directly
        if (safeTrends.length > 0 && safeKeywords.length === 0) {
            for (let i = 0; i < Math.min(safeTrends.length, targetCount); i++) {
                const trend = safeTrends[i];
                const extractedKeywords = trend.keywords?.length > 0 ? trend.keywords : [trend.topic];
                
                topics.push({
                    title: this.optimizeTitle(trend.topic),
                    category: trend.category,
                    keywords: extractedKeywords,
                    priority: Math.round((trend.trendScore || 50) / 10),
                    estimatedPerformance: trend.relevanceScore || 60
                });
            }
            return topics.sort((a, b) => b.priority - a.priority);
        }
        
        // CASE 2: Combine trends and keywords normally
        const maxItems = Math.min(safeTrends.length, safeKeywords.length, targetCount);
        for (let i = 0; i < maxItems; i++) {
            const trend = safeTrends[i];
            const keyword = safeKeywords[i];
            
            if (!trend || !keyword) continue;
            
            // Calculate priority based on trend score, keyword opportunity, and performance weights
            const trendWeight = (trend.trendScore || 50) / 100;
            const keywordWeight = (keyword.opportunityScore || 50) / 100;
            const performanceWeight = weights?.categories?.[trend.category] || 1.0;
            
            const priority = Math.round((trendWeight * 0.4 + keywordWeight * 0.4 + performanceWeight * 0.2) * 10);
            const estimatedPerformance = ((trend.relevanceScore || 50) * 0.5) + ((keyword.opportunityScore || 50) * 0.5);
            
            topics.push({
                title: this.generateTitle(trend.topic, keyword.keyword),
                category: trend.category,
                keywords: [keyword.keyword, ...(keyword.longTailVariations || []).slice(0, 3)],
                priority: Math.min(10, Math.max(1, priority)),
                estimatedPerformance: Math.min(100, estimatedPerformance)
            });
        }
        
        // Sort by priority
        return topics.sort((a, b) => b.priority - a.priority);
    }
    
    /**
     * Generate title from trend and keyword
     */
    private generateTitle(topic: string, keyword: string): string {
        // Use keyword as base, enhance with topic context
        return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Complete Guide ${new Date().getFullYear()}`;
    }
    
    /**
     * Optimize a trend topic into a SEO-friendly title
     */
    private optimizeTitle(trendTopic: string): string {
        const year = new Date().getFullYear();
        
        // If already has a good title format, use it
        if (trendTopic.length > 20 && trendTopic.length < 80) {
            // Add year if not present
            if (!trendTopic.includes(String(year)) && !trendTopic.includes(String(year - 1))) {
                return `${trendTopic} - ${year} Guide`;
            }
            return trendTopic;
        }
        
        // Enhance short topics
        return `${trendTopic.charAt(0).toUpperCase() + trendTopic.slice(1)}: Complete Guide ${year}`;
    }
    
    /**
     * Generate category weights based on performance
     */
    private generateCategoryWeights(patterns: any[], weights: any): Record<string, number> {
        const categoryWeights: Record<string, number> = {};
        
        // Default weights
        const categories = ['mutual-funds', 'credit-cards', 'loans', 'insurance', 'tax-planning', 'retirement', 'stocks', 'investing-basics'];
        categories.forEach(cat => {
            categoryWeights[cat] = 1.0;
        });
        
        // Apply performance-based weights
        patterns.forEach(pattern => {
            if (categoryWeights[pattern.category] !== undefined) {
                categoryWeights[pattern.category] = pattern.performanceScore >= 80 ? 1.5 : 
                                                     pattern.performanceScore >= 60 ? 1.0 :
                                                     pattern.performanceScore >= 40 ? 0.7 : 0.5;
            }
        });
        
        // Apply stored weights if available
        if (weights.categories) {
            Object.entries(weights.categories).forEach(([cat, weight]) => {
                if (categoryWeights[cat] !== undefined) {
                    categoryWeights[cat] = weight as number;
                }
            });
        }
        
        return categoryWeights;
    }
    
    /**
     * Generate keyword priorities
     */
    private generateKeywordPriorities(
        keywords: KeywordResearchResult[],
        weights: any
    ): Record<string, number> {
        const priorities: Record<string, number> = {};
        
        // Handle empty or undefined keywords
        if (!keywords || !Array.isArray(keywords)) {
            return priorities;
        }
        
        // Safely access weights.keywords
        const keywordWeights = weights?.keywords || {};
        
        keywords.forEach(keyword => {
            if (!keyword?.keyword) return;
            
            const basePriority = keyword.opportunityScore || 50;
            const weightMultiplier = keywordWeights[keyword.keyword] || 1.0;
            priorities[keyword.keyword] = basePriority * weightMultiplier;
        });
        
        return priorities;
    }
    
    /**
     * Determine content type distribution
     * 
     * STRATEGIC DIVERSITY CONSTRAINT:
     * At least 20% must be long-term authority content (evergreen, guides)
     */
    private async determineContentTypeDistribution(goals?: { volume?: number; quality?: number }): Promise<Record<string, number>> {
        // Check current diversity
        const diversity = await this.checkDiversityConstraint();
        
        // If diversity constraint not met, increase authority content
        if (!diversity.meetsConstraint) {
            return {
                'ultimate-guide': 0.3, // Authority content
                'how-to-guide': 0.3,   // Authority content
                'comparison-guide': 0.2,
                'listicle': 0.2
            };
        }
        
        // Default distribution (balanced)
        return {
            'comparison-guide': 0.3,
            'how-to-guide': 0.3,
            'ultimate-guide': 0.2, // Authority content (20% minimum)
            'listicle': 0.2
        };
    }
    
    /**
     * Check diversity constraint
     * At least 20% must be authority/evergreen content
     */
    private async checkDiversityConstraint(): Promise<{ meetsConstraint: boolean; authorityPercent: number }> {
        try {
            // Get content from last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const { data: articles } = await this.supabase
                .from('articles')
                .select('id, tags, category')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .eq('status', 'published');
            
            if (!articles || articles.length === 0) {
                return { meetsConstraint: true, authorityPercent: 0 };
            }
            
            // Count authority content (ultimate-guide, how-to-guide, comprehensive guides)
            const authorityKeywords = ['guide', 'complete', 'ultimate', 'comprehensive', 'evergreen'];
            const authorityCount = articles.filter(article => {
                const title = (article as any).title?.toLowerCase() || '';
                const tags = article.tags || [];
                return authorityKeywords.some(keyword => 
                    title.includes(keyword) || 
                    tags.some((tag: string) => tag.toLowerCase().includes(keyword))
                );
            }).length;
            
            const authorityPercent = (authorityCount / articles.length) * 100;
            const meetsConstraint = authorityPercent >= 20;
            
            return { meetsConstraint, authorityPercent };
            
        } catch (error) {
            logger.warn('StrategyAgent: Failed to check diversity', error as Error);
            return { meetsConstraint: true, authorityPercent: 0 };
        }
    }
    
    /**
     * Generate publishing schedule
     */
    private generatePublishingSchedule(topics: ContentStrategy['selectedTopics']): ContentStrategy['publishingSchedule'] {
        const schedule: ContentStrategy['publishingSchedule'] = [];
        const today = new Date();
        
        topics.forEach((topic, index) => {
            // Schedule high-priority topics first
            const daysOffset = Math.floor(index / 2); // 2 articles per day
            const scheduledDate = new Date(today);
            scheduledDate.setDate(scheduledDate.getDate() + daysOffset);
            
            schedule.push({
                topic: topic.title,
                scheduledDate,
                priority: topic.priority
            });
        });
        
        return schedule;
    }
    
    /**
     * Log strategy to history
     */
    private async logStrategy(strategy: ContentStrategy): Promise<void> {
        try {
            await this.supabase.from('strategy_history').insert({
                strategy_data: strategy,
                strategy_type: 'content_selection',
                applied_at: new Date().toISOString()
            });
        } catch (error) {
            logger.warn('Failed to log strategy', error as Error);
        }
    }
    
    /**
     * Adjust strategy based on performance
     */
    async adjustStrategyBasedOnPerformance(): Promise<void> {
        try {
            // Get recent performance data
            const performanceData = await this.feedbackLoopAgent.getPerformanceData(30);
            const patterns = await this.feedbackLoopAgent.identifyPatterns(performanceData);
            
            // Update strategy weights
            await this.feedbackLoopAgent.updateStrategyWeights(patterns);
            
            logger.info('StrategyAgent: Adjusted strategy based on performance');
        } catch (error) {
            logger.error('StrategyAgent: Failed to adjust strategy', error as Error);
        }
    }
    
    /**
     * Select topics from strategy
     */
    async selectTopicsFromStrategy(strategy: ContentStrategy, count: number): Promise<ContentStrategy['selectedTopics']> {
        return (strategy?.selectedTopics || []).slice(0, count);
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const strategy = await this.generateStrategy({
                trends: context.trends || [],
                keywords: context.keywords || [],
                goals: context.goals,
                performanceData: context.performanceData
            });
            
            return {
                success: true,
                data: strategy,
                executionTime: Date.now() - startTime,
                metadata: { topicCount: strategy.selectedTopics.length }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
