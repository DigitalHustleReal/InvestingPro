import { createClient } from '@/lib/supabase/server';

export interface MutualFund {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    provider_name: string;
    features: Record<string, any>;
    specs: Record<string, any>;
    rating: number;
    trust_score: number;
    affiliate_url?: string;
    is_active: boolean;
}

/**
 * Fetch mutual funds filtered by subcategory keywords.
 * Fails open (returns all funds if no keywords match).
 */
export async function getMutualFundsBySubcategory(
    keywords: string[]
): Promise<MutualFund[]> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', 'mutual_fund')
            .eq('is_active', true)
            .order('trust_score', { ascending: false });

        if (error || !data || data.length === 0) return [];

        const lower = keywords.map(k => k.toLowerCase());
        const filtered = data.filter((fund: any) => {
            const haystack = [
                fund.name,
                fund.description,
                fund.category,
                JSON.stringify(fund.features),
                JSON.stringify(fund.specs),
                JSON.stringify(fund.tags),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return lower.some(kw => haystack.includes(kw));
        });

        const result = filtered.length > 0 ? filtered : data;
        return result.map((f: any): MutualFund => ({
            id: f.id,
            name: f.name,
            slug: f.slug,
            description: f.description || '',
            category: f.category,
            provider_name: f.provider_name || '',
            features: f.features || {},
            specs: f.specs || {},
            rating: Number(f.rating) || 0,
            trust_score: Number(f.trust_score) || 0,
            affiliate_url: f.affiliate_url,
            is_active: f.is_active ?? true,
        }));
    } catch {
        return [];
    }
}
