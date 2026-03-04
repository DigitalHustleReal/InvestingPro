
import { createClient } from '@/lib/supabase/static';
import { logger } from '@/lib/logger';
import { RichProduct } from "@/types/rich-product";

/**
 * Server-Side Fetcher for Credit Cards
 * Used in Server Components (page.tsx) to provide initial data.
 */
export async function getCreditCardsServer(): Promise<RichProduct[]> {
    const supabase = createClient();
    
    // We use the same query as the client-side API
    const { data, error } = await supabase.from('credit_cards').select('*');

    if (error) {
        logger.error('SERVER FETCH ERROR: credit_cards', error);
        return [];
    }

    // Map to RichProduct (Same logic as api-client.ts)
    return (data || []).map((card: any) => ({
        id: card.id || card.slug || 'unknown',
        slug: card.slug,
        name: card.name,
        category: 'credit_card',
        provider: card.bank,
        provider_name: card.bank,
        image_url: card.image_url,
        description: card.description || '',
        rating: {
           overall: Number(card.rating) || 4.5,
           trust_score: 85,
           breakdown: {}
        },
        reviewsCount: 0,
        applyLink: card.apply_link || card.source_url || '#',
        
        // Spec Data
        bestFor: card.best_for,
        specs: {
           network: card.metadata?.network || "Visa",
           type: card.type || "Credit"
        },
        
        // Arrays
        features: card.features || {},
        key_features: card.pros ? card.pros.map((p: string) => ({ label: 'Pro', value: p })).slice(0,3) : [],
        pros: card.pros || [],
        cons: card.cons || [],
        
        is_verified: true,
        updated_at: card.updated_at,
        official_link: card.official_link,
        affiliate_link: card.apply_link
    }));
}
