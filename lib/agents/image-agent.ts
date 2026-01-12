/**
 * Image Agent
 * 
 * Generates images for articles:
 * - Featured images
 * - Social media images
 * - In-article images
 * - Infographics
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { generateArticleImages } from '@/lib/automation/image-pipeline';
import { generateInfographic } from '@/lib/automation/infographic-generator';
import { logger } from '@/lib/logger';

export interface ImageGenerationParams {
    articleTitle: string;
    category: string;
    keywords: string[];
    articleExcerpt?: string;
    articleContent?: string;
}

export class ImageAgent extends BaseAgent {
    constructor() {
        super('ImageAgent');
    }
    
    /**
     * Generate images for article
     */
    async generateImages(params: ImageGenerationParams): Promise<any> {
        const startTime = Date.now();
        
        try {
            logger.info('ImageAgent: Generating images...', { articleTitle: params.articleTitle });
            
            // Generate all article images
            const imageResult = await generateArticleImages({
                articleTitle: params.articleTitle,
                category: params.category,
                keywords: params.keywords,
                articleExcerpt: params.articleExcerpt,
                articleContent: params.articleContent
            });
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'image_generation',
                { articleTitle: params.articleTitle, category: params.category },
                { 
                    featuredImage: !!imageResult.featuredImage,
                    inArticleCount: imageResult.inArticleImages.length,
                    cost: imageResult.generationCost
                },
                executionTime,
                true
            );
            
            logger.info('ImageAgent: Images generated successfully');
            
            return imageResult;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            await this.logExecution(
                'image_generation',
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
     * Generate infographic
     */
    async generateInfographic(params: {
        articleTitle: string;
        articleContent: string;
        category: string;
        infographicType: 'comparison' | 'timeline' | 'statistics' | 'process';
    }): Promise<any> {
        try {
            return await generateInfographic({
                articleTitle: params.articleTitle,
                articleContent: params.articleContent,
                category: params.category,
                infographicType: params.infographicType,
                targetPlatform: 'social'
            });
        } catch (error) {
            logger.error('ImageAgent: Infographic generation failed', error as Error);
            throw error;
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const images = await this.generateImages({
                articleTitle: context.articleTitle,
                category: context.category,
                keywords: context.keywords || [],
                articleExcerpt: context.articleExcerpt,
                articleContent: context.articleContent
            });
            
            return {
                success: true,
                data: images,
                executionTime: Date.now() - startTime,
                metadata: { 
                    featuredImage: !!images.featuredImage,
                    inArticleCount: images.inArticleImages?.length || 0
                }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
