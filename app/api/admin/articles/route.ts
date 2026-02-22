import { NextRequest, NextResponse } from 'next/server';
import { ArticleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
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

    const articleServiceInstance = ArticleService.create(supabase);

    const result = await articleServiceInstance.createArticle(
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

/**
 * GET /api/admin/articles
 * List articles with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = (searchParams.get('status') as any) || undefined;
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('query') || undefined;
    const slugParam = searchParams.get('slug') || undefined;
    const order = searchParams.get('order') || undefined;

    let sortField = 'created_at';
    let sortOrder: 'asc' | 'desc' = 'desc';

    if (order) {
        if (order.startsWith('-')) {
            sortField = order.slice(1);
            sortOrder = 'desc';
        } else {
            sortField = order;
            sortOrder = 'asc';
        }
    }

    // Use service-role client for admin reads (bypasses RLS)
    const { createServiceClient } = await import('@/lib/supabase/service');
    const adminClient = createServiceClient();

    // Direct slug lookup (used by preview mode)
    if (slugParam) {
        const { data, error } = await adminClient
            .from('articles')
            .select('*')
            .eq('slug', slugParam)
            .single();
        
        if (error || !data) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ articles: [data], pagination: { page: 1, limit: 1, total: 1, totalPages: 1 } });
    }

    const articleServiceInstance = ArticleService.create(adminClient);
    const result = await articleServiceInstance.getArticles({
        page,
        limit,
        status,
        includeDeleted,
        search: query,
        sortField,
        sortOrder
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error listing articles', error as Error);
    return NextResponse.json(
      { error: 'Failed to list articles' },
      { status: 500 }
    );
  }
}

