import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/products/analytics
 * Returns analytics data for all products including clicks, revenue, and affiliate status
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Fetch all products from all category tables
        const [loans, insurance, creditCards, mutualFunds] = await Promise.all([
            supabase.from('loans').select('*'),
            supabase.from('insurance').select('*'),
            supabase.from('credit_cards').select('*'),
            supabase.from('mutual_funds').select('*')
        ]);

        // Transform and combine data
        const products = [
            ...(loans.data || []).map((p: any) => transformProduct(p, 'loan')),
            ...(insurance.data || []).map((p: any) => transformProduct(p, 'insurance')),
            ...(creditCards.data || []).map((p: any) => transformProduct(p, 'credit-card')),
            ...(mutualFunds.data || []).map((p: any) => transformProduct(p, 'mutual-fund'))
        ];

        return NextResponse.json(products);
    } catch (error: any) {
        logger.error('Error fetching product analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product analytics' },
            { status: 500 }
        );
    }
}

function transformProduct(product: any, category: string) {
    // Extract affiliate link
    const hasAffiliateLink = !!(product.affiliate_link || product.apply_link);
    
    // Mock analytics data (in production, fetch from analytics_events table)
    const views = Math.floor(Math.random() * 5000) + 100;
    const clicks = Math.floor(Math.random() * 500) + 10;
    const affiliateIncome = hasAffiliateLink ? Math.floor(Math.random() * 5000) + 100 : 0;

    return {
        id: product.id,
        name: product.name,
        category: category,
        provider: product.provider_name || product.provider || product.bank || product.fund_house || 'Unknown',
        clicks: clicks,
        views: views,
        hasAffiliateLink: hasAffiliateLink,
        affiliateIncome: affiliateIncome,
        conversionRate: views > 0 ? (clicks / views) * 100 : 0,
        lastUpdated: product.updated_at || product.created_at || new Date().toISOString()
    };
}
