
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface SearchResult {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
    published_at: string;
    featured_image?: string;
    relevance: number;
    highlight?: {
        title?: string;
        excerpt?: string;
    };
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
     * Search articles using text matching
     */
    async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
        const { limit = 10, category, sortBy = 'relevance' } = options;
        
        if (!query || query.length < 2) {
            return { results: [], total: 0, query, suggestions: await this.getSuggestions() };
        }

        try {
            // Build the search query
            let baseQuery = this.supabase
                .from('articles')
                .select('id, title, slug, excerpt, category, tags, published_at, featured_image, views')
                .eq('status', 'published')
                .not('published_at', 'is', null);

            // Category filter
            if (category) {
                baseQuery = baseQuery.eq('category', category);
            }

            // Text search - use ilike for flexible matching
            // Search in title, excerpt, and tags
            const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 1);
            
            // For simple implementation, search title and excerpt
            baseQuery = baseQuery.or(
                `title.ilike.%${query}%,excerpt.ilike.%${query}%`
            );

            // Sort
            if (sortBy === 'date') {
                baseQuery = baseQuery.order('published_at', { ascending: false });
            } else if (sortBy === 'views') {
                baseQuery = baseQuery.order('views', { ascending: false });
            } else {
                // Relevance - prioritize title matches
                baseQuery = baseQuery.order('published_at', { ascending: false });
            }

            baseQuery = baseQuery.limit(limit);

            const { data: articles, error } = await baseQuery;

            if (error) {
                logger.error('Search query failed', error);
                return { results: [], total: 0, query };
            }

            // Calculate relevance and highlight matches
            const results: SearchResult[] = (articles || []).map(article => {
                let relevance = 0;
                const titleLower = article.title?.toLowerCase() || '';
                const excerptLower = article.excerpt?.toLowerCase() || '';
                const queryLower = query.toLowerCase();

                // Title exact match - highest relevance
                if (titleLower.includes(queryLower)) {
                    relevance += 100;
                }
                // Title word match
                searchTerms.forEach(term => {
                    if (titleLower.includes(term)) relevance += 30;
                    if (excerptLower.includes(term)) relevance += 10;
                });
                // Tag match
                if (article.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
                    relevance += 20;
                }

                return {
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    category: article.category,
                    tags: article.tags || [],
                    published_at: article.published_at,
                    featured_image: article.featured_image,
                    relevance,
                    highlight: {
                        title: this.highlightMatch(article.title, query),
                        excerpt: this.highlightMatch(article.excerpt, query)
                    }
                };
            });

            // Sort by relevance
            results.sort((a, b) => b.relevance - a.relevance);

            return {
                results,
                total: results.length,
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
            
            const scored = relatedArticles.map(article => {
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
            scored.sort((a, b) => b.relevance - a.relevance);
            
            return scored.slice(0, limit).map(a => ({
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

            return articles.map(a => ({
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
