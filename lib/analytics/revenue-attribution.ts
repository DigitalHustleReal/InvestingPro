/**
 * Revenue Attribution System
 * Multi-touch attribution models and revenue per article calculation
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// =============================================================================
// TYPES
// =============================================================================

export type AttributionModel = 
  | 'first_touch'      // 100% credit to first touchpoint
  | 'last_touch'       // 100% credit to last touchpoint
  | 'linear'           // Equal credit to all touchpoints
  | 'time_decay'       // More credit to recent touchpoints
  | 'position_based'   // 40% first, 20% middle, 40% last (U-shaped)
  | 'data_driven';     // ML-based attribution (future)

export interface Touchpoint {
  id: string;
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  category: string;
  timestamp: Date;
  type: 'pageview' | 'click' | 'engagement' | 'conversion';
  sessionId: string;
  userId?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface Conversion {
  id: string;
  affiliateId: string;
  affiliateName: string;
  revenue: number;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  productCategory: string;
}

export interface AttributionResult {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  category: string;
  attributedRevenue: number;
  attributionPercentage: number;
  touchpointCount: number;
  touchpointPosition: 'first' | 'middle' | 'last' | 'only';
  model: AttributionModel;
  conversionId: string;
}

export interface ArticleRevenueMetrics {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  category: string;
  totalRevenue: number;
  firstTouchRevenue: number;
  lastTouchRevenue: number;
  linearRevenue: number;
  timeDecayRevenue: number;
  positionBasedRevenue: number;
  conversionCount: number;
  avgRevenuePerConversion: number;
  conversionRate: number;
  totalPageviews: number;
  assistedConversions: number;
  directConversions: number;
}

export interface ChannelAttribution {
  channel: string;
  revenue: number;
  conversions: number;
  percentage: number;
}

// =============================================================================
// ATTRIBUTION MODELS
// =============================================================================

/**
 * First Touch Attribution
 * 100% credit to the first touchpoint
 */
export function firstTouchAttribution(
  touchpoints: Touchpoint[],
  conversion: Conversion
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const sortedTouchpoints = [...touchpoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const firstTouch = sortedTouchpoints[0];

  return [{
    articleId: firstTouch.articleId,
    articleTitle: firstTouch.articleTitle,
    articleSlug: firstTouch.articleSlug,
    category: firstTouch.category,
    attributedRevenue: conversion.revenue,
    attributionPercentage: 100,
    touchpointCount: touchpoints.length,
    touchpointPosition: touchpoints.length === 1 ? 'only' : 'first',
    model: 'first_touch',
    conversionId: conversion.id,
  }];
}

/**
 * Last Touch Attribution
 * 100% credit to the last touchpoint before conversion
 */
export function lastTouchAttribution(
  touchpoints: Touchpoint[],
  conversion: Conversion
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const sortedTouchpoints = [...touchpoints].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  const lastTouch = sortedTouchpoints[0];

  return [{
    articleId: lastTouch.articleId,
    articleTitle: lastTouch.articleTitle,
    articleSlug: lastTouch.articleSlug,
    category: lastTouch.category,
    attributedRevenue: conversion.revenue,
    attributionPercentage: 100,
    touchpointCount: touchpoints.length,
    touchpointPosition: touchpoints.length === 1 ? 'only' : 'last',
    model: 'last_touch',
    conversionId: conversion.id,
  }];
}

/**
 * Linear Attribution
 * Equal credit to all touchpoints
 */
export function linearAttribution(
  touchpoints: Touchpoint[],
  conversion: Conversion
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const creditPerTouch = conversion.revenue / touchpoints.length;
  const percentagePerTouch = 100 / touchpoints.length;

  // Group by article to aggregate
  const articleMap = new Map<string, AttributionResult>();

  touchpoints.forEach((tp, index) => {
    const existing = articleMap.get(tp.articleId);
    
    if (existing) {
      existing.attributedRevenue += creditPerTouch;
      existing.attributionPercentage += percentagePerTouch;
      existing.touchpointCount += 1;
    } else {
      let position: 'first' | 'middle' | 'last' | 'only' = 'middle';
      if (touchpoints.length === 1) position = 'only';
      else if (index === 0) position = 'first';
      else if (index === touchpoints.length - 1) position = 'last';

      articleMap.set(tp.articleId, {
        articleId: tp.articleId,
        articleTitle: tp.articleTitle,
        articleSlug: tp.articleSlug,
        category: tp.category,
        attributedRevenue: creditPerTouch,
        attributionPercentage: percentagePerTouch,
        touchpointCount: 1,
        touchpointPosition: position,
        model: 'linear',
        conversionId: conversion.id,
      });
    }
  });

  return Array.from(articleMap.values());
}

/**
 * Time Decay Attribution
 * More recent touchpoints get more credit
 * Uses exponential decay with 7-day half-life
 */
export function timeDecayAttribution(
  touchpoints: Touchpoint[],
  conversion: Conversion,
  halfLifeDays: number = 7
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const conversionTime = conversion.timestamp.getTime();
  const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1000;

  // Calculate decay weights
  const weights = touchpoints.map(tp => {
    const timeDiff = conversionTime - tp.timestamp.getTime();
    return Math.pow(2, -timeDiff / halfLifeMs);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // Group by article with weighted attribution
  const articleMap = new Map<string, AttributionResult>();

  touchpoints.forEach((tp, index) => {
    const weight = weights[index];
    const credit = (weight / totalWeight) * conversion.revenue;
    const percentage = (weight / totalWeight) * 100;

    const existing = articleMap.get(tp.articleId);
    
    if (existing) {
      existing.attributedRevenue += credit;
      existing.attributionPercentage += percentage;
      existing.touchpointCount += 1;
    } else {
      let position: 'first' | 'middle' | 'last' | 'only' = 'middle';
      if (touchpoints.length === 1) position = 'only';
      else if (index === 0) position = 'first';
      else if (index === touchpoints.length - 1) position = 'last';

      articleMap.set(tp.articleId, {
        articleId: tp.articleId,
        articleTitle: tp.articleTitle,
        articleSlug: tp.articleSlug,
        category: tp.category,
        attributedRevenue: credit,
        attributionPercentage: percentage,
        touchpointCount: 1,
        touchpointPosition: position,
        model: 'time_decay',
        conversionId: conversion.id,
      });
    }
  });

  return Array.from(articleMap.values());
}

/**
 * Position-Based Attribution (U-shaped)
 * 40% to first touch, 40% to last touch, 20% split among middle touches
 */
export function positionBasedAttribution(
  touchpoints: Touchpoint[],
  conversion: Conversion
): AttributionResult[] {
  if (touchpoints.length === 0) return [];

  const sortedTouchpoints = [...touchpoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  if (sortedTouchpoints.length === 1) {
    return [{
      articleId: sortedTouchpoints[0].articleId,
      articleTitle: sortedTouchpoints[0].articleTitle,
      articleSlug: sortedTouchpoints[0].articleSlug,
      category: sortedTouchpoints[0].category,
      attributedRevenue: conversion.revenue,
      attributionPercentage: 100,
      touchpointCount: 1,
      touchpointPosition: 'only',
      model: 'position_based',
      conversionId: conversion.id,
    }];
  }

  if (sortedTouchpoints.length === 2) {
    // Split 50/50 between first and last
    return [
      {
        articleId: sortedTouchpoints[0].articleId,
        articleTitle: sortedTouchpoints[0].articleTitle,
        articleSlug: sortedTouchpoints[0].articleSlug,
        category: sortedTouchpoints[0].category,
        attributedRevenue: conversion.revenue * 0.5,
        attributionPercentage: 50,
        touchpointCount: 1,
        touchpointPosition: 'first',
        model: 'position_based',
        conversionId: conversion.id,
      },
      {
        articleId: sortedTouchpoints[1].articleId,
        articleTitle: sortedTouchpoints[1].articleTitle,
        articleSlug: sortedTouchpoints[1].articleSlug,
        category: sortedTouchpoints[1].category,
        attributedRevenue: conversion.revenue * 0.5,
        attributionPercentage: 50,
        touchpointCount: 1,
        touchpointPosition: 'last',
        model: 'position_based',
        conversionId: conversion.id,
      },
    ];
  }

  // Standard U-shaped: 40% first, 40% last, 20% middle
  const firstCredit = conversion.revenue * 0.4;
  const lastCredit = conversion.revenue * 0.4;
  const middleTotal = conversion.revenue * 0.2;
  const middleCount = sortedTouchpoints.length - 2;
  const middleCreditEach = middleTotal / middleCount;

  const articleMap = new Map<string, AttributionResult>();

  sortedTouchpoints.forEach((tp, index) => {
    let credit: number;
    let percentage: number;
    let position: 'first' | 'middle' | 'last' | 'only';

    if (index === 0) {
      credit = firstCredit;
      percentage = 40;
      position = 'first';
    } else if (index === sortedTouchpoints.length - 1) {
      credit = lastCredit;
      percentage = 40;
      position = 'last';
    } else {
      credit = middleCreditEach;
      percentage = 20 / middleCount;
      position = 'middle';
    }

    const existing = articleMap.get(tp.articleId);
    
    if (existing) {
      existing.attributedRevenue += credit;
      existing.attributionPercentage += percentage;
      existing.touchpointCount += 1;
    } else {
      articleMap.set(tp.articleId, {
        articleId: tp.articleId,
        articleTitle: tp.articleTitle,
        articleSlug: tp.articleSlug,
        category: tp.category,
        attributedRevenue: credit,
        attributionPercentage: percentage,
        touchpointCount: 1,
        touchpointPosition: position,
        model: 'position_based',
        conversionId: conversion.id,
      });
    }
  });

  return Array.from(articleMap.values());
}

// =============================================================================
// MAIN ATTRIBUTION ENGINE
// =============================================================================

/**
 * Apply attribution model to a conversion
 */
export function applyAttribution(
  touchpoints: Touchpoint[],
  conversion: Conversion,
  model: AttributionModel
): AttributionResult[] {
  switch (model) {
    case 'first_touch':
      return firstTouchAttribution(touchpoints, conversion);
    case 'last_touch':
      return lastTouchAttribution(touchpoints, conversion);
    case 'linear':
      return linearAttribution(touchpoints, conversion);
    case 'time_decay':
      return timeDecayAttribution(touchpoints, conversion);
    case 'position_based':
      return positionBasedAttribution(touchpoints, conversion);
    case 'data_driven':
      // Fallback to position-based until ML model is trained
      return positionBasedAttribution(touchpoints, conversion);
    default:
      return lastTouchAttribution(touchpoints, conversion);
  }
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

/**
 * Get touchpoints for a session/user before conversion
 */
export async function getTouchpointsForConversion(
  conversionId: string,
  sessionId: string,
  userId?: string,
  lookbackDays: number = 30
): Promise<Touchpoint[]> {
  try {
    const lookbackDate = new Date();
    lookbackDate.setDate(lookbackDate.getDate() - lookbackDays);

    // Query analytics_events table for touchpoints
    let query = supabase
      .from('analytics_events')
      .select(`
        id,
        article_id,
        event_type,
        session_id,
        user_id,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        created_at,
        articles!inner(id, title, slug, category_id, categories(name))
      `)
      .eq('session_id', sessionId)
      .gte('created_at', lookbackDate.toISOString())
      .in('event_type', ['pageview', 'click', 'engagement'])
      .order('created_at', { ascending: true });

    if (userId) {
      query = query.or(`user_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching touchpoints', { error, conversionId });
      return [];
    }

    return (data || []).map((event: any) => ({
      id: event.id,
      articleId: event.article_id,
      articleTitle: event.articles?.title || 'Unknown',
      articleSlug: event.articles?.slug || '',
      category: event.articles?.categories?.name || 'Uncategorized',
      timestamp: new Date(event.created_at),
      type: event.event_type,
      sessionId: event.session_id,
      userId: event.user_id,
      referrer: event.referrer,
      utmSource: event.utm_source,
      utmMedium: event.utm_medium,
      utmCampaign: event.utm_campaign,
    }));
  } catch (error) {
    logger.error('Error in getTouchpointsForConversion', { error });
    return [];
  }
}

/**
 * Calculate revenue per article with multiple attribution models
 */
export async function calculateArticleRevenue(
  startDate: Date,
  endDate: Date
): Promise<ArticleRevenueMetrics[]> {
  try {
    // Get all conversions in date range
    const { data: conversions, error: convError } = await supabase
      .from('affiliate_clicks')
      .select(`
        id,
        link_id,
        article_id,
        clicked_at,
        affiliate_links!inner(
          id,
          name,
          revenue,
          partner_id,
          affiliate_partners(name, category)
        )
      `)
      .gte('clicked_at', startDate.toISOString())
      .lte('clicked_at', endDate.toISOString())
      .not('affiliate_links.revenue', 'is', null)
      .gt('affiliate_links.revenue', 0);

    if (convError) {
      logger.error('Error fetching conversions', { error: convError });
      return [];
    }

    // Get pageviews for conversion rate calculation
    const { data: pageviews, error: pvError } = await supabase
      .from('analytics_events')
      .select('article_id, id')
      .eq('event_type', 'pageview')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (pvError) {
      logger.error('Error fetching pageviews', { error: pvError });
    }

    // Calculate pageviews per article
    const pageviewCounts = new Map<string, number>();
    (pageviews || []).forEach((pv: any) => {
      const count = pageviewCounts.get(pv.article_id) || 0;
      pageviewCounts.set(pv.article_id, count + 1);
    });

    // Aggregate revenue by article with different models
    const articleMetrics = new Map<string, ArticleRevenueMetrics>();

    for (const conv of conversions || []) {
      if (!conv.article_id) continue;

      const conversion: Conversion = {
        id: conv.id,
        affiliateId: conv.affiliate_links?.partner_id || '',
        affiliateName: conv.affiliate_links?.affiliate_partners?.name || '',
        revenue: conv.affiliate_links?.revenue || 0,
        timestamp: new Date(conv.clicked_at),
        sessionId: '', // Would need to join session data
        productCategory: conv.affiliate_links?.affiliate_partners?.category || '',
      };

      // For direct attribution (article-to-conversion), use last touch
      const articleId = conv.article_id;
      
      // Get or create metrics entry
      let metrics = articleMetrics.get(articleId);
      if (!metrics) {
        // Fetch article details
        const { data: article } = await supabase
          .from('articles')
          .select('id, title, slug, categories(name)')
          .eq('id', articleId)
          .single();

        metrics = {
          articleId,
          articleTitle: article?.title || 'Unknown',
          articleSlug: article?.slug || '',
          category: (article as any)?.categories?.name || 'Uncategorized',
          totalRevenue: 0,
          firstTouchRevenue: 0,
          lastTouchRevenue: 0,
          linearRevenue: 0,
          timeDecayRevenue: 0,
          positionBasedRevenue: 0,
          conversionCount: 0,
          avgRevenuePerConversion: 0,
          conversionRate: 0,
          totalPageviews: pageviewCounts.get(articleId) || 0,
          assistedConversions: 0,
          directConversions: 0,
        };
        articleMetrics.set(articleId, metrics);
      }

      // Direct conversion attribution (last touch for this simplified version)
      metrics.totalRevenue += conversion.revenue;
      metrics.lastTouchRevenue += conversion.revenue;
      metrics.conversionCount += 1;
      metrics.directConversions += 1;
    }

    // Calculate derived metrics
    for (const metrics of articleMetrics.values()) {
      metrics.avgRevenuePerConversion = metrics.conversionCount > 0 
        ? metrics.totalRevenue / metrics.conversionCount 
        : 0;
      
      metrics.conversionRate = metrics.totalPageviews > 0 
        ? (metrics.conversionCount / metrics.totalPageviews) * 100 
        : 0;
    }

    return Array.from(articleMetrics.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );
  } catch (error) {
    logger.error('Error in calculateArticleRevenue', { error });
    return [];
  }
}

/**
 * Get channel attribution breakdown
 */
export async function getChannelAttribution(
  startDate: Date,
  endDate: Date,
  model: AttributionModel = 'last_touch'
): Promise<ChannelAttribution[]> {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select(`
        utm_source,
        utm_medium,
        article_id,
        affiliate_clicks!inner(
          affiliate_links(revenue)
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .not('affiliate_clicks.affiliate_links.revenue', 'is', null);

    if (error) {
      logger.error('Error fetching channel data', { error });
      return [];
    }

    // Aggregate by channel
    const channelMap = new Map<string, { revenue: number; conversions: number }>();
    let totalRevenue = 0;

    (data || []).forEach((event: any) => {
      const channel = event.utm_source || event.utm_medium || 'direct';
      const revenue = event.affiliate_clicks?.affiliate_links?.revenue || 0;
      
      totalRevenue += revenue;
      
      const existing = channelMap.get(channel) || { revenue: 0, conversions: 0 };
      existing.revenue += revenue;
      existing.conversions += 1;
      channelMap.set(channel, existing);
    });

    return Array.from(channelMap.entries())
      .map(([channel, data]) => ({
        channel,
        revenue: data.revenue,
        conversions: data.conversions,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    logger.error('Error in getChannelAttribution', { error });
    return [];
  }
}

/**
 * Compare attribution models for a time period
 */
export async function compareAttributionModels(
  startDate: Date,
  endDate: Date
): Promise<Record<AttributionModel, ArticleRevenueMetrics[]>> {
  const models: AttributionModel[] = [
    'first_touch',
    'last_touch',
    'linear',
    'time_decay',
    'position_based',
  ];

  const results: Record<string, ArticleRevenueMetrics[]> = {};

  // For now, use the same calculation - in production, 
  // you'd apply different models to the same data
  const baseMetrics = await calculateArticleRevenue(startDate, endDate);

  for (const model of models) {
    results[model] = baseMetrics;
  }

  return results as Record<AttributionModel, ArticleRevenueMetrics[]>;
}

export default {
  applyAttribution,
  firstTouchAttribution,
  lastTouchAttribution,
  linearAttribution,
  timeDecayAttribution,
  positionBasedAttribution,
  getTouchpointsForConversion,
  calculateArticleRevenue,
  getChannelAttribution,
  compareAttributionModels,
};
