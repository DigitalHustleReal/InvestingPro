/**
 * Affiliate Repository
 * Abstracts database access for affiliate tracking
 */
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AffiliateClick {
    productId?: string;
    productType?: string;
    affiliateLink: string;
    userId?: string;
    sessionId?: string;
    referrer?: string;
    userAgent?: string;
    productName?: string;
    productSlug?: string;
    category?: string;
    sourcePage?: string;
    sourceComponent?: string;
}

export interface AffiliateRepository {
    trackClick(data: AffiliateClick): Promise<any>;
    getClicks(userId?: string, productId?: string): Promise<any[]>;
    getStats(userId?: string, productId?: string): Promise<any>;
}

export class SupabaseAffiliateRepository implements AffiliateRepository {
    private async getClient(): Promise<SupabaseClient> {
        return await createClient();
    }

    async trackClick(data: AffiliateClick & { productName?: string; productSlug?: string; category?: string; sourcePage?: string; sourceComponent?: string }): Promise<any> {
        const supabase = await this.getClient();

        try {
            // Use RPC function if available (matches existing route implementation)
            const { data: clickId, error: rpcError } = await supabase.rpc('record_affiliate_click', {
                p_product_name: data.productName || '',
                p_product_slug: data.productSlug || null,
                p_category: data.category || null,
                p_source_page: data.sourcePage || '',
                p_source_component: data.sourceComponent || 'unknown',
                p_session_id: data.sessionId || null,
                p_affiliate_link: data.affiliateLink || null,
            });

            if (!rpcError && clickId) {
                return { clickId, timestamp: new Date().toISOString() };
            }

            // Fallback to direct insert if RPC doesn't exist
            const { data: click, error } = await supabase
                .from('affiliate_clicks')
                .insert({
                    product_id: data.productId,
                    product_type: data.productType,
                    affiliate_link: data.affiliateLink,
                    user_id: data.userId,
                    session_id: data.sessionId,
                    referrer: data.referrer,
                    user_agent: data.userAgent,
                    clicked_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return click;
        } catch (error) {
            logger.error('Affiliate repository trackClick error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getClicks(userId?: string, productId?: string): Promise<any[]> {
        const supabase = await this.getClient();

        try {
            let query = supabase
                .from('affiliate_clicks')
                .select('*')
                .order('clicked_at', { ascending: false });

            if (userId) {
                query = query.eq('user_id', userId);
            }

            if (productId) {
                query = query.eq('product_id', productId);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            logger.error('Affiliate repository getClicks error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getStats(userId?: string, productId?: string): Promise<any> {
        const supabase = await this.getClient();

        try {
            let query = supabase
                .from('affiliate_clicks')
                .select('*', { count: 'exact', head: false });

            if (userId) {
                query = query.eq('user_id', userId);
            }

            if (productId) {
                query = query.eq('product_id', productId);
            }

            const { data, error, count } = await query;

            if (error) {
                throw error;
            }

            return {
                totalClicks: count || 0,
                clicks: data || []
            };
        } catch (error) {
            logger.error('Affiliate repository getStats error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}
