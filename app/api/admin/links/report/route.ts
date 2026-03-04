/**
 * Link Health Report API
 * 
 * GET /api/admin/links/report - Get link health report for all articles
 * POST /api/admin/links/repair - Batch repair broken links
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { checkAllArticlesLinks, batchRepairBrokenLinks } from '@/lib/automation/link-checker';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/links/report
 * Get link health report
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Admin role verification
        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (adminRole?.role !== 'admin') {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '100');
        const articleIds = searchParams.get('articleIds')?.split(',');

        const report = await checkAllArticlesLinks({
            limit,
            articleIds
        });

        return NextResponse.json({
            success: true,
            ...report,
            healthScore: report.totalLinks > 0
                ? ((report.totalLinks - report.brokenLinks) / report.totalLinks) * 100
                : 100
        });
    } catch (error) {
        logger.error('Error generating link health report', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/links/repair
 * Batch repair broken links
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Admin role verification
        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (adminRole?.role !== 'admin') {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }
        }

        const body = await request.json();
        const { articleIds } = body;

        const result = await batchRepairBrokenLinks(articleIds);

        return NextResponse.json({
            success: true,
            ...result,
            message: `Repaired ${result.totalRepaired} link(s) across ${result.articlesRepaired} article(s)`
        });
    } catch (error) {
        logger.error('Error batch repairing links', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
