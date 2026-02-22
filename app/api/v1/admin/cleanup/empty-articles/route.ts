/**
 * Admin: Empty Article Cleanup
 * POST /api/v1/admin/cleanup/empty-articles
 *
 * Scans the articles table for empty / stub records and either reports
 * them (dry_run=true, the default) or permanently deletes them (dry_run=false).
 *
 * Definition of "empty article":
 *   • content is NULL, empty string, or whitespace-only
 *   • OR content length < 300 characters (shorter than a typical intro paragraph)
 *   • AND the article is NOT in "published" status (we never auto-delete published)
 *
 * Secured: requires admin auth (withAdminAuth).
 * Audit trail: every delete is logged to console with article IDs + titles.
 *
 * Request body:
 *   { dry_run?: boolean }   — defaults to true for safety
 *
 * Response:
 *   {
 *     dry_run: boolean,
 *     found: number,
 *     deleted: number,          // always 0 when dry_run=true
 *     articles: Array<{ id, title, content_length, status, created_at }>
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware/api-auth';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/** Maximum content length (chars) that qualifies an article as "empty/stub". */
const EMPTY_THRESHOLD_CHARS = 300;

interface ArticleRow {
  id: string;
  title: string | null;
  content: string | null;
  status: string | null;
  created_at: string | null;
}

interface ArticleSummary {
  id: string;
  title: string;
  content_length: number;
  status: string;
  created_at: string;
}

async function handler(req: NextRequest): Promise<NextResponse> {
  let body: { dry_run?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // No body — use defaults
  }

  // Default to dry_run=true for safety. Caller must explicitly send `dry_run: false` to delete.
  const isDryRun = body.dry_run !== false;

  try {
    const supabase = await createClient();

    // Fetch all non-published articles so we never touch live content
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, content, status, created_at')
      .neq('status', 'published')
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('cleanup/empty-articles: failed to fetch articles', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data || []) as ArticleRow[];

    // Identify empty/stub articles
    const emptyArticles = rows.filter(a => {
      const trimmed = (a.content || '').trim();
      return trimmed.length < EMPTY_THRESHOLD_CHARS;
    });

    const summaries: ArticleSummary[] = emptyArticles.map(a => ({
      id:             a.id,
      title:          a.title || '(untitled)',
      content_length: (a.content || '').trim().length,
      status:         a.status || 'unknown',
      created_at:     a.created_at || '',
    }));

    if (isDryRun) {
      logger.info(`cleanup/empty-articles: dry run — would delete ${emptyArticles.length} articles`);
      return NextResponse.json({
        dry_run: true,
        found:   emptyArticles.length,
        deleted: 0,
        message: emptyArticles.length > 0
          ? `ℹ️ Dry run: ${emptyArticles.length} articles would be deleted. Send dry_run: false to confirm.`
          : '✅ No empty articles found.',
        articles: summaries,
      });
    }

    // ── LIVE DELETE ─────────────────────────────────────────────────────────
    if (emptyArticles.length === 0) {
      return NextResponse.json({
        dry_run: false,
        found:   0,
        deleted: 0,
        message: '✅ No empty articles to delete.',
        articles: [],
      });
    }

    const ids = emptyArticles.map(a => a.id);

    logger.warn('cleanup/empty-articles: DELETING articles', {
      count: ids.length,
      ids,
      titles: emptyArticles.map(a => a.title),
    });

    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .in('id', ids);

    if (deleteError) {
      logger.error('cleanup/empty-articles: deletion failed', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    logger.info(`cleanup/empty-articles: deleted ${ids.length} articles`, { ids });

    return NextResponse.json({
      dry_run: false,
      found:   emptyArticles.length,
      deleted: emptyArticles.length,
      message: `🗑️ Deleted ${emptyArticles.length} empty article(s).`,
      articles: summaries,
    });
  } catch (err) {
    logger.error('cleanup/empty-articles: unhandled error', err as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin-only — requires authenticated admin session
export const POST = withAdminAuth(handler);
