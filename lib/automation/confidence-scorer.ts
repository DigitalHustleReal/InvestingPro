/**
 * Confidence Scorer
 * 
 * Purpose: Calculate AI confidence scores for articles to determine
 * if they can be auto-published or need human review.
 * 
 * Confidence is based on:
 * - Quality gate scores
 * - Pattern matching with successful content
 * - Category-specific rules
 * - Content anomaly detection
 * - Historical accuracy
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type { Article } from '@/types/article';

// ============================================
// TYPES
// ============================================

export interface ConfidenceResult {
  score: number; // 0-100
  confidence: number; // 0-1 (how confident we are in the score)
  canAutoPublish: boolean;
  reason: string;
  factors: ConfidenceFactor[];
  flags: ConfidenceFlag[];
  recommendations: string[];
}

export interface ConfidenceFactor {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  contribution: number; // Weighted score contribution
  details?: string;
}

export interface ConfidenceFlag {
  type: 'warning' | 'error' | 'info';
  code: string;
  message: string;
  requiresReview: boolean;
}

export interface ConfidenceThresholds {
  autoPublishMinScore: number; // Minimum score for auto-publish
  autoPublishMinConfidence: number; // Minimum confidence for auto-publish
  reviewRequiredScore: number; // Below this, always requires review
  highConfidenceThreshold: number; // Above this, high confidence
}

export interface CategoryRule {
  category: string;
  enabled: boolean;
  minScore: number;
  minConfidence: number;
  requiresExpertReview: boolean;
  blockedTopics: string[];
  additionalChecks: string[];
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

const DEFAULT_THRESHOLDS: ConfidenceThresholds = {
  autoPublishMinScore: 85,
  autoPublishMinConfidence: 0.9,
  reviewRequiredScore: 70,
  highConfidenceThreshold: 0.85,
};

const DEFAULT_CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'credit-cards',
    enabled: true,
    minScore: 85,
    minConfidence: 0.88,
    requiresExpertReview: false,
    blockedTopics: ['illegal', 'fraud', 'scam'],
    additionalChecks: ['affiliate_links_valid', 'product_data_fresh'],
  },
  {
    category: 'mutual-funds',
    enabled: true,
    minScore: 85,
    minConfidence: 0.9,
    requiresExpertReview: false,
    blockedTopics: ['guaranteed returns', 'illegal'],
    additionalChecks: ['nav_data_fresh', 'disclaimer_present'],
  },
  {
    category: 'taxes',
    enabled: true,
    minScore: 90,
    minConfidence: 0.95,
    requiresExpertReview: true, // Tax content always needs expert review
    blockedTopics: ['tax evasion', 'illegal'],
    additionalChecks: ['regulatory_compliance', 'year_specific'],
  },
  {
    category: 'insurance',
    enabled: true,
    minScore: 85,
    minConfidence: 0.9,
    requiresExpertReview: false,
    blockedTopics: ['fraud', 'illegal claims'],
    additionalChecks: ['irdai_compliance'],
  },
  {
    category: 'loans',
    enabled: true,
    minScore: 85,
    minConfidence: 0.88,
    requiresExpertReview: false,
    blockedTopics: ['predatory lending', 'illegal'],
    additionalChecks: ['interest_rate_valid', 'rbi_compliance'],
  },
];

// Factor weights for confidence calculation
const FACTOR_WEIGHTS = {
  quality_score: 0.25,
  seo_score: 0.15,
  readability: 0.10,
  fact_check: 0.15,
  plagiarism: 0.10,
  pattern_match: 0.10,
  category_baseline: 0.10,
  historical_accuracy: 0.05,
};

// ============================================
// CONFIDENCE SCORER CLASS
// ============================================

export class ConfidenceScorer {
  private supabase = createClient();
  private thresholds: ConfidenceThresholds;
  private categoryRules: Map<string, CategoryRule>;

  constructor(
    thresholds?: Partial<ConfidenceThresholds>,
    categoryRules?: CategoryRule[]
  ) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.categoryRules = new Map(
      (categoryRules || DEFAULT_CATEGORY_RULES).map(r => [r.category, r])
    );
  }

  // ============================================
  // MAIN SCORING METHOD
  // ============================================

  /**
   * Calculate confidence score for an article
   */
  async calculateConfidence(article: Partial<Article> & { id: string }): Promise<ConfidenceResult> {
    const factors: ConfidenceFactor[] = [];
    const flags: ConfidenceFlag[] = [];
    const recommendations: string[] = [];

    try {
      // 1. Quality Score Factor
      const qualityFactor = this.evaluateQualityScore(article.quality_score);
      factors.push(qualityFactor);

      // 2. SEO Score Factor (if available)
      const seoFactor = await this.evaluateSEOScore(article);
      factors.push(seoFactor);

      // 3. Readability Factor
      const readabilityFactor = this.evaluateReadability(article);
      factors.push(readabilityFactor);

      // 4. Fact Check Factor
      const factCheckFactor = await this.evaluateFactCheck(article);
      factors.push(factCheckFactor);

      // 5. Plagiarism Factor
      const plagiarismFactor = await this.evaluatePlagiarism(article);
      factors.push(plagiarismFactor);

      // 6. Pattern Match Factor
      const patternFactor = await this.evaluatePatternMatch(article);
      factors.push(patternFactor);

      // 7. Category Baseline Factor
      const baselineFactor = await this.evaluateCategoryBaseline(article);
      factors.push(baselineFactor);

      // 8. Historical Accuracy Factor
      const historicalFactor = await this.evaluateHistoricalAccuracy(article.category || '');
      factors.push(historicalFactor);

      // Calculate weighted score
      const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
      const weightedScore = factors.reduce((sum, f) => sum + f.contribution, 0) / totalWeight;

      // Calculate confidence in the score
      const scoreConfidence = this.calculateScoreConfidence(factors);

      // Check category rules
      const categoryFlags = this.checkCategoryRules(article, weightedScore);
      flags.push(...categoryFlags);

      // Check for anomalies
      const anomalyFlags = await this.checkForAnomalies(article);
      flags.push(...anomalyFlags);

      // Determine if can auto-publish
      const categoryRule = this.categoryRules.get(article.category || '');
      const canAutoPublish = this.determineAutoPublish(
        weightedScore,
        scoreConfidence,
        flags,
        categoryRule
      );

      // Generate recommendations
      recommendations.push(...this.generateRecommendations(factors, flags));

      // Build reason
      const reason = this.buildReason(weightedScore, scoreConfidence, flags, canAutoPublish);

      return {
        score: Math.round(weightedScore),
        confidence: Math.round(scoreConfidence * 100) / 100,
        canAutoPublish,
        reason,
        factors,
        flags,
        recommendations,
      };
    } catch (error) {
      logger.error('Error calculating confidence', error as Error);
      return {
        score: 0,
        confidence: 0,
        canAutoPublish: false,
        reason: 'Error calculating confidence - requires manual review',
        factors,
        flags: [
          {
            type: 'error',
            code: 'CALCULATION_ERROR',
            message: 'Failed to calculate confidence score',
            requiresReview: true,
          },
        ],
        recommendations: ['Review article manually due to scoring error'],
      };
    }
  }

  // ============================================
  // FACTOR EVALUATION METHODS
  // ============================================

  /**
   * Evaluate quality score factor
   */
  private evaluateQualityScore(qualityScore?: number): ConfidenceFactor {
    const score = qualityScore ?? 50;
    const weight = FACTOR_WEIGHTS.quality_score;

    return {
      name: 'Quality Score',
      score,
      weight,
      contribution: score * weight,
      details: `Article quality score: ${score}/100`,
    };
  }

  /**
   * Evaluate SEO score factor
   */
  private async evaluateSEOScore(article: Partial<Article>): Promise<ConfidenceFactor> {
    let score = 70; // Default
    const weight = FACTOR_WEIGHTS.seo_score;

    // Check for SEO elements
    if (article.seo_title && article.seo_title.length >= 30 && article.seo_title.length <= 60) {
      score += 10;
    }
    if (article.seo_description && article.seo_description.length >= 120 && article.seo_description.length <= 160) {
      score += 10;
    }
    if (article.primary_keyword) {
      score += 5;
    }
    if (article.secondary_keywords && article.secondary_keywords.length >= 3) {
      score += 5;
    }

    return {
      name: 'SEO Score',
      score: Math.min(100, score),
      weight,
      contribution: Math.min(100, score) * weight,
      details: 'Based on meta title, description, and keywords',
    };
  }

  /**
   * Evaluate readability factor
   */
  private evaluateReadability(article: Partial<Article>): ConfidenceFactor {
    let score = 70; // Default
    const weight = FACTOR_WEIGHTS.readability;

    const content = article.content || '';
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    // Word count check
    if (wordCount >= 1500 && wordCount <= 3000) {
      score += 15; // Optimal length
    } else if (wordCount >= 1000 && wordCount < 1500) {
      score += 10;
    } else if (wordCount < 500) {
      score -= 20; // Too short
    }

    // Structure check (headings, lists)
    if (content.includes('<h2>') || content.includes('## ')) {
      score += 5;
    }
    if (content.includes('<ul>') || content.includes('- ')) {
      score += 5;
    }
    if (content.includes('<table>') || content.includes('|---|')) {
      score += 5;
    }

    return {
      name: 'Readability',
      score: Math.min(100, Math.max(0, score)),
      weight,
      contribution: Math.min(100, Math.max(0, score)) * weight,
      details: `Word count: ${wordCount}, Structure checks applied`,
    };
  }

  /**
   * Evaluate fact check factor
   */
  private async evaluateFactCheck(article: Partial<Article>): Promise<ConfidenceFactor> {
    const weight = FACTOR_WEIGHTS.fact_check;
    let score = 80; // Default assumption

    // Check if article has been fact-checked (from editorial_notes)
    const editorialNotes = article.editorial_notes as any;
    if (editorialNotes?.fact_checked) {
      score = editorialNotes.fact_check_score || 90;
    }

    // Verify expert reviewed
    if (article.verified_by_expert) {
      score = Math.min(100, score + 10);
    }

    return {
      name: 'Fact Check',
      score,
      weight,
      contribution: score * weight,
      details: article.verified_by_expert ? 'Expert verified' : 'Standard verification',
    };
  }

  /**
   * Evaluate plagiarism factor
   */
  private async evaluatePlagiarism(article: Partial<Article>): Promise<ConfidenceFactor> {
    const weight = FACTOR_WEIGHTS.plagiarism;
    let score = 95; // Default - assume original

    // Check editorial notes for plagiarism data
    const editorialNotes = article.editorial_notes as any;
    if (editorialNotes?.plagiarism_score) {
      score = editorialNotes.plagiarism_score;
    }

    return {
      name: 'Originality',
      score,
      weight,
      contribution: score * weight,
      details: `Plagiarism check score: ${score}%`,
    };
  }

  /**
   * Evaluate pattern match with successful content
   */
  private async evaluatePatternMatch(article: Partial<Article>): Promise<ConfidenceFactor> {
    const weight = FACTOR_WEIGHTS.pattern_match;
    let score = 70; // Default

    try {
      // Get patterns for this category
      const { data: patterns } = await this.supabase
        .from('content_intelligence')
        .select('pattern_type, success_correlation, confidence')
        .eq('is_active', true)
        .or(`category.is.null,category.eq.${article.category}`);

      if (patterns && patterns.length > 0) {
        // Check how many positive patterns are matched
        let matchedPositive = 0;
        let totalPositive = 0;

        for (const pattern of patterns) {
          if (pattern.success_correlation > 0) {
            totalPositive++;
            // Simple pattern matching (would be more sophisticated in production)
            if (this.doesMatchPattern(article, pattern)) {
              matchedPositive++;
            }
          }
        }

        if (totalPositive > 0) {
          score = Math.round((matchedPositive / totalPositive) * 100);
        }
      }
    } catch (error) {
      logger.error('Error evaluating pattern match', error as Error);
    }

    return {
      name: 'Pattern Match',
      score,
      weight,
      contribution: score * weight,
      details: 'Based on learned success patterns',
    };
  }

  /**
   * Simple pattern matching helper
   */
  private doesMatchPattern(article: Partial<Article>, pattern: any): boolean {
    const content = article.content || '';
    const title = article.title || '';

    switch (pattern.pattern_type) {
      case 'headline':
        return /\d+/.test(title) || title.includes(String(new Date().getFullYear()));
      case 'structure':
        return content.includes('<table>') || content.includes('<ul>');
      case 'length':
        const wordCount = content.split(/\s+/).length;
        return wordCount >= 1500 && wordCount <= 3000;
      case 'cta':
        return (content.match(/apply|compare|calculate|check/gi) || []).length >= 2;
      default:
        return true;
    }
  }

  /**
   * Evaluate against category baseline
   */
  private async evaluateCategoryBaseline(article: Partial<Article>): Promise<ConfidenceFactor> {
    const weight = FACTOR_WEIGHTS.category_baseline;
    let score = 75; // Default

    try {
      // Get category average quality
      const { data: categoryArticles } = await this.supabase
        .from('articles')
        .select('quality_score')
        .eq('category', article.category)
        .eq('status', 'published')
        .gte('quality_score', 0);

      if (categoryArticles && categoryArticles.length > 0) {
        const avgScore = categoryArticles.reduce((sum: any, a: any) => sum + (a.quality_score || 0), 0) / categoryArticles.length;
        const articleScore = article.quality_score || 50;

        // Score based on how this article compares to average
        if (articleScore >= avgScore * 1.2) {
          score = 95; // Above average
        } else if (articleScore >= avgScore) {
          score = 85; // At average
        } else if (articleScore >= avgScore * 0.8) {
          score = 70; // Slightly below
        } else {
          score = 50; // Well below
        }
      }
    } catch (error) {
      logger.error('Error evaluating category baseline', error as Error);
    }

    return {
      name: 'Category Comparison',
      score,
      weight,
      contribution: score * weight,
      details: `Compared to category average performance`,
    };
  }

  /**
   * Evaluate historical prediction accuracy
   */
  private async evaluateHistoricalAccuracy(category: string): Promise<ConfidenceFactor> {
    const weight = FACTOR_WEIGHTS.historical_accuracy;
    let score = 70; // Default

    try {
      // Get recent predictions and their accuracy
      const { data: predictions } = await this.supabase
        .from('performance_predictions')
        .select('prediction_accuracy')
        .eq('category', category)
        .not('prediction_accuracy', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);

      if (predictions && predictions.length > 0) {
        const avgAccuracy = predictions.reduce(
          (sum: any, p: any) => sum + (p.prediction_accuracy || 0),
          0
        ) / predictions.length;

        score = Math.round(avgAccuracy * 100);
      }
    } catch (error) {
      logger.error('Error evaluating historical accuracy', error as Error);
    }

    return {
      name: 'Historical Accuracy',
      score,
      weight,
      contribution: score * weight,
      details: 'Based on past prediction accuracy',
    };
  }

  // ============================================
  // FLAG CHECKING METHODS
  // ============================================

  /**
   * Check category-specific rules
   */
  private checkCategoryRules(
    article: Partial<Article>,
    score: number
  ): ConfidenceFlag[] {
    const flags: ConfidenceFlag[] = [];
    const categoryRule = this.categoryRules.get(article.category || '');

    if (!categoryRule) {
      flags.push({
        type: 'warning',
        code: 'UNKNOWN_CATEGORY',
        message: `No rules defined for category: ${article.category}`,
        requiresReview: true,
      });
      return flags;
    }

    // Check if category auto-publish is enabled
    if (!categoryRule.enabled) {
      flags.push({
        type: 'info',
        code: 'CATEGORY_DISABLED',
        message: `Auto-publish disabled for category: ${article.category}`,
        requiresReview: true,
      });
    }

    // Check if expert review required
    if (categoryRule.requiresExpertReview) {
      flags.push({
        type: 'warning',
        code: 'EXPERT_REVIEW_REQUIRED',
        message: `Category ${article.category} requires expert review`,
        requiresReview: true,
      });
    }

    // Check for blocked topics
    const content = (article.content || '').toLowerCase();
    const title = (article.title || '').toLowerCase();
    for (const blockedTopic of categoryRule.blockedTopics) {
      if (content.includes(blockedTopic.toLowerCase()) || title.includes(blockedTopic.toLowerCase())) {
        flags.push({
          type: 'error',
          code: 'BLOCKED_TOPIC',
          message: `Content contains blocked topic: ${blockedTopic}`,
          requiresReview: true,
        });
      }
    }

    // Check minimum score
    if (score < categoryRule.minScore) {
      flags.push({
        type: 'warning',
        code: 'BELOW_CATEGORY_THRESHOLD',
        message: `Score ${Math.round(score)} below category minimum ${categoryRule.minScore}`,
        requiresReview: true,
      });
    }

    return flags;
  }

  /**
   * Check for content anomalies
   */
  private async checkForAnomalies(article: Partial<Article>): Promise<ConfidenceFlag[]> {
    const flags: ConfidenceFlag[] = [];
    const content = article.content || '';
    const title = article.title || '';

    // Check for unusual length
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 300) {
      flags.push({
        type: 'error',
        code: 'CONTENT_TOO_SHORT',
        message: `Article too short: ${wordCount} words (minimum 500)`,
        requiresReview: true,
      });
    } else if (wordCount > 10000) {
      flags.push({
        type: 'warning',
        code: 'CONTENT_UNUSUALLY_LONG',
        message: `Article unusually long: ${wordCount} words`,
        requiresReview: false,
      });
    }

    // Check for missing essential elements
    if (!article.seo_title && !article.title) {
      flags.push({
        type: 'error',
        code: 'MISSING_TITLE',
        message: 'Article missing title',
        requiresReview: true,
      });
    }

    if (!article.seo_description && !article.excerpt) {
      flags.push({
        type: 'warning',
        code: 'MISSING_META_DESCRIPTION',
        message: 'Article missing meta description',
        requiresReview: false,
      });
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /(?:make money fast|get rich quick)/i,
      /(?:100% guaranteed|no risk)/i,
      /(?:act now|limited time|urgent)/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content) || pattern.test(title)) {
        flags.push({
          type: 'warning',
          code: 'SUSPICIOUS_CONTENT',
          message: 'Content contains potentially misleading language',
          requiresReview: true,
        });
        break;
      }
    }

    // Check for regulatory compliance (financial content)
    const financialCategories = ['credit-cards', 'mutual-funds', 'insurance', 'loans', 'taxes'];
    if (financialCategories.includes(article.category || '')) {
      if (!content.toLowerCase().includes('disclaimer') && !content.toLowerCase().includes('terms')) {
        flags.push({
          type: 'warning',
          code: 'MISSING_DISCLAIMER',
          message: 'Financial content should include disclaimer',
          requiresReview: false,
        });
      }
    }

    return flags;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Calculate confidence in the score itself
   */
  private calculateScoreConfidence(factors: ConfidenceFactor[]): number {
    // Confidence based on factor availability and scores
    let totalConfidence = 0;
    let factorCount = 0;

    for (const factor of factors) {
      if (factor.score > 0) {
        // Higher scores = higher confidence
        const factorConfidence = 0.5 + (factor.score / 200); // 0.5 to 1.0
        totalConfidence += factorConfidence * factor.weight;
        factorCount++;
      }
    }

    // Adjust for factor coverage
    const coverageBonus = Math.min(factorCount / 8, 1) * 0.2;

    return Math.min(0.98, totalConfidence + coverageBonus);
  }

  /**
   * Determine if article can be auto-published
   */
  private determineAutoPublish(
    score: number,
    confidence: number,
    flags: ConfidenceFlag[],
    categoryRule?: CategoryRule
  ): boolean {
    // Check for blocking flags
    const hasBlockingFlag = flags.some(f => f.requiresReview && f.type === 'error');
    if (hasBlockingFlag) return false;

    // Check for review-required flags
    const hasReviewFlag = flags.some(f => f.requiresReview);
    if (hasReviewFlag) return false;

    // Check thresholds
    if (score < this.thresholds.autoPublishMinScore) return false;
    if (confidence < this.thresholds.autoPublishMinConfidence) return false;

    // Check category-specific thresholds
    if (categoryRule) {
      if (!categoryRule.enabled) return false;
      if (score < categoryRule.minScore) return false;
      if (confidence < categoryRule.minConfidence) return false;
      if (categoryRule.requiresExpertReview) return false;
    }

    return true;
  }

  /**
   * Build human-readable reason
   */
  private buildReason(
    score: number,
    confidence: number,
    flags: ConfidenceFlag[],
    canAutoPublish: boolean
  ): string {
    if (canAutoPublish) {
      return `High confidence (${Math.round(confidence * 100)}%) with score ${Math.round(score)}/100 - eligible for auto-publish`;
    }

    const reasons: string[] = [];

    if (score < this.thresholds.autoPublishMinScore) {
      reasons.push(`Score ${Math.round(score)} below threshold ${this.thresholds.autoPublishMinScore}`);
    }

    if (confidence < this.thresholds.autoPublishMinConfidence) {
      reasons.push(`Confidence ${Math.round(confidence * 100)}% below threshold ${this.thresholds.autoPublishMinConfidence * 100}%`);
    }

    const errorFlags = flags.filter(f => f.type === 'error');
    if (errorFlags.length > 0) {
      reasons.push(errorFlags.map(f => f.message).join('; '));
    }

    const reviewFlags = flags.filter(f => f.requiresReview && f.type !== 'error');
    if (reviewFlags.length > 0) {
      reasons.push(`Review required: ${reviewFlags.map(f => f.code).join(', ')}`);
    }

    return reasons.join(' | ') || 'Manual review required';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    factors: ConfidenceFactor[],
    flags: ConfidenceFlag[]
  ): string[] {
    const recommendations: string[] = [];

    // Low-scoring factors
    for (const factor of factors) {
      if (factor.score < 70) {
        switch (factor.name) {
          case 'Quality Score':
            recommendations.push('Improve overall content quality through better research and writing');
            break;
          case 'SEO Score':
            recommendations.push('Add meta title, description, and primary keywords');
            break;
          case 'Readability':
            recommendations.push('Improve structure with headings, lists, and optimal length');
            break;
          case 'Pattern Match':
            recommendations.push('Review successful articles in this category for best practices');
            break;
        }
      }
    }

    // Flags
    for (const flag of flags) {
      if (flag.code === 'MISSING_DISCLAIMER') {
        recommendations.push('Add appropriate financial disclaimer');
      }
      if (flag.code === 'MISSING_META_DESCRIPTION') {
        recommendations.push('Add SEO meta description');
      }
    }

    return recommendations.slice(0, 5);
  }

  // ============================================
  // CONFIGURATION METHODS
  // ============================================

  /**
   * Update thresholds
   */
  updateThresholds(thresholds: Partial<ConfidenceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    logger.info('Updated confidence thresholds', { thresholds: this.thresholds });
  }

  /**
   * Update category rule
   */
  updateCategoryRule(rule: CategoryRule): void {
    this.categoryRules.set(rule.category, rule);
    logger.info('Updated category rule', { category: rule.category });
  }

  /**
   * Get current thresholds
   */
  getThresholds(): ConfidenceThresholds {
    return { ...this.thresholds };
  }

  /**
   * Get category rules
   */
  getCategoryRules(): CategoryRule[] {
    return Array.from(this.categoryRules.values());
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const confidenceScorer = new ConfidenceScorer();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Calculate confidence for an article
 */
export async function calculateConfidence(
  article: Partial<Article> & { id: string }
): Promise<ConfidenceResult> {
  return confidenceScorer.calculateConfidence(article);
}

/**
 * Check if article can be auto-published
 */
export async function canAutoPublish(
  article: Partial<Article> & { id: string }
): Promise<{ canPublish: boolean; reason: string }> {
  const result = await confidenceScorer.calculateConfidence(article);
  return {
    canPublish: result.canAutoPublish,
    reason: result.reason,
  };
}
