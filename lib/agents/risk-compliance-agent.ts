/**
 * Risk & Compliance Agent
 * 
 * Ensures financial content safety:
 * - Flags guaranteed returns
 * - Flags tax claims
 * - Flags investment advice
 * - Flags regulatory sensitive content
 * - Two-model verification for high-risk content
 * - Prevents auto-publishing of risky content
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { multiProviderAI } from '@/lib/ai/providers/multi-provider';
import { logger } from '@/lib/logger';

export interface RiskAssessment {
    riskScore: number; // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    flags: {
        hasGuaranteedReturns: boolean;
        hasTaxClaims: boolean;
        hasInvestmentAdvice: boolean;
        hasRegulatorySensitive: boolean;
    };
    verificationStatus: 'pending' | 'verified' | 'flagged' | 'rejected';
    canAutoPublish: boolean;
    requiresManualReview: boolean;
    verificationConflict: boolean;
}

export class RiskComplianceAgent extends BaseAgent {
    constructor() {
        super('RiskComplianceAgent');
    }
    
    /**
     * Assess content risk
     */
    async assessRisk(article: {
        title: string;
        content: string;
        category: string;
    }): Promise<RiskAssessment> {
        const startTime = Date.now();
        
        try {
            logger.info('RiskComplianceAgent: Assessing risk...', { articleId: article.title });
            
            // Use cheap model first for initial assessment
            const assessmentPrompt = this.buildAssessmentPrompt(article);
            
            const initialAssessment = await this.generateWithAI(assessmentPrompt, {
                priority: 'cost', // Use cheapest model
                maxTokens: 500,
                temperature: 0.3
            });
            
            // Parse assessment
            const assessment = this.parseAssessment(initialAssessment);
            
            // If high risk, verify with second model
            let verificationConflict = false;
            let verificationModel2: string | undefined;
            
            if (assessment.riskLevel === 'high' || assessment.riskLevel === 'critical') {
                // Use more expensive model for verification
                const verificationResult = await this.generateWithAI(assessmentPrompt, {
                    priority: 'quality', // Use better model
                    maxTokens: 500,
                    temperature: 0.3
                });
                
                const verification = this.parseAssessment(verificationResult);
                verificationModel2 = 'openai'; // Or whatever quality model was used
                
                // Check for conflict
                if (verification.riskLevel !== assessment.riskLevel ||
                    verification.flags.hasGuaranteedReturns !== assessment.flags.hasGuaranteedReturns ||
                    verification.flags.hasTaxClaims !== assessment.flags.hasTaxClaims) {
                    verificationConflict = true;
                    // Use more conservative assessment
                    if (verification.riskScore > assessment.riskScore) {
                        Object.assign(assessment, verification);
                    }
                }
            }
            
            // Determine if can auto-publish
            const canAutoPublish = assessment.riskLevel === 'low' && !verificationConflict;
            const requiresManualReview = assessment.riskLevel === 'high' || 
                                        assessment.riskLevel === 'critical' || 
                                        verificationConflict;
            
            const result: RiskAssessment = {
                ...assessment,
                verificationStatus: requiresManualReview ? 'flagged' : 'verified',
                canAutoPublish,
                requiresManualReview,
                verificationConflict
            };
            
            // Store risk assessment
            await this.storeRiskAssessment(article, result, verificationModel2);
            
            const executionTime = Date.now() - startTime;
            
            await this.logExecution(
                'risk_assessment',
                { articleTitle: article.title },
                { riskLevel: result.riskLevel, canAutoPublish: result.canAutoPublish },
                executionTime,
                true,
                undefined,
                { articleId: (article as any).id }
            );
            
            logger.info('RiskComplianceAgent: Risk assessment complete', {
                riskLevel: result.riskLevel,
                canAutoPublish: result.canAutoPublish
            });
            
            return result;
            
        } catch (error) {
            logger.error('RiskComplianceAgent: Risk assessment failed', error as Error);
            // Fail safe - don't allow auto-publish if assessment fails
            return {
                riskScore: 100,
                riskLevel: 'critical',
                flags: {
                    hasGuaranteedReturns: false,
                    hasTaxClaims: false,
                    hasInvestmentAdvice: false,
                    hasRegulatorySensitive: false
                },
                verificationStatus: 'rejected',
                canAutoPublish: false,
                requiresManualReview: true,
                verificationConflict: false
            };
        }
    }
    
    /**
     * Build assessment prompt
     */
    private buildAssessmentPrompt(article: { title: string; content: string; category: string }): string {
        return `You are a financial content compliance checker for Indian finance content.

Analyze this article for compliance risks:

Title: ${article.title}
Category: ${article.category}
Content: ${article.content.substring(0, 2000)}...

Check for:
1. Guaranteed returns claims (e.g., "guaranteed 12% returns", "risk-free")
2. Tax claims (e.g., "save 100% tax", specific tax amounts without disclaimers)
3. Investment advice (e.g., "you should invest in X", "buy this stock")
4. Regulatory sensitive content (e.g., SEBI violations, RBI policy claims)

Return JSON:
{
  "riskScore": 0-100,
  "riskLevel": "low" | "medium" | "high" | "critical",
  "hasGuaranteedReturns": boolean,
  "hasTaxClaims": boolean,
  "hasInvestmentAdvice": boolean,
  "hasRegulatorySensitive": boolean,
  "reason": "explanation"
}`;
    }
    
    /**
     * Parse assessment from AI response
     */
    private parseAssessment(response: string): Partial<RiskAssessment> {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    riskScore: parsed.riskScore || 0,
                    riskLevel: parsed.riskLevel || 'low',
                    flags: {
                        hasGuaranteedReturns: parsed.hasGuaranteedReturns || false,
                        hasTaxClaims: parsed.hasTaxClaims || false,
                        hasInvestmentAdvice: parsed.hasInvestmentAdvice || false,
                        hasRegulatorySensitive: parsed.hasRegulatorySensitive || false
                    }
                };
            }
        } catch (error) {
            logger.warn('RiskComplianceAgent: Failed to parse assessment', error as Error);
        }
        
        // Default to low risk if parsing fails
        return {
            riskScore: 20,
            riskLevel: 'low',
            flags: {
                hasGuaranteedReturns: false,
                hasTaxClaims: false,
                hasInvestmentAdvice: false,
                hasRegulatorySensitive: false
            }
        };
    }
    
    /**
     * Store risk assessment
     */
    private async storeRiskAssessment(
        article: any,
        assessment: RiskAssessment,
        verificationModel2?: string
    ): Promise<void> {
        try {
            await this.supabase.from('content_risk_scores').insert({
                article_id: article.id,
                risk_score: assessment.riskScore,
                risk_level: assessment.riskLevel,
                has_guaranteed_returns: assessment.flags.hasGuaranteedReturns,
                has_tax_claims: assessment.flags.hasTaxClaims,
                has_investment_advice: assessment.flags.hasInvestmentAdvice,
                has_regulatory_sensitive: assessment.flags.hasRegulatorySensitive,
                verification_status: assessment.verificationStatus,
                verification_model_1: 'deepseek', // First model (cheap)
                verification_model_2: verificationModel2,
                verification_conflict: assessment.verificationConflict,
                requires_manual_review: assessment.requiresManualReview,
                can_auto_publish: assessment.canAutoPublish
            });
        } catch (error) {
            logger.warn('RiskComplianceAgent: Failed to store assessment', error as Error);
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const assessment = await this.assessRisk(context.article);
            
            return {
                success: true,
                data: assessment,
                executionTime: Date.now() - startTime,
                metadata: {
                    riskLevel: assessment.riskLevel,
                    canAutoPublish: assessment.canAutoPublish
                }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
