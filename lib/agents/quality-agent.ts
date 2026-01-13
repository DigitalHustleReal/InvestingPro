/**
 * Quality Agent
 * 
 * Evaluates content quality:
 * - Content scoring (0-100)
 * - SEO scoring
 * - Readability check
 * - E-E-A-T validation
 * - Quality gates
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { scoreContent } from '@/lib/quality/content-scorer';
import { runQualityGates } from '@/lib/quality/quality-gates';
import { logger } from '@/lib/logger';

export interface QualityEvaluationResult {
    score: number; // 0-100
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    passesQualityGates: boolean;
    recommendations: string[];
    breakdown: {
        readability: number;
        seo: number;
        structure: number;
        eeat: number;
    };
}

export class QualityAgent extends BaseAgent {
    constructor() {
        super('QualityAgent');
    }
    
    /**
     * Evaluate article quality
     */
    async evaluateQuality(article: any): Promise<QualityEvaluationResult> {
        const startTime = Date.now();
        
        try {
            logger.info('QualityAgent: Evaluating quality...', { articleId: article.id });
            
            // Score content
            const contentScore = await scoreContent({
                title: article.title,
                content: article.content,
                excerpt: article.excerpt,
                category: article.category,
                keywords: article.tags || []
            });
            
            // Evaluate quality gates
            const qualityGates = await runQualityGates({
                title: article.title,
                content: article.content || article.body_markdown,
                metaDescription: article.meta_description || article.excerpt,
                articleId: article.id
            });
            
            // Calculate overall score
            const overallScore = Math.round(
                (contentScore.readability * 0.3) +
                (contentScore.seo * 0.3) +
                (contentScore.structure * 0.2) +
                (contentScore.eeat * 0.2)
            );
            
            // Assign grade
            const grade = this.assignGrade(overallScore);
            
            // Generate recommendations
            const recommendations = this.generateRecommendations(contentScore, qualityGates);
            
            const result: QualityEvaluationResult = {
                score: overallScore,
                grade,
                passesQualityGates: qualityGates.passes,
                recommendations,
                breakdown: {
                    readability: contentScore.readability,
                    seo: contentScore.seo,
                    structure: contentScore.structure,
                    eeat: contentScore.eeat
                }
            };
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'quality_evaluation',
                { articleId: article.id },
                { score: overallScore, grade, passes: qualityGates.passes },
                executionTime,
                true,
                undefined,
                { articleId: article.id }
            );
            
            logger.info('QualityAgent: Quality evaluation complete', { score: overallScore, grade });
            
            return result;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            await this.logExecution(
                'quality_evaluation',
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
     * Assign grade based on score
     */
    private assignGrade(score: number): QualityEvaluationResult['grade'] {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }
    
    /**
     * Generate recommendations
     */
    private generateRecommendations(contentScore: any, qualityGates: any): string[] {
        const recommendations: string[] = [];
        
        // Handle null contentScore
        const safeScore = contentScore || { readability: 0, seo: 0, structure: 0, eeat: 0 };
        
        if (safeScore.readability < 70) {
            recommendations.push('Improve readability: Use shorter sentences and simpler language');
        }
        
        if (safeScore.seo < 70) {
            recommendations.push('Enhance SEO: Add more keywords and optimize meta tags');
        }
        
        if (safeScore.structure < 70) {
            recommendations.push('Improve structure: Add more headings and organize content better');
        }
        
        if (safeScore.eeat < 70) {
            recommendations.push('Enhance E-E-A-T: Add more expertise indicators and citations');
        }
        
        // Handle null qualityGates or failedChecks
        if (qualityGates && !qualityGates.passes && Array.isArray(qualityGates.failedChecks)) {
            recommendations.push(...qualityGates.failedChecks.map((check: any) => check.message || 'Quality check failed'));
        }
        
        return recommendations;
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const quality = await this.evaluateQuality(context.article);
            
            return {
                success: true,
                data: quality,
                executionTime: Date.now() - startTime,
                metadata: { score: quality.score, grade: quality.grade }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
