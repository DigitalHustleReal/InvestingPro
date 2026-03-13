import { NextRequest, NextResponse } from 'next/server';
import { ArticleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/articles/[id]
 * Fetch article by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article fetch attempt', { articleId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createServiceClient();
    const service = ArticleService.create(adminClient);
    const article = await service.getById(id);
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    const { id } = await params;
    logger.error('Error fetching article', error as Error, { articleId: id });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/articles/[id]
 * Full update (content + metadata). Does NOT change status by itself.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article update attempt', { articleId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, metadata } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const articleContent: ArticleContent = {
      body_markdown: content.body_markdown || content.content || '',
      body_html: content.body_html || '',
      content: content.content || content.body_markdown || '',
    };

    const articleMetadata: Partial<ArticleMetadata> = metadata || {};

    // Use service-role client so trigger bypasses get_user_role for admin ops
    const adminClient = createServiceClient();
    const service = ArticleService.create(adminClient);
    const result = await service.saveArticle(id, articleContent, articleMetadata);

    return NextResponse.json(result);
  } catch (error) {
    const { id } = await params;
    logger.error('Error updating article', error as Error, { articleId: id });
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && errorMessage.includes('not found') ? 404 : 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * - Default (no params): soft-delete → sets deleted_at (Move to Trash)
 * - ?permanent=true: hard-delete → removes row completely
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article delete attempt', { articleId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permanent = request.nextUrl.searchParams.get('permanent') === 'true';
    // Always use service-role client so RLS is bypassed completely
    const adminClient = createServiceClient();

    if (permanent) {
      // Hard delete — permanently removes the row
      const { data, error } = await adminClient
        .from('articles')
        .delete()
        .eq('id', id)
        .select('id');

      if (error) {
        logger.error('Failed to hard delete article', error, { articleId: id });
        throw new Error(error.message || 'Failed to permanently delete article');
      }

      const deleted = data?.length ?? 0;
      logger.info(`Hard deleted article`, { articleId: id, rowsDeleted: deleted });

      if (deleted === 0) {
        // Article not found — that's OK, treat as success (idempotent)
        logger.warn('Hard delete matched 0 rows', { articleId: id });
      }
    } else {
      // Soft delete — move to Trash
      const { error } = await adminClient
        .from('articles')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
        })
        .eq('id', id);

      if (error) {
        logger.error('Failed to soft delete article', error, { articleId: id });
        throw new Error(error.message || 'Failed to move article to trash');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const { id } = await params;
    logger.error('Error deleting article', error as Error, { articleId: id });
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


/**
 * PATCH /api/admin/articles/[id]
 * Partial metadata update (Quick Edit — status, title, slug, category, keyword)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
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
    const { metadata } = body;

    if (!metadata) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 });
    }

    // Use service-role client so the get_user_role() trigger is bypassed for admin ops
    const adminClient = createServiceClient();
    const service = ArticleService.create(adminClient);
    const result = await service.quickSaveMetadata(id, metadata);

    return NextResponse.json(result);
  } catch (error) {
    const { id } = await params;
    logger.error('Error patching article metadata', error as Error, { articleId: id });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
