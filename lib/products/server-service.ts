
import { createClient } from '@/lib/supabase/client';
import { Product, ProductCategory } from './product-service';

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
        
    if (error || !data) return null;
    return normalizeProduct(data);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('trust_score', { ascending: false });
        
    if (error) return [];
    return (data || []).map(normalizeProduct);
}

function normalizeProduct(data: any): Product {
    return {
        ...data,
        category: data.category || 'credit_card',
        rating: {
            overall: Number(data.rating) || 0,
            trust_score: Number(data.trust_score) || 0,
        },
        features: data.features || {},
        key_features: data.key_features || [],
        pros: data.pros || [],
        cons: data.cons || [],
        trust_score: data.trust_score || 0,
        is_active: data.is_active ?? true,
        is_verified: data.verification_status === 'verified',
        verification_status: data.verification_status || 'pending',
        provider_name: data.provider_name || 'InvestingPro Partner'
    };
}
