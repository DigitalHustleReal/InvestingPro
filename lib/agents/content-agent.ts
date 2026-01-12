/**
 * Content Agent
 * 
 * Generates high-quality articles:
 * - Uses enhanced prompts
 * - Applies templates
 * - Optimizes for SEO
 * - Ensures quality standards
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { articleGenerator } from '@/lib/workers/articleGenerator';
import { logger } from '@/lib/logger';

export interface ArticleGenerationParams {
    topic: string;
    category: string;
    keywords: string[];
    strategy?: any;
    mode?: 'fully-automated' | 'semi-automated' | 'manual';
}

export class ContentAgent extends BaseAgent {
    constructor() {
        super('ContentAgent');
    }
    
    /**
     * Generate article
     */
    async generateArticle(params: ArticleGenerationParams): Promise<any> {
        const startTime = Date.now();
        
        try {
            logger.info('ContentAgent: Generating article...', { topic: params.topic });
            
            // Use existing article generator
            const result = await articleGenerator.generateComprehensiveArticle({
                topic: params.topic,
                category: params.category,
                targetKeywords: params.keywords,
                targetAudience: 'general',
                contentLength: 'comprehensive',
                wordCount: 2000,
                language: 'en',
                tone: 'professional'
            });
            
            if (!result.success || !result.article) {
                throw new Error(result.error || 'Article generation failed');
            }
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'content_generation',
                { topic: params.topic, category: params.category },
                { articleId: result.article.id, title: result.article.title },
                executionTime,
                true,
                undefined,
                { articleId: result.article.id }
            );
            
            logger.info('ContentAgent: Article generated successfully', { articleId: result.article.id });
            
            return result.article;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            await this.logExecution(
                'content_generation',
                params,
                {},
                executionTime,
                false,
                error instanceof Error ? error.message : String(error)
            );
            
            throw error;
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const article = await this.generateArticle({
                topic: context.topic,
                category: context.category,
                keywords: context.keywords || [],
                strategy: context.strategy,
                mode: context.mode
            });
            
            return {
                success: true,
                data: article,
                executionTime: Date.now() - startTime,
                metadata: { articleId: article.id, title: article.title }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
