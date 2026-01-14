/**
 * Prompt Performance API
 * 
 * GET /api/v1/admin/prompts/[id]/performance
 * 
 * Returns performance metrics for a prompt
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { getPromptPerformanceHistory } from '@/lib/ai/prompt-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    },
                },
                { status: 401 }
            );
        }

        // Check admin access
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'Admin access required',
                    },
                },
                { status: 403 }
            );
        }

        const days = parseInt(searchParams.get('days') || '30', 10);

        try {
            const performance = await getPromptPerformanceHistory(id, days);

            // Get prompt details
            const { data: prompt } = await supabase
                .from('prompts')
                .select('*')
                .eq('id', id)
                .single();

            return NextResponse.json({
                success: true,
                data: {
                    prompt,
                    performance,
                    summary: {
                        totalExecutions: performance.length,
                        successRate: performance.length > 0
                            ? (performance.filter(p => p.success).length / performance.length) * 100
                            : 0,
                        avgQualityScore: performance.length > 0
                            ? performance.reduce((sum, p) => sum + (p.quality_score || 0), 0) / performance.length
                            : 0,
                        avgLatencyMs: performance.length > 0
                            ? performance.reduce((sum, p) => sum + (p.latency_ms || 0), 0) / performance.length
                            : 0,
                        avgCostUSD: performance.length > 0
                            ? performance.reduce((sum, p) => sum + (p.cost_usd || 0), 0) / performance.length
                            : 0,
                    },
                },
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FETCH_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to fetch performance data',
                    },
                },
                { status: 500 }
            );
        }
    }, 'prompt-performance')
);
