/**
 * Email Analytics
 * Tracks open rates, click rates, conversion rates for emails
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface EmailMetrics {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number; // percentage
    clickRate: number; // percentage
    conversionRate: number; // percentage
}

export interface EmailCampaign {
    id: string;
    name: string;
    type: 'newsletter' | 'sequence' | 'promotional';
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    date: string;
}

/**
 * Track email open (call from webhook or pixel)
 */
export async function trackEmailOpen(
    resendId: string,
    subscriberEmail: string
): Promise<void> {
    try {
        // Update email_sequences table
        await supabase
            .from('email_sequences')
            .update({
                opened_at: new Date().toISOString()
            })
            .eq('resend_id', resendId)
            .eq('subscriber_email', subscriberEmail);

        logger.info('Email open tracked', { resendId, subscriberEmail });

    } catch (error) {
        logger.error('Error tracking email open', error);
    }
}

/**
 * Track email click (call from webhook or link tracking)
 */
export async function trackEmailClick(
    resendId: string,
    subscriberEmail: string,
    url: string
): Promise<void> {
    try {
        // Update email_sequences table
        await supabase
            .from('email_sequences')
            .update({
                clicked_at: new Date().toISOString()
            })
            .eq('resend_id', resendId)
            .eq('subscriber_email', subscriberEmail);

        logger.info('Email click tracked', { resendId, subscriberEmail, url });

    } catch (error) {
        logger.error('Error tracking email click', error);
    }
}

/**
 * Get email metrics for a date range
 */
export async function getEmailMetrics(
    startDate: string,
    endDate: string
): Promise<EmailMetrics> {
    try {
        // Get all emails sent in date range
        const { data: emails } = await supabase
            .from('email_sequences')
            .select('id, opened_at, clicked_at')
            .eq('status', 'sent')
            .gte('sent_at', startDate)
            .lte('sent_at', endDate);

        const sent = emails?.length || 0;
        const delivered = sent; // Assume all sent emails are delivered (Resend handles bounces)
        const opened = emails?.filter(e => e.opened_at).length || 0;
        const clicked = emails?.filter(e => e.clicked_at).length || 0;
        
        // Conversions: emails that led to affiliate clicks (would need to track this separately)
        const converted = 0; // Placeholder

        return {
            sent,
            delivered,
            opened,
            clicked,
            converted,
            openRate: sent > 0 ? (opened / sent) * 100 : 0,
            clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
            conversionRate: sent > 0 ? (converted / sent) * 100 : 0
        };

    } catch (error) {
        logger.error('Error getting email metrics', error);
        throw error;
    }
}

/**
 * Get email campaigns (grouped by sequence type or date)
 */
export async function getEmailCampaigns(
    startDate: string,
    endDate: string
): Promise<EmailCampaign[]> {
    try {
        // Get emails grouped by sequence type
        const { data: emails } = await supabase
            .from('email_sequences')
            .select('sequence_type, sent_at, opened_at, clicked_at')
            .eq('status', 'sent')
            .gte('sent_at', startDate)
            .lte('sent_at', endDate);

        // Group by sequence type
        const campaigns = new Map<string, EmailCampaign>();

        emails?.forEach(email => {
            const type = email.sequence_type || 'newsletter';
            const key = `${type}-${new Date(email.sent_at).toISOString().split('T')[0]}`;

            if (!campaigns.has(key)) {
                campaigns.set(key, {
                    id: key,
                    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sequence`,
                    type: type === 'newsletter' ? 'newsletter' : 'sequence',
                    sent: 0,
                    opened: 0,
                    clicked: 0,
                    converted: 0,
                    openRate: 0,
                    clickRate: 0,
                    conversionRate: 0,
                    date: new Date(email.sent_at).toISOString().split('T')[0]
                });
            }

            const campaign = campaigns.get(key)!;
            campaign.sent++;
            if (email.opened_at) campaign.opened++;
            if (email.clicked_at) campaign.clicked++;
        });

        // Calculate rates
        Array.from(campaigns.values()).forEach(campaign => {
            campaign.openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0;
            campaign.clickRate = campaign.sent > 0 ? (campaign.clicked / campaign.sent) * 100 : 0;
            campaign.conversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent) * 100 : 0;
        });

        return Array.from(campaigns.values()).sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    } catch (error) {
        logger.error('Error getting email campaigns', error);
        throw error;
    }
}

/**
 * Get subscriber segments
 */
export async function getSubscriberSegments(): Promise<Array<{
    segment: string;
    count: number;
    percentage: number;
}>> {
    try {
        // Get all subscribers
        const { data: subscribers } = await supabase
            .from('newsletter_subscribers')
            .select('status, interests');

        const total = subscribers?.length || 1;

        // Segment by status
        const active = subscribers?.filter(s => s.status === 'active').length || 0;
        const inactive = subscribers?.filter(s => s.status === 'inactive').length || 0;

        // Segment by interests (if available)
        const creditCardInterested = subscribers?.filter(s => 
            s.interests && (s.interests as string[]).includes('credit-cards')
        ).length || 0;

        const mutualFundInterested = subscribers?.filter(s => 
            s.interests && (s.interests as string[]).includes('mutual-funds')
        ).length || 0;

        return [
            {
                segment: 'active',
                count: active,
                percentage: (active / total) * 100
            },
            {
                segment: 'inactive',
                count: inactive,
                percentage: (inactive / total) * 100
            },
            {
                segment: 'credit-cards',
                count: creditCardInterested,
                percentage: (creditCardInterested / total) * 100
            },
            {
                segment: 'mutual-funds',
                count: mutualFundInterested,
                percentage: (mutualFundInterested / total) * 100
            }
        ];

    } catch (error) {
        logger.error('Error getting subscriber segments', error);
        throw error;
    }
}
