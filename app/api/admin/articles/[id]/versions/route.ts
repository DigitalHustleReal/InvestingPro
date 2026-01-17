/**
 * GET /api/admin/articles/[id]/versions
 * Get version history for an article
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getArticleVersionHistory } from '@/lib/cms/version-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const versionHistory = await getArticleVersionHistory(id, limit, offset);

    if (!versionHistory) {
      return NextResponse.json({ error: 'Failed to fetch version history' }, { status: 500 });
    }

    return NextResponse.json(versionHistory);
  } catch (error) {
    logger.error('Error fetching version history', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
