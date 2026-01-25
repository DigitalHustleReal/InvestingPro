/**
 * Intelligence Layer Types
 * 
 * Types for the Brain CMS intelligence features including:
 * - Content pattern learning
 * - Performance prediction
 * - Revenue intelligence
 */

// ============================================
// PATTERN TYPES
// ============================================

export type PatternType = 
  | 'headline'
  | 'structure'
  | 'cta'
  | 'length'
  | 'tone'
  | 'keyword_density'
  | 'formatting'
  | 'hook'
  | 'conclusion';

export type ToneType = 
  | 'professional'
  | 'casual'
  | 'expert'
  | 'friendly'
  | 'urgent'
  | 'educational';

export type CTAPosition = 
  | 'after_intro'
  | 'middle'
  | 'before_conclusion'
  | 'conclusion'
  | 'comparison_table'
  | 'after_pros_cons'
  | 'sidebar';

export type CompetitionLevel = 'low' | 'medium' | 'high';

// ============================================
// CONTENT PATTERN INTERFACES
// ============================================

/**
 * Pattern data stored in content_intelligence.pattern_data
 */
export interface PatternData {
  // Length patterns
  avg_word_count?: number;
  min_word_count?: number;
  max_word_count?: number;
  optimal_word_range?: [number, number];
  
  // Headline patterns
  headline_has_numbers?: boolean;
  headline_has_year?: boolean;
  headline_has_question?: boolean;
  headline_avg_length?: number;
  headline_power_words?: string[];
  
  // Structure patterns
  uses_lists?: boolean;
  uses_tables?: boolean;
  uses_comparison?: boolean;
  avg_section_count?: number;
  has_faq_section?: boolean;
  has_pros_cons?: boolean;
  
  // CTA patterns
  cta_position?: CTAPosition;
  cta_count?: number;
  cta_type?: 'button' | 'link' | 'card';
  
  // Tone patterns
  tone?: ToneType;
  reading_level?: number; // Grade level
  
  // Keyword patterns
  keyword_density?: number;
  keyword_in_first_100?: boolean;
  secondary_keywords_count?: number;
  
  // Engagement patterns
  avg_time_on_page?: number;
  avg_scroll_depth?: number;
  avg_bounce_rate?: number;
  
  // Custom patterns (flexible)
  [key: string]: unknown;
}

/**
 * Content pattern learned from high-performing articles
 */
export interface ContentPattern {
  id: string;
  pattern_type: PatternType;
  pattern_data: PatternData;
  success_correlation: number; // -1 to 1
  sample_size: number;
  confidence: number; // 0 to 1
  category: string | null;
  example_articles: string[];
  is_active: boolean;
  last_validated: string | null;
  validation_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Simplified pattern for display/learning
 */
export interface LearnedPattern {
  pattern_type: PatternType;
  description: string;
  impact: number; // -1 to 1
  confidence: number; // 0 to 1
  category?: string;
  examples?: string[];
}

// ============================================
// PREDICTION INTERFACES
// ============================================

/**
 * Factors that contributed to a performance prediction
 */
export interface PredictionFactors {
  // Pattern matching
  pattern_matches: string[];
  pattern_misses: string[];
  pattern_score: number; // 0 to 100
  
  // Category baseline
  category_baseline: number;
  category_avg_performance: number;
  
  // Keyword analysis
  keyword_strength: number; // 0 to 1
  keyword_competition: CompetitionLevel;
  search_volume?: number;
  
  // Competition analysis
  competition_level: CompetitionLevel;
  top_competitor_score?: number;
  
  // Seasonal factors
  seasonal_boost: number; // Multiplier, e.g., 1.2 = 20% boost
  seasonal_reason?: string;
  
  // Content quality signals
  quality_signals: {
    has_structured_data: boolean;
    has_images: boolean;
    has_video: boolean;
    has_calculator: boolean;
    expert_reviewed: boolean;
  };
  
  // Historical performance (if updating existing)
  historical_avg_score?: number;
  historical_trend?: 'improving' | 'stable' | 'declining';
}

/**
 * Actual performance data (filled after 30 days)
 */
export interface ActualPerformance {
  score: number;
  traffic: number;
  revenue: number;
  conversions: number;
  avg_time_on_page: number;
  bounce_rate: number;
  measured_at: string;
}

/**
 * Performance prediction for an article
 */
export interface PerformancePrediction {
  id: string;
  article_id: string | null;
  draft_hash: string | null;
  predicted_score: number; // 0 to 100
  predicted_traffic: number;
  predicted_revenue: number;
  confidence: number; // 0 to 1
  factors: PredictionFactors;
  actual_performance: ActualPerformance | null;
  prediction_accuracy: number | null;
  model_version: string;
  category: string | null;
  created_at: string;
  validated_at: string | null;
}

/**
 * Simplified prediction result for UI display
 */
export interface PredictionResult {
  score: number;
  confidence: number;
  traffic: {
    predicted: number;
    range: [number, number];
  };
  revenue: {
    predicted: number;
    range: [number, number];
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// ============================================
// REVENUE INTELLIGENCE INTERFACES
// ============================================

/**
 * Optimal position for affiliate link placement
 */
export interface OptimalAffiliatePosition {
  position: CTAPosition;
  product_type: string;
  expected_ctr: number;
  expected_conversions: number;
  recommended_format: 'button' | 'link' | 'card' | 'table';
  rationale: string;
}

/**
 * Revenue drivers analysis
 */
export interface RevenueDrivers {
  primary_driver: string;
  top_products: string[];
  best_cta_type: 'button' | 'link' | 'card';
  optimal_cta_count: number;
  seasonal_factor: number;
  category_multiplier: number;
  traffic_to_revenue_ratio: number;
}

/**
 * Conversion insights from historical data
 */
export interface ConversionInsights {
  avg_conversion_rate: number;
  best_converting_position: CTAPosition;
  best_converting_product: string;
  avg_commission: number;
  commission_range: [number, number];
  peak_conversion_hour?: number;
  peak_conversion_day?: string;
}

/**
 * Revenue intelligence for an article
 */
export interface RevenueIntelligence {
  id: string;
  article_id: string;
  predicted_monthly_revenue: number;
  predicted_revenue_range_min: number;
  predicted_revenue_range_max: number;
  actual_monthly_revenue: number;
  revenue_last_updated: string | null;
  optimal_affiliate_positions: OptimalAffiliatePosition[];
  revenue_drivers: RevenueDrivers;
  conversion_insights: ConversionInsights;
  prediction_confidence: number;
  created_at: string;
  updated_at: string;
}

/**
 * Simplified revenue prediction for UI
 */
export interface RevenuePrediction {
  predicted: number;
  range: {
    min: number;
    max: number;
  };
  confidence: number;
  topProducts: string[];
  optimalPositions: {
    position: string;
    expectedCTR: number;
  }[];
  recommendations: string[];
}

// ============================================
// ARTICLE DRAFT FOR PREDICTION
// ============================================

/**
 * Article draft data for prediction
 */
export interface ArticleDraft {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  primary_keyword?: string;
  secondary_keywords?: string[];
  author_id?: string;
  has_comparison_table?: boolean;
  has_calculator?: boolean;
  products_mentioned?: string[];
}

/**
 * Full prediction response combining all intelligence
 */
export interface ArticleIntelligence {
  prediction: PredictionResult;
  revenue: RevenuePrediction;
  patterns: {
    matched: LearnedPattern[];
    missing: LearnedPattern[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    expected_impact: number;
  }[];
  comparable_articles: {
    id: string;
    title: string;
    score: number;
    revenue: number;
  }[];
}

// ============================================
// LEARNING ENGINE TYPES
// ============================================

/**
 * Learning cycle result
 */
export interface LearningCycleResult {
  patterns_discovered: number;
  patterns_validated: number;
  patterns_invalidated: number;
  predictions_validated: number;
  avg_prediction_accuracy: number;
  insights: string[];
  next_cycle: string;
}

/**
 * Pattern extraction options
 */
export interface PatternExtractionOptions {
  category?: string;
  min_sample_size?: number;
  min_confidence?: number;
  time_range_days?: number;
  include_patterns?: PatternType[];
  exclude_patterns?: PatternType[];
}

/**
 * Prediction options
 */
export interface PredictionOptions {
  include_revenue?: boolean;
  include_patterns?: boolean;
  include_recommendations?: boolean;
  compare_to_similar?: boolean;
  confidence_threshold?: number;
}
