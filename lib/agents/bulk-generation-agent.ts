/**
 * Bulk Generation Agent
 * 
 * Handles bulk content generation with:
 * - Parallel processing
 * - Batch management
 * - Progress tracking
 * - Error recovery
 * - Rate limiting
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import type { OrchestrationContext, OrchestrationResult } from './orchestrator';
import { logger } from '@/lib/logger';

// Lazy import to avoid circular dependency
let _getCmsOrchestrator: (() => { executeCycle: (ctx: OrchestrationContext) => Promise<OrchestrationResult> }) | null = null;

async function getOrchestrator() {
    if (!_getCmsOrchestrator) {
        const module = await import('./orchestrator');
        _getCmsOrchestrator = module.getCmsOrchestrator;
    }
    return _getCmsOrchestrator();
}

export interface BulkGenerationConfig {
    totalArticles: number;
    batchSize?: number; // Articles per batch (default: 5)
    parallelBatches?: number; // How many batches to run in parallel (default: 2)
    qualityThreshold?: number; // Minimum quality to publish (default: 80)
    categories?: string[]; // Specific categories to generate
    delayBetweenBatches?: number; // Delay in ms between batches (default: 5000)
}

export interface BulkGenerationResult {
    success: boolean;
    totalRequested: number;
    totalGenerated: number;
    totalPublished: number;
    totalFailed: number;
    batches: Array<{
        batchNumber: number;
        articlesGenerated: number;
        articlesPublished: number;
        errors: string[];
        executionTime: number;
    }>;
    averageQualityScore: number;
    totalExecutionTime: number;
}

export class BulkGenerationAgent extends BaseAgent {
    constructor() {
        super('BulkGenerationAgent');
    }
    
    /**
     * Generate articles in bulk
     */
    async generateBulk(config: BulkGenerationConfig): Promise<BulkGenerationResult> {
        const startTime = Date.now();
        
        try {
            logger.info('BulkGenerationAgent: Starting bulk generation', config);
            
            const {
                totalArticles,
                batchSize = 5,
                parallelBatches = 2,
                qualityThreshold = 80,
                categories,
                delayBetweenBatches = 5000
            } = config;
            
            const batches: BulkGenerationResult['batches'] = [];
            let totalGenerated = 0;
            let totalPublished = 0;
            let totalFailed = 0;
            let totalQualityScore = 0;
            
            // Calculate number of batches
            const totalBatches = Math.ceil(totalArticles / batchSize);
            
            logger.info(`BulkGenerationAgent: Generating ${totalArticles} articles in ${totalBatches} batches`);
            
            // Process batches
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const batchStartTime = Date.now();
                const batchNumber = batchIndex + 1;
                const remainingArticles = totalArticles - totalGenerated;
                const currentBatchSize = Math.min(batchSize, remainingArticles);
                
                logger.info(`BulkGenerationAgent: Processing batch ${batchNumber}/${totalBatches} (${currentBatchSize} articles)`);
                
                try {
                    // Execute cycle for this batch
                    const context: OrchestrationContext = {
                        mode: 'fully-automated',
                        goals: {
                            volume: currentBatchSize,
                            quality: qualityThreshold,
                            revenue: 0,
                            seo: true
                        }
                    };
                    
                    const orchestrator = await getOrchestrator();
                    const result = await orchestrator.executeCycle(context);
                    
                    const batchExecutionTime = Date.now() - batchStartTime;
                    
                    totalGenerated += result.articlesGenerated;
                    totalPublished += result.articlesPublished;
                    totalFailed += result.errors.length;
                    totalQualityScore += result.performanceScore * result.articlesGenerated;
                    
                    batches.push({
                        batchNumber,
                        articlesGenerated: result.articlesGenerated,
                        articlesPublished: result.articlesPublished,
                        errors: result.errors,
                        executionTime: batchExecutionTime
                    });
                    
                    logger.info(`BulkGenerationAgent: Batch ${batchNumber} complete`, {
                        generated: result.articlesGenerated,
                        published: result.articlesPublished,
                        errors: result.errors.length
                    });
                    
                    // Delay between batches (except last batch)
                    if (batchIndex < totalBatches - 1 && delayBetweenBatches > 0) {
                        logger.info(`BulkGenerationAgent: Waiting ${delayBetweenBatches}ms before next batch...`);
                        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                    }
                    
                } catch (error: any) {
                    logger.error(`BulkGenerationAgent: Batch ${batchNumber} failed`, error);
                    
                    batches.push({
                        batchNumber,
                        articlesGenerated: 0,
                        articlesPublished: 0,
                        errors: [error.message],
                        executionTime: Date.now() - batchStartTime
                    });
                    
                    totalFailed += currentBatchSize;
                }
            }
            
            const totalExecutionTime = Date.now() - startTime;
            const averageQualityScore = totalGenerated > 0 
                ? totalQualityScore / totalGenerated 
                : 0;
            
            const result: BulkGenerationResult = {
                success: totalFailed < totalArticles * 0.5, // Success if < 50% failed
                totalRequested: totalArticles,
                totalGenerated,
                totalPublished,
                totalFailed,
                batches,
                averageQualityScore,
                totalExecutionTime
            };
            
            logger.info('BulkGenerationAgent: Bulk generation complete', {
                totalGenerated,
                totalPublished,
                totalFailed,
                averageQualityScore: averageQualityScore.toFixed(1)
            });
            
            return result;
            
        } catch (error) {
            logger.error('BulkGenerationAgent: Bulk generation failed', error as Error);
            throw error;
        }
    }
    
    /**
     * Generate articles in parallel batches
     */
    async generateBulkParallel(config: BulkGenerationConfig): Promise<BulkGenerationResult> {
        const startTime = Date.now();
        
        try {
            logger.info('BulkGenerationAgent: Starting parallel bulk generation', config);
            
            const {
                totalArticles,
                batchSize = 5,
                parallelBatches = 2,
                qualityThreshold = 80,
                delayBetweenBatches = 5000
            } = config;
            
            const totalBatches = Math.ceil(totalArticles / batchSize);
            const batches: BulkGenerationResult['batches'] = [];
            let totalGenerated = 0;
            let totalPublished = 0;
            let totalFailed = 0;
            let totalQualityScore = 0;
            
            // Process batches in parallel groups
            for (let groupIndex = 0; groupIndex < totalBatches; groupIndex += parallelBatches) {
                const batchGroup = [];
                
                // Create batch promises for this group
                for (let i = 0; i < parallelBatches && (groupIndex + i) < totalBatches; i++) {
                    const batchIndex = groupIndex + i;
                    const batchNumber = batchIndex + 1;
                    const remainingArticles = totalArticles - totalGenerated;
                    const currentBatchSize = Math.min(batchSize, remainingArticles);
                    
                    const context: OrchestrationContext = {
                        mode: 'fully-automated',
                        goals: {
                            volume: currentBatchSize,
                            quality: qualityThreshold,
                            revenue: 0,
                            seo: true
                        }
                    };
                    
                    batchGroup.push(
                        (async () => {
                            const orchestrator = await getOrchestrator();
                            return orchestrator.executeCycle(context);
                        })()
                            .then(result => ({
                                batchNumber,
                                result,
                                success: true
                            }))
                            .catch(error => ({
                                batchNumber,
                                result: null,
                                success: false,
                                error: error.message
                            }))
                    );
                }
                
                // Wait for all batches in this group to complete
                const batchResults = await Promise.all(batchGroup);
                
                // Process results
                for (const batchResult of batchResults) {
                    const batchStartTime = Date.now();
                    
                    if (batchResult.success && batchResult.result) {
                        const result = batchResult.result;
                        
                        totalGenerated += result.articlesGenerated;
                        totalPublished += result.articlesPublished;
                        totalFailed += result.errors.length;
                        totalQualityScore += result.performanceScore * result.articlesGenerated;
                        
                        batches.push({
                            batchNumber: batchResult.batchNumber,
                            articlesGenerated: result.articlesGenerated,
                            articlesPublished: result.articlesPublished,
                            errors: result.errors,
                            executionTime: Date.now() - batchStartTime
                        });
                    } else {
                        batches.push({
                            batchNumber: batchResult.batchNumber,
                            articlesGenerated: 0,
                            articlesPublished: 0,
                            errors: [batchResult.error || 'Unknown error'],
                            executionTime: Date.now() - batchStartTime
                        });
                        totalFailed += batchSize;
                    }
                }
                
                // Delay between groups
                if (groupIndex + parallelBatches < totalBatches && delayBetweenBatches > 0) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }
            }
            
            const totalExecutionTime = Date.now() - startTime;
            const averageQualityScore = totalGenerated > 0 
                ? totalQualityScore / totalGenerated 
                : 0;
            
            return {
                success: totalFailed < totalArticles * 0.5,
                totalRequested: totalArticles,
                totalGenerated,
                totalPublished,
                totalFailed,
                batches,
                averageQualityScore,
                totalExecutionTime
            };
            
        } catch (error) {
            logger.error('BulkGenerationAgent: Parallel bulk generation failed', error as Error);
            throw error;
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const config: BulkGenerationConfig = {
                totalArticles: context.totalArticles || 10,
                batchSize: context.batchSize || 5,
                parallelBatches: context.parallelBatches || 2,
                qualityThreshold: context.qualityThreshold || 80,
                categories: context.categories,
                delayBetweenBatches: context.delayBetweenBatches || 5000
            };
            
            const useParallel = context.parallel !== false;
            const result = useParallel
                ? await this.generateBulkParallel(config)
                : await this.generateBulk(config);
            
            return {
                success: result.success,
                data: result,
                executionTime: Date.now() - startTime,
                metadata: {
                    totalGenerated: result.totalGenerated,
                    totalPublished: result.totalPublished,
                    averageQuality: result.averageQualityScore
                }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
