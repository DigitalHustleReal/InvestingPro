/**
 * Analytics Event Tracker
 * 
 * Tracks user events for funnel analysis and revenue attribution.
 * Events: page_view → click → outbound → conversion
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export type EventType = 'page_view' | 'click' | 'outbound' | 'conversion';

export interface AnalyticsEvent {
  type: EventType;
  articleId?: string;
  productId?: string;
  userId?: string;
  sessionId?: string;
  referrer?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface FunnelStats {
  totalViews: number;
  totalClicks: number;
  totalOutbound: number;
  totalConversions: number;
  clickRate: number;
  outboundRate: number;
  conversionRate: number;
}

export interface TopArticle {
  articleId: string;
  articleTitle: string;
  pageViews: number;
  clicks: number;
  outboundClicks: number;
  engagementScore: number;
}

class AnalyticsEventTracker {
  private supabase = createClient();
  private sessionId: string | null = null;

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    if (this.sessionId) return this.sessionId;
    
    // Try to get from sessionStorage
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      // Generate new session ID
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    this.sessionId = sessionId;
    return sessionId;
  }

  /**
   * Track an event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert({
          event_type: event.type,
          article_id: event.articleId,
          product_id: event.productId,
          user_id: event.userId,
          session_id: event.sessionId || this.getSessionId(),
          referrer: event.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
          user_agent: event.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
          metadata: event.metadata || {},
        });

      if (error) {
        logger.warn('Failed to track analytics event', { event, error: error.message });
      }
    } catch (error) {
      // Fail silently - analytics should never break the app
      logger.warn('Analytics tracking error', { event, error: (error as Error).message });
    }
  }

  /**
   * Track page view
   */
  async trackPageView(articleId?: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      type: 'page_view',
      articleId,
      metadata,
    });
  }

  /**
   * Track click (internal link, button, etc.)
   */
  async trackClick(target: string, articleId?: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      type: 'click',
      articleId,
      metadata: { target, ...metadata },
    });
  }

  /**
   * Track outbound click (affiliate link, external link)
   */
  async trackOutbound(
    url: string,
    articleId?: string,
    productId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent({
      type: 'outbound',
      articleId,
      productId,
      metadata: { url, ...metadata },
    });
  }

  /**
   * Track conversion (form submission, signup, etc.)
   */
  async trackConversion(
    conversionType: string,
    value?: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent({
      type: 'conversion',
      metadata: { conversionType, value, ...metadata },
    });
  }

  /**
   * Get funnel conversion rates
   */
  async getFunnelStats(startDate: Date, endDate: Date): Promise<FunnelStats | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_funnel_conversion_rate', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

      if (error) throw error;
      if (!data || data.length === 0) return null;

      const stats = data[0];
      return {
        totalViews: parseInt(stats.total_views),
        totalClicks: parseInt(stats.total_clicks),
        totalOutbound: parseInt(stats.total_outbound),
        totalConversions: parseInt(stats.total_conversions),
        clickRate: parseFloat(stats.click_rate),
        outboundRate: parseFloat(stats.outbound_rate),
        conversionRate: parseFloat(stats.conversion_rate),
      };
    } catch (error) {
      logger.error('Failed to get funnel stats', error as Error);
      return null;
    }
  }

  /**
   * Get top performing articles
   */
  async getTopArticles(limit: number = 10, daysBack: number = 30): Promise<TopArticle[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_top_articles_by_engagement', {
        limit_count: limit,
        days_back: daysBack,
      });

      if (error) throw error;
      if (!data) return [];

      return data.map((article: any) => ({
        articleId: article.article_id,
        articleTitle: article.article_title,
        pageViews: parseInt(article.page_views),
        clicks: parseInt(article.clicks),
        outboundClicks: parseInt(article.outbound_clicks),
        engagementScore: parseFloat(article.engagement_score),
      }));
    } catch (error) {
      logger.error('Failed to get top articles', error as Error);
      return [];
    }
  }
}

// Export singleton instance
export const analyticsTracker = new AnalyticsEventTracker();

// Convenience functions
export const trackPageView = (articleId?: string, metadata?: Record<string, any>) =>
  analyticsTracker.trackPageView(articleId, metadata);

export const trackClick = (target: string, articleId?: string, metadata?: Record<string, any>) =>
  analyticsTracker.trackClick(target, articleId, metadata);

export const trackOutbound = (
  url: string,
  articleId?: string,
  productId?: string,
  metadata?: Record<string, any>
) => analyticsTracker.trackOutbound(url, articleId, productId, metadata);

export const trackConversion = (
  conversionType: string,
  value?: number,
  metadata?: Record<string, any>
) => analyticsTracker.trackConversion(conversionType, value, metadata);
