/**
 * Prompts Management API
 * 
 * GET /api/v1/admin/prompts - List prompts
 * POST /api/v1/admin/prompts - Create new prompt version
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { createPromptVersion, getBestPrompt } from '@/lib/ai/prompt-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(
    withTracing(async (request: NextRequest) => {
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

        const category = searchParams.get('category') || null;
        const includeInactive = searchParams.get('include_inactive') === 'true';

        try {
            let query = supabase
                .from('prompts')
                .select('*')
                .order('slug', { ascending: true })
                .order('version', { ascending: false });

            if (category) {
                query = query.eq('category', category);
            }

            if (!includeInactive) {
                query = query.eq('is_active', true);
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
                        message: error instanceof Error ? error.message : 'Failed to fetch prompts',
                    },
                },
                { status: 500 }
            );
        }
    }, 'prompts-list')
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
            const { base_prompt_id, updates } = body;

            if (!base_prompt_id) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'VALIDATION_ERROR',
                            message: 'base_prompt_id is required',
                        },
                    },
                    { status: 400 }
                );
            }

            const newVersion = await createPromptVersion(base_prompt_id, updates || {});

            if (!newVersion) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'CREATE_FAILED',
                            message: 'Failed to create prompt version',
                        },
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                data: newVersion,
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'CREATE_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to create prompt version',
                    },
                },
                { status: 500 }
            );
        }
    }, 'prompts-create')
);
