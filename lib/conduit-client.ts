/**
 * Conduit CMS Client — fetches content from Conduit's headless API
 * Used to pull articles managed in Conduit into investingpro.in
 */

const CONDUIT_API = process.env.CONDUIT_API_URL || 'https://conduit-woad.vercel.app/api';
const WORKSPACE_ID = process.env.CONDUIT_WORKSPACE_ID || '';
const API_KEY = process.env.CONDUIT_API_KEY || '';

interface ConduitArticle {
  id: number;
  title: string;
  slug: string;
  body: string;
  collection: string;
  status: string;
  keyword: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  word_count: number;
  ai_score: number;
  seo_score: number;
  featured_image: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

interface ConduitResponse {
  data: ConduitArticle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (API_KEY) h['X-API-Key'] = API_KEY;
  return h;
}

/**
 * Fetch published articles from Conduit CMS
 */
export async function getConduitArticles(options?: {
  collection?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  q?: string;
}): Promise<ConduitResponse> {
  const params = new URLSearchParams({
    workspace: WORKSPACE_ID,
    status: 'published',
    page: String(options?.page || 1),
    limit: String(options?.limit || 20),
    sort: options?.sort || 'created_at',
    order: options?.order || 'desc',
  });
  if (options?.collection) params.set('collection', options.collection);
  if (options?.q) params.set('q', options.q);

  const res = await fetch(`${CONDUIT_API}/content?${params}`, {
    headers: headers(),
    next: { revalidate: 60, tags: ['conduit-content'] },
  });

  if (!res.ok) {
    console.error(`Conduit API error: ${res.status}`);
    return { data: [], meta: { total: 0, page: 1, limit: 20, hasMore: false } };
  }

  return res.json();
}

/**
 * Fetch single article by slug from Conduit
 */
export async function getConduitArticleBySlug(slug: string): Promise<ConduitArticle | null> {
  const params = new URLSearchParams({
    workspace: WORKSPACE_ID,
    slug,
  });

  const res = await fetch(`${CONDUIT_API}/content?${params}`, {
    headers: headers(),
    next: { revalidate: 60, tags: [`conduit-article-${slug}`] },
  });

  if (!res.ok) return null;

  const json = await res.json();
  const articles = json.data || json.articles || [];
  return articles[0] || null;
}

/**
 * Fetch RSS feed from Conduit
 */
export async function getConduitRSS(collection?: string): Promise<string> {
  const params = new URLSearchParams({ workspace: WORKSPACE_ID });
  if (collection) params.set('collection', collection);

  const res = await fetch(`${CONDUIT_API}/rss?${params}`, {
    next: { revalidate: 300 },
  });

  return res.ok ? res.text() : '';
}

/**
 * Fetch sitemap entries from Conduit
 */
export async function getConduitSitemap(): Promise<string> {
  const params = new URLSearchParams({ workspace: WORKSPACE_ID });

  const res = await fetch(`${CONDUIT_API}/sitemap?${params}`, {
    next: { revalidate: 300 },
  });

  return res.ok ? res.text() : '';
}

/**
 * Map Conduit article to investingpro Article format
 */
export function mapConduitToInvestingPro(article: ConduitArticle) {
  return {
    id: `conduit-${article.id}`,
    title: article.title,
    slug: article.slug,
    excerpt: article.meta_description || article.body?.slice(0, 160),
    category: article.collection || 'articles',
    read_time: Math.ceil((article.word_count || 0) / 250),
    published_at: article.publish_date || article.created_at,
    published_date: article.publish_date || article.created_at,
    featured_image: article.featured_image || '',
    author_name: 'InvestingPro Editorial',
    body: article.body,
    meta_title: article.meta_title || article.title,
    meta_description: article.meta_description || '',
    tags: article.tags || [],
    seo_score: article.seo_score,
    ai_score: article.ai_score,
    word_count: article.word_count,
    source: 'conduit' as const,
  };
}
