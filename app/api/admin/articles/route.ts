import { NextRequest, NextResponse } from 'next/server';
import { articleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/articles
 * Create new article (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article creation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, metadata } = body;

    if (!content || !metadata) {
      return NextResponse.json(
        { error: 'Content and metadata are required' },
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
    const articleMetadata: ArticleMetadata = {
      title: metadata.title || 'Untitled',
      slug: metadata.slug || '',
      excerpt: metadata.excerpt || '',
      category: metadata.category || 'investing-basics',
      ...metadata,
    };

    const result = await articleService.createArticle(
      articleContent,
      articleMetadata
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    logger.error('Error creating article', error as Error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
