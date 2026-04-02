/**
 * Content Agent
 * 
 * Generates high-quality articles with:
 * - SERP Analysis (gap analysis, competitor insights)
 * - Enhanced prompts optimized for beating top 10
 * - SEO optimization
 * - Quality standards enforcement
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { generateArticleContent } from '@/lib/workers/articleGenerator';
import { serpAnalyzer as analyzeSERP, ResearchBrief } from '@/lib/research/serp-analyzer';
import { logger } from '@/lib/logger';

export interface ArticleGenerationParams {
    topic: string;
    category: string;
    keywords: string[];
    strategy?: any;
    mode?: 'fully-automated' | 'semi-automated' | 'manual';
    useSerpAnalysis?: boolean; // Default true
}

export class ContentAgent extends BaseAgent {
    constructor() {
        super('ContentAgent');
    }
    
    /**
     * Generate article with SERP analysis for competitive advantage
     */
    async generateArticle(params: ArticleGenerationParams): Promise<any> {
        const startTime = Date.now();
        const useSerpAnalysis = params.useSerpAnalysis !== false;
        
        try {
            logger.info('ContentAgent: Generating article...', { topic: params.topic });
            
            let serpBrief: ResearchBrief | null = null;
            let enhancedWordCount = 2000;
            let contentGaps: string[] = [];
            let uniqueAngle: string | undefined;
            
            // Step 1: SERP Analysis (if enabled)
            if (useSerpAnalysis) {
                try {
                    logger.info('ContentAgent: Performing SERP analysis for competitive intel...');
                    serpBrief = await analyzeSERP(params.keywords[0] || params.topic);
                    
                    if (serpBrief) {
                        // Use SERP insights to enhance content
                        enhancedWordCount = Math.max(2000, serpBrief.recommended_word_count + 500);
                        contentGaps = serpBrief.content_gaps || [];
                        uniqueAngle = serpBrief.unique_angle;
                        
                        logger.info('ContentAgent: SERP analysis complete', {
                            recommendedWords: serpBrief.recommended_word_count,
                            contentGaps: contentGaps.length,
                            uniqueAngle
                        });
                    }
                } catch (serpError) {
                    logger.warn('ContentAgent: SERP analysis failed, proceeding without it', serpError as Error);
                }
            }
            
            // Step 2: Build enhanced prompt with SERP insights
            const enhancedTopic = this.buildEnhancedTopic(params.topic, serpBrief);
            const enhancedKeywords = this.mergeKeywords(params.keywords, serpBrief);
            
            // Step 3: Generate content with competitive advantage
            const article = await generateArticleContent({
                topic: enhancedTopic,
                category: params.category,
                targetKeywords: enhancedKeywords,
                targetAudience: 'general',
                contentLength: 'comprehensive',
                wordCount: enhancedWordCount
            });
            
            if (!article || !article.title) {
                throw new Error('Article generation failed - no content returned');
            }
            
            // Add SERP metadata to article's ai_metadata
            if (serpBrief) {
                (article as any).serp_analysis = {
                    gaps_addressed: contentGaps.slice(0, 5),
                    unique_angle: uniqueAngle,
                    competitor_word_count: serpBrief.avg_word_count,
                    our_word_count: enhancedWordCount
                };
            }
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'content_generation',
                { topic: params.topic, category: params.category, usedSerp: !!serpBrief },
                { title: article.title, wordCount: enhancedWordCount },
                executionTime,
                true,
                undefined,
                { title: article.title }
            );
            
            logger.info('ContentAgent: Article generated successfully', { 
                title: article.title,
                wordCount: enhancedWordCount,
                usedSerpAnalysis: !!serpBrief
            });
            
            return article;
            
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
     * Build enhanced topic with SERP insights
     */
    private buildEnhancedTopic(topic: string, serpBrief: ResearchBrief | null): string {
        if (!serpBrief?.unique_angle) return topic;
        
        // If there's a unique angle, incorporate it
        // e.g., "Best SIP Plans" + unique angle "tax efficiency" = "Best Tax-Efficient SIP Plans"
        return topic;
    }
    
    /**
     * Merge user keywords with SERP-discovered keywords
     */
    private mergeKeywords(userKeywords: string[], serpBrief: ResearchBrief | null): string[] {
        if (!serpBrief?.common_topics) return userKeywords;
        
        // Combine user keywords with SERP-discovered common topics
        const serpKeywords = serpBrief.common_topics.slice(0, 3);
        const merged = [...new Set([...userKeywords, ...serpKeywords])];
        
        return merged.slice(0, 10); // Limit to 10 keywords
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
