import { NextRequest, NextResponse } from 'next/server';
import { cmsOrchestrator, OrchestrationContext } from '@/lib/agents/orchestrator';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * CMS Orchestrator API
 * 
 * Executes complete content generation cycles
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
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
        logger.error('Orchestrator API error', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

/**
 * Get cycle status
 */
export async function GET(request: NextRequest) {
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
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
