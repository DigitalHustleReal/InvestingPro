/**
 * Analyze A/B Test API
 * 
 * GET /api/v1/admin/ab-tests/[id]/analyze
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { analyzeABTestResults } from '@/lib/ai/prompt-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params;
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

        try {
            const results = await analyzeABTestResults(id);

            return NextResponse.json({
                success: true,
                data: results,
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'ANALYZE_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to analyze A/B test',
                    },
                },
                { status: 500 }
            );
        }
    }, 'ab-test-analyze')
);
