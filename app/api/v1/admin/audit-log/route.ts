/**
 * Audit Log API
 * 
 * GET /api/v1/admin/audit-log
 * 
 * Returns audit log entries with filtering and pagination
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
        const entityType = searchParams.get('entity_type') || null;
        const entityId = searchParams.get('entity_id') || null;
        const userId = searchParams.get('user_id') || null;
        const action = searchParams.get('action') || null;
        const severity = searchParams.get('severity') || null;
        const tags = searchParams.get('tags')?.split(',') || null;
        const startDate = searchParams.get('start_date') || null;
        const endDate = searchParams.get('end_date') || null;
        const limit = parseInt(searchParams.get('limit') || '100', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        // Get audit log entries
        const { data, error } = await supabase.rpc('get_audit_log', {
            p_entity_type: entityType,
            p_entity_id: entityId,
            p_user_id: userId,
            p_action: action,
            p_severity: severity,
            p_tags: tags,
            p_start_date: startDate ? new Date(startDate).toISOString() : null,
            p_end_date: endDate ? new Date(endDate).toISOString() : null,
            p_limit: limit,
            p_offset: offset,
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

        // Get total count for pagination
        let query = supabase.from('audit_log').select('*', { count: 'exact', head: true });
        
        if (entityType) query = query.eq('entity_type', entityType);
        if (entityId) query = query.eq('entity_id', entityId);
        if (userId) query = query.eq('user_id', userId);
        if (action) query = query.eq('action', action);
        if (severity) query = query.eq('severity', severity);
        if (startDate) query = query.gte('created_at', startDate);
        if (endDate) query = query.lte('created_at', endDate);

        const { count } = await query;

        return NextResponse.json({
            success: true,
            data: {
                entries: data || [],
                pagination: {
                    total: count || 0,
                    limit,
                    offset,
                    has_more: (count || 0) > offset + limit,
                },
            },
        });
    }, 'audit-log')
);
