/**
 * GET /api/admin/articles/[id]/versions/[version]
 * Get specific version content
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
