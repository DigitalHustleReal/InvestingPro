/**
 * Publish Agent
 * 
 * Handles publishing:
 * - Auto-publish if quality ≥ 80
 * - Save as draft if quality < 80
 * - Schedule publishing
 * - Update article status
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { articleService } from '@/lib/cms/article-service';
import { RiskComplianceAgent } from './risk-compliance-agent';
import { logger } from '@/lib/logger';

export interface PublishDecision {
    action: 'publish' | 'draft' | 'schedule';
    scheduledDate?: Date;
    reason: string;
}

export class PublishAgent extends BaseAgent {
    private riskAgent: RiskComplianceAgent;
    
    constructor() {
        super('PublishAgent');
        this.riskAgent = new RiskComplianceAgent();
    }
    
    /**
     * Publish article
     */
    async publishArticle(article: any): Promise<void> {
        const startTime = Date.now();
        
        try {
            logger.info('PublishAgent: Publishing article...', { articleId: article.id });
            
            await articleService.updateArticle(article.id, {
                status: 'published',
                published_date: new Date().toISOString()
            });
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'publish',
                { articleId: article.id },
                { status: 'published', publishedDate: new Date().toISOString() },
                executionTime,
                true,
                undefined,
                { articleId: article.id }
            );
            
            logger.info('PublishAgent: Article published successfully', { articleId: article.id });
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            await this.logExecution(
                'publish',
                { articleId: article.id },
                {},
                executionTime,
                false,
                error instanceof Error ? error.message : String(error)
            );
            
            throw error;
        }
    }
    
    /**
     * Save as draft
     */
    async saveDraft(article: any): Promise<void> {
        try {
            await articleService.updateArticle(article.id, {
                status: 'draft'
            });
            
            logger.info('PublishAgent: Article saved as draft', { articleId: article.id });
        } catch (error) {
            logger.error('PublishAgent: Failed to save draft', error as Error);
            throw error;
        }
    }
    
    /**
     * Make publish decision based on quality and risk
     */
    async makePublishDecision(article: any, qualityScore: number): Promise<PublishDecision> {
        // First check risk compliance
        const riskAssessment = await this.riskAgent.assessRisk({
            title: article.title,
            content: article.content,
            category: article.category
        });
        
        // If high risk, never auto-publish
        if (!riskAssessment.canAutoPublish) {
            return {
                action: 'draft',
                reason: `Risk level ${riskAssessment.riskLevel} - requires manual review. Cannot auto-publish.`
            };
        }
        
        // Then check quality
        if (qualityScore >= 80) {
            return {
                action: 'publish',
                reason: `Quality score ${qualityScore} meets auto-publish threshold (≥80) and risk is low`
            };
        } else if (qualityScore >= 75) {
            return {
                action: 'schedule',
                scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                reason: `Quality score ${qualityScore} is good but below auto-publish threshold. Scheduled for review.`
            };
        } else {
            return {
                action: 'draft',
                reason: `Quality score ${qualityScore} is below threshold. Saved as draft for improvement.`
            };
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const article = context.article;
            const qualityScore = context.qualityScore || 0;
            
            const decision = await this.makePublishDecision(article, qualityScore);
            
            if (decision.action === 'publish') {
                await this.publishArticle(article);
            } else if (decision.action === 'schedule') {
                // Schedule for later
                await articleService.updateArticle(article.id, {
                    status: 'scheduled',
                    published_date: decision.scheduledDate?.toISOString()
                });
            } else {
                await this.saveDraft(article);
            }
            
            return {
                success: true,
                data: decision,
                executionTime: Date.now() - startTime,
                metadata: { action: decision.action, qualityScore }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
