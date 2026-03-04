/**
 * POST /api/admin/articles/[id]/versions/[version]/restore
 * Restore article to a specific version
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { restoreArticleVersion } from '@/lib/cms/version-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
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

    const result = await restoreArticleVersion(id, versionNumber);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to restore version' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Article restored to version ${versionNumber}`,
      newVersionId: result.newVersionId
    });
  } catch (error) {
    logger.error('Error restoring version', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
