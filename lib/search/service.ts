
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface SearchResult {
    id: string;
    type: 'article' | 'product' | 'tool';
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
    published_at?: string;
    featured_image?: string;
    image_url?: string;
    relevance: number;
    url: string;
    provider?: string;
}

export interface SearchOptions {
    limit?: number;
    category?: string;
    tags?: string[];
    sortBy?: 'relevance' | 'date' | 'views';
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
    query: string;
    suggestions?: string[];
}

class SearchService {
    private supabase = createClient();

    /**
     * Search across articles and products
     */
    async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
        const { limit = 10, category } = options;
        
        if (!query || query.length < 2) {
            return { results: [], total: 0, query, suggestions: await this.getSuggestions() };
        }

        try {
            const queryLower = query.toLowerCase();
            const searchTerms = queryLower.split(' ').filter(t => t.length > 1);

            // 1. Search Articles
            let articleQuery = this.supabase
                .from('articles')
                .select('id, title, slug, excerpt, category, tags, published_at, featured_image, views')
                .eq('status', 'published')
                .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
                .limit(limit);

            if (category) articleQuery = articleQuery.eq('category', category);

            // 2. Search Products
            let productQuery = this.supabase
                .from('products')
                .select('id, name, slug, description, category, provider_name, image_url')
                .eq('is_active', true)
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,provider_name.ilike.%${query}%`)
                .limit(limit);

            const [articleRes, productRes] = await Promise.all([articleQuery, productQuery]);

            const results: SearchResult[] = [];

            // Process Articles
            if (articleRes.data) {
                articleRes.data.forEach((a: any) => {
                    let score = 0;
                    const title = a.title?.toLowerCase() || '';
                    if (title.includes(queryLower)) score += 100;
                    searchTerms.forEach(t => { if (title.includes(t)) score += 30; });
                    
                    results.push({
                        id: a.id,
                        type: 'article',
                        title: a.title,
                        slug: a.slug,
                        excerpt: a.excerpt,
                        category: a.category,
                        tags: a.tags || [],
                        published_at: a.published_at,
                        featured_image: a.featured_image,
                        relevance: score,
                        url: `/article/${a.slug}`
                    });
                });
            }

            // Process Products
            if (productRes.data) {
                productRes.data.forEach((p: any) => {
                    let score = 0;
                    const name = p.name?.toLowerCase() || '';
                    const provider = p.provider_name?.toLowerCase() || '';
                    if (name.includes(queryLower)) score += 120; // Boost products slightly
                    if (provider.includes(queryLower)) score += 80;
                    searchTerms.forEach(t => { if (name.includes(t)) score += 40; });

                    results.push({
                        id: p.id,
                        type: 'product',
                        title: p.name,
                        slug: p.slug,
                        excerpt: p.description || '',
                        category: p.category,
                        tags: [],
                        image_url: p.image_url,
                        provider: p.provider_name,
                        relevance: score,
                        url: (() => {
                            switch(p.category) {
                                case 'credit_card': return `/credit-cards/${p.slug}`;
                                case 'mutual_fund': return `/mutual-funds/${p.slug}`;
                                case 'loan': return `/loans/${p.slug}`;
                                case 'insurance': return `/insurance/${p.slug}`;
                                default: return `/products/${(p.category || 'general').replace(/_/g, '-')}/${p.slug}`;
                            }
                        })()
                    });
                });
            }

            // Sort and Limit
            results.sort((a, b) => b.relevance - a.relevance);
            const finalResults = results.slice(0, limit);

            return {
                results: finalResults,
                total: finalResults.length,
                query
            };

        } catch (error) {
            logger.error('Search failed', error as Error);
            return { results: [], total: 0, query };
        }
    }

    /**
     * Get related articles based on category and tags
     */
    async getRelatedArticles(articleId: string, limit: number = 4): Promise<SearchResult[]> {
        try {
            // First get the current article's category and tags
            const { data: currentArticle, error: articleError } = await this.supabase
                .from('articles')
                .select('category, tags')
                .eq('id', articleId)
                .single();

            if (articleError || !currentArticle) {
                return [];
            }

            // Find articles with same category or overlapping tags
            let query = this.supabase
                .from('articles')
                .select('id, title, slug, excerpt, category, tags, published_at, featured_image, views')
                .eq('status', 'published')
                .neq('id', articleId)
                .not('published_at', 'is', null);

            // Prioritize same category
            if (currentArticle.category) {
                query = query.eq('category', currentArticle.category);
            }

            query = query.order('views', { ascending: false }).limit(limit * 2);

            const { data: relatedArticles, error } = await query;

            if (error || !relatedArticles) {
                return [];
            }

            // Score by tag overlap
            const currentTags = new Set((currentArticle.tags || []).map((t: string) => t.toLowerCase()));
            
            const scored = relatedArticles.map((article: any) => {
                let score = 0;
                const articleTags = (article.tags || []).map((t: string) => t.toLowerCase());
                
                // Count tag overlaps
                articleTags.forEach((tag: string) => {
                    if (currentTags.has(tag)) score += 10;
                });
                
                // Boost for views
                score += Math.min(article.views || 0, 50) / 10;

                return { ...article, relevance: score };
            });

            // Sort by score and take top results
            scored.sort((a: any, b: any) => b.relevance - a.relevance);
            
            return scored.slice(0, limit).map((a: any) => ({
                id: a.id,
                title: a.title,
                slug: a.slug,
                excerpt: a.excerpt,
                category: a.category,
                tags: a.tags || [],
                published_at: a.published_at,
                featured_image: a.featured_image,
                relevance: a.relevance
            }));

        } catch (error) {
            logger.error('Failed to get related articles', error as Error);
            return [];
        }
    }

    /**
     * Get trending/popular articles
     */
    async getTrending(limit: number = 5): Promise<SearchResult[]> {
        try {
            const { data: articles, error } = await this.supabase
                .from('articles')
                .select('id, title, slug, excerpt, category, tags, published_at, featured_image, views')
                .eq('status', 'published')
                .not('published_at', 'is', null)
                .order('views', { ascending: false })
                .limit(limit);

            if (error || !articles) {
                return [];
            }

            return articles.map((a: any) => ({
                id: a.id,
                title: a.title,
                slug: a.slug,
                excerpt: a.excerpt,
                category: a.category,
                tags: a.tags || [],
                published_at: a.published_at,
                featured_image: a.featured_image,
                relevance: a.views || 0
            }));

        } catch (error) {
            logger.error('Failed to get trending articles', error as Error);
            return [];
        }
    }

    /**
     * Get search suggestions (popular searches / categories)
     */
    async getSuggestions(): Promise<string[]> {
        // Return popular categories as suggestions
        return [
            'mutual funds',
            'SIP investing',
            'tax saving',
            'stock market',
            'credit cards',
            'personal finance',
            'retirement planning'
        ];
    }

    /**
     * Highlight matching text
     */
    private highlightMatch(text: string | null, query: string): string {
        if (!text) return '';
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

export const searchService = new SearchService();
