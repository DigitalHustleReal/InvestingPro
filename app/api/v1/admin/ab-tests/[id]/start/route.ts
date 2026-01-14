/**
 * Start A/B Test API
 * 
 * POST /api/v1/admin/ab-tests/[id]/start
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { startABTest } from '@/lib/ai/prompt-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandler(
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
            const success = await startABTest(id);

            if (!success) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'START_FAILED',
                            message: 'Failed to start A/B test',
                        },
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'A/B test started successfully',
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'START_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to start A/B test',
                    },
                },
                { status: 500 }
            );
        }
    }, 'ab-test-start')
);
