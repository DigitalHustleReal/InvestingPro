import { NextRequest, NextResponse } from 'next/server';
import { BulkGenerationAgent, BulkGenerationConfig } from '@/lib/agents/bulk-generation-agent';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bulkAgent = new BulkGenerationAgent();

/**
 * Bulk Content Generation API
 * 
 * Generates multiple articles in batches
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const config: BulkGenerationConfig = {
            totalArticles: body.totalArticles || 10,
            batchSize: body.batchSize || 5,
            parallelBatches: body.parallelBatches || 2,
            qualityThreshold: body.qualityThreshold || 80,
            categories: body.categories,
            delayBetweenBatches: body.delayBetweenBatches || 5000
        };
        
        // Validate
        if (config.totalArticles <= 0 || config.totalArticles > 1000) {
            return NextResponse.json({
                success: false,
                error: 'totalArticles must be between 1 and 1000'
            }, { status: 400 });
        }
        
        // Create bulk generation record
        const { data: bulkRecord } = await supabase
            .from('content_generation_cycles')
            .insert({
                cycle_type: 'bulk-generation',
                target_articles: config.totalArticles,
                target_quality: config.qualityThreshold,
                status: 'running'
            })
            .select()
            .single();
        
        const cycleId = bulkRecord?.id;
        
        logger.info('Bulk generation started', { cycleId, config });
        
        // Execute bulk generation
        const useParallel = body.parallel !== false;
        const result = useParallel
            ? await bulkAgent.generateBulkParallel(config)
            : await bulkAgent.generateBulk(config);
        
        // Update record
        if (cycleId) {
            await supabase
                .from('content_generation_cycles')
                .update({
                    status: result.success ? 'completed' : 'failed',
                    articles_generated: result.totalGenerated,
                    articles_published: result.totalPublished,
                    average_performance_score: result.averageQualityScore,
                    errors: result.batches.flatMap(b => b.errors),
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
        logger.error('Bulk generation API error', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

/**
 * Get bulk generation status
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
                .eq('cycle_type', 'bulk-generation')
                .single();
            
            return NextResponse.json({ success: true, cycle });
        }
        
        // Get recent bulk generations
        const { data: cycles } = await supabase
            .from('content_generation_cycles')
            .select('*')
            .eq('cycle_type', 'bulk-generation')
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
