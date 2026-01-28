import { createClient } from '@/lib/supabase/static';
import { RichProduct } from "@/types/rich-product";

/**
 * Server-Side Fetcher for Loans
 * Used in Server Components (page.tsx) to provide initial data.
 */
export async function getLoansServer(): Promise<RichProduct[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase.from('loans').select('*');

    if (error) {
        console.error('SERVER FETCH ERROR: loans', error);
        return [];
    }

    // Map to RichProduct format
    return (data || []).map((loan: any) => ({
        id: loan.id || loan.slug || 'unknown',
        slug: loan.slug,
        name: loan.name,
        category: 'loan',
        provider: loan.bank_name,
        provider_name: loan.bank_name,
        image_url: loan.image_url,
        description: loan.description || '',
        rating: {
           overall: Number(loan.rating) || 4.2,
           trust_score: 90,
           breakdown: {}
        },
        bestFor: loan.best_for,
        specs: {
           type: loan.type || loan.metadata?.type || 'Personal Loan'
        },
        key_features: loan.features 
            ? Object.entries(loan.features).map(([k,v]) => ({ label: k, value: String(v) }))
            : [],
        features: loan.features || {},
        pros: loan.pros || [],
        cons: loan.cons || [],
        is_verified: true,
        updated_at: loan.updated_at || new Date().toISOString(),
        affiliate_link: loan.apply_link || loan.affiliate_link || '#',
        official_link: loan.official_link,
        metadata: {
            type: loan.type || 'Personal Loan',
            interest_rate_min: loan.interest_rate_min,
            interest_rate_max: loan.interest_rate_max,
            max_tenure_months: loan.max_tenure_months,
            max_amount: loan.max_amount,
            processing_fee: loan.processing_fee
        }
    }));
}
