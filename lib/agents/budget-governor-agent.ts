/**
 * Budget Governor Agent
 * 
 * Enforces cost discipline:
 * - Daily token limits
 * - Daily image limits
 * - Daily cost limits
 * - Pauses generation when limits reached
 * - Prioritizes high-ROI content
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { logger } from '@/lib/logger';

export interface BudgetStatus {
    canGenerate: boolean;
    tokensRemaining: number;
    imagesRemaining: number;
    costRemaining: number;
    isPaused: boolean;
    reason?: string;
}

export interface BudgetConfig {
    maxTokensPerDay?: number;
    maxImagesPerDay?: number;
    maxCostPerDay?: number; // USD
}

export class BudgetGovernorAgent extends BaseAgent {
    constructor() {
        super('BudgetGovernorAgent');
    }
    
    /**
     * Check if generation is allowed within budget
     */
    async checkBudget(estimatedTokens?: number, estimatedImages?: number, estimatedCost?: number): Promise<BudgetStatus> {
        try {
            // Get today's budget status
            const { data: budgetData, error } = await this.supabase.rpc('check_daily_budget');
            
            if (error) {
                logger.warn('BudgetGovernor: Failed to check budget', error);
                // Default to allowing if check fails (fail open)
                return {
                    canGenerate: true,
                    tokensRemaining: 1000000,
                    imagesRemaining: 100,
                    costRemaining: 50,
                    isPaused: false
                };
            }
            
            const budget = budgetData?.[0] || {
                has_budget: true,
                tokens_remaining: 1000000,
                images_remaining: 100,
                cost_remaining: 50,
                is_paused: false
            };
            
            // Check if we can generate (SQL returns has_budget, not can_generate)
            let canGenerate = budget.has_budget as boolean;
            let reason: string | undefined;
            
            if (budget.is_paused as boolean) {
                canGenerate = false;
                reason = 'Daily budget paused by admin';
            } else if (estimatedTokens && estimatedTokens > (budget.tokens_remaining as number)) {
                canGenerate = false;
                reason = `Insufficient tokens. Need ${estimatedTokens}, have ${budget.tokens_remaining}`;
            } else if (estimatedImages && estimatedImages > (budget.images_remaining as number)) {
                canGenerate = false;
                reason = `Insufficient image quota. Need ${estimatedImages}, have ${budget.images_remaining}`;
            } else if (estimatedCost && estimatedCost > (budget.cost_remaining as number)) {
                canGenerate = false;
                reason = `Insufficient budget. Need $${estimatedCost}, have $${budget.cost_remaining}`;
            }
            
            return {
                canGenerate,
                tokensRemaining: budget.tokens_remaining as number,
                imagesRemaining: budget.images_remaining as number,
                costRemaining: budget.cost_remaining as number,
                isPaused: budget.is_paused as boolean,
                reason
            };
            
        } catch (error) {
            logger.error('BudgetGovernor: Budget check failed', error as Error);
            // Fail open - allow generation if check fails
            return {
                canGenerate: true,
                tokensRemaining: 1000000,
                imagesRemaining: 100,
                costRemaining: 50,
                isPaused: false
            };
        }
    }
    
    /**
     * Record cost usage
     */
    async recordCost(
        articleId: string,
        tokens: number,
        cost: number,
        provider: string,
        model: string,
        images: number = 0,
        imageCost: number = 0
    ): Promise<void> {
        try {
            await this.supabase.rpc('record_content_cost', {
                p_article_id: articleId,
                p_tokens: tokens,
                p_cost: cost,
                p_provider: provider,
                p_model: model,
                p_images: images,
                p_image_cost: imageCost
            });
            
            logger.info('BudgetGovernor: Cost recorded', {
                articleId,
                tokens,
                cost,
                provider
            });
        } catch (error) {
            logger.warn('BudgetGovernor: Failed to record cost', error as Error);
        }
    }
    
    /**
     * Set daily budget limits
     */
    async setDailyBudget(config: BudgetConfig): Promise<void> {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            await this.supabase
                .from('daily_budgets')
                .upsert({
                    budget_date: today,
                    max_tokens: config.maxTokensPerDay || 1000000,
                    max_images: config.maxImagesPerDay || 100,
                    max_cost_usd: config.maxCostPerDay || 50.00,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'budget_date' });
            
            logger.info('BudgetGovernor: Daily budget updated', config);
        } catch (error) {
            logger.error('BudgetGovernor: Failed to set budget', error as Error);
            throw error;
        }
    }
    
    /**
     * Pause/resume daily budget
     */
    async pauseBudget(pause: boolean): Promise<void> {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            await this.supabase
                .from('daily_budgets')
                .update({
                    is_paused: pause,
                    updated_at: new Date().toISOString()
                })
                .eq('budget_date', today);
            
            logger.info(`BudgetGovernor: Budget ${pause ? 'paused' : 'resumed'}`);
        } catch (error) {
            logger.error('BudgetGovernor: Failed to pause/resume budget', error as Error);
            throw error;
        }
    }
    
    /**
     * Get budget status
     */
    async getBudgetStatus(): Promise<any> {
        try {
            const { data, error } = await this.supabase
                .from('daily_budgets')
                .select('*')
                .eq('budget_date', new Date().toISOString().split('T')[0])
                .single();
            
            if (error && error.code !== 'PGRST116') { // Not found is OK
                throw error;
            }
            
            return data || {
                budget_date: new Date().toISOString().split('T')[0],
                max_tokens: 1000000,
                max_images: 100,
                max_cost_usd: 50.00,
                tokens_used: 0,
                images_used: 0,
                cost_spent_usd: 0,
                is_paused: false
            };
        } catch (error) {
            logger.error('BudgetGovernor: Failed to get budget status', error as Error);
            throw error;
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            if (context.action === 'check') {
                const status = await this.checkBudget(
                    context.estimatedTokens,
                    context.estimatedImages,
                    context.estimatedCost
                );
                return {
                    success: true,
                    data: status,
                    executionTime: Date.now() - startTime
                };
            } else if (context.action === 'record') {
                await this.recordCost(
                    context.articleId,
                    context.tokens,
                    context.cost,
                    context.provider,
                    context.model,
                    context.images,
                    context.imageCost
                );
                return {
                    success: true,
                    data: { recorded: true },
                    executionTime: Date.now() - startTime
                };
            } else if (context.action === 'set') {
                await this.setDailyBudget(context.config);
                return {
                    success: true,
                    data: { budgetSet: true },
                    executionTime: Date.now() - startTime
                };
            }
            
            return {
                success: false,
                error: 'Invalid action',
                executionTime: Date.now() - startTime
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
