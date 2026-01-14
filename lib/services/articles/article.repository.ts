/**
 * Article Repository
 * Abstracts database access for articles
 */
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cacheService, cacheKeys, cacheTags } from '@/lib/cache';
import { withPerformanceTracking } from '@/lib/performance/performance-monitor';

export interface ArticleQuery {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
}

export interface ArticleRepository {
    findMany(query: ArticleQuery): Promise<{ data: any[]; count: number }>;
    findById(id: string): Promise<any | null>;
    findBySlug(slug: string): Promise<any | null>;
}

export class SupabaseArticleRepository implements ArticleRepository {
    private async getClient(): Promise<SupabaseClient> {
        return await createClient();
    }

    async findMany(query: ArticleQuery): Promise<{ data: any[]; count: number }> {
        const supabase = await this.getClient();
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        try {
            let dbQuery = supabase
                .from('articles')
                .select('*', { count: 'exact' })
                // Order by published_at if available, otherwise created_at
                .order('published_at', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false });

            // Apply filters
            if (query.status) {
                dbQuery = dbQuery.eq('status', query.status);
            }

            if (query.category) {
                dbQuery = dbQuery.eq('category', query.category);
            }

            if (query.search) {
                dbQuery = dbQuery.or(`title.ilike.%${query.search}%,excerpt.ilike.%${query.search}%`);
            }

            // Apply pagination
            dbQuery = dbQuery.range(offset, offset + limit - 1);

            const { data, error, count } = await dbQuery;

            if (error) {
                logger.warn('Article repository query error', { 
                    error: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint
                });
                
                // If table doesn't exist or RLS blocks, return empty result instead of throwing
                if (error.code === '42P01' || error.code === 'PGRST116') {
                    // Table doesn't exist - return empty result
                    logger.warn('Articles table not found, returning empty result');
                    return {
                        data: [],
                        count: 0
                    };
                }
                
                // Try RPC fallback if available
                try {
                    const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_articles', {
                        result_limit: limit
                    });

                    if (!rpcError && rpcData) {
                        return {
                            data: rpcData || [],
                            count: (rpcData || []).length
                        };
                    }
                } catch (rpcFallbackError) {
                    logger.debug('RPC fallback failed', { error: rpcFallbackError instanceof Error ? rpcFallbackError.message : String(rpcFallbackError) });
                }
                
                // Return empty result instead of throwing to prevent 500 errors
                logger.warn('Returning empty result due to query error');
                return {
                    data: [],
                    count: 0
                };
            }

            return {
                data: data || [],
                count: count || 0
            };
        } catch (error) {
            logger.error('Article repository findMany error', error instanceof Error ? error : new Error(String(error)));
            // Return empty result instead of throwing to prevent 500 errors
            return {
                data: [],
                count: 0
            };
        }
    }

    async findById(id: string): Promise<any | null> {
        return await withPerformanceTracking(
            'article.repository.findById',
            async () => {
                const cacheKey = cacheKeys.article(id);
                
                // Try cache first
                const cached = await cacheService.get<any>(cacheKey);
                if (cached !== null) {
                    return cached;
                }

                const supabase = await this.getClient();

                try {
                    const { data, error } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) {
                        if (error.code === 'PGRST116') {
                            return null; // Not found
                        }
                        throw error;
                    }

                    // Cache the result
                    if (data) {
                        await cacheService.set(cacheKey, data, {
                            ttl: 3600, // 1 hour
                            tags: [cacheTags.articles, cacheTags.article(id)],
                        });
                    }

                    return data;
                } catch (error) {
                    logger.error('Article repository findById error', error instanceof Error ? error : new Error(String(error)));
                    throw error;
                }
            },
            { articleId: id }
        );
    }

    async findBySlug(slug: string): Promise<any | null> {
        return await withPerformanceTracking(
            'article.repository.findBySlug',
            async () => {
                const cacheKey = cacheKeys.articleBySlug(slug);
                
                // Try cache first
                const cached = await cacheService.get<any>(cacheKey);
                if (cached !== null) {
                    return cached;
                }

                const supabase = await this.getClient();

                try {
                    const { data, error } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('slug', slug)
                        .single();

                    if (error) {
                        if (error.code === 'PGRST116') {
                            return null; // Not found
                        }
                        throw error;
                    }

                    // Cache the result
                    if (data) {
                        await cacheService.set(cacheKey, data, {
                            ttl: 3600, // 1 hour
                            tags: [cacheTags.articles, cacheTags.article(data.id)],
                        });
                    }

                    return data;
                } catch (error) {
                    logger.error('Article repository findBySlug error', error instanceof Error ? error : new Error(String(error)));
                    throw error;
                }
            },
            { slug }
        );
    }
}
