/**
 * AI Cost Tracker
 * 
 * Tracks AI costs per article and operation for cost attribution and budgeting
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface AICostEntry {
    article_id?: string;
    provider: string;
    model: string;
    operation: 'generate' | 'proofread' | 'translate' | 'summarize' | 'analyze' | 'image' | 'other';
    input_tokens?: number;
    output_tokens?: number;
    cost_usd: number;
    request_id?: string;
    prompt_template_id?: string;
    duration_ms?: number;
    metadata?: Record<string, any>;
}

export interface ArticleCostBreakdown {
    provider: string;
    operation: string;
    total_tokens: number;
    total_cost_usd: number;
    total_cost_inr: number;
    request_count: number;
}

/**
 * Log AI cost for an operation
 */
export async function logAICost(entry: AICostEntry): Promise<string | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('log_ai_cost', {
            p_article_id: entry.article_id || null,
            p_provider: entry.provider,
            p_model: entry.model,
            p_operation: entry.operation,
            p_input_tokens: entry.input_tokens || 0,
            p_output_tokens: entry.output_tokens || 0,
            p_cost_usd: entry.cost_usd,
            p_request_id: entry.request_id || null,
            p_prompt_template_id: entry.prompt_template_id || null,
            p_duration_ms: entry.duration_ms || null,
            p_metadata: entry.metadata || {},
        });

        if (error) {
            logger.error('Failed to log AI cost', error as Error, { entry });
            return null;
        }

        return data as string;
    } catch (error) {
        logger.error('Error logging AI cost', error as Error, { entry });
        return null;
    }
}

/**
 * Get cost breakdown for an article
 */
export async function getArticleCostBreakdown(
    articleId: string,
    startDate?: Date,
    endDate?: Date
): Promise<ArticleCostBreakdown[] | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('get_article_cost_breakdown', {
            p_article_id: articleId,
            p_start_date: startDate?.toISOString() || null,
            p_end_date: endDate?.toISOString() || null,
        });

        if (error) {
            logger.error('Failed to get article cost breakdown', error as Error, { articleId });
            return null;
        }

        return data as ArticleCostBreakdown[];
    } catch (error) {
        logger.error('Error getting article cost breakdown', error as Error, { articleId });
        return null;
    }
}

/**
 * Get total cost for an article
 */
export async function getArticleTotalCost(articleId: string): Promise<number> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('get_article_total_cost', {
            p_article_id: articleId,
        });

        if (error) {
            logger.error('Failed to get article total cost', error as Error, { articleId });
            return 0;
        }

        return parseFloat(data || '0');
    } catch (error) {
        logger.error('Error getting article total cost', error as Error, { articleId });
        return 0;
    }
}

/**
 * Calculate cost from tokens (provider-specific pricing)
 */
export function calculateCostFromTokens(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number
): number {
    // Pricing per 1M tokens (as of 2026)
    const pricing: Record<string, Record<string, { input: number; output: number }>> = {
        openai: {
            'gpt-4': { input: 30.0, output: 60.0 },
            'gpt-4-turbo': { input: 10.0, output: 30.0 },
            'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
        },
        anthropic: {
            'claude-3-opus': { input: 15.0, output: 75.0 },
            'claude-3-sonnet': { input: 3.0, output: 15.0 },
            'claude-3-haiku': { input: 0.25, output: 1.25 },
        },
        groq: {
            'llama-3-70b': { input: 0.59, output: 0.79 },
            'mixtral-8x7b': { input: 0.24, output: 0.24 },
        },
        mistral: {
            'mistral-large': { input: 2.7, output: 8.1 },
            'mistral-medium': { input: 2.7, output: 8.1 },
            'mistral-small': { input: 1.0, output: 3.0 },
        },
        google: {
            'gemini-pro': { input: 0.5, output: 1.5 },
            'gemini-ultra': { input: 5.0, output: 15.0 },
        },
    };

    const providerPricing = pricing[provider.toLowerCase()];
    if (!providerPricing) {
        logger.warn('Unknown provider for cost calculation', { provider, model });
        return 0;
    }

    const modelPricing = providerPricing[model.toLowerCase()] || providerPricing[Object.keys(providerPricing)[0]];
    if (!modelPricing) {
        logger.warn('Unknown model for cost calculation', { provider, model });
        return 0;
    }

    // Calculate cost: (tokens / 1,000,000) * price_per_1M_tokens
    const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
    const outputCost = (outputTokens / 1_000_000) * modelPricing.output;

    return inputCost + outputCost;
}
