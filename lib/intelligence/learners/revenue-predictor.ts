/**
 * Revenue Predictor
 * 
 * Purpose: Predict revenue potential of articles and optimize affiliate placements.
 * Uses historical affiliate click and conversion data to make predictions.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type {
  ArticleDraft,
  RevenuePrediction,
  OptimalAffiliatePosition,
  RevenueDrivers,
  ConversionInsights,
  CTAPosition,
  RevenueIntelligence,
} from '@/types/intelligence';

// ============================================
// TYPES
// ============================================

interface CategoryRevenueData {
  category: string;
  avgRevenue: number;
  avgConversionRate: number;
  avgCommission: number;
  topProducts: string[];
  bestPositions: CTAPosition[];
  sampleSize: number;
}

interface ArticleRevenueHistory {
  articleId: string;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  avgConversionRate: number;
  topPosition: CTAPosition | null;
}

// ============================================
// REVENUE PREDICTOR CLASS
// ============================================

export class RevenuePredictor {
  private supabase = createClient();
  private categoryCache: Map<string, CategoryRevenueData> = new Map();
  private cacheExpiry = 2 * 60 * 60 * 1000; // 2 hours
  private lastCacheUpdate = 0;

  // Default values for categories without data
  private categoryDefaults: Record<string, Partial<CategoryRevenueData>> = {
    'credit-cards': {
      avgRevenue: 3500,
      avgConversionRate: 0.032,
      avgCommission: 850,
      topProducts: ['hdfc_regalia', 'icici_amazon', 'axis_ace'],
      bestPositions: ['comparison_table', 'after_pros_cons', 'conclusion'],
    },
    'mutual-funds': {
      avgRevenue: 1800,
      avgConversionRate: 0.018,
      avgCommission: 450,
      topProducts: ['parag_parikh_flexi', 'hdfc_index', 'axis_bluechip'],
      bestPositions: ['after_intro', 'middle', 'conclusion'],
    },
    'loans': {
      avgRevenue: 2500,
      avgConversionRate: 0.025,
      avgCommission: 650,
      topProducts: ['hdfc_home_loan', 'sbi_personal', 'icici_car_loan'],
      bestPositions: ['after_intro', 'comparison_table', 'conclusion'],
    },
    'insurance': {
      avgRevenue: 2000,
      avgConversionRate: 0.022,
      avgCommission: 550,
      topProducts: ['hdfc_term', 'icici_health', 'max_life'],
      bestPositions: ['middle', 'before_conclusion', 'conclusion'],
    },
  };

  // ============================================
  // REVENUE PREDICTION
  // ============================================

  /**
   * Predict revenue potential for an article draft
   */
  async predictRevenue(
    draft: ArticleDraft,
    options: { includePositions?: boolean; includeRecommendations?: boolean } = {}
  ): Promise<RevenuePrediction> {
    const { includePositions = true, includeRecommendations = true } = options;

    try {
      // Get category revenue data
      const categoryData = await this.getCategoryRevenueData(draft.category);

      // Estimate traffic (from content quality)
      const estimatedTraffic = await this.estimateTraffic(draft);

      // Calculate conversion potential
      const conversionMultiplier = this.calculateConversionMultiplier(draft, categoryData);

      // Calculate seasonal factor
      const seasonalFactor = this.getSeasonalFactor(draft.category);

      // Base revenue calculation
      const baseRevenue = categoryData.avgRevenue;
      const trafficMultiplier = estimatedTraffic / 1000; // Normalize to 1000 views
      const qualityMultiplier = this.getQualityMultiplier(draft);

      // Predicted revenue
      const predictedRevenue = Math.round(
        baseRevenue * trafficMultiplier * conversionMultiplier * seasonalFactor * qualityMultiplier
      );

      // Calculate confidence based on data availability
      const confidence = this.calculateConfidence(categoryData, draft);

      // Get optimal positions
      const optimalPositions = includePositions
        ? await this.getOptimalAffiliatePositions(draft, categoryData)
        : [];

      // Generate recommendations
      const recommendations = includeRecommendations
        ? this.generateRevenueRecommendations(draft, categoryData, optimalPositions)
        : [];

      const prediction: RevenuePrediction = {
        predicted: predictedRevenue,
        range: {
          min: Math.round(predictedRevenue * 0.6),
          max: Math.round(predictedRevenue * 1.5),
        },
        confidence,
        topProducts: categoryData.topProducts.slice(0, 5),
        optimalPositions: optimalPositions.map(p => ({
          position: p.position,
          expectedCTR: p.expected_ctr,
        })),
        recommendations,
      };

      // Store prediction
      await this.storeRevenuePrediction(draft, prediction, categoryData);

      return prediction;
    } catch (error) {
      logger.error('Error predicting revenue', error as Error);
      return this.getDefaultPrediction(draft.category);
    }
  }

  /**
   * Get optimal affiliate positions for an article
   */
  async getOptimalAffiliatePositions(
    draft: ArticleDraft,
    categoryData?: CategoryRevenueData
  ): Promise<OptimalAffiliatePosition[]> {
    try {
      // Get category data if not provided
      const data = categoryData || await this.getCategoryRevenueData(draft.category);

      // Get historical position performance
      const positionPerformance = await this.getPositionPerformance(draft.category);

      // Analyze content structure
      const contentStructure = this.analyzeContentStructure(draft.content || '');

      // Generate optimal positions
      const positions: OptimalAffiliatePosition[] = [];

      // Position 1: After Introduction (if substantial intro)
      if (contentStructure.hasSubstantialIntro) {
        positions.push({
          position: 'after_intro',
          product_type: draft.category,
          expected_ctr: positionPerformance['after_intro'] || 0.025,
          expected_conversions: Math.round((positionPerformance['after_intro'] || 0.025) * data.avgConversionRate * 100),
          recommended_format: 'card',
          rationale: 'Capture interest while reader is engaged with intro',
        });
      }

      // Position 2: Comparison Table (if article has comparison)
      if (contentStructure.hasComparisonTable || draft.has_comparison_table) {
        positions.push({
          position: 'comparison_table',
          product_type: draft.category,
          expected_ctr: positionPerformance['comparison_table'] || 0.068,
          expected_conversions: Math.round((positionPerformance['comparison_table'] || 0.068) * data.avgConversionRate * 100),
          recommended_format: 'table',
          rationale: 'Users comparing products are high-intent - best conversion point',
        });
      }

      // Position 3: After Pros/Cons (if exists)
      if (contentStructure.hasProsCons) {
        positions.push({
          position: 'after_pros_cons',
          product_type: draft.category,
          expected_ctr: positionPerformance['after_pros_cons'] || 0.045,
          expected_conversions: Math.round((positionPerformance['after_pros_cons'] || 0.045) * data.avgConversionRate * 100),
          recommended_format: 'button',
          rationale: 'User has evaluated options and is ready to act',
        });
      }

      // Position 4: Middle of article
      if (contentStructure.wordCount > 1000) {
        positions.push({
          position: 'middle',
          product_type: draft.category,
          expected_ctr: positionPerformance['middle'] || 0.032,
          expected_conversions: Math.round((positionPerformance['middle'] || 0.032) * data.avgConversionRate * 100),
          recommended_format: 'card',
          rationale: 'Break up long content with relevant product highlight',
        });
      }

      // Position 5: Conclusion (always)
      positions.push({
        position: 'conclusion',
        product_type: draft.category,
        expected_ctr: positionPerformance['conclusion'] || 0.035,
        expected_conversions: Math.round((positionPerformance['conclusion'] || 0.035) * data.avgConversionRate * 100),
        recommended_format: 'button',
        rationale: 'Final CTA for readers who finished the article',
      });

      // Sort by expected CTR
      positions.sort((a, b) => b.expected_ctr - a.expected_ctr);

      return positions.slice(0, 5); // Return top 5 positions
    } catch (error) {
      logger.error('Error getting optimal positions', error as Error);
      return this.getDefaultPositions(draft.category);
    }
  }

  // ============================================
  // DATA RETRIEVAL
  // ============================================

  /**
   * Get category revenue data from historical data
   */
  private async getCategoryRevenueData(category: string): Promise<CategoryRevenueData> {
    // Check cache
    if (this.categoryCache.has(category) && Date.now() - this.lastCacheUpdate < this.cacheExpiry) {
      return this.categoryCache.get(category)!;
    }

    try {
      // Get affiliate click data for category
      const { data: clicksData, error: clicksError } = await this.supabase
        .from('affiliate_clicks')
        .select('product_name, source_component, conversion_status, commission_earned')
        .eq('category', category)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (clicksError) {
        logger.error('Error fetching clicks data', clicksError);
        return this.getDefaultCategoryData(category);
      }

      if (!clicksData || clicksData.length < 10) {
        return this.getDefaultCategoryData(category);
      }

      // Calculate metrics
      const totalClicks = clicksData.length;
      const conversions = clicksData.filter((c: any) => c.conversion_status === 'converted').length;
      const totalRevenue = clicksData.reduce((sum: any, c: any) => sum + (c.commission_earned || 0), 0);

      // Top products
      const productCounts = new Map<string, number>();
      for (const click of clicksData) {
        const count = productCounts.get(click.product_name) || 0;
        productCounts.set(click.product_name, count + 1);
      }
      const topProducts = [...productCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name]) => name);

      // Best positions
      const positionConversions = new Map<string, { clicks: number; conversions: number }>();
      for (const click of clicksData) {
        const pos = click.source_component || 'unknown';
        const current = positionConversions.get(pos) || { clicks: 0, conversions: 0 };
        current.clicks++;
        if (click.conversion_status === 'converted') current.conversions++;
        positionConversions.set(pos, current);
      }
      const bestPositions = [...positionConversions.entries()]
        .map(([pos, data]) => ({
          position: pos as CTAPosition,
          rate: data.clicks > 0 ? data.conversions / data.clicks : 0,
        }))
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 5)
        .map(p => p.position);

      const categoryData: CategoryRevenueData = {
        category,
        avgRevenue: totalClicks > 0 ? Math.round(totalRevenue / (totalClicks / 100)) : 1000, // Per 100 clicks
        avgConversionRate: totalClicks > 0 ? conversions / totalClicks : 0.025,
        avgCommission: conversions > 0 ? Math.round(totalRevenue / conversions) : 500,
        topProducts,
        bestPositions,
        sampleSize: totalClicks,
      };

      // Update cache
      this.categoryCache.set(category, categoryData);
      this.lastCacheUpdate = Date.now();

      return categoryData;
    } catch (error) {
      logger.error('Error getting category revenue data', error as Error);
      return this.getDefaultCategoryData(category);
    }
  }

  /**
   * Get position performance from historical data
   */
  private async getPositionPerformance(category: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await this.supabase
        .from('affiliate_clicks')
        .select('source_component')
        .eq('category', category)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (error || !data || data.length === 0) {
        return this.getDefaultPositionPerformance();
      }

      // Count by position
      const positionCounts = new Map<string, number>();
      for (const click of data) {
        const pos = click.source_component || 'unknown';
        positionCounts.set(pos, (positionCounts.get(pos) || 0) + 1);
      }

      const total = data.length;
      const performance: Record<string, number> = {};

      for (const [pos, count] of positionCounts) {
        // CTR approximation (clicks / estimated impressions)
        // Assuming 3% of page views result in clicks on average
        performance[pos] = count / total * 0.03 * 2; // Normalize
      }

      return { ...this.getDefaultPositionPerformance(), ...performance };
    } catch (error) {
      logger.error('Error getting position performance', error as Error);
      return this.getDefaultPositionPerformance();
    }
  }

  // ============================================
  // CALCULATION HELPERS
  // ============================================

  /**
   * Estimate traffic based on content quality
   */
  private async estimateTraffic(draft: ArticleDraft): Promise<number> {
    try {
      // Get average traffic for category
      const { data, error } = await this.supabase
        .from('articles')
        .select('views')
        .eq('category', draft.category)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        return 500; // Default
      }

      const avgViews = Math.round(
        data.reduce((sum: any, a: any) => sum + (a.views || 0), 0) / data.length
      );

      // Adjust based on content quality indicators
      let multiplier = 1.0;

      // Keyword strength
      if (draft.primary_keyword) multiplier += 0.1;
      if (draft.secondary_keywords && draft.secondary_keywords.length >= 3) multiplier += 0.1;

      // Content depth
      const wordCount = this.estimateWordCount(draft.content || '');
      if (wordCount >= 1500) multiplier += 0.15;
      if (wordCount >= 2500) multiplier += 0.1;

      // Special content
      if (draft.has_comparison_table) multiplier += 0.2;
      if (draft.has_calculator) multiplier += 0.15;

      return Math.round(avgViews * multiplier);
    } catch (error) {
      logger.error('Error estimating traffic', error as Error);
      return 500;
    }
  }

  /**
   * Calculate conversion multiplier based on content
   */
  private calculateConversionMultiplier(
    draft: ArticleDraft,
    categoryData: CategoryRevenueData
  ): number {
    let multiplier = 1.0;

    // Products mentioned
    if (draft.products_mentioned && draft.products_mentioned.length > 0) {
      // Check if top products are mentioned
      const topMentioned = draft.products_mentioned.filter(p =>
        categoryData.topProducts.some(tp => tp.toLowerCase().includes(p.toLowerCase()))
      ).length;
      multiplier += topMentioned * 0.1;
    }

    // Comparison table (high-intent content)
    if (draft.has_comparison_table) {
      multiplier += 0.3;
    }

    // Calculator (engagement driver)
    if (draft.has_calculator) {
      multiplier += 0.2;
    }

    // Search intent
    if ((draft as ArticleDraft & { search_intent?: string }).search_intent === 'transactional') {
      multiplier += 0.25;
    } else if ((draft as ArticleDraft & { search_intent?: string }).search_intent === 'commercial') {
      multiplier += 0.15;
    }

    return Math.min(2.0, multiplier); // Cap at 2x
  }

  /**
   * Get seasonal factor for category
   */
  private getSeasonalFactor(category: string): number {
    const month = new Date().getMonth();

    const seasonalFactors: Record<string, Record<number, number>> = {
      'credit-cards': {
        9: 1.4,   // October
        10: 1.6,  // November - Diwali peak
        11: 1.3,  // December
        0: 1.1,   // January
      },
      'taxes': {
        0: 1.2,
        1: 1.5,
        2: 1.8,   // March - tax deadline
      },
      'mutual-funds': {
        0: 1.2,   // New year planning
        2: 1.4,   // Tax saving
        3: 1.2,   // New FY
      },
      'insurance': {
        0: 1.2,
        1: 1.3,
        2: 1.4,   // Tax saving
      },
    };

    return seasonalFactors[category]?.[month] || 1.0;
  }

  /**
   * Get quality multiplier based on content
   */
  private getQualityMultiplier(draft: ArticleDraft): number {
    let multiplier = 1.0;
    const content = draft.content || '';
    const wordCount = this.estimateWordCount(content);

    // Length bonus
    if (wordCount >= 1500 && wordCount <= 3000) {
      multiplier += 0.15;
    } else if (wordCount > 3000) {
      multiplier += 0.1;
    }

    // Structure bonuses
    if (content.includes('<table>') || content.includes('|---|')) {
      multiplier += 0.1;
    }
    if (content.includes('<ul>') || content.includes('<ol>')) {
      multiplier += 0.05;
    }
    if (content.toLowerCase().includes('faq')) {
      multiplier += 0.05;
    }

    return multiplier;
  }

  /**
   * Calculate confidence in prediction
   */
  private calculateConfidence(
    categoryData: CategoryRevenueData,
    draft: ArticleDraft
  ): number {
    let confidence = 0.3; // Base

    // Data availability
    if (categoryData.sampleSize >= 100) confidence += 0.3;
    else if (categoryData.sampleSize >= 50) confidence += 0.2;
    else if (categoryData.sampleSize >= 20) confidence += 0.1;

    // Content completeness
    if (draft.primary_keyword) confidence += 0.1;
    if (draft.products_mentioned && draft.products_mentioned.length > 0) confidence += 0.1;
    if (draft.has_comparison_table) confidence += 0.1;

    return Math.min(0.95, confidence);
  }

  /**
   * Analyze content structure
   */
  private analyzeContentStructure(content: string): {
    wordCount: number;
    hasSubstantialIntro: boolean;
    hasComparisonTable: boolean;
    hasProsCons: boolean;
    hasFAQ: boolean;
    sectionCount: number;
  } {
    const wordCount = this.estimateWordCount(content);
    const lowerContent = content.toLowerCase();

    // Check for sections using headings
    const headingMatches = content.match(/<h[2-4]/gi) || [];
    const sectionCount = headingMatches.length;

    // Substantial intro (first section > 150 words)
    const firstHeadingIndex = content.search(/<h[2-4]/i);
    const introText = firstHeadingIndex > 0 ? content.slice(0, firstHeadingIndex) : content.slice(0, 500);
    const hasSubstantialIntro = this.estimateWordCount(introText) >= 100;

    return {
      wordCount,
      hasSubstantialIntro,
      hasComparisonTable: content.includes('<table>') || content.includes('|---|'),
      hasProsCons: lowerContent.includes('pros') && lowerContent.includes('cons'),
      hasFAQ: lowerContent.includes('faq') || lowerContent.includes('frequently asked'),
      sectionCount,
    };
  }

  /**
   * Estimate word count
   */
  private estimateWordCount(content: string): number {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    return words.length;
  }

  // ============================================
  // RECOMMENDATIONS
  // ============================================

  /**
   * Generate revenue optimization recommendations
   */
  private generateRevenueRecommendations(
    draft: ArticleDraft,
    categoryData: CategoryRevenueData,
    positions: OptimalAffiliatePosition[]
  ): string[] {
    const recommendations: string[] = [];

    // Product recommendations
    const mentionedProducts = draft.products_mentioned || [];
    const missingTopProducts = categoryData.topProducts
      .filter(p => !mentionedProducts.some(m => m.toLowerCase().includes(p.toLowerCase())))
      .slice(0, 3);

    if (missingTopProducts.length > 0) {
      recommendations.push(
        `Consider featuring top-performing products: ${missingTopProducts.join(', ')}`
      );
    }

    // Position recommendations
    const topPosition = positions[0];
    if (topPosition && topPosition.position === 'comparison_table' && !draft.has_comparison_table) {
      recommendations.push(
        'Add a comparison table - highest conversion position for this category'
      );
    }

    // CTA count
    const content = draft.content || '';
    const ctaCount = (content.match(/apply now|compare|check eligibility|calculate|get started/gi) || []).length;
    if (ctaCount < 3) {
      recommendations.push(
        'Add 2-3 more CTAs throughout the article to maximize conversion opportunities'
      );
    }

    // Calculator
    if (!draft.has_calculator && ['credit-cards', 'loans', 'mutual-funds'].includes(draft.category)) {
      recommendations.push(
        'Link to relevant calculator to increase engagement and time-on-page'
      );
    }

    // Seasonal
    const seasonalFactor = this.getSeasonalFactor(draft.category);
    if (seasonalFactor > 1.2) {
      recommendations.push(
        `Current season is favorable for ${draft.category} content - prioritize publication`
      );
    }

    return recommendations.slice(0, 5);
  }

  // ============================================
  // STORAGE
  // ============================================

  /**
   * Store revenue prediction in database
   */
  private async storeRevenuePrediction(
    draft: ArticleDraft,
    prediction: RevenuePrediction,
    categoryData: CategoryRevenueData
  ): Promise<void> {
    try {
      // We store the prediction data, but without a specific article_id
      // since this is for draft prediction
      await this.supabase
        .from('revenue_intelligence')
        .insert({
          predicted_monthly_revenue: prediction.predicted,
          predicted_revenue_range_min: prediction.range.min,
          predicted_revenue_range_max: prediction.range.max,
          optimal_affiliate_positions: prediction.optimalPositions,
          revenue_drivers: {
            primary_driver: prediction.optimalPositions[0]?.position || 'unknown',
            top_products: prediction.topProducts,
            best_cta_type: 'button',
            optimal_cta_count: 3,
            seasonal_factor: this.getSeasonalFactor(draft.category),
            category_multiplier: 1.0,
            traffic_to_revenue_ratio: categoryData.avgRevenue / 1000,
          },
          conversion_insights: {
            avg_conversion_rate: categoryData.avgConversionRate,
            best_converting_position: categoryData.bestPositions[0] || 'comparison_table',
            best_converting_product: categoryData.topProducts[0] || 'unknown',
            avg_commission: categoryData.avgCommission,
            commission_range: [
              Math.round(categoryData.avgCommission * 0.5),
              Math.round(categoryData.avgCommission * 1.5),
            ],
          },
          prediction_confidence: prediction.confidence,
        });
    } catch (error) {
      logger.error('Error storing revenue prediction', error as Error);
    }
  }

  // ============================================
  // DEFAULTS
  // ============================================

  /**
   * Get default category data
   */
  private getDefaultCategoryData(category: string): CategoryRevenueData {
    const defaults = this.categoryDefaults[category] || {
      avgRevenue: 1500,
      avgConversionRate: 0.02,
      avgCommission: 400,
      topProducts: [],
      bestPositions: ['comparison_table', 'conclusion'],
    };

    return {
      category,
      avgRevenue: defaults.avgRevenue!,
      avgConversionRate: defaults.avgConversionRate!,
      avgCommission: defaults.avgCommission!,
      topProducts: defaults.topProducts!,
      bestPositions: defaults.bestPositions!,
      sampleSize: 0,
    };
  }

  /**
   * Get default position performance
   */
  private getDefaultPositionPerformance(): Record<string, number> {
    return {
      after_intro: 0.025,
      middle: 0.032,
      before_conclusion: 0.028,
      conclusion: 0.035,
      comparison_table: 0.068,
      after_pros_cons: 0.045,
      sidebar: 0.018,
    };
  }

  /**
   * Get default positions
   */
  private getDefaultPositions(category: string): OptimalAffiliatePosition[] {
    return [
      {
        position: 'comparison_table',
        product_type: category,
        expected_ctr: 0.068,
        expected_conversions: 2,
        recommended_format: 'table',
        rationale: 'Highest converting position for comparison content',
      },
      {
        position: 'after_pros_cons',
        product_type: category,
        expected_ctr: 0.045,
        expected_conversions: 1,
        recommended_format: 'button',
        rationale: 'User has evaluated options',
      },
      {
        position: 'conclusion',
        product_type: category,
        expected_ctr: 0.035,
        expected_conversions: 1,
        recommended_format: 'button',
        rationale: 'Final CTA for engaged readers',
      },
    ];
  }

  /**
   * Get default prediction
   */
  private getDefaultPrediction(category: string): RevenuePrediction {
    const defaults = this.categoryDefaults[category] || { avgRevenue: 1500 };
    return {
      predicted: defaults.avgRevenue!,
      range: {
        min: Math.round(defaults.avgRevenue! * 0.5),
        max: Math.round(defaults.avgRevenue! * 1.5),
      },
      confidence: 0.3,
      topProducts: defaults.topProducts || [],
      optimalPositions: [
        { position: 'comparison_table', expectedCTR: 0.068 },
        { position: 'conclusion', expectedCTR: 0.035 },
      ],
      recommendations: [
        'Unable to make accurate prediction - using category defaults',
        'Add comparison tables for better conversion',
      ],
    };
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const revenuePredictor = new RevenuePredictor();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Predict revenue for an article draft
 */
export async function predictRevenue(
  draft: ArticleDraft,
  options?: { includePositions?: boolean; includeRecommendations?: boolean }
): Promise<RevenuePrediction> {
  return revenuePredictor.predictRevenue(draft, options);
}

/**
 * Get optimal affiliate positions for content
 */
export async function getOptimalAffiliatePositions(
  draft: ArticleDraft
): Promise<OptimalAffiliatePosition[]> {
  return revenuePredictor.getOptimalAffiliatePositions(draft);
}
