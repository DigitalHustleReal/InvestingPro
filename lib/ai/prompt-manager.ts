/**
 * Prompt Manager
 * 
 * Manages prompt versioning, A/B testing, and auto-optimization
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface PromptVersion {
    id: string;
    name: string;
    slug: string;
    version: number;
    ab_test_group?: string;
    ab_test_id?: string;
    user_prompt_template: string;
    system_prompt?: string;
    preferred_model: string;
    temperature: number;
    max_tokens: number;
    output_format: 'text' | 'json' | 'markdown';
    json_schema?: any;
    performance_score?: number;
    quality_score?: number;
    usage_count: number;
    success_count: number;
    is_active: boolean;
}

export interface ABTest {
    id: string;
    name: string;
    description?: string;
    prompt_slug: string;
    status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
    traffic_split: Record<string, number>;
    min_sample_size: number;
    winner_version?: string;
    winner_prompt_id?: string;
    statistical_significance?: number;
    test_started_at?: string;
    test_ended_at?: string;
}

export interface PromptPerformance {
    id: string;
    prompt_id: string;
    prompt_version: number;
    execution_id?: string;
    execution_type?: string;
    latency_ms?: number;
    tokens_used?: number;
    cost_usd?: number;
    success: boolean;
    error_message?: string;
    quality_score?: number;
    readability_score?: number;
    seo_score?: number;
    article_id?: string;
    views?: number;
    avg_time_on_page?: number;
    bounce_rate?: number;
    conversion_rate?: number;
    created_at: string;
}

/**
 * Get best performing prompt version for a slug
 */
export async function getBestPrompt(slug: string, category?: string): Promise<PromptVersion | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('get_best_prompt_version', {
            p_prompt_slug: slug,
            p_category: category || null,
        });
        
        if (error) {
            logger.error('Failed to get best prompt', error as Error, { slug, category });
            return null;
        }
        
        if (!data || data.length === 0) {
            return null;
        }
        
        // Get full prompt details
        const { data: promptData } = await supabase
            .from('prompts')
            .select('*')
            .eq('id', data[0].prompt_id)
            .single();
        
        return promptData as PromptVersion | null;
    } catch (error) {
        logger.error('Error getting best prompt', error as Error);
        return null;
    }
}

/**
 * Select prompt for A/B testing
 */
export async function selectPromptForABTest(
    slug: string,
    userId?: string
): Promise<PromptVersion | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('select_prompt_for_ab_test', {
            p_prompt_slug: slug,
            p_user_id: userId || null,
        });
        
        if (error) {
            logger.error('Failed to select prompt for A/B test', error as Error, { slug, userId });
            return null;
        }
        
        if (!data || data.length === 0) {
            return null;
        }
        
        return {
            id: data[0].prompt_id,
            name: '', // Will be filled if needed
            slug,
            version: data[0].version,
            ab_test_group: data[0].ab_test_group || undefined,
            user_prompt_template: data[0].user_prompt_template,
            system_prompt: data[0].system_prompt || undefined,
            preferred_model: data[0].preferred_model,
            temperature: data[0].temperature,
            max_tokens: data[0].max_tokens,
            output_format: data[0].output_format,
            json_schema: data[0].json_schema,
            usage_count: 0,
            success_count: 0,
            is_active: true,
        };
    } catch (error) {
        logger.error('Error selecting prompt for A/B test', error as Error);
        return null;
    }
}

/**
 * Record prompt performance
 */
export async function recordPromptPerformance(
    promptId: string,
    promptVersion: number,
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
): Promise<string | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('record_prompt_performance', {
            p_prompt_id: promptId,
            p_prompt_version: promptVersion,
            p_execution_id: metrics.executionId || null,
            p_execution_type: metrics.executionType || null,
            p_latency_ms: metrics.latencyMs || null,
            p_tokens_used: metrics.tokensUsed || null,
            p_cost_usd: metrics.costUSD || null,
            p_success: metrics.success !== false,
            p_error_message: metrics.errorMessage || null,
            p_quality_score: metrics.qualityScore || null,
            p_readability_score: metrics.readabilityScore || null,
            p_seo_score: metrics.seoScore || null,
            p_article_id: metrics.articleId || null,
        });
        
        if (error) {
            logger.error('Failed to record prompt performance', error as Error, { promptId, metrics });
            return null;
        }
        
        return data as string;
    } catch (error) {
        logger.error('Error recording prompt performance', error as Error);
        return null;
    }
}

/**
 * Create new prompt version
 */
export async function createPromptVersion(
    basePromptId: string,
    updates: {
        user_prompt_template?: string;
        system_prompt?: string;
        preferred_model?: string;
        temperature?: number;
        max_tokens?: number;
        ab_test_group?: string;
        ab_test_id?: string;
    }
): Promise<PromptVersion | null> {
    try {
        const supabase = await createClient();
        
        // Get base prompt
        const { data: basePrompt } = await supabase
            .from('prompts')
            .select('*')
            .eq('id', basePromptId)
            .single();
        
        if (!basePrompt) {
            throw new Error('Base prompt not found');
        }
        
        // Get next version number
        const { data: versions } = await supabase
            .from('prompts')
            .select('version')
            .eq('slug', basePrompt.slug)
            .order('version', { ascending: false })
            .limit(1);
        
        const nextVersion = versions && versions.length > 0
            ? versions[0].version + 1
            : basePrompt.version + 1;
        
        // Create new version
        const { data: newPrompt, error } = await supabase
            .from('prompts')
            .insert({
                name: basePrompt.name,
                slug: basePrompt.slug,
                category: basePrompt.category,
                description: basePrompt.description,
                version: nextVersion,
                parent_prompt_id: basePromptId,
                user_prompt_template: updates.user_prompt_template || basePrompt.user_prompt_template,
                system_prompt: updates.system_prompt !== undefined ? updates.system_prompt : basePrompt.system_prompt,
                preferred_model: updates.preferred_model || basePrompt.preferred_model,
                temperature: updates.temperature !== undefined ? updates.temperature : basePrompt.temperature,
                max_tokens: updates.max_tokens || basePrompt.max_tokens,
                output_format: basePrompt.output_format,
                json_schema: basePrompt.json_schema,
                ab_test_group: updates.ab_test_group || null,
                ab_test_id: updates.ab_test_id || null,
                is_active: true,
            })
            .select()
            .single();
        
        if (error) {
            logger.error('Failed to create prompt version', error as Error, { basePromptId, updates });
            return null;
        }
        
        return newPrompt as PromptVersion;
    } catch (error) {
        logger.error('Error creating prompt version', error as Error);
        return null;
    }
}

/**
 * Create A/B test
 */
export async function createABTest(
    promptSlug: string,
    config: {
        name: string;
        description?: string;
        trafficSplit: Record<string, number>;
        minSampleSize?: number;
    }
): Promise<ABTest | null> {
    try {
        const supabase = await createClient();
        
        // Get current best prompt as control
        const controlPrompt = await getBestPrompt(promptSlug);
        if (!controlPrompt) {
            throw new Error('Base prompt not found');
        }
        
        // Create A/B test record
        const { data: abTest, error: testError } = await supabase
            .from('ab_tests')
            .insert({
                name: config.name,
                description: config.description,
                prompt_slug: promptSlug,
                status: 'draft',
                traffic_split: config.trafficSplit,
                min_sample_size: config.minSampleSize || 100,
            })
            .select()
            .single();
        
        if (testError) {
            logger.error('Failed to create A/B test', testError as Error);
            return null;
        }
        
        // Mark control prompt
        await supabase
            .from('prompts')
            .update({
                ab_test_id: abTest.id,
                ab_test_group: Object.keys(config.trafficSplit)[0], // First group is control
                is_control: true,
            })
            .eq('id', controlPrompt.id);
        
        return abTest as ABTest;
    } catch (error) {
        logger.error('Error creating A/B test', error as Error);
        return null;
    }
}

/**
 * Start A/B test
 */
export async function startABTest(testId: string): Promise<boolean> {
    try {
        const supabase = await createClient();
        
        const { error } = await supabase
            .from('ab_tests')
            .update({
                status: 'running',
                test_started_at: new Date().toISOString(),
            })
            .eq('id', testId);
        
        if (error) {
            logger.error('Failed to start A/B test', error as Error, { testId });
            return false;
        }
        
        return true;
    } catch (error) {
        logger.error('Error starting A/B test', error as Error);
        return false;
    }
}

/**
 * Analyze A/B test results
 */
export async function analyzeABTestResults(testId: string): Promise<any[]> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('analyze_ab_test_results', {
            p_ab_test_id: testId,
        });
        
        if (error) {
            logger.error('Failed to analyze A/B test results', error as Error, { testId });
            return [];
        }
        
        return data || [];
    } catch (error) {
        logger.error('Error analyzing A/B test results', error as Error);
        return [];
    }
}

/**
 * Get prompt performance history
 */
export async function getPromptPerformanceHistory(
    promptId: string,
    days: number = 30
): Promise<PromptPerformance[]> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase
            .from('prompt_performance')
            .select('*')
            .eq('prompt_id', promptId)
            .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });
        
        if (error) {
            logger.error('Failed to get prompt performance history', error as Error, { promptId });
            return [];
        }
        
        return (data || []) as PromptPerformance[];
    } catch (error) {
        logger.error('Error getting prompt performance history', error as Error);
        return [];
    }
}

/**
 * Auto-optimize: Update prompt to use best performing version
 */
export async function autoOptimizePrompt(slug: string): Promise<boolean> {
    try {
        const supabase = await createClient();
        
        // Get best performing version
        const bestPrompt = await getBestPrompt(slug);
        if (!bestPrompt) {
            return false;
        }
        
        // Deactivate all other versions
        await supabase
            .from('prompts')
            .update({ is_active: false })
            .eq('slug', slug)
            .neq('id', bestPrompt.id);
        
        // Ensure best version is active
        await supabase
            .from('prompts')
            .update({ is_active: true })
            .eq('id', bestPrompt.id);
        
        logger.info('Auto-optimized prompt', { slug, bestVersion: bestPrompt.version });
        
        return true;
    } catch (error) {
        logger.error('Error auto-optimizing prompt', error as Error);
        return false;
    }
}
