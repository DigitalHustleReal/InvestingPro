/**
 * Audit Log Statistics API
 * 
 * GET /api/v1/admin/audit-log/statistics
 * 
 * Returns audit log statistics and summaries
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';

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

        // Parse query parameters
        const startDate = searchParams.get('start_date') || null;
        const endDate = searchParams.get('end_date') || null;

        // Get audit statistics
        const { data, error } = await supabase.rpc('get_audit_statistics', {
            p_start_date: startDate ? new Date(startDate).toISOString() : null,
            p_end_date: endDate ? new Date(endDate).toISOString() : null,
        });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FETCH_FAILED',
                        message: error.message,
                    },
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data?.[0] || {
                total_actions: 0,
                actions_by_type: {},
                actions_by_user: {},
                actions_by_severity: {},
                recent_activity: [],
            },
        });
    }, 'audit-statistics')
);
