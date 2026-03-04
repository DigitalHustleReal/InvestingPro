import { NextRequest, NextResponse } from 'next/server';
import { ArticleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
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

    // Pass authenticated client to service
    const service = ArticleService.create(supabase);
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
 * Update article (admin only)
 * Does NOT change status - use publish endpoint for that
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

    // Validate content structure
    const articleContent: ArticleContent = {
      body_markdown: content.body_markdown || content.content || '',
      body_html: content.body_html || '',
      content: content.content || content.body_markdown || '', // Legacy
    };

    // Validate and prepare metadata
    const articleMetadata: Partial<ArticleMetadata> = metadata || {};

    // Pass authenticated client to service
    const service = ArticleService.create(supabase);
    const result = await service.saveArticle(
      id,
      articleContent,
      articleMetadata
    );

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
 * Delete article (admin only)
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

    // Use service-role client for admin delete (bypasses RLS)
    // Auth is already verified above via the cookie-based client
    const adminClient = createServiceClient();
    const service = ArticleService.create(adminClient);
    await service.deleteArticle(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const { id } = await params;
    logger.error('Error deleting article', error as Error, { articleId: id });
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && errorMessage.includes('not found') ? 404 : 500 }
    );
  }
}

/**
 * PATCH /api/admin/articles/[id]
 * Partial update for metadata (Quick Edit)
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

    // Pass authenticated client to service
    const service = ArticleService.create(supabase);
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
