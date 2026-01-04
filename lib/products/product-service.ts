
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export type ProductCategory = 'credit_card' | 'broker' | 'loan' | 'mutual_fund' | 'insurance';

export type Product = {
    id: string;
    slug: string;
    name: string;
    category: ProductCategory;
    provider_name: string;
    description?: string;
    image_url?: string;
    rating: number;
    features: Record<string, any>;
    pros: string[];
    cons: string[];
    affiliate_link?: string;
    official_link?: string;
    is_active: boolean;
    trust_score: number;
    verification_status: 'pending' | 'verified' | 'discrepancy' | 'outdated';
    verification_notes?: string;
    created_at?: string;
    updated_at?: string;
};

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export interface ProductListParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    includeInactive?: boolean;
}

export interface ProductListResult {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ProductService {
    async getProducts(params: ProductListParams = {}): Promise<Product[]> {
        const { category, includeInactive = false, limit } = params;
        const supabase = createClient();
        
        let query = supabase.from('products').select('*');
        
        if (!includeInactive) {
            query = query.eq('is_active', true);
        }
        
        if (category) {
            query = query.eq('category', category);
        }
        
        query = query.order('trust_score', { ascending: false, nullsFirst: false })
                     .order('name', { ascending: true });
                     
        if (limit) {
            query = query.limit(limit);
        }
        
        try {
            const { data, error } = await query;
            if (error) {
                logger.error('Failed to fetch products', error, { query: params });
                return [];
            }
            return (data || []).map((p: any) => this.normalizeProduct(p));
        } catch (e: any) {
            logger.error('Unexpected error in getProducts', e);
            return [];
        }
    }

    async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
        return this.getProducts({ limit });
    }

    async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single();
                
            if (error) {
                logger.warn(`Product not found for slug: ${slug}`, { error });
                return null;
            }
            return this.normalizeProduct(data);
        } catch (e: any) {
            logger.error(`Error in getProductBySlug for ${slug}`, e);
            return null;
        }
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
                
            if (error) {
                logger.warn(`Product not found for ID: ${id}`, { error });
                return null;
            }
            return this.normalizeProduct(data);
        } catch (e: any) {
            logger.error(`Error in getProductById for ${id}`, e);
            return null;
        }
    }

    async createProduct(input: Partial<ProductInput>): Promise<Product> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .insert({
                    ...input,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
                
            if (error) {
                logger.error('Failed to create product', error, { input });
                throw error;
            }
            return this.normalizeProduct(data);
        } catch (e: any) {
            logger.error('Unexpected error in createProduct', e);
            throw e;
        }
    }

    async updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
                
            if (error) {
                logger.error(`Failed to update product ${id}`, error, { updates });
                throw error;
            }
            return this.normalizeProduct(data);
        } catch (e: any) {
            logger.error(`Unexpected error in updateProduct for ${id}`, e);
            throw e;
        }
    }

    async deleteProduct(id: string): Promise<void> {
        try {
            const supabase = createClient();
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
                logger.error(`Failed to delete product ${id}`, error);
                throw error;
            }
        } catch (e: any) {
            logger.error(`Unexpected error in deleteProduct for ${id}`, e);
            throw e;
        }
    }

    generateSlug(name: string): string {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    private normalizeProduct(data: any): Product {
        if (!data) return data;
        return {
            ...data,
            category: data.category || 'credit_card',
            rating: Number(data.rating) || 0,
            features: data.features || {},
            pros: data.pros || [],
            cons: data.cons || [],
            trust_score: data.trust_score || 0,
            is_active: data.is_active ?? true,
            verification_status: data.verification_status || 'pending'
        };
    }
}

export const productService = new ProductService();
