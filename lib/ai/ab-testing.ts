/**
 * A/B Testing Framework
 * 
 * Provides utilities for A/B testing prompts
 */

import { selectPromptForABTest, recordPromptPerformance, analyzeABTestResults } from './prompt-manager';
import { logger } from '@/lib/logger';

export interface ABTestResult {
    group: string;
    sampleSize: number;
    avgQualityScore: number;
    avgLatencyMs: number;
    successRate: number;
    avgCostUSD: number;
    performanceScore: number;
    isWinner: boolean;
}

/**
 * Get prompt for A/B testing
 * This should be used instead of direct prompt retrieval when A/B testing is active
 */
export async function getPromptForABTest(
    slug: string,
    userId?: string
): Promise<{
    promptId: string;
    version: number;
    abTestGroup?: string;
    userPromptTemplate: string;
    systemPrompt?: string;
    config: any;
} | null> {
    try {
        const prompt = await selectPromptForABTest(slug, userId);
        
        if (!prompt) {
            return null;
        }
        
        return {
            promptId: prompt.id,
            version: prompt.version,
            abTestGroup: prompt.ab_test_group,
            userPromptTemplate: prompt.user_prompt_template,
            systemPrompt: prompt.system_prompt,
            config: {
                preferred_model: prompt.preferred_model,
                temperature: prompt.temperature,
                max_tokens: prompt.max_tokens,
                output_format: prompt.output_format,
                json_schema: prompt.json_schema,
            },
        };
    } catch (error) {
        logger.error('Error getting prompt for A/B test', error as Error);
        return null;
    }
}

/**
 * Track A/B test execution
 */
export async function trackABTestExecution(
    promptId: string,
    promptVersion: number,
    abTestGroup: string | undefined,
    metrics: {
        executionId?: string;
        executionType?: string;
        latencyMs?: number;
        tokensUsed?: number;
        costUSD?: number;
        success?: boolean;
        errorMessage?: string;
        qualityScore?: number;
        readabilityScore?: number;
        seoScore?: number;
        articleId?: string;
    }
): Promise<void> {
    try {
        await recordPromptPerformance(promptId, promptVersion, metrics);
        
        if (abTestGroup) {
            logger.info('A/B test execution tracked', {
                promptId,
                version: promptVersion,
                group: abTestGroup,
                success: metrics.success,
            });
        }
    } catch (error) {
        logger.error('Error tracking A/B test execution', error as Error);
    }
}

/**
 * Check if A/B test has winner
 */
export async function checkABTestWinner(testId: string): Promise<{
    hasWinner: boolean;
    winner?: string;
    results?: ABTestResult[];
}> {
    try {
        const results = await analyzeABTestResults(testId);
        
        if (!results || results.length === 0) {
            return { hasWinner: false };
        }
        
        const winner = results.find(r => r.is_winner);
        
        return {
            hasWinner: !!winner,
            winner: winner?.test_group,
            results: results.map(r => ({
                group: r.test_group,
                sampleSize: r.sample_size,
                avgQualityScore: r.avg_quality_score || 0,
                avgLatencyMs: r.avg_latency_ms || 0,
                successRate: r.success_rate || 0,
                avgCostUSD: r.avg_cost_usd || 0,
                performanceScore: r.performance_score || 0,
                isWinner: r.is_winner || false,
            })),
        };
    } catch (error) {
        logger.error('Error checking A/B test winner', error as Error);
        return { hasWinner: false };
    }
}

/**
 * Calculate statistical significance
 */
export function calculateStatisticalSignificance(
    control: { sampleSize: number; successRate: number },
    variant: { sampleSize: number; successRate: number }
): number {
    // Simplified z-test for proportions
    const p1 = control.successRate / 100;
    const n1 = control.sampleSize;
    const p2 = variant.successRate / 100;
    const n2 = variant.sampleSize;
    
    if (n1 === 0 || n2 === 0) {
        return 0;
    }
    
    const p = (p1 * n1 + p2 * n2) / (n1 + n2);
    const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
    
    if (se === 0) {
        return 0;
    }
    
    const z = (p2 - p1) / se;
    
    // Convert z-score to p-value (two-tailed)
    // Simplified: using normal approximation
    const pValue = 2 * (1 - normalCDF(Math.abs(z)));
    
    // Return confidence level (1 - p-value)
    return Math.max(0, Math.min(1, 1 - pValue));
}

/**
 * Normal CDF approximation
 */
function normalCDF(z: number): number {
    // Abramowitz and Stegun approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2.0);
    
    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    
    return 0.5 * (1.0 + sign * y);
}

/**
 * Determine if test results are statistically significant
 */
export function isStatisticallySignificant(
    control: { sampleSize: number; successRate: number },
    variant: { sampleSize: number; successRate: number },
    confidenceLevel: number = 0.95
): boolean {
    const significance = calculateStatisticalSignificance(control, variant);
    return significance >= confidenceLevel;
}

/**
 * Get recommended sample size for A/B test
 */
export function getRecommendedSampleSize(
    baselineRate: number,
    minimumDetectableEffect: number,
    confidenceLevel: number = 0.95,
    power: number = 0.80
): number {
    // Simplified sample size calculation
    // Using formula for two-proportion z-test
    const zAlpha = 1.96; // For 95% confidence
    const zBeta = 0.84; // For 80% power
    
    const p1 = baselineRate / 100;
    const p2 = (baselineRate + minimumDetectableEffect) / 100;
    const p = (p1 + p2) / 2;
    
    const numerator = Math.pow(zAlpha * Math.sqrt(2 * p * (1 - p)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
    const denominator = Math.pow(p2 - p1, 2);
    
    if (denominator === 0) {
        return 100; // Default
    }
    
    return Math.ceil(numerator / denominator);
}
