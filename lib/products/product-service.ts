
import { createClient } from '@/lib/supabase/client';

export type Product = {
    id: string;
    slug: string;
    name: string;
    category: 'credit_card' | 'broker' | 'loan' | 'mutual_fund';
    provider_name: string;
    description: string;
    image_url: string;
    rating: number;
    features: Record<string, any>;
    pros: string[];
    cons: string[];
    affiliate_link?: string;
    official_link?: string;
    last_verified_at?: string;
    verification_status?: 'pending' | 'verified' | 'discrepancy' | 'outdated';
    verification_notes?: string;
    trust_score?: number;
};

export class ProductService {
    async getProducts(category?: string): Promise<Product[]> {
        const supabase = createClient();
        let query = supabase.from('products').select('*').eq('is_active', true);
        
        if (category) {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }

    async getProductBySlug(slug: string): Promise<Product | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (error) return null;
        return data;
    }

    async getProductsByIds(ids: string[]): Promise<Product[]> {
        if (ids.length === 0) return [];
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('id', ids);
            
        if (error) throw error;
        return data || [];
    }
}

export const productService = new ProductService();
