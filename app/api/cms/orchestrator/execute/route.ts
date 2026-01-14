import { NextRequest, NextResponse } from 'next/server';
import { cmsOrchestrator, OrchestrationContext } from '@/lib/agents/orchestrator';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { orchestratorExecuteSchema } from '@/lib/validation/schemas';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * CMS Orchestrator API
 * 
 * Executes complete content generation cycles
 */

export const POST = createAPIWrapper('/api/cms/orchestrator/execute', {
    rateLimitType: 'ai', // AI generation - strict rate limit
    trackMetrics: true,
})(
    withValidation(orchestratorExecuteSchema, undefined)(
        async (request: NextRequest, body: any, _query?: unknown) => {
    try {
        const context: OrchestrationContext = {
            mode: body.mode || 'fully-automated',
            goals: body.goals || {
                volume: 10,
                quality: 80,
                revenue: 0,
                seo: true
            },
            constraints: body.constraints
        };
        
        // Create cycle record
        const { data: cycle } = await supabase
            .from('content_generation_cycles')
            .insert({
                cycle_type: context.mode,
                target_articles: context.goals?.volume,
                target_quality: context.goals?.quality,
                target_revenue: context.goals?.revenue,
                status: 'running'
            })
            .select()
            .single();
        
        const cycleId = cycle?.id;
        
        // Execute cycle
        logger.info('Executing CMS cycle...', { cycleId, context });
        
        const result = await cmsOrchestrator.executeCycle(context);
        
        // Update cycle record
        if (cycleId) {
            await supabase
                .from('content_generation_cycles')
                .update({
                    status: result.success ? 'completed' : 'failed',
                    articles_generated: result.articlesGenerated,
                    articles_published: result.articlesPublished,
                    average_performance_score: result.performanceScore,
                    errors: result.errors,
                    completed_at: new Date().toISOString()
                })
                .eq('id', cycleId);
        }
        
        return NextResponse.json({
            success: true,
            cycleId,
            result
        });
        
    } catch (error: any) {
        logger.error('Orchestrator API error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle the error response
    }
    }
)
);

/**
 * Get cycle status
 */
export const GET = createAPIWrapper('/api/cms/orchestrator/execute', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
})(
    async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const cycleId = searchParams.get('cycleId');
        
        if (cycleId) {
            const { data: cycle } = await supabase
                .from('content_generation_cycles')
                .select('*')
                .eq('id', cycleId)
                .single();
            
            return NextResponse.json({ success: true, cycle });
        }
        
        // Get recent cycles
        const { data: cycles } = await supabase
            .from('content_generation_cycles')
            .select('*')
            .order('started_at', { ascending: false })
            .limit(10);
        
        return NextResponse.json({ success: true, cycles });
        
    } catch (error: any) {
        logger.error('Orchestrator GET error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
    }
);
