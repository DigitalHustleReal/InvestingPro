/**
 * Revenue Prediction System
 * Predict revenue before publish using historical pattern matching
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// =============================================================================
// TYPES
// =============================================================================

export interface RevenuePrediction {
  articleId?: string;
  predictedRevenue: {
    low: number;      // Conservative estimate (25th percentile)
    expected: number; // Most likely estimate (median)
    high: number;     // Optimistic estimate (75th percentile)
  };
  confidence: number; // 0-100 score
  factors: PredictionFactor[];
  comparableArticles: ComparableArticle[];
  timeframe: {
    days30: number;
    days90: number;
    days365: number;
  };
  model: 'historical' | 'ml' | 'hybrid';
  createdAt: Date;
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // -100 to 100
  description: string;
}

export interface ComparableArticle {
  articleId: string;
  title: string;
  slug: string;
  category: string;
  publishDate: Date;
  actualRevenue: number;
  similarityScore: number; // 0-100
  matchingFactors: string[];
}

export interface ArticleFeatures {
  category: string;
  subcategory?: string;
  wordCount: number;
  hasVideo: boolean;
  hasCalculator: boolean;
  hasComparison: boolean;
  affiliateLinksCount: number;
  affiliateCategories: string[];
  authorExpertise: number; // 1-10
  searchVolume: number;
  keywordDifficulty: number;
  seasonality: 'high' | 'medium' | 'low' | 'none';
  contentType: 'guide' | 'comparison' | 'review' | 'news' | 'analysis' | 'how-to';
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  monetizationPotential: 'high' | 'medium' | 'low';
}

export interface HistoricalPattern {
  category: string;
  avgRevenue: number;
  medianRevenue: number;
  stdDeviation: number;
  percentile25: number;
  percentile75: number;
  sampleSize: number;
  factors: {
    name: string;
    avgImpact: number;
  }[];
}

export interface PredictionAccuracy {
  predictionId: string;
  articleId: string;
  predictedRevenue: number;
  actualRevenue: number;
  accuracy: number; // Percentage
  daysElapsed: number;
  model: string;
}

// =============================================================================
// FEATURE EXTRACTION
// =============================================================================

/**
 * Extract features from article content for prediction
 */
export function extractArticleFeatures(article: any): ArticleFeatures {
  const content = article.content || '';
  const wordCount = content.split(/\s+/).length;
  
  // Check for special content types
  const hasVideo = /<video|youtube|vimeo/i.test(content);
  const hasCalculator = /calculator|<Calculator|data-calculator/i.test(content);
  const hasComparison = /comparison|vs\.|versus|compare/i.test(content);
  
  // Count affiliate links
  const affiliateLinkPattern = /affiliate|partner|ref=|tracking/gi;
  const affiliateLinksCount = (content.match(affiliateLinkPattern) || []).length;
  
  // Determine content type
  let contentType: ArticleFeatures['contentType'] = 'guide';
  if (hasComparison) contentType = 'comparison';
  else if (/review|rated|rating/i.test(article.title)) contentType = 'review';
  else if (/news|update|announce/i.test(article.title)) contentType = 'news';
  else if (/how to|step|tutorial/i.test(article.title)) contentType = 'how-to';
  else if (/analysis|forecast|predict/i.test(article.title)) contentType = 'analysis';
  
  // Determine target audience
  let targetAudience: ArticleFeatures['targetAudience'] = 'intermediate';
  if (/beginner|basic|introduction|101|start/i.test(article.title)) targetAudience = 'beginner';
  else if (/advanced|expert|pro|strategy/i.test(article.title)) targetAudience = 'advanced';
  
  // Determine monetization potential based on category
  const highMonetization = ['credit-cards', 'loans', 'insurance', 'trading'];
  const mediumMonetization = ['mutual-funds', 'savings', 'banking', 'tax'];
  
  let monetizationPotential: ArticleFeatures['monetizationPotential'] = 'low';
  if (highMonetization.includes(article.category?.slug)) monetizationPotential = 'high';
  else if (mediumMonetization.includes(article.category?.slug)) monetizationPotential = 'medium';

  return {
    category: article.category?.name || 'Uncategorized',
    subcategory: article.subcategory?.name,
    wordCount,
    hasVideo,
    hasCalculator,
    hasComparison,
    affiliateLinksCount,
    affiliateCategories: article.affiliateCategories || [],
    authorExpertise: article.author?.expertise_score || 5,
    searchVolume: article.search_volume || 0,
    keywordDifficulty: article.keyword_difficulty || 50,
    seasonality: determineSeasonality(article),
    contentType,
    targetAudience,
    monetizationPotential,
  };
}

/**
 * Determine seasonality factor
 */
function determineSeasonality(article: any): ArticleFeatures['seasonality'] {
  const title = (article.title || '').toLowerCase();
  const category = (article.category?.slug || '').toLowerCase();
  
  // Tax-related content has high seasonality
  if (/tax|itr|income tax|80c|deduction/i.test(title) || category === 'tax') {
    return 'high';
  }
  
  // Investment-related has medium seasonality
  if (/elss|tax saving|year end|financial year/i.test(title)) {
    return 'medium';
  }
  
  return 'low';
}

// =============================================================================
// HISTORICAL PATTERN ANALYSIS
// =============================================================================

/**
 * Get historical revenue patterns by category
 */
export async function getHistoricalPatterns(
  category?: string
): Promise<HistoricalPattern[]> {
  try {
    let query = supabase
      .from('articles')
      .select(`
        id,
        title,
        category_id,
        categories(name, slug),
        created_at,
        affiliate_clicks(
          affiliate_links(revenue)
        )
      `)
      .eq('status', 'published')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    if (category) {
      query = query.eq('categories.slug', category);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching historical patterns', { error });
      return [];
    }

    // Group by category and calculate statistics
    const categoryMap = new Map<string, number[]>();

    (data || []).forEach((article: any) => {
      const categoryName = article.categories?.name || 'Uncategorized';
      const revenue = (article.affiliate_clicks || []).reduce(
        (sum: number, click: any) => sum + (click.affiliate_links?.revenue || 0),
        0
      );

      const existing = categoryMap.get(categoryName) || [];
      existing.push(revenue);
      categoryMap.set(categoryName, existing);
    });

    // Calculate statistics for each category
    const patterns: HistoricalPattern[] = [];

    for (const [categoryName, revenues] of categoryMap.entries()) {
      if (revenues.length < 3) continue;

      const sorted = [...revenues].sort((a, b) => a - b);
      const sum = revenues.reduce((a, b) => a + b, 0);
      const avg = sum / revenues.length;
      const median = sorted[Math.floor(sorted.length / 2)];
      
      // Standard deviation
      const squaredDiffs = revenues.map(r => Math.pow(r - avg, 2));
      const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / revenues.length;
      const stdDev = Math.sqrt(avgSquaredDiff);

      patterns.push({
        category: categoryName,
        avgRevenue: avg,
        medianRevenue: median,
        stdDeviation: stdDev,
        percentile25: sorted[Math.floor(sorted.length * 0.25)] || 0,
        percentile75: sorted[Math.floor(sorted.length * 0.75)] || median,
        sampleSize: revenues.length,
        factors: [],
      });
    }

    return patterns.sort((a, b) => b.avgRevenue - a.avgRevenue);
  } catch (error) {
    logger.error('Error in getHistoricalPatterns', { error });
    return [];
  }
}

/**
 * Find comparable articles based on features
 */
export async function findComparableArticles(
  features: ArticleFeatures,
  limit: number = 5
): Promise<ComparableArticle[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        created_at,
        categories(name, slug),
        affiliate_clicks(
          affiliate_links(revenue)
        )
      `)
      .eq('status', 'published')
      .eq('categories.name', features.category)
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .limit(50);

    if (error) {
      logger.error('Error finding comparable articles', { error });
      return [];
    }

    // Score similarity and filter
    const comparables: ComparableArticle[] = (data || [])
      .map((article: any) => {
        const revenue = (article.affiliate_clicks || []).reduce(
          (sum: number, click: any) => sum + (click.affiliate_links?.revenue || 0),
          0
        );

        // Calculate similarity score
        const matchingFactors: string[] = [];
        let similarityScore = 50; // Base score

        // Same category is already guaranteed
        matchingFactors.push('Same category');
        similarityScore += 20;

        return {
          articleId: article.id,
          title: article.title,
          slug: article.slug,
          category: article.categories?.name || 'Uncategorized',
          publishDate: new Date(article.created_at),
          actualRevenue: revenue,
          similarityScore: Math.min(100, similarityScore),
          matchingFactors,
        };
      })
      .filter((a: ComparableArticle) => a.actualRevenue > 0)
      .sort((a: ComparableArticle, b: ComparableArticle) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return comparables;
  } catch (error) {
    logger.error('Error in findComparableArticles', { error });
    return [];
  }
}

// =============================================================================
// PREDICTION ENGINE
// =============================================================================

/**
 * Calculate prediction factors with impact scores
 */
function calculatePredictionFactors(features: ArticleFeatures): PredictionFactor[] {
  const factors: PredictionFactor[] = [];

  // Category factor
  const categoryImpacts: Record<string, number> = {
    'Credit Cards': 80,
    'Loans': 70,
    'Insurance': 65,
    'Trading': 60,
    'Mutual Funds': 50,
    'Tax': 45,
    'Banking': 40,
    'Savings': 30,
  };
  
  const categoryImpact = categoryImpacts[features.category] || 20;
  factors.push({
    name: 'Category Revenue Potential',
    impact: categoryImpact > 50 ? 'positive' : categoryImpact > 30 ? 'neutral' : 'negative',
    weight: categoryImpact,
    description: `${features.category} category has ${categoryImpact > 50 ? 'high' : categoryImpact > 30 ? 'medium' : 'low'} revenue potential`,
  });

  // Content type factor
  const contentTypeImpacts: Record<string, number> = {
    'comparison': 40,
    'review': 35,
    'how-to': 25,
    'guide': 20,
    'analysis': 15,
    'news': 5,
  };
  
  const contentImpact = contentTypeImpacts[features.contentType] || 10;
  factors.push({
    name: 'Content Type',
    impact: contentImpact > 30 ? 'positive' : 'neutral',
    weight: contentImpact,
    description: `${features.contentType} content typically converts ${contentImpact > 30 ? 'well' : 'moderately'}`,
  });

  // Affiliate links factor
  if (features.affiliateLinksCount > 0) {
    const linkImpact = Math.min(50, features.affiliateLinksCount * 10);
    factors.push({
      name: 'Affiliate Link Density',
      impact: linkImpact > 20 ? 'positive' : 'neutral',
      weight: linkImpact,
      description: `${features.affiliateLinksCount} affiliate links provide conversion opportunities`,
    });
  } else {
    factors.push({
      name: 'No Affiliate Links',
      impact: 'negative',
      weight: -30,
      description: 'No affiliate links detected - add monetization opportunities',
    });
  }

  // Calculator/tool factor
  if (features.hasCalculator) {
    factors.push({
      name: 'Interactive Calculator',
      impact: 'positive',
      weight: 35,
      description: 'Calculators increase engagement and conversion rates',
    });
  }

  // Comparison factor
  if (features.hasComparison) {
    factors.push({
      name: 'Comparison Content',
      impact: 'positive',
      weight: 30,
      description: 'Comparison content helps users make decisions',
    });
  }

  // Word count factor
  if (features.wordCount < 500) {
    factors.push({
      name: 'Thin Content',
      impact: 'negative',
      weight: -25,
      description: 'Short content may not rank well or provide value',
    });
  } else if (features.wordCount > 2000) {
    factors.push({
      name: 'Comprehensive Content',
      impact: 'positive',
      weight: 25,
      description: 'Long-form content typically ranks better',
    });
  }

  // Seasonality factor
  if (features.seasonality === 'high') {
    const month = new Date().getMonth();
    // Tax season in India: Jan-Mar
    const inSeason = month >= 0 && month <= 2;
    factors.push({
      name: 'Seasonal Content',
      impact: inSeason ? 'positive' : 'neutral',
      weight: inSeason ? 40 : 15,
      description: inSeason 
        ? 'Currently in peak season for this content'
        : 'Off-season - revenue will increase during tax season',
    });
  }

  // Search volume factor
  if (features.searchVolume > 10000) {
    factors.push({
      name: 'High Search Volume',
      impact: 'positive',
      weight: 35,
      description: `${features.searchVolume.toLocaleString()} monthly searches`,
    });
  } else if (features.searchVolume > 1000) {
    factors.push({
      name: 'Moderate Search Volume',
      impact: 'neutral',
      weight: 15,
      description: `${features.searchVolume.toLocaleString()} monthly searches`,
    });
  }

  return factors.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
}

/**
 * Main prediction function
 */
export async function predictRevenue(
  article: any,
  useML: boolean = false
): Promise<RevenuePrediction> {
  try {
    // Extract features
    const features = extractArticleFeatures(article);
    
    // Get historical patterns
    const patterns = await getHistoricalPatterns(features.category);
    const categoryPattern = patterns.find(p => p.category === features.category);
    
    // Find comparable articles
    const comparables = await findComparableArticles(features);
    
    // Calculate prediction factors
    const factors = calculatePredictionFactors(features);
    
    // Calculate base prediction from historical data
    let baseRevenue = categoryPattern?.medianRevenue || 100;
    
    // If we have comparables, weight their average
    if (comparables.length > 0) {
      const comparableAvg = comparables.reduce((sum, c) => sum + c.actualRevenue, 0) / comparables.length;
      baseRevenue = (baseRevenue + comparableAvg) / 2;
    }
    
    // Apply factor adjustments
    const totalFactorWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    const adjustmentMultiplier = 1 + (totalFactorWeight / 200); // Scale factor
    const adjustedRevenue = baseRevenue * Math.max(0.1, adjustmentMultiplier);
    
    // Calculate confidence based on data quality
    let confidence = 50; // Base confidence
    if (categoryPattern && categoryPattern.sampleSize >= 10) confidence += 20;
    if (comparables.length >= 3) confidence += 15;
    if (factors.filter(f => f.impact === 'positive').length > 2) confidence += 10;
    confidence = Math.min(95, confidence);
    
    // Calculate range
    const stdDev = categoryPattern?.stdDeviation || adjustedRevenue * 0.5;
    
    const prediction: RevenuePrediction = {
      articleId: article.id,
      predictedRevenue: {
        low: Math.max(0, adjustedRevenue - stdDev),
        expected: adjustedRevenue,
        high: adjustedRevenue + stdDev,
      },
      confidence,
      factors,
      comparableArticles: comparables,
      timeframe: {
        days30: adjustedRevenue * 0.3,  // 30% in first month
        days90: adjustedRevenue * 0.7,  // 70% in first quarter
        days365: adjustedRevenue,        // Full estimate in first year
      },
      model: useML ? 'ml' : 'historical',
      createdAt: new Date(),
    };

    logger.info('Revenue prediction generated', {
      articleId: article.id,
      predicted: adjustedRevenue,
      confidence,
    });

    return prediction;
  } catch (error) {
    logger.error('Error in predictRevenue', { error, articleId: article?.id });
    
    // Return safe default prediction
    return {
      articleId: article?.id,
      predictedRevenue: { low: 0, expected: 0, high: 0 },
      confidence: 0,
      factors: [],
      comparableArticles: [],
      timeframe: { days30: 0, days90: 0, days365: 0 },
      model: 'historical',
      createdAt: new Date(),
    };
  }
}

/**
 * Batch prediction for multiple articles
 */
export async function predictRevenueForArticles(
  articleIds: string[]
): Promise<Map<string, RevenuePrediction>> {
  const predictions = new Map<string, RevenuePrediction>();
  
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        content,
        slug,
        categories(name, slug),
        authors(expertise_score)
      `)
      .in('id', articleIds);

    if (error) throw error;

    for (const article of articles || []) {
      const prediction = await predictRevenue(article);
      predictions.set(article.id, prediction);
    }
  } catch (error) {
    logger.error('Error in batch prediction', { error });
  }

  return predictions;
}

/**
 * Track prediction accuracy for model improvement
 */
export async function trackPredictionAccuracy(
  predictionId: string,
  articleId: string,
  predictedRevenue: number,
  actualRevenue: number
): Promise<void> {
  try {
    const accuracy = actualRevenue > 0 
      ? Math.max(0, 100 - Math.abs((predictedRevenue - actualRevenue) / actualRevenue * 100))
      : predictedRevenue === 0 ? 100 : 0;

    await supabase.from('revenue_prediction_accuracy').insert({
      prediction_id: predictionId,
      article_id: articleId,
      predicted_revenue: predictedRevenue,
      actual_revenue: actualRevenue,
      accuracy_score: accuracy,
      created_at: new Date().toISOString(),
    });

    logger.info('Prediction accuracy tracked', {
      articleId,
      predicted: predictedRevenue,
      actual: actualRevenue,
      accuracy: accuracy.toFixed(1),
    });
  } catch (error) {
    logger.error('Error tracking prediction accuracy', { error });
  }
}

/**
 * Get model accuracy statistics
 */
export async function getModelAccuracyStats(): Promise<{
  overallAccuracy: number;
  predictions: number;
  byCategory: Record<string, number>;
  trend: { date: string; accuracy: number }[];
}> {
  try {
    const { data, error } = await supabase
      .from('revenue_prediction_accuracy')
      .select(`
        accuracy_score,
        created_at,
        articles(categories(name))
      `)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    const records = data || [];
    const overallAccuracy = records.length > 0
      ? records.reduce((sum, r) => sum + r.accuracy_score, 0) / records.length
      : 0;

    // Group by category
    const byCategory: Record<string, number[]> = {};
    records.forEach((r: any) => {
      const category = r.articles?.categories?.name || 'Unknown';
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(r.accuracy_score);
    });

    const categoryAvgs: Record<string, number> = {};
    for (const [cat, scores] of Object.entries(byCategory)) {
      categoryAvgs[cat] = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    // Calculate trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentRecords = records.filter(
      r => new Date(r.created_at) >= thirtyDaysAgo
    );

    const trend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = recentRecords.filter(
        r => r.created_at.split('T')[0] === dateStr
      );
      return {
        date: dateStr,
        accuracy: dayRecords.length > 0
          ? dayRecords.reduce((sum, r) => sum + r.accuracy_score, 0) / dayRecords.length
          : 0,
      };
    }).reverse();

    return {
      overallAccuracy,
      predictions: records.length,
      byCategory: categoryAvgs,
      trend,
    };
  } catch (error) {
    logger.error('Error getting accuracy stats', { error });
    return {
      overallAccuracy: 0,
      predictions: 0,
      byCategory: {},
      trend: [],
    };
  }
}

export default {
  predictRevenue,
  predictRevenueForArticles,
  extractArticleFeatures,
  getHistoricalPatterns,
  findComparableArticles,
  trackPredictionAccuracy,
  getModelAccuracyStats,
};
