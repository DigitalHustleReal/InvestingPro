/**
 * A/B Tests Management API
 * 
 * GET /api/v1/admin/ab-tests - List A/B tests
 * POST /api/v1/admin/ab-tests - Create new A/B test
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { createABTest, startABTest, analyzeABTestResults } from '@/lib/ai/prompt-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (request: NextRequest) => {
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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || null;

        try {
            let query = supabase
                .from('ab_tests')
                .select('*')
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return NextResponse.json({
                success: true,
                data: data || [],
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FETCH_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to fetch A/B tests',
                    },
                },
                { status: 500 }
            );
        }
    }, 'ab-tests-list')
);

export const POST = withErrorHandler(
    withTracing(async (request: NextRequest) => {
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
            const body = await request.json();
            const { prompt_slug, name, description, traffic_split, min_sample_size } = body;

            if (!prompt_slug || !name || !traffic_split) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: 'prompt_slug, name, and traffic_split are required',
                        },
                    },
                    { status: 400 }
                );
            }

            const abTest = await createABTest(prompt_slug, {
                name,
                description,
                trafficSplit: traffic_split,
                minSampleSize: min_sample_size,
            });

            if (!abTest) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'CREATE_FAILED',
                            message: 'Failed to create A/B test',
                        },
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                data: abTest,
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'CREATE_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to create A/B test',
                    },
                },
                { status: 500 }
            );
        }
    }, 'ab-tests-create')
);
