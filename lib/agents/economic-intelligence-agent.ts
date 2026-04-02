/**
 * Economic Intelligence Agent
 * 
 * Tracks and optimizes ROI:
 * - Tracks costs per article
 * - Tracks revenue per article
 * - Calculates ROI
 * - Identifies profitable content
 * - Optimizes strategy based on profit
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { logger } from '@/lib/logger';

export interface ContentROI {
    articleId: string;
    totalCost: number;
    totalRevenue: number;
    profit: number;
    roiPercentage: number;
    profitPerView: number;
    profitPerClick: number;
    views: number;
    clicks: number;
    conversions: number;
}

export interface ROIStrategy {
    profitableKeywords: Array<{
        keyword: string;
        avgROI: number;
        avgProfit: number;
        articleCount: number;
    }>;
    profitableCategories: Array<{
        category: string;
        avgROI: number;
        avgProfit: number;
        articleCount: number;
    }>;
    unprofitableKeywords: string[];
    unprofitableCategories: string[];
    recommendations: string[];
}

export class EconomicIntelligenceAgent extends BaseAgent {
    constructor() {
        super('EconomicIntelligenceAgent');
    }
    
    /**
     * Calculate ROI for article
     */
    async calculateROI(articleId: string, days: number = 30): Promise<ContentROI> {
        try {
            // Get ROI from database function
            const { data: roiData, error } = await this.supabase.rpc('calculate_content_roi', {
                p_article_id: articleId,
                p_days: days
            });
            
            if (error) {
                logger.warn('EconomicIntelligenceAgent: Failed to calculate ROI', error);
                return this.getDefaultROI(articleId);
            }
            
            const roi = roiData?.[0];
            
            // Get performance metrics
            const { data: performance } = await this.supabase
                .from('content_performance')
                .select('metric_type, metric_value')
                .eq('article_id', articleId)
                .in('metric_type', ['views', 'conversions']);
            
            const views = performance?.find(p => p.metric_type === 'views')?.metric_value || 0;
            const conversions = performance?.find(p => p.metric_type === 'conversions')?.metric_value || 0;
            
            // Get clicks
            const { data: clicks } = await this.supabase
                .from('affiliate_clicks')
                .select('id')
                .eq('article_id', articleId);
            
            const clicksCount = clicks?.length || 0;
            
            const totalCost = roi?.total_cost || 0;
            const totalRevenue = roi?.total_revenue || 0;
            const profit = roi?.profit || 0;
            const roiPercentage = roi?.roi_percentage || 0;
            
            return {
                articleId,
                totalCost,
                totalRevenue,
                profit,
                roiPercentage,
                profitPerView: views > 0 ? profit / views : 0,
                profitPerClick: clicksCount > 0 ? profit / clicksCount : 0,
                views: views as number,
                clicks: clicksCount,
                conversions: conversions as number
            };
            
        } catch (error) {
            logger.error('EconomicIntelligenceAgent: ROI calculation failed', error as Error);
            return this.getDefaultROI(articleId);
        }
    }
    
    /**
     * Get default ROI (zero)
     */
    private getDefaultROI(articleId: string): ContentROI {
        return {
            articleId,
            totalCost: 0,
            totalRevenue: 0,
            profit: 0,
            roiPercentage: 0,
            profitPerView: 0,
            profitPerClick: 0,
            views: 0,
            clicks: 0,
            conversions: 0
        };
    }
    
    /**
     * Generate ROI-based strategy
     */
    async generateROIStrategy(days: number = 90): Promise<ROIStrategy> {
        try {
            logger.info('EconomicIntelligenceAgent: Generating ROI strategy...');
            
            // Get all articles with economics data
            const { data: economics } = await this.supabase
                .from('content_economics')
                .select(`
                    article_id,
                    roi_percentage,
                    profit,
                    period_start,
                    period_end
                `)
                .gte('period_end', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
            
            if (!economics || economics.length === 0) {
                return this.getDefaultStrategy();
            }
            
            // Get article details
            const articleIds = economics.map(e => e.article_id);
            const { data: articles } = await this.supabase
                .from('articles')
                .select('id, category, tags')
                .in('id', articleIds);
            
            // Aggregate by keyword and category
            const keywordROI: Record<string, { totalROI: number; totalProfit: number; count: number }> = {};
            const categoryROI: Record<string, { totalROI: number; totalProfit: number; count: number }> = {};
            
            articles?.forEach(article => {
                const economic = economics.find(e => e.article_id === article.id);
                if (!economic) return;
                
                const roi = economic.roi_percentage as number;
                const profit = economic.profit as number;
                
                // Aggregate by category
                if (article.category) {
                    if (!categoryROI[article.category]) {
                        categoryROI[article.category] = { totalROI: 0, totalProfit: 0, count: 0 };
                    }
                    categoryROI[article.category].totalROI += roi;
                    categoryROI[article.category].totalProfit += profit;
                    categoryROI[article.category].count++;
                }
                
                // Aggregate by keywords (tags)
                if (article.tags && Array.isArray(article.tags)) {
                    article.tags.forEach((tag: string) => {
                        if (!keywordROI[tag]) {
                            keywordROI[tag] = { totalROI: 0, totalProfit: 0, count: 0 };
                        }
                        keywordROI[tag].totalROI += roi;
                        keywordROI[tag].totalProfit += profit;
                        keywordROI[tag].count++;
                    });
                }
            });
            
            // Calculate averages and identify profitable/unprofitable
            const profitableKeywords = Object.entries(keywordROI)
                .filter(([_, data]) => (data.totalROI / data.count) > 0 && data.count >= 2)
                .map(([keyword, data]) => ({
                    keyword,
                    avgROI: data.totalROI / data.count,
                    avgProfit: data.totalProfit / data.count,
                    articleCount: data.count
                }))
                .sort((a, b) => b.avgROI - a.avgROI)
                .slice(0, 20);
            
            const unprofitableKeywords = Object.entries(keywordROI)
                .filter(([_, data]) => data.totalROI / data.count < -50)
                .map(([keyword]) => keyword);
            
            const profitableCategories = Object.entries(categoryROI)
                .filter(([_, data]) => data.totalROI / data.count > 0)
                .map(([category, data]) => ({
                    category,
                    avgROI: data.totalROI / data.count,
                    avgProfit: data.totalProfit / data.count,
                    articleCount: data.count
                }))
                .sort((a, b) => b.avgROI - a.avgROI);
            
            const unprofitableCategories = Object.entries(categoryROI)
                .filter(([_, data]) => data.totalROI / data.count < -50)
                .map(([category]) => category);
            
            // Generate recommendations
            const recommendations: string[] = [];
            
            if (profitableKeywords.length > 0) {
                recommendations.push(`Prioritize keywords: ${profitableKeywords.slice(0, 5).map(k => k.keyword).join(', ')}`);
            }
            
            if (unprofitableKeywords.length > 0) {
                recommendations.push(`Avoid or deprioritize keywords: ${unprofitableKeywords.slice(0, 5).join(', ')}`);
            }
            
            if (profitableCategories.length > 0) {
                recommendations.push(`Focus on categories: ${profitableCategories.slice(0, 3).map(c => c.category).join(', ')}`);
            }
            
            return {
                profitableKeywords,
                profitableCategories,
                unprofitableKeywords,
                unprofitableCategories,
                recommendations
            };
            
        } catch (error) {
            logger.error('EconomicIntelligenceAgent: Strategy generation failed', error as Error);
            return this.getDefaultStrategy();
        }
    }
    
    /**
     * Get default strategy
     */
    private getDefaultStrategy(): ROIStrategy {
        return {
            profitableKeywords: [],
            profitableCategories: [],
            unprofitableKeywords: [],
            unprofitableCategories: [],
            recommendations: ['Insufficient data for ROI analysis']
        };
    }
    
    /**
     * Update content economics
     */
    async updateContentEconomics(articleId: string, days: number = 30): Promise<void> {
        try {
            const roi = await this.calculateROI(articleId, days);
            
            const periodStart = new Date();
            periodStart.setDate(periodStart.getDate() - days);
            
            await this.supabase.from('content_economics').upsert({
                article_id: articleId,
                total_cost: roi.totalCost,
                total_revenue: roi.totalRevenue,
                roi_percentage: roi.roiPercentage,
                profit: roi.profit,
                profit_per_view: roi.profitPerView,
                profit_per_click: roi.profitPerClick,
                views: roi.views,
                clicks: roi.clicks,
                conversions: roi.conversions,
                period_start: periodStart.toISOString().split('T')[0],
                period_end: new Date().toISOString().split('T')[0]
            }, { onConflict: 'article_id' });
            
        } catch (error) {
            logger.warn('EconomicIntelligenceAgent: Failed to update economics', error as Error);
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            if (context.action === 'calculate') {
                const roi = await this.calculateROI(context.articleId ?? '', context.days);
                return {
                    success: true,
                    data: roi,
                    executionTime: Date.now() - startTime
                };
            } else if (context.action === 'strategy') {
                const strategy = await this.generateROIStrategy(context.days);
                return {
                    success: true,
                    data: strategy,
                    executionTime: Date.now() - startTime
                };
            } else if (context.action === 'update') {
                await this.updateContentEconomics(context.articleId ?? '', context.days);
                return {
                    success: true,
                    data: { updated: true },
                    executionTime: Date.now() - startTime
                };
            }
            
            return {
                success: false,
                error: 'Invalid action',
                executionTime: Date.now() - startTime
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
