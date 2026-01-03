
import { createClient } from '@/lib/supabase/client';

export type ProductCategory = 'credit_card' | 'broker' | 'loan' | 'mutual_fund' | 'insurance';

export type Product = {
    id: string;
    slug: string;
    name: string;
    category: ProductCategory;
    provider_name: string;
    description: string;
    image_url: string;
    rating: number;
    features: Record<string, any>;
    pros: string[];
    cons: string[];
    affiliate_link?: string;
    official_link?: string;
    is_active: boolean;
    last_verified_at?: string;
    verification_status?: 'pending' | 'verified' | 'discrepancy' | 'outdated';
    verification_notes?: string;
    trust_score?: number;
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
    // Fetch products with pagination (for admin - includes inactive)
    async getProducts(params: ProductListParams = {}): Promise<Product[]> {
        const { category, includeInactive = false } = params;
        const supabase = createClient();
        
        let query = supabase.from('products').select('*');
        
        if (!includeInactive) {
            query = query.eq('is_active', true);
        }
        
        if (category) {
            query = query.eq('category', category);
        }
        
        query = query.order('trust_score', { ascending: false, nullsFirst: false })
                     .order('rating', { ascending: false, nullsFirst: false });
        
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map((p: any) => this.normalizeProduct(p));
    }

    // Fetch products with full pagination (for public pages)
    async getProductsPaginated(params: ProductListParams = {}): Promise<ProductListResult> {
        const { page = 1, limit = 20, category, search } = params;
        
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(category && category !== 'all' && { category }),
                ...(search && { search })
            });
            
            const response = await fetch(`/api/products/public?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const data = await response.json();
            return {
                products: data.products || [],
                total: data.total || 0,
                page: data.page || 1,
                limit: data.limit || 20,
                totalPages: data.totalPages || 0
            };
        } catch (error) {
            console.error('ProductService.getProductsPaginated error:', error);
            return { products: [], total: 0, page: 1, limit: 20, totalPages: 0 };
        }
    }

    async getProductBySlug(slug: string): Promise<Product | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (error) return null;
        return this.normalizeProduct(data);
    }

    async getProductById(id: string): Promise<Product | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) return null;
        return this.normalizeProduct(data);
    }

    async getProductsByIds(ids: string[]): Promise<Product[]> {
        if (ids.length === 0) return [];
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('id', ids);
            
        if (error) throw error;
        return (data || []).map((p: any) => this.normalizeProduct(p));
    }

    async getProductsByCategory(category: ProductCategory, limit?: number): Promise<Product[]> {
        const supabase = createClient();
        let query = supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .order('trust_score', { ascending: false, nullsFirst: false })
            .order('rating', { ascending: false, nullsFirst: false });
        
        if (limit) {
            query = query.limit(limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map((p: any) => this.normalizeProduct(p));
    }

    async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .gte('trust_score', 80)
            .order('trust_score', { ascending: false })
            .limit(limit);
            
        if (error) throw error;
        return (data || []).map((p: any) => this.normalizeProduct(p));
    }

    // === ADMIN CRUD OPERATIONS ===

    async createProduct(input: ProductInput): Promise<Product> {
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
            
        if (error) throw error;
        return this.normalizeProduct(data);
    }

    async updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product> {
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
            
        if (error) throw error;
        return this.normalizeProduct(data);
    }

    async deleteProduct(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
    }

    async toggleProductActive(id: string, isActive: boolean): Promise<Product> {
        return this.updateProduct(id, { is_active: isActive });
    }

    async verifyProduct(id: string, status: 'verified' | 'discrepancy' | 'outdated', notes?: string): Promise<Product> {
        return this.updateProduct(id, {
            verification_status: status,
            verification_notes: notes,
            last_verified_at: new Date().toISOString()
        } as any);
    }

    // === HELPERS ===

    private normalizeProduct(data: any): Product {
        if (!data) return data;
        return {
            ...data,
            features: data.features || {},
            pros: data.pros || [],
            cons: data.cons || [],
            rating: data.rating || 4.0,
            trust_score: data.trust_score || 0,
            is_active: data.is_active ?? true
        };
    }

    generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

export const productService = new ProductService();
