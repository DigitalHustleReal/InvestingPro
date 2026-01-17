import { NextRequest, NextResponse } from 'next/server';
import { articleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/articles/[id]
 * Fetch article by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article fetch attempt', { articleId: params.id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await articleService.getById(params.id);
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    logger.error('Error fetching article', error as Error, { articleId: params.id });
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article update attempt', { articleId: params.id });
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

    const result = await articleService.saveArticle(
      params.id,
      articleContent,
      articleMetadata
    );

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error updating article', error as Error, { articleId: params.id });
    
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article delete attempt', { articleId: params.id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await articleService.deleteArticle(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting article', error as Error, { articleId: params.id });
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && errorMessage.includes('not found') ? 404 : 500 }
    );
  }
}
