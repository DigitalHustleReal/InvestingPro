/**
 * Article Link Checking API
 * 
 * GET /api/admin/articles/[id]/links/check - Check article links
 * POST /api/admin/articles/[id]/links/repair - Auto-repair broken links
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { checkArticleLinks, autoRepairArticleLinks } from '@/lib/automation/link-checker';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/articles/[id]/links/check
 * Check all links in an article
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        const brokenLinks = await checkArticleLinks(id);

        return NextResponse.json({
            success: true,
            brokenLinks,
            totalBroken: brokenLinks.length,
            internalBroken: brokenLinks.filter(l => l.link.type === 'internal').length,
            externalBroken: brokenLinks.filter(l => l.link.type === 'external').length,
            repairable: brokenLinks.filter(l => l.canRepair).length
        });
    } catch (error) {
        logger.error('Error checking article links', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/articles/[id]/links/repair
 * Auto-repair broken internal links
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        const result = await autoRepairArticleLinks(id);

        return NextResponse.json({
            success: true,
            ...result,
            message: `Repaired ${result.repaired} link(s), ${result.failed} failed`
        });
    } catch (error) {
        logger.error('Error repairing article links', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
