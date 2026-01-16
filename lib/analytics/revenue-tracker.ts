/**
 * Revenue Tracker
 * Tracks revenue by articles, products, categories, and time periods
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface RevenueMetrics {
    totalRevenue: number;
    revenueByCategory: Record<string, number>;
    revenueByArticle: Array<{
        articleId: string;
        articleTitle: string;
        revenue: number;
        conversions: number;
    }>;
    revenueByProduct: Array<{
        productId: string;
        productName: string;
        revenue: number;
        conversions: number;
    }>;
    period: {
        startDate: string;
        endDate: string;
    };
}

/**
 * Get revenue metrics for a date range
 */
export async function getRevenueMetrics(
    startDate: string,
    endDate: string
): Promise<RevenueMetrics> {
    try {
        // Get all conversions in date range
        const { data: conversions } = await supabase
            .from('affiliate_clicks')
            .select('article_id, product_id, product_type, commission_earned')
            .eq('converted', true)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        // Calculate total revenue
        const totalRevenue = conversions?.reduce(
            (sum, conv) => sum + (Number(conv.commission_earned) || 0),
            0
        ) || 0;

        // Calculate revenue by category
        const revenueByCategory: Record<string, number> = {
            'credit-cards': 0,
            'mutual-funds': 0,
            'insurance': 0,
            'others': 0
        };

        conversions?.forEach(conv => {
            const revenue = Number(conv.commission_earned) || 0;
            const productType = conv.product_type?.toLowerCase() || '';

            if (productType.includes('credit_card') || productType.includes('creditcard')) {
                revenueByCategory['credit-cards'] += revenue;
            } else if (productType.includes('mutual_fund') || productType.includes('mutualfund') || productType.includes('stock_broker')) {
                revenueByCategory['mutual-funds'] += revenue;
            } else if (productType.includes('insurance')) {
                revenueByCategory['insurance'] += revenue;
            } else {
                revenueByCategory['others'] += revenue;
            }
        });

        // Calculate revenue by article
        const articleRevenueMap = new Map<string, { revenue: number; conversions: number }>();

        conversions?.forEach(conv => {
            if (conv.article_id) {
                const articleId = conv.article_id;
                const revenue = Number(conv.commission_earned) || 0;

                if (!articleRevenueMap.has(articleId)) {
                    articleRevenueMap.set(articleId, { revenue: 0, conversions: 0 });
                }

                const current = articleRevenueMap.get(articleId)!;
                current.revenue += revenue;
                current.conversions += 1;
            }
        });

        // Get article titles
        const articleIds = Array.from(articleRevenueMap.keys());
        const { data: articles } = await supabase
            .from('articles')
            .select('id, title')
            .in('id', articleIds);

        const revenueByArticle = Array.from(articleRevenueMap.entries())
            .map(([articleId, stats]) => ({
                articleId,
                articleTitle: articles?.find(a => a.id === articleId)?.title || 'Unknown Article',
                revenue: stats.revenue,
                conversions: stats.conversions
            }))
            .sort((a, b) => b.revenue - a.revenue);

        // Calculate revenue by product
        const productRevenueMap = new Map<string, { revenue: number; conversions: number }>();

        conversions?.forEach(conv => {
            if (conv.product_id) {
                const productId = conv.product_id;
                const revenue = Number(conv.commission_earned) || 0;

                if (!productRevenueMap.has(productId)) {
                    productRevenueMap.set(productId, { revenue: 0, conversions: 0 });
                }

                const current = productRevenueMap.get(productId)!;
                current.revenue += revenue;
                current.conversions += 1;
            }
        });

        // Get product names (from credit_cards or mutual_funds tables)
        const productIds = Array.from(productRevenueMap.keys());
        
        // Try credit_cards first
        const { data: creditCards } = await supabase
            .from('credit_cards')
            .select('id, name')
            .in('id', productIds);

        // Try mutual_funds
        const { data: mutualFunds } = await supabase
            .from('mutual_funds')
            .select('id, name')
            .in('id', productIds);

        const revenueByProduct = Array.from(productRevenueMap.entries())
            .map(([productId, stats]) => {
                const cc = creditCards?.find(c => c.id === productId);
                const mf = mutualFunds?.find(m => m.id === productId);
                const productName = cc?.name || mf?.name || 'Unknown Product';

                return {
                    productId,
                    productName,
                    revenue: stats.revenue,
                    conversions: stats.conversions
                };
            })
            .sort((a, b) => b.revenue - a.revenue);

        return {
            totalRevenue,
            revenueByCategory,
            revenueByArticle,
            revenueByProduct,
            period: {
                startDate,
                endDate
            }
        };

    } catch (error) {
        console.error('Error calculating revenue metrics:', error);
        throw error;
    }
}
