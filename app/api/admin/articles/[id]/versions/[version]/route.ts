/**
 * GET /api/admin/articles/[id]/versions/[version]
 * Get specific version content
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { getArticleVersionContent } from '@/lib/cms/version-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  try {
    const { id, version } = await params;
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

    const versionNumber = parseInt(version);
    if (isNaN(versionNumber)) {
      return NextResponse.json({ error: 'Invalid version number' }, { status: 400 });
    }

    const versionContent = await getArticleVersionContent(id, versionNumber);

    if (!versionContent) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json(versionContent);
  } catch (error) {
    logger.error('Error fetching version content', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
