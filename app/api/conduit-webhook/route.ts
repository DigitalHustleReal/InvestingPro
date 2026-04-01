import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';
import crypto from 'crypto';

/**
 * Webhook endpoint for Conduit CMS
 *
 * Best practice: Conduit pushes content → we write to OUR articles table → ISR revalidates
 * investingpro.in NEVER calls Conduit API at runtime. Zero dependency. Zero latency.
 *
 * Flow: Conduit publish → webhook → upsert to articles table → revalidate pages
 * Register URL in Conduit: https://investingpro.in/api/conduit-webhook
 */

// Map Conduit content fields to investingpro articles table columns
function mapConduitToArticle(content: Record<string, unknown>) {
  const body = String(content.body || '');
  const title = String(content.title || '');
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 250);

  return {
    // Use conduit slug as our slug — prevents duplicates via upsert
    slug: String(content.slug || ''),
    title,
    excerpt: String(content.meta_description || body.slice(0, 160)),
    content: body,
    category: String(content.collection || 'articles'),
    status: content.status === 'published' ? 'published' : 'draft',
    featured_image: String(content.featured_image || ''),
    meta_title: String(content.meta_title || title),
    meta_description: String(content.meta_description || ''),
    tags: Array.isArray(content.tags) ? content.tags : [],
    word_count: wordCount,
    read_time: readTime,
    published_at: content.publish_date || content.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Track source so we know this came from Conduit
    source: 'conduit',
    conduit_id: String(content.id || ''),
    seo_score: Number(content.seo_score || 0),
    ai_score: Number(content.ai_score || 0),
    author_name: 'InvestingPro Editorial',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-conduit-signature') || '';
    const secret = process.env.CONDUIT_WEBHOOK_SECRET || '';

    // Verify HMAC signature
    if (secret) {
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expected);

      if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const event = payload.event || '';
    const content = payload.content || {};
    const slug = content.slug || payload.slug || '';
    const revalidatedPaths: string[] = [];
    let syncResult = null;

    const supabase = createServiceClient();

    switch (event) {
      case 'content.published':
      case 'content.updated': {
        if (!slug) break;

        // Upsert article into investingpro's articles table
        const articleData = mapConduitToArticle(content);
        const { data, error } = await supabase
          .from('articles')
          .upsert(articleData, { onConflict: 'slug' })
          .select()
          .single();

        if (error) {
          console.error('Conduit sync error:', error.message);
          syncResult = { error: error.message };
        } else {
          syncResult = { id: data?.id, slug: data?.slug };
        }

        // Revalidate the specific article + listing pages
        revalidatePath(`/articles/${slug}`);
        revalidateTag(`conduit-article-${slug}`);
        revalidatePath('/articles');
        revalidatePath('/blog');
        revalidateTag('conduit-content');
        revalidatedPaths.push(`/articles/${slug}`, '/articles', '/blog');
        break;
      }

      case 'content.deleted':
      case 'content.unpublished': {
        if (!slug) break;

        // Set status to draft (soft delete — don't destroy content)
        const { error } = await supabase
          .from('articles')
          .update({ status: 'draft', updated_at: new Date().toISOString() })
          .eq('slug', slug)
          .eq('source', 'conduit');

        if (error) {
          console.error('Conduit delete error:', error.message);
          syncResult = { error: error.message };
        } else {
          syncResult = { deleted: slug };
        }

        revalidatePath(`/articles/${slug}`);
        revalidateTag(`conduit-article-${slug}`);
        revalidatePath('/articles');
        revalidateTag('conduit-content');
        revalidatedPaths.push(`/articles/${slug}`, '/articles');
        break;
      }

      default:
        revalidateTag('conduit-content');
        revalidatedPaths.push('conduit-content tag');
    }

    return NextResponse.json({
      revalidated: true,
      synced: true,
      event,
      slug,
      syncResult,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Conduit webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    webhook: 'conduit-cms',
    description: 'Syncs Conduit CMS content to investingpro articles table + ISR revalidation',
    timestamp: new Date().toISOString(),
  });
}
