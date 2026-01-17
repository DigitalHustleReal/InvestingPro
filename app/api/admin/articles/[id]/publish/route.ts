import { NextRequest, NextResponse } from 'next/server';
import { articleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/articles/[id]/publish
 * Publish article (admin only)
 * Sets status to 'published' and updates published_at timestamp
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article publish attempt', { articleId: params.id });
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

    const result = await articleService.publishArticle(
      params.id,
      articleContent,
      articleMetadata
    );

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error publishing article', error as Error, { articleId: params.id });
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && errorMessage.includes('not found') ? 404 : 500 }
    );
  }
}
