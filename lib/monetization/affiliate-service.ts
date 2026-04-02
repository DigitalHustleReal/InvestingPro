
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface AffiliatePartner {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    base_url: string;
    commission_type: 'cpc' | 'cpa' | 'revenue_share';
    commission_rate: number;
    category: string;
    is_active: boolean;
    tracking_param?: string;
    created_at: string;
}

export interface AffiliateLink {
    id: string;
    partner_id: string;
    partner?: AffiliatePartner;
    name: string;
    destination_url: string;
    short_code: string;
    campaign?: string;
    placement?: string;
    clicks: number;
    conversions: number;
    revenue: number;
    is_active: boolean;
    created_at: string;
}

export interface ClickEvent {
    link_id: string;
    article_id?: string;
    referrer?: string;
    user_agent?: string;
    ip_hash?: string;
    timestamp: string;
}

export interface AffiliateStats {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;
    topPartners: { partner: string; clicks: number; revenue: number }[];
    topLinks: { name: string; clicks: number; conversions: number }[];
    recentClicks: ClickEvent[];
}

class AffiliateService {
    private supabase = createClient();

    /**
     * Get all affiliate partners
     */
    async getPartners(): Promise<AffiliatePartner[]> {
        try {
            const { data, error } = await this.supabase
                .from('affiliate_partners')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Failed to fetch affiliate partners', error as Error);
            return [];
        }
    }

    /**
     * Get all affiliate links
     */
    async getLinks(partnerId?: string): Promise<AffiliateLink[]> {
        try {
            let query = this.supabase
                .from('affiliate_links')
                .select('*, partner:affiliate_partners(*)')
                .eq('is_active', true)
                .order('clicks', { ascending: false });

            if (partnerId) {
                query = query.eq('partner_id', partnerId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Failed to fetch affiliate links', error as Error);
            return [];
        }
    }

    /**
     * Get link by short code
     */
    async getLinkByShortCode(shortCode: string): Promise<AffiliateLink | null> {
        try {
            const { data, error } = await this.supabase
                .from('affiliate_links')
                .select('*, partner:affiliate_partners(*)')
                .eq('short_code', shortCode)
                .eq('is_active', true)
                .single();

            if (error) return null;
            return data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Record a click event
     */
    async recordClick(linkId: string, metadata?: {
        articleId?: string;
        referrer?: string;
        userAgent?: string;
    }): Promise<void> {
        try {
            // Increment click count
            await this.supabase.rpc('increment_affiliate_clicks', { link_id: linkId });

            // Log click event
            await this.supabase.from('affiliate_clicks').insert({
                link_id: linkId,
                article_id: metadata?.articleId,
                referrer: metadata?.referrer,
                user_agent: metadata?.userAgent,
                clicked_at: new Date().toISOString()
            });

        } catch (error) {
            logger.warn('Failed to record affiliate click', { linkId, error: (error as Error).message });
        }
    }

    /**
     * Create a new affiliate link
     */
    async createLink(data: {
        partnerId: string;
        name: string;
        destinationUrl: string;
        campaign?: string;
        placement?: string;
    }): Promise<AffiliateLink | null> {
        try {
            // Generate short code
            const shortCode = this.generateShortCode();

            const { data: link, error } = await this.supabase
                .from('affiliate_links')
                .insert({
                    partner_id: data.partnerId,
                    name: data.name,
                    destination_url: data.destinationUrl,
                    short_code: shortCode,
                    campaign: data.campaign,
                    placement: data.placement,
                    clicks: 0,
                    conversions: 0,
                    revenue: 0,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;
            return link;
        } catch (error) {
            logger.error('Failed to create affiliate link', error as Error);
            return null;
        }
    }

    /**
     * Get affiliate statistics
     */
    async getStats(): Promise<AffiliateStats> {
        try {
            // Get all links with their partners
            const { data: links } = await this.supabase
                .from('affiliate_links')
                .select('*, partner:affiliate_partners(name)')
                .eq('is_active', true);

            if (!links) {
                return this.getEmptyStats();
            }

            const totalClicks = links.reduce((sum: any, l: any) => sum + (l.clicks || 0), 0);
            const totalConversions = links.reduce((sum: any, l: any) => sum + (l.conversions || 0), 0);
            const totalRevenue = links.reduce((sum: any, l: any) => sum + (l.revenue || 0), 0);

            // Group by partner
            const partnerStats = new Map<string, { clicks: number; revenue: number }>();
            links.forEach((link: any) => {
                const partnerName = link.partner?.name || 'Unknown';
                const existing = partnerStats.get(partnerName) || { clicks: 0, revenue: 0 };
                partnerStats.set(partnerName, {
                    clicks: existing.clicks + (link.clicks || 0),
                    revenue: existing.revenue + (link.revenue || 0)
                });
            });

            const topPartners = Array.from(partnerStats.entries())
                .map(([partner, stats]) => ({ partner, ...stats }))
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 5);

            const topLinks = links
                .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
                .slice(0, 10)
                .map((l: any) => ({
                    name: l.name,
                    clicks: l.clicks || 0,
                    conversions: l.conversions || 0
                }));

            // Recent clicks
            const { data: recentClicks } = await this.supabase
                .from('affiliate_clicks')
                .select('*')
                .order('clicked_at', { ascending: false })
                .limit(10);

            return {
                totalClicks,
                totalConversions,
                totalRevenue,
                conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
                topPartners,
                topLinks,
                recentClicks: recentClicks || []
            };

        } catch (error) {
            logger.error('Failed to get affiliate stats', error as Error);
            return this.getEmptyStats();
        }
    }

    /**
     * Get contextual affiliate links for a category
     */
    async getContextualLinks(category: string, limit: number = 3): Promise<AffiliateLink[]> {
        try {
            const { data, error } = await this.supabase
                .from('affiliate_links')
                .select('*, partner:affiliate_partners!inner(*)')
                .eq('is_active', true)
                .eq('partner.category', category)
                .order('clicks', { ascending: false })
                .limit(limit);

            if (error) return [];
            return data || [];
        } catch (error) {
            return [];
        }
    }

    private generateShortCode(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    private getEmptyStats(): AffiliateStats {
        return {
            totalClicks: 0,
            totalConversions: 0,
            totalRevenue: 0,
            conversionRate: 0,
            topPartners: [],
            topLinks: [],
            recentClicks: []
        };
    }
}

export const affiliateService = new AffiliateService();
