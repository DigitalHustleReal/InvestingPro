/**
 * Product Repository
 * Abstracts database access for products
 */
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ProductQuery {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
}

export interface ProductRepository {
    findMany(query: ProductQuery): Promise<{ data: any[]; count: number }>;
    findById(id: string): Promise<any | null>;
    findBySlug(slug: string): Promise<any | null>;
}

export class SupabaseProductRepository implements ProductRepository {
    private async getClient(): Promise<SupabaseClient> {
        return await createClient();
    }

    async findMany(query: ProductQuery): Promise<{ data: any[]; count: number }> {
        const supabase = await this.getClient();
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;

        try {
            let dbQuery = supabase
                .from('products')
                .select('*', { count: 'exact' })
                .eq('is_active', true)
                .order('trust_score', { ascending: false, nullsFirst: false })
                .order('name', { ascending: true });

            // Apply filters
            if (query.category && query.category !== 'all') {
                dbQuery = dbQuery.eq('category', query.category);
            }

            if (query.search) {
                dbQuery = dbQuery.or(`name.ilike.%${query.search}%,provider_name.ilike.%${query.search}%`);
            }

            if (query.featured) {
                dbQuery = dbQuery.gte('trust_score', 80);
            }

            // Apply pagination
            dbQuery = dbQuery.range(offset, offset + limit - 1);

            const { data, error, count } = await dbQuery;

            if (error) {
                logger.warn('Product repository query error, falling back to RPC', { error: error.message });

                // Fallback to RPC if direct query fails
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_products', {
                    category_filter: query.category || null,
                    result_limit: limit,
                    result_offset: offset,
                    search_term: query.search || null
                });

                if (rpcError) {
                    throw new Error(rpcError.message);
                }

                return {
                    data: (rpcData?.products || []).map((p: any) => ({
                        ...p,
                        trust_score: p.trust_score || 0,
                        data_completeness_score: p.data_completeness_score || 0
                    })),
                    count: rpcData?.total || 0
                };
            }

            // Normalize products
            const products = (data || []).map((p: any) => ({
                ...p,
                trust_score: p.trust_score || 0,
                data_completeness_score: p.data_completeness_score || 0
            }));

            return {
                data: products,
                count: count || 0
            };
        } catch (error) {
            logger.error('Product repository findMany error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async findById(id: string): Promise<any | null> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Product repository findById error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async findBySlug(slug: string): Promise<any | null> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Product repository findBySlug error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}
