/**
 * Base Agent Class
 * 
 * Foundation for all CMS agents
 * Provides common functionality: logging, error handling, database access
 */

import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';
import { multiProviderAI } from '@/lib/ai/providers/multi-provider';

export interface AgentContext {
    cycleId?: string;
    articleId?: string;
    mode?: 'fully-automated' | 'semi-automated' | 'manual';
    [key: string]: any;
}

export interface AgentResult {
    success: boolean;
    data?: any;
    error?: string;
    executionTime?: number;
    metadata?: Record<string, any>;
}

/**
 * Base Agent - All agents extend this
 */
export abstract class BaseAgent {
    protected name: string;
    private _supabase: ReturnType<typeof createServiceClient> | null = null;
    protected aiProvider = multiProviderAI;
    
    constructor(name: string) {
        this.name = name;
    }
    
    /**
     * Lazy-initialize Supabase client to avoid module-load-time issues
     */
    protected get supabase() {
        if (!this._supabase) {
            this._supabase = createServiceClient();
        }
        return this._supabase;
    }
    
    /**
     * Execute agent task
     */
    abstract execute(context: AgentContext): Promise<AgentResult>;
    
    /**
     * Log execution to database
     */
    protected async logExecution(
        executionType: string,
        input: any,
        output: any,
        executionTime: number,
        success: boolean,
        error?: string,
        context?: AgentContext
    ): Promise<void> {
        try {
            await this.supabase.from('agent_executions').insert({
                agent_name: this.name,
                execution_type: executionType,
                input_data: input,
                output_data: output,
                execution_time_ms: executionTime,
                success,
                error_message: error,
                article_id: context?.articleId,
                cycle_id: context?.cycleId
            });
        } catch (error) {
            logger.warn('Failed to log agent execution', { agent: this.name, error });
        }
    }
    
    /**
     * Generate content using AI
     * Automatically tracks costs and records to database
     */
    protected async generateWithAI(
        prompt: string,
        options: {
            priority?: 'cost' | 'speed' | 'quality';
            maxTokens?: number;
            temperature?: number;
            articleId?: string; // For cost tracking
            trackCost?: boolean; // Whether to track cost (default: true)
        } = {}
    ): Promise<string> {
        const result = await this.aiProvider.generate({
            prompt,
            priority: options.priority || 'cost', // Default to cost-first
            maxTokens: options.maxTokens || 2000,
            temperature: options.temperature || 0.7
        });
        
        // Track cost if articleId provided and tracking enabled
        if (options.trackCost !== false && options.articleId && result.cost > 0) {
            try {
                await this.supabase.rpc('record_content_cost', {
                    p_article_id: options.articleId,
                    p_tokens: result.tokensUsed,
                    p_cost: result.cost,
                    p_provider: result.provider,
                    p_model: result.model,
                    p_images: 0,
                    p_image_cost: 0
                });
            } catch (error) {
                logger.warn('Failed to record AI cost', { 
                    agent: this.name, 
                    articleId: options.articleId,
                    error 
                });
            }
        }
        
        return result.content;
    }
    
    /**
     * Handle errors consistently
     */
    protected handleError(error: any, context?: AgentContext): AgentResult {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Agent ${this.name} error`, error instanceof Error ? error : new Error(errorMessage), context);
        
        return {
            success: false,
            error: errorMessage,
            metadata: context
        };
    }
}
