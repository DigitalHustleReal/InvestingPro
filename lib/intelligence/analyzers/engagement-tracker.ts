/**
 * Engagement Tracker
 * 
 * Purpose: Track user engagement metrics to understand content performance
 * and enable self-learning quality improvements.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { publishEvent, SystemEvent } from '@/lib/infrastructure/event-bus/event-bus';

export interface EngagementMetrics {
  articleId: string;
  userId?: string;
  sessionId: string;
  
  // Time-based metrics
  timeOnPage: number; // seconds
  scrollDepth: number; // percentage (0-100)
  readingProgress: number; // percentage (0-100)
  
  // Interaction metrics
  clicks: number;
  shares: number;
  bookmarks: number;
  
  // Conversion metrics
  calculatorUsed: boolean;
  affiliateLinkClicked: boolean;
  productCompared: boolean;
  
  // Quality signals
  bounced: boolean; // Left within 10 seconds
  completed: boolean; // Scrolled to bottom
  engaged: boolean; // Time > 30s AND scroll > 50%
  
  timestamp: number;
}

export interface AggregatedMetrics {
  articleId: string;
  
  // Averages
  avgTimeOnPage: number;
  avgScrollDepth: number;
  avgReadingProgress: number;
  
  // Rates
  bounceRate: number;
  completionRate: number;
  engagementRate: number;
  conversionRate: number;
  
  // Totals
  totalViews: number;
  totalShares: number;
  totalBookmarks: number;
  
  // Quality score (0-1)
  qualityScore: number;
  
  lastUpdated: number;
}

class EngagementTracker {
  private supabase = createClient();
  private sessionMetrics: Map<string, Partial<EngagementMetrics>> = new Map();

  /**
   * Initialize tracking for a page view
   */
  initializeSession(articleId: string, sessionId: string, userId?: string): void {
    this.sessionMetrics.set(sessionId, {
      articleId,
      sessionId,
      userId,
      timeOnPage: 0,
      scrollDepth: 0,
      readingProgress: 0,
      clicks: 0,
      shares: 0,
      bookmarks: 0,
      calculatorUsed: false,
      affiliateLinkClicked: false,
      productCompared: false,
      bounced: false,
      completed: false,
      engaged: false,
      timestamp: Date.now()
    });
  }

  /**
   * Update scroll depth
   */
  updateScrollDepth(sessionId: string, scrollDepth: number): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      metrics.scrollDepth = Math.max(metrics.scrollDepth || 0, scrollDepth);
      metrics.readingProgress = scrollDepth;
    }
  }

  /**
   * Track time on page
   */
  updateTimeOnPage(sessionId: string, timeOnPage: number): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      metrics.timeOnPage = timeOnPage;
      
      // Update engagement status
      if (timeOnPage > 30 && (metrics.scrollDepth || 0) > 50) {
        metrics.engaged = true;
      }
      
      // Check if bounced
      if (timeOnPage < 10 && (metrics.scrollDepth || 0) < 25) {
        metrics.bounced = true;
      }
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(sessionId: string, type: 'click' | 'share' | 'bookmark' | 'calculator' | 'affiliate' | 'compare'): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (!metrics) return;

    switch (type) {
      case 'click':
        metrics.clicks = (metrics.clicks || 0) + 1;
        break;
      case 'share':
        metrics.shares = (metrics.shares || 0) + 1;
        break;
      case 'bookmark':
        metrics.bookmarks = (metrics.bookmarks || 0) + 1;
        break;
      case 'calculator':
        metrics.calculatorUsed = true;
        break;
      case 'affiliate':
        metrics.affiliateLinkClicked = true;
        break;
      case 'compare':
        metrics.productCompared = true;
        break;
    }
  }

  /**
   * Mark session as completed
   */
  completeSession(sessionId: string): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      metrics.completed = true;
    }
  }

  /**
   * Save session metrics to database
   */
  async saveSession(sessionId: string): Promise<void> {
    const metrics = this.sessionMetrics.get(sessionId);
    if (!metrics || !metrics.articleId) return;

    try {
      // Save to database
      await this.supabase
        .from('engagement_metrics')
        .insert({
          article_id: metrics.articleId,
          user_id: metrics.userId,
          session_id: sessionId,
          time_on_page: metrics.timeOnPage,
          scroll_depth: metrics.scrollDepth,
          reading_progress: metrics.readingProgress,
          clicks: metrics.clicks,
          shares: metrics.shares,
          bookmarks: metrics.bookmarks,
          calculator_used: metrics.calculatorUsed,
          affiliate_link_clicked: metrics.affiliateLinkClicked,
          product_compared: metrics.productCompared,
          bounced: metrics.bounced,
          completed: metrics.completed,
          engaged: metrics.engaged,
          created_at: new Date(metrics.timestamp || Date.now()).toISOString()
        });

      // Update aggregated metrics
      await this.updateAggregatedMetrics(metrics.articleId);

      // Clean up session
      this.sessionMetrics.delete(sessionId);

      logger.info(`Saved engagement metrics for session ${sessionId}`);
    } catch (error) {
      logger.error('Error saving engagement metrics', error as Error);
    }
  }

  /**
   * Update aggregated metrics for an article
   */
  private async updateAggregatedMetrics(articleId: string): Promise<void> {
    try {
      // Get all metrics for this article
      const { data: allMetrics } = await this.supabase
        .from('engagement_metrics')
        .select('*')
        .eq('article_id', articleId);

      if (!allMetrics || allMetrics.length === 0) return;

      // Calculate aggregates
      const totalViews = allMetrics.length;
      const avgTimeOnPage = allMetrics.reduce((sum, m) => sum + (m.time_on_page || 0), 0) / totalViews;
      const avgScrollDepth = allMetrics.reduce((sum, m) => sum + (m.scroll_depth || 0), 0) / totalViews;
      const avgReadingProgress = allMetrics.reduce((sum, m) => sum + (m.reading_progress || 0), 0) / totalViews;
      
      const bounceRate = allMetrics.filter(m => m.bounced).length / totalViews;
      const completionRate = allMetrics.filter(m => m.completed).length / totalViews;
      const engagementRate = allMetrics.filter(m => m.engaged).length / totalViews;
      
      const conversions = allMetrics.filter(m => 
        m.calculator_used || m.affiliate_link_clicked || m.product_compared
      ).length;
      const conversionRate = conversions / totalViews;
      
      const totalShares = allMetrics.reduce((sum, m) => sum + (m.shares || 0), 0);
      const totalBookmarks = allMetrics.reduce((sum, m) => sum + (m.bookmarks || 0), 0);

      // Calculate quality score (0-1)
      const qualityScore = this.calculateQualityScore({
        avgTimeOnPage,
        avgScrollDepth,
        bounceRate,
        completionRate,
        engagementRate,
        conversionRate
      });

      // Save aggregated metrics
      await this.supabase
        .from('article_performance')
        .upsert({
          article_id: articleId,
          avg_time_on_page: avgTimeOnPage,
          avg_scroll_depth: avgScrollDepth,
          avg_reading_progress: avgReadingProgress,
          bounce_rate: bounceRate,
          completion_rate: completionRate,
          engagement_rate: engagementRate,
          conversion_rate: conversionRate,
          total_views: totalViews,
          total_shares: totalShares,
          total_bookmarks: totalBookmarks,
          quality_score: qualityScore,
          updated_at: new Date().toISOString()
        });

      // Publish event if quality is low
      if (qualityScore < 0.5 && totalViews > 100) {
        await publishEvent(
          SystemEvent.CONTENT_QUALITY_LOW,
          { articleId, qualityScore, totalViews },
          'engagement-tracker'
        );
      }

      logger.info(`Updated aggregated metrics for article ${articleId}: quality score ${qualityScore.toFixed(2)}`);
    } catch (error) {
      logger.error('Error updating aggregated metrics', error as Error);
    }
  }

  /**
   * Calculate quality score from metrics
   */
  private calculateQualityScore(metrics: {
    avgTimeOnPage: number;
    avgScrollDepth: number;
    bounceRate: number;
    completionRate: number;
    engagementRate: number;
    conversionRate: number;
  }): number {
    // Weighted scoring
    const timeScore = Math.min(metrics.avgTimeOnPage / 120, 1); // Max at 2 minutes
    const scrollScore = metrics.avgScrollDepth / 100;
    const bounceScore = 1 - metrics.bounceRate;
    const completionScore = metrics.completionRate;
    const engagementScore = metrics.engagementRate;
    const conversionScore = metrics.conversionRate * 2; // 2x weight

    const qualityScore = (
      timeScore * 0.2 +
      scrollScore * 0.15 +
      bounceScore * 0.2 +
      completionScore * 0.15 +
      engagementScore * 0.2 +
      conversionScore * 0.1
    );

    return Math.min(qualityScore, 1);
  }

  /**
   * Get performance metrics for an article
   */
  async getPerformance(articleId: string): Promise<AggregatedMetrics | null> {
    try {
      const { data } = await this.supabase
        .from('article_performance')
        .select('*')
        .eq('article_id', articleId)
        .single();

      if (!data) return null;

      return {
        articleId: data.article_id,
        avgTimeOnPage: data.avg_time_on_page,
        avgScrollDepth: data.avg_scroll_depth,
        avgReadingProgress: data.avg_reading_progress,
        bounceRate: data.bounce_rate,
        completionRate: data.completion_rate,
        engagementRate: data.engagement_rate,
        conversionRate: data.conversion_rate,
        totalViews: data.total_views,
        totalShares: data.total_shares,
        totalBookmarks: data.total_bookmarks,
        qualityScore: data.quality_score,
        lastUpdated: new Date(data.updated_at).getTime()
      };
    } catch (error) {
      logger.error('Error getting performance metrics', error as Error);
      return null;
    }
  }

  /**
   * Get top performing articles
   */
  async getTopPerformers(limit: number = 10): Promise<AggregatedMetrics[]> {
    try {
      const { data } = await this.supabase
        .from('article_performance')
        .select('*')
        .order('quality_score', { ascending: false })
        .limit(limit);

      if (!data) return [];

      return data.map(d => ({
        articleId: d.article_id,
        avgTimeOnPage: d.avg_time_on_page,
        avgScrollDepth: d.avg_scroll_depth,
        avgReadingProgress: d.avg_reading_progress,
        bounceRate: d.bounce_rate,
        completionRate: d.completion_rate,
        engagementRate: d.engagement_rate,
        conversionRate: d.conversion_rate,
        totalViews: d.total_views,
        totalShares: d.total_shares,
        totalBookmarks: d.total_bookmarks,
        qualityScore: d.quality_score,
        lastUpdated: new Date(d.updated_at).getTime()
      }));
    } catch (error) {
      logger.error('Error getting top performers', error as Error);
      return [];
    }
  }

  /**
   * Get low performing articles
   */
  async getLowPerformers(limit: number = 10, minViews: number = 100): Promise<AggregatedMetrics[]> {
    try {
      const { data } = await this.supabase
        .from('article_performance')
        .select('*')
        .gte('total_views', minViews)
        .order('quality_score', { ascending: true })
        .limit(limit);

      if (!data) return [];

      return data.map(d => ({
        articleId: d.article_id,
        avgTimeOnPage: d.avg_time_on_page,
        avgScrollDepth: d.avg_scroll_depth,
        avgReadingProgress: d.avg_reading_progress,
        bounceRate: d.bounce_rate,
        completionRate: d.completion_rate,
        engagementRate: d.engagement_rate,
        conversionRate: d.conversion_rate,
        totalViews: d.total_views,
        totalShares: d.total_shares,
        totalBookmarks: d.total_bookmarks,
        qualityScore: d.quality_score,
        lastUpdated: new Date(d.updated_at).getTime()
      }));
    } catch (error) {
      logger.error('Error getting low performers', error as Error);
      return [];
    }
  }
}

// Singleton instance
export const engagementTracker = new EngagementTracker();
