/**
 * CMS Orchestrator Agent
 * 
 * Coordinates all agents and makes high-level decisions
 * Acts as the "brain" of the autonomous CMS system
 */

import { TrendAgent } from './trend-agent';
import { KeywordAgent } from './keyword-agent';
import { StrategyAgent } from './strategy-agent';
import { ContentAgent } from './content-agent';
import { ImageAgent } from './image-agent';
import { QualityAgent } from './quality-agent';
import { PublishAgent } from './publish-agent';
import { TrackingAgent } from './tracking-agent';
import { RepurposeAgent } from './repurpose-agent';
import { SocialAgent } from './social-agent';
import { AffiliateAgent } from './affiliate-agent';
import { FeedbackLoopAgent } from './feedback-loop-agent';
import { ScraperAgent } from './scraper-agent';
import { BulkGenerationAgent } from './bulk-generation-agent';
import { BudgetGovernorAgent } from './budget-governor-agent';
import { RiskComplianceAgent } from './risk-compliance-agent';
import { EconomicIntelligenceAgent } from './economic-intelligence-agent';
import { HealthMonitorAgent } from './health-monitor-agent';
import { retry } from '@/lib/utils/retry';
import { logger } from '@/lib/logger';

export interface OrchestrationContext {
    mode: 'fully-automated' | 'semi-automated' | 'manual';
    goals?: {
        volume?: number;
        quality?: number;
        revenue?: number;
        seo?: boolean;
    };
    constraints?: {
        budget?: number;
        time?: number;
        resources?: string[];
    };
}

export interface OrchestrationResult {
    success: boolean;
    articlesGenerated: number;
    articlesPublished: number;
    performanceScore: number;
    strategy: any;
    errors: string[];
}

/**
 * CMS Orchestrator - The Brain of the System
 */
export class CMSOrchestrator {
    private trendAgent: TrendAgent;
    private keywordAgent: KeywordAgent;
    private strategyAgent: StrategyAgent;
    private contentAgent: ContentAgent;
    private imageAgent: ImageAgent;
    private qualityAgent: QualityAgent;
    private publishAgent: PublishAgent;
    private trackingAgent: TrackingAgent;
    private repurposeAgent: RepurposeAgent;
    private socialAgent: SocialAgent;
    private affiliateAgent: AffiliateAgent;
    private feedbackLoopAgent: FeedbackLoopAgent;
    private scraperAgent: ScraperAgent;
    private bulkGenerationAgent: BulkGenerationAgent;
    private budgetGovernorAgent: BudgetGovernorAgent;
    private riskComplianceAgent: RiskComplianceAgent;
    private economicIntelligenceAgent: EconomicIntelligenceAgent;
    private healthMonitorAgent: HealthMonitorAgent;
    
    constructor() {
        // Initialize all agents
        this.trendAgent = new TrendAgent();
        this.keywordAgent = new KeywordAgent();
        this.strategyAgent = new StrategyAgent();
        this.contentAgent = new ContentAgent();
        this.imageAgent = new ImageAgent();
        this.qualityAgent = new QualityAgent();
        this.publishAgent = new PublishAgent();
        this.trackingAgent = new TrackingAgent();
        this.repurposeAgent = new RepurposeAgent();
        this.socialAgent = new SocialAgent();
        this.affiliateAgent = new AffiliateAgent();
        this.feedbackLoopAgent = new FeedbackLoopAgent();
        this.scraperAgent = new ScraperAgent();
        this.bulkGenerationAgent = new BulkGenerationAgent();
        this.budgetGovernorAgent = new BudgetGovernorAgent();
        this.riskComplianceAgent = new RiskComplianceAgent();
        this.economicIntelligenceAgent = new EconomicIntelligenceAgent();
        this.healthMonitorAgent = new HealthMonitorAgent();
    }
    
    /**
     * Generate articles in bulk
     */
    async generateBulk(config: {
        totalArticles: number;
        batchSize?: number;
        parallelBatches?: number;
        qualityThreshold?: number;
        categories?: string[];
    }): Promise<any> {
        return await this.bulkGenerationAgent.generateBulk({
            totalArticles: config.totalArticles,
            batchSize: config.batchSize || 5,
            parallelBatches: config.parallelBatches || 2,
            qualityThreshold: config.qualityThreshold || 80,
            categories: config.categories
        });
    }
    
    /**
     * Execute complete content generation cycle
     */
    async executeCycle(context: OrchestrationContext): Promise<OrchestrationResult> {
        logger.info('CMS Orchestrator: Starting content generation cycle', context);
        
        const errors: string[] = [];
        let articlesGenerated = 0;
        let articlesPublished = 0;
        let totalPerformanceScore = 0;
        
        try {
            // Pre-flight health check
            const isHealthy = await this.healthMonitorAgent.isHealthy();
            if (!isHealthy) {
                logger.warn('Orchestrator: System health check failed, proceeding with caution');
            }
            
            // Pre-flight budget check
            const budgetStatus = await this.budgetGovernorAgent.checkBudget();
            if (!budgetStatus.canGenerate) {
                logger.warn('Orchestrator: Budget exhausted, stopping cycle');
                return {
                    success: false,
                    articlesGenerated: 0,
                    articlesPublished: 0,
                    performanceScore: 0,
                    strategy: null,
                    errors: ['Budget exhausted. Set new budget or wait for reset.']
                };
            }
            
            // Step 1: Detect Trends
            logger.info('Step 1: Detecting trends...');
            const trends = await retry(() => this.trendAgent.detectTrends(), {
                maxRetries: 2,
                delay: 1000
            });
            
            // Step 2: Research Keywords
            logger.info('Step 2: Researching keywords...');
            const keywords = await this.keywordAgent.researchKeywords(trends);
            
            // Step 3: Generate Strategy
            logger.info('Step 3: Generating strategy...');
            const strategy = await this.strategyAgent.generateStrategy({
                trends,
                keywords,
                goals: context.goals,
                performanceData: await this.feedbackLoopAgent.getPerformanceData()
            });
            
            // Step 4: Generate Content
            logger.info('Step 4: Generating content...');
            const topics = (strategy?.selectedTopics || []).slice(0, context.goals?.volume || 10);
            
            if (topics.length === 0) {
                logger.warn('No topics available for content generation');
                return {
                    success: false,
                    articlesGenerated: 0,
                    articlesPublished: 0,
                    performanceScore: 0,
                    strategy,
                    errors: ['No topics generated. Check trend detection and strategy generation.']
                };
            }
            
            for (const topic of topics) {
                try {
                    // Step 1: Generate article content
                    const article = await this.contentAgent.generateArticle({
                        topic: topic.title,
                        category: topic.category,
                        keywords: topic.keywords,
                        strategy
                    });
                    
                    // Step 2: Generate images (using stock photos first, AI fallback)
                    let images = { featuredImage: null };
                    try {
                        images = await this.imageAgent.generateImages({
                            articleTitle: article.title,
                            category: article.category || topic.category,
                            keywords: article.keywords || topic.keywords
                        });
                    } catch (imageError: any) {
                        logger.warn('Image generation failed, proceeding without featured image', imageError);
                    }
                    
                    article.featured_image = images.featuredImage;
                    
                    // Step 3: Evaluate quality
                    const qualityScore = await this.qualityAgent.evaluateQuality(article);
                    article.quality_score = qualityScore.score;
                    
                    // Step 4: Assess risk
                    let riskAssessment = { canAutoPublish: true, riskLevel: 'low' };
                    try {
                        riskAssessment = await this.riskComplianceAgent.assessRisk({
                            title: article.title,
                            content: article.content || article.body_markdown,
                            category: article.category || topic.category
                        });
                    } catch (riskError: any) {
                        logger.warn('Risk assessment failed, defaulting to manual review', riskError);
                        riskAssessment = { canAutoPublish: false, riskLevel: 'unknown' };
                    }
                    
                    totalPerformanceScore += qualityScore.score;
                    articlesGenerated++;
                    
                    // Step 5: Save to database first (creates article with ID)
                    // Import services lazily to avoid circular deps
                    const { articleService } = await import('@/lib/cms/article-service');
                    const { getAuthorForCategory, getEditorForCategory } = await import('@/lib/content/author-personas');
                    
                    // Get appropriate author/editor for this category
                    const categoryKey = this.mapCategoryToPersona(topic.category);
                    const assignedAuthor = getAuthorForCategory(categoryKey);
                    const assignedEditor = getEditorForCategory(categoryKey);
                    
                    logger.info('Content assigned to:', { 
                        author: assignedAuthor.name, 
                        editor: assignedEditor.name,
                        category: topic.category 
                    });
                    
                    const savedArticle = await articleService.createArticle(
                        {
                            body_html: article.body_html || article.content || '',
                            body_markdown: article.body_markdown || article.content || ''
                        },
                        {
                            title: article.title,
                            slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
                            category: article.category || topic.category,
                            excerpt: article.excerpt || article.meta_description || `A comprehensive guide about ${topic.title}`,
                            featured_image: article.featured_image,
                            tags: article.tags || topic.keywords,
                            author_name: assignedAuthor.name, // Use author name from persona system
                            author_role: assignedAuthor.title,
                            meta_title: article.meta_title || article.title,
                            meta_description: article.meta_description || article.excerpt
                        }
                    );
                    
                    const articleId = savedArticle.id;
                    logger.info('Article saved to database', { articleId, title: article.title });
                    
                    // Step 6: Publish or keep as draft based on quality
                    if (qualityScore.score >= (context.goals?.quality || 80) && riskAssessment.canAutoPublish) {
                        await articleService.updateArticle(articleId, {
                            status: 'published',
                            published_date: new Date().toISOString().split('T')[0],
                            quality_score: qualityScore.score
                        });
                        articlesPublished++;
                        logger.info('Article published', { articleId, title: article.title });
                        
                        // Record costs
                        try {
                            await this.budgetGovernorAgent.recordCost(
                                articleId,
                                2000, // Estimated tokens
                                0.05, // Estimated cost
                                'deepseek',
                                'deepseek-chat',
                                1,
                                images.featuredImage ? 0.00 : 0.08 // Free if stock, paid if AI
                            );
                        } catch (costError) {
                            logger.warn('Failed to record cost', costError as Error);
                        }
                    } else {
                        // Keep as draft (default status)
                        await articleService.updateArticle(articleId, {
                            quality_score: qualityScore.score,
                            editorial_notes: `Auto-generated. Quality: ${qualityScore.score}/100. Risk: ${riskAssessment.riskLevel}`
                        });
                        
                        if (!riskAssessment.canAutoPublish) {
                            errors.push(`Article "${article.title}" saved as draft (risk: ${riskAssessment.riskLevel})`);
                        } else {
                            errors.push(`Article "${article.title}" saved as draft (quality: ${qualityScore.score}/100)`);
                        }
                    }
                } catch (error: any) {
                    errors.push(`Failed to generate article for "${topic.title}": ${error.message}`);
                    logger.error('Article generation failed', error);
                }
            }
            
            // Step 5: Update Feedback Loop
            logger.info('Step 5: Updating feedback loop...');
            await this.feedbackLoopAgent.updateFeedbackLoop();
            
            // Step 6: Adjust Strategy Based on Performance
            logger.info('Step 6: Adjusting strategy...');
            await this.strategyAgent.adjustStrategyBasedOnPerformance();
            
            const averagePerformanceScore = articlesGenerated > 0 
                ? totalPerformanceScore / articlesGenerated 
                : 0;
            
            return {
                success: errors.length === 0,
                articlesGenerated,
                articlesPublished,
                performanceScore: averagePerformanceScore,
                strategy,
                errors
            };
            
        } catch (error: any) {
            logger.error('Orchestration cycle failed', error);
            errors.push(`Orchestration failed: ${error.message}`);
            
            return {
                success: false,
                articlesGenerated,
                articlesPublished,
                performanceScore: 0,
                strategy: null,
                errors
            };
        }
    }
    
    /**
     * Continuous operation mode - runs cycles automatically
     */
    async startContinuousMode(context: OrchestrationContext) {
        logger.info('Starting continuous mode...');
        
        while (true) {
            try {
                const result = await this.executeCycle(context);
                
                logger.info('Cycle completed', {
                    articlesGenerated: result.articlesGenerated,
                    articlesPublished: result.articlesPublished,
                    performanceScore: result.performanceScore
                });
                
                // Wait before next cycle (configurable)
                const waitTime = process.env.CYCLE_INTERVAL_MINUTES 
                    ? parseInt(process.env.CYCLE_INTERVAL_MINUTES) * 60 * 1000
                    : 24 * 60 * 60 * 1000; // Default: 24 hours
                
                await new Promise(resolve => setTimeout(resolve, waitTime));
                
            } catch (error: any) {
                logger.error('Continuous mode error', error);
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // 1 minute
            }
        }
    }
    
    /**
     * Adaptive learning - adjusts based on performance
     */
    async adaptiveLearning() {
        logger.info('Running adaptive learning...');
        
        // Get performance data
        const performanceData = await this.feedbackLoopAgent.getPerformanceData();
        
        // Identify patterns
        const patterns = await this.feedbackLoopAgent.identifyPatterns(performanceData);
        
        // Update strategy weights
        await this.feedbackLoopAgent.updateStrategyWeights(patterns);
        
        // Adjust strategy based on performance
        await this.strategyAgent.adjustStrategyBasedOnPerformance();
        
        logger.info('Adaptive learning completed', { patterns: patterns.length });
    }
    
    /**
     * Map CMS category to author persona category key
     */
    private mapCategoryToPersona(category: string): any {
        const categoryMap: Record<string, string> = {
            'mutual-funds': 'mutual_funds',
            'credit-cards': 'credit_cards',
            'loans': 'loans',
            'insurance': 'insurance',
            'tax-planning': 'tax',
            'tax': 'tax',
            'investing-basics': 'mutual_funds',
            'stocks': 'stocks',
            'fixed-deposits': 'fixed_deposits',
            'banking': 'banking',
            'retirement': 'nps_ppf',
            'gold': 'gold'
        };
        
        return categoryMap[category?.toLowerCase()] || 'mutual_funds';
    }
}

// Lazy singleton pattern - only instantiate when first accessed
let _orchestratorInstance: CMSOrchestrator | null = null;

export function getCmsOrchestrator(): CMSOrchestrator {
    if (!_orchestratorInstance) {
        _orchestratorInstance = new CMSOrchestrator();
    }
    return _orchestratorInstance;
}

// Keep for backward compatibility, but use function when possible
export const cmsOrchestrator = {
    get instance() {
        return getCmsOrchestrator();
    },
    async executeCycle(context: OrchestrationContext) {
        return getCmsOrchestrator().executeCycle(context);
    },
    async generateBulk(config: any) {
        return getCmsOrchestrator().generateBulk(config);
    }
};
