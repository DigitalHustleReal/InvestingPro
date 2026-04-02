/**
 * Repurpose Agent
 * 
 * Repurposes content for different formats:
 * - Social media posts
 * - Newsletters
 * - Video scripts
 * - Infographics
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { generateSocialMediaContent } from '@/lib/automation/social-media-generator';
import { generateNewsletter } from '@/lib/automation/newsletter-generator';
import { generateVideoScript } from '@/lib/automation/video-script-generator';
import { generateArticleInfographics } from '@/lib/automation/infographic-generator';
import { logger } from '@/lib/logger';

export class RepurposeAgent extends BaseAgent {
    constructor() {
        super('RepurposeAgent');
    }
    
    /**
     * Repurpose article
     */
    async repurposeArticle(articleId: string): Promise<any> {
        const startTime = Date.now();
        
        try {
            logger.info('RepurposeAgent: Repurposing article...', { articleId });
            
            // Get article
            const { data: article } = await this.supabase
                .from('articles')
                .select('*')
                .eq('id', articleId)
                .single();
            
            if (!article) {
                throw new Error('Article not found');
            }
            
            const repurposed: any = {};
            
            // Generate social media content
            try {
                const socialContent = await generateSocialMediaContent({
                    articleTitle: article.title,
                    articleContent: article.content,
                    articleExcerpt: article.excerpt,
                    category: article.category,
                    keywords: article.tags || []
                });
                repurposed.socialMedia = socialContent;
            } catch (error) {
                logger.warn('Failed to generate social media content', error as Error);
            }
            
            // Generate newsletter content (if part of newsletter)
            // This would be called separately when building newsletters
            
            // Generate video scripts
            try {
                const videoScripts = await generateVideoScript({
                    articleTitle: article.title,
                    articleContent: article.content,
                    articleExcerpt: article.excerpt,
                    platform: 'youtube',
                    videoType: 'educational',
                    category: article.category,
                    keywords: article.tags || []
                });
                repurposed.videoScripts = [videoScripts];
            } catch (error) {
                logger.warn('Failed to generate video scripts', error as Error);
            }
            
            // Generate infographics
            try {
                const infographics = await generateArticleInfographics({
                    articleTitle: article.title,
                    articleContent: article.content,
                    category: article.category
                });
                repurposed.infographics = infographics;
            } catch (error) {
                logger.warn('Failed to generate infographics', error as Error);
            }
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'repurpose',
                { articleId },
                { 
                    socialMedia: !!repurposed.socialMedia,
                    videoScripts: repurposed.videoScripts?.length || 0,
                    infographics: repurposed.infographics?.length || 0
                },
                executionTime,
                true,
                undefined,
                { articleId }
            );
            
            logger.info('RepurposeAgent: Article repurposed successfully', { articleId });
            
            return repurposed;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            await this.logExecution(
                'repurpose',
                { articleId },
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
            const repurposed = await this.repurposeArticle(context.articleId ?? '');
            
            return {
                success: true,
                data: repurposed,
                executionTime: Date.now() - startTime,
                metadata: { articleId: context.articleId }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
