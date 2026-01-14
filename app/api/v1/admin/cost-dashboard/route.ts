/**
 * Cost Dashboard API
 * 
 * GET /api/v1/admin/cost-dashboard
 * 
 * Returns comprehensive cost data for admin dashboard
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

        const startDate = searchParams.get('start_date') || null;
        const endDate = searchParams.get('end_date') || null;

        try {
            // Get daily budget status
            const today = new Date().toISOString().split('T')[0];
            const { data: dailyBudget } = await supabase
                .from('daily_budgets')
                .select('*')
                .eq('budget_date', today)
                .single();

            // Get monthly budget status
            const monthStart = new Date();
            monthStart.setDate(1);
            const monthStartStr = monthStart.toISOString().split('T')[0];
            const { data: monthlyBudget } = await supabase
                .from('monthly_budgets')
                .select('*')
                .eq('budget_month', monthStartStr)
                .single();

            // Get cost breakdown by provider
            const { data: providerBreakdown } = await supabase.rpc('get_cost_breakdown_by_provider', {
                p_start_date: startDate,
                p_end_date: endDate,
            });

            // Get cost breakdown by operation
            const { data: operationBreakdown } = await supabase.rpc('get_cost_breakdown_by_operation', {
                p_start_date: startDate,
                p_end_date: endDate,
            });

            // Get projected monthly cost
            const { data: projection } = await supabase.rpc('get_projected_monthly_cost');

            // Get recent cost alerts
            const { data: recentAlerts } = await supabase
                .from('cost_alerts')
                .select('*')
                .order('sent_at', { ascending: false })
                .limit(10);

            // Get daily cost trend (last 30 days)
            const { data: dailyTrend } = await supabase
                .from('content_costs')
                .select('generation_date, total_cost')
                .gte('generation_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                .order('generation_date', { ascending: true });

            return NextResponse.json({
                success: true,
                data: {
                    dailyBudget: dailyBudget || null,
                    monthlyBudget: monthlyBudget || null,
                    providerBreakdown: providerBreakdown || [],
                    operationBreakdown: operationBreakdown || [],
                    projection: projection?.[0] || null,
                    recentAlerts: recentAlerts || [],
                    dailyTrend: dailyTrend || [],
                },
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'FETCH_FAILED',
                        message: error instanceof Error ? error.message : 'Failed to fetch cost data',
                    },
                },
                { status: 500 }
            );
        }
    }, 'cost-dashboard')
);
