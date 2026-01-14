import { NextRequest, NextResponse } from 'next/server';
import { BulkGenerationAgent, BulkGenerationConfig } from '@/lib/agents/bulk-generation-agent';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { bulkGenerateSchema } from '@/lib/validation/schemas';

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

export const POST = createAPIWrapper('/api/cms/bulk-generate', {
    rateLimitType: 'ai', // AI generation - strict rate limit
    trackMetrics: true,
})(
    withValidation(bulkGenerateSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
    try {
        // Body is already validated by middleware
        const config: BulkGenerationConfig = {
            totalArticles: body.totalArticles || 10,
            batchSize: body.batchSize || 5,
            parallelBatches: body.parallelBatches || 2,
            qualityThreshold: body.qualityThreshold || 80,
            categories: body.categories,
            delayBetweenBatches: body.delayBetweenBatches || 5000
        };
        
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
        logger.error('Bulk generation API error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
    }
)
);

/**
 * Get bulk generation status
 */
export const GET = createAPIWrapper('/api/cms/bulk-generate', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
})(async (request: NextRequest) => {
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
        logger.error('Bulk generation GET error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
});
