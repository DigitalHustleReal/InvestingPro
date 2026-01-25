/**
 * Performance Learner
 * 
 * Purpose: Learn from high-performing content to predict performance of new articles.
 * Analyzes patterns in top articles and uses them to score drafts.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type {
  ContentPattern,
  PatternData,
  PatternType,
  PredictionFactors,
  PredictionResult,
  ArticleDraft,
  LearnedPattern,
  PatternExtractionOptions,
  PredictionOptions,
} from '@/types/intelligence';
import { createHash } from 'crypto';

// ============================================
// PERFORMANCE LEARNER CLASS
// ============================================

export class PerformanceLearner {
  private supabase = createClient();
  private patternCache: Map<string, ContentPattern[]> = new Map();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour
  private lastCacheUpdate = 0;

  // ============================================
  // PATTERN EXTRACTION
  // ============================================

  /**
   * Extract winning patterns from top-performing articles
   */
  async extractWinningPatterns(
    category?: string,
    options: PatternExtractionOptions = {}
  ): Promise<LearnedPattern[]> {
    const {
      min_sample_size = 10,
      min_confidence = 0.5,
      time_range_days = 90,
      include_patterns,
      exclude_patterns,
    } = options;

    try {
      // Get top 10% articles by quality_score
      const { data: articles, error } = await this.supabase
        .from('articles')
        .select('id, title, content, category, quality_score, word_count, created_at')
        .eq('status', 'published')
        .gte('quality_score', 70) // Top performers have score >= 70
        .gte('created_at', new Date(Date.now() - time_range_days * 24 * 60 * 60 * 1000).toISOString())
        .order('quality_score', { ascending: false })
        .limit(100);

      if (error) {
        logger.error('Error fetching top articles', error);
        return [];
      }

      if (!articles || articles.length < min_sample_size) {
        logger.warn(`Not enough articles for pattern extraction. Found: ${articles?.length || 0}`);
        return [];
      }

      // Filter by category if specified
      const filteredArticles = category
        ? articles.filter(a => a.category === category)
        : articles;

      if (filteredArticles.length < min_sample_size) {
        logger.warn(`Not enough articles in category ${category}`);
        return [];
      }

      // Extract patterns
      const patterns: LearnedPattern[] = [];

      // Length patterns
      const lengthPattern = this.extractLengthPattern(filteredArticles);
      if (lengthPattern && (!include_patterns || include_patterns.includes('length'))) {
        patterns.push(lengthPattern);
      }

      // Headline patterns
      const headlinePatterns = this.extractHeadlinePatterns(filteredArticles);
      for (const pattern of headlinePatterns) {
        if (!exclude_patterns?.includes('headline')) {
          patterns.push(pattern);
        }
      }

      // Structure patterns
      const structurePatterns = this.extractStructurePatterns(filteredArticles);
      for (const pattern of structurePatterns) {
        if (!exclude_patterns?.includes('structure')) {
          patterns.push(pattern);
        }
      }

      // CTA patterns
      const ctaPatterns = this.extractCTAPatterns(filteredArticles);
      for (const pattern of ctaPatterns) {
        if (!exclude_patterns?.includes('cta')) {
          patterns.push(pattern);
        }
      }

      // Store patterns in database
      await this.storePatterns(patterns, category || null, filteredArticles.length);

      logger.info(`Extracted ${patterns.length} patterns from ${filteredArticles.length} articles`);
      return patterns.filter(p => p.confidence >= min_confidence);
    } catch (error) {
      logger.error('Error extracting winning patterns', error as Error);
      return [];
    }
  }

  /**
   * Extract length-related patterns
   */
  private extractLengthPattern(articles: any[]): LearnedPattern | null {
    const wordCounts = articles
      .map(a => a.word_count || this.estimateWordCount(a.content))
      .filter(wc => wc > 0);

    if (wordCounts.length === 0) return null;

    const avgWordCount = Math.round(
      wordCounts.reduce((sum, wc) => sum + wc, 0) / wordCounts.length
    );

    const minWordCount = Math.min(...wordCounts);
    const maxWordCount = Math.max(...wordCounts);

    return {
      pattern_type: 'length',
      description: `Optimal word count: ${avgWordCount} words (range: ${minWordCount}-${maxWordCount})`,
      impact: 0.7,
      confidence: Math.min(0.9, wordCounts.length / 50),
      examples: [`Average: ${avgWordCount} words`],
    };
  }

  /**
   * Extract headline patterns
   */
  private extractHeadlinePatterns(articles: any[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];
    const titles = articles.map(a => a.title);

    // Check for numbers in titles
    const titlesWithNumbers = titles.filter(t => /\d+/.test(t)).length;
    const numberRatio = titlesWithNumbers / titles.length;

    if (numberRatio > 0.5) {
      patterns.push({
        pattern_type: 'headline',
        description: 'Headlines with numbers perform better',
        impact: 0.6,
        confidence: numberRatio,
        examples: titles.filter(t => /\d+/.test(t)).slice(0, 3),
      });
    }

    // Check for year in titles
    const currentYear = new Date().getFullYear();
    const titlesWithYear = titles.filter(t => 
      t.includes(String(currentYear)) || t.includes(String(currentYear + 1))
    ).length;
    const yearRatio = titlesWithYear / titles.length;

    if (yearRatio > 0.3) {
      patterns.push({
        pattern_type: 'headline',
        description: 'Headlines with current year perform better',
        impact: 0.5,
        confidence: yearRatio,
        examples: titles.filter(t => t.includes(String(currentYear))).slice(0, 3),
      });
    }

    // Check for question format
    const titlesWithQuestion = titles.filter(t => t.includes('?')).length;
    const questionRatio = titlesWithQuestion / titles.length;

    if (questionRatio > 0.2) {
      patterns.push({
        pattern_type: 'headline',
        description: 'Question-format headlines engage readers',
        impact: 0.4,
        confidence: questionRatio,
        examples: titles.filter(t => t.includes('?')).slice(0, 3),
      });
    }

    return patterns;
  }

  /**
   * Extract structure patterns
   */
  private extractStructurePatterns(articles: any[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];

    // Check for lists
    const articlesWithLists = articles.filter(a => 
      (a.content || '').includes('<ul>') || 
      (a.content || '').includes('<ol>') ||
      (a.content || '').match(/^\s*[-*]\s/m)
    ).length;
    const listRatio = articlesWithLists / articles.length;

    if (listRatio > 0.6) {
      patterns.push({
        pattern_type: 'structure',
        description: 'Articles with bullet points/lists perform better',
        impact: 0.8,
        confidence: listRatio,
      });
    }

    // Check for tables
    const articlesWithTables = articles.filter(a => 
      (a.content || '').includes('<table>') || 
      (a.content || '').includes('|---|')
    ).length;
    const tableRatio = articlesWithTables / articles.length;

    if (tableRatio > 0.4) {
      patterns.push({
        pattern_type: 'structure',
        description: 'Comparison tables increase engagement',
        impact: 0.75,
        confidence: tableRatio,
      });
    }

    // Check for FAQ sections
    const articlesWithFAQ = articles.filter(a => 
      (a.content || '').toLowerCase().includes('faq') ||
      (a.content || '').toLowerCase().includes('frequently asked')
    ).length;
    const faqRatio = articlesWithFAQ / articles.length;

    if (faqRatio > 0.3) {
      patterns.push({
        pattern_type: 'structure',
        description: 'FAQ sections improve SEO and engagement',
        impact: 0.6,
        confidence: faqRatio,
      });
    }

    return patterns;
  }

  /**
   * Extract CTA patterns
   */
  private extractCTAPatterns(articles: any[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];

    // Check for multiple CTAs
    const avgCTACount = articles.reduce((sum, a) => {
      const content = a.content || '';
      const ctaMatches = (
        content.match(/apply now|compare|check eligibility|calculate|get started/gi) || []
      ).length;
      return sum + ctaMatches;
    }, 0) / articles.length;

    if (avgCTACount >= 2) {
      patterns.push({
        pattern_type: 'cta',
        description: `Multiple CTAs (avg ${Math.round(avgCTACount)}) improve conversions`,
        impact: 0.7,
        confidence: 0.8,
      });
    }

    // Check for calculator links
    const articlesWithCalculator = articles.filter(a => 
      (a.content || '').toLowerCase().includes('calculator')
    ).length;
    const calcRatio = articlesWithCalculator / articles.length;

    if (calcRatio > 0.4) {
      patterns.push({
        pattern_type: 'cta',
        description: 'Calculator links increase engagement',
        impact: 0.65,
        confidence: calcRatio,
      });
    }

    return patterns;
  }

  // ============================================
  // PERFORMANCE PREDICTION
  // ============================================

  /**
   * Predict performance of an article draft
   */
  async predictPerformance(
    draft: ArticleDraft,
    options: PredictionOptions = {}
  ): Promise<PredictionResult> {
    const {
      include_revenue = true,
      include_patterns = true,
      include_recommendations = true,
      compare_to_similar = true,
      confidence_threshold = 0.5,
    } = options;

    try {
      // Get patterns for this category
      const patterns = await this.getPatterns(draft.category);

      // Calculate pattern matches
      const { matches, misses, score: patternScore } = this.evaluatePatternMatches(draft, patterns);

      // Get category baseline
      const categoryBaseline = await this.getCategoryBaseline(draft.category);

      // Calculate keyword strength
      const keywordStrength = this.calculateKeywordStrength(draft);

      // Detect seasonal factors
      const seasonalBoost = this.calculateSeasonalBoost(draft.category);

      // Build prediction factors
      const factors: PredictionFactors = {
        pattern_matches: matches.map(m => m.pattern_type),
        pattern_misses: misses.map(m => m.pattern_type),
        pattern_score: patternScore,
        category_baseline: categoryBaseline.avgScore,
        category_avg_performance: categoryBaseline.avgPerformance,
        keyword_strength: keywordStrength,
        keyword_competition: this.estimateCompetition(draft.primary_keyword),
        competition_level: 'medium',
        seasonal_boost: seasonalBoost,
        quality_signals: {
          has_structured_data: draft.has_comparison_table || false,
          has_images: (draft.content || '').includes('<img'),
          has_video: (draft.content || '').includes('youtube') || (draft.content || '').includes('video'),
          has_calculator: draft.has_calculator || false,
          expert_reviewed: false,
        },
      };

      // Calculate predicted score
      const baseScore = categoryBaseline.avgScore;
      const patternBonus = (patternScore - 50) * 0.3; // +/- 15 points max
      const keywordBonus = keywordStrength * 10; // +10 points max
      const seasonalBonus = (seasonalBoost - 1) * 20; // Seasonal impact

      let predictedScore = Math.round(
        baseScore + patternBonus + keywordBonus + seasonalBonus
      );
      predictedScore = Math.max(0, Math.min(100, predictedScore));

      // Calculate confidence
      const confidence = this.calculateConfidence(patterns.length, matches.length, categoryBaseline.sampleSize);

      // Estimate traffic and revenue
      const predictedTraffic = Math.round(
        categoryBaseline.avgTraffic * (predictedScore / categoryBaseline.avgScore) * seasonalBoost
      );

      const predictedRevenue = include_revenue
        ? Math.round(predictedTraffic * categoryBaseline.revenuePerVisitor * 30) // Monthly
        : 0;

      // Generate recommendations
      const recommendations = include_recommendations
        ? this.generateRecommendations(draft, matches, misses)
        : [];

      // Build result
      const result: PredictionResult = {
        score: predictedScore,
        confidence,
        traffic: {
          predicted: predictedTraffic,
          range: [
            Math.round(predictedTraffic * 0.7),
            Math.round(predictedTraffic * 1.4),
          ],
        },
        revenue: {
          predicted: predictedRevenue,
          range: [
            Math.round(predictedRevenue * 0.6),
            Math.round(predictedRevenue * 1.5),
          ],
        },
        strengths: matches.map(m => m.description),
        weaknesses: misses.map(m => m.description),
        recommendations,
      };

      // Store prediction
      await this.storePrediction(draft, result, factors);

      return result;
    } catch (error) {
      logger.error('Error predicting performance', error as Error);
      return this.getDefaultPrediction();
    }
  }

  /**
   * Evaluate how well a draft matches known patterns
   */
  private evaluatePatternMatches(
    draft: ArticleDraft,
    patterns: ContentPattern[]
  ): { matches: LearnedPattern[]; misses: LearnedPattern[]; score: number } {
    const matches: LearnedPattern[] = [];
    const misses: LearnedPattern[] = [];

    for (const pattern of patterns) {
      const isMatch = this.checkPatternMatch(draft, pattern);
      const learned: LearnedPattern = {
        pattern_type: pattern.pattern_type,
        description: this.getPatternDescription(pattern),
        impact: pattern.success_correlation,
        confidence: pattern.confidence,
        category: pattern.category || undefined,
      };

      if (isMatch) {
        matches.push(learned);
      } else if (pattern.success_correlation > 0.3) {
        // Only track important misses
        misses.push(learned);
      }
    }

    // Calculate score (0-100)
    const totalWeight = patterns.reduce((sum, p) => sum + Math.abs(p.success_correlation), 0);
    const matchedWeight = matches.reduce((sum, m) => sum + m.impact, 0);
    const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 50;

    return { matches, misses, score };
  }

  /**
   * Check if a draft matches a specific pattern
   */
  private checkPatternMatch(draft: ArticleDraft, pattern: ContentPattern): boolean {
    const content = draft.content || '';
    const title = draft.title || '';
    const wordCount = this.estimateWordCount(content);

    switch (pattern.pattern_type) {
      case 'length':
        const optimalRange = pattern.pattern_data.optimal_word_range as [number, number] | undefined;
        if (optimalRange) {
          return wordCount >= optimalRange[0] && wordCount <= optimalRange[1];
        }
        const avgWordCount = pattern.pattern_data.avg_word_count as number | undefined;
        return avgWordCount ? wordCount >= avgWordCount * 0.7 && wordCount <= avgWordCount * 1.3 : true;

      case 'headline':
        if (pattern.pattern_data.headline_has_numbers) {
          return /\d+/.test(title);
        }
        if (pattern.pattern_data.headline_has_year) {
          const year = new Date().getFullYear();
          return title.includes(String(year)) || title.includes(String(year + 1));
        }
        return true;

      case 'structure':
        if (pattern.pattern_data.uses_lists) {
          return content.includes('<ul>') || content.includes('<ol>') || /^\s*[-*]\s/m.test(content);
        }
        if (pattern.pattern_data.uses_tables) {
          return content.includes('<table>') || content.includes('|---|');
        }
        return true;

      case 'cta':
        const ctaCount = (content.match(/apply now|compare|check eligibility|calculate|get started/gi) || []).length;
        const optimalCount = pattern.pattern_data.cta_count as number | undefined;
        return optimalCount ? ctaCount >= optimalCount * 0.5 : ctaCount >= 2;

      default:
        return true;
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get patterns from cache or database
   */
  private async getPatterns(category?: string): Promise<ContentPattern[]> {
    const cacheKey = category || 'all';
    
    // Check cache
    if (this.patternCache.has(cacheKey) && Date.now() - this.lastCacheUpdate < this.cacheExpiry) {
      return this.patternCache.get(cacheKey)!;
    }

    // Fetch from database
    let query = this.supabase
      .from('content_intelligence')
      .select('*')
      .eq('is_active', true)
      .gte('confidence', 0.5)
      .order('success_correlation', { ascending: false });

    if (category) {
      query = query.or(`category.is.null,category.eq.${category}`);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching patterns', error);
      return [];
    }

    const patterns = (data || []) as ContentPattern[];
    this.patternCache.set(cacheKey, patterns);
    this.lastCacheUpdate = Date.now();

    return patterns;
  }

  /**
   * Store extracted patterns in database
   */
  private async storePatterns(
    patterns: LearnedPattern[],
    category: string | null,
    sampleSize: number
  ): Promise<void> {
    try {
      for (const pattern of patterns) {
        const { error } = await this.supabase
          .from('content_intelligence')
          .upsert({
            pattern_type: pattern.pattern_type,
            pattern_data: { description: pattern.description },
            success_correlation: pattern.impact,
            confidence: pattern.confidence,
            category,
            sample_size: sampleSize,
            is_active: true,
            last_validated: new Date().toISOString(),
          }, {
            onConflict: 'pattern_type,category',
          });

        if (error) {
          logger.error(`Error storing pattern ${pattern.pattern_type}`, error);
        }
      }
    } catch (error) {
      logger.error('Error storing patterns', error as Error);
    }
  }

  /**
   * Store prediction in database
   */
  private async storePrediction(
    draft: ArticleDraft,
    result: PredictionResult,
    factors: PredictionFactors
  ): Promise<void> {
    try {
      const draftHash = this.generateDraftHash(draft);

      await this.supabase
        .from('performance_predictions')
        .insert({
          draft_hash: draftHash,
          predicted_score: result.score,
          predicted_traffic: result.traffic.predicted,
          predicted_revenue: result.revenue.predicted,
          confidence: result.confidence,
          factors,
          category: draft.category,
          model_version: 'v1.0',
        });
    } catch (error) {
      logger.error('Error storing prediction', error as Error);
    }
  }

  /**
   * Get category baseline metrics
   */
  private async getCategoryBaseline(category: string): Promise<{
    avgScore: number;
    avgPerformance: number;
    avgTraffic: number;
    revenuePerVisitor: number;
    sampleSize: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('articles')
        .select('quality_score, views')
        .eq('category', category)
        .eq('status', 'published')
        .gte('quality_score', 0);

      if (error || !data || data.length === 0) {
        return {
          avgScore: 70,
          avgPerformance: 70,
          avgTraffic: 500,
          revenuePerVisitor: 0.02,
          sampleSize: 0,
        };
      }

      const avgScore = Math.round(
        data.reduce((sum, a) => sum + (a.quality_score || 70), 0) / data.length
      );
      const avgTraffic = Math.round(
        data.reduce((sum, a) => sum + (a.views || 0), 0) / data.length
      );

      return {
        avgScore,
        avgPerformance: avgScore,
        avgTraffic: avgTraffic || 500,
        revenuePerVisitor: 0.02, // ₹0.02 per visitor default
        sampleSize: data.length,
      };
    } catch (error) {
      logger.error('Error getting category baseline', error as Error);
      return {
        avgScore: 70,
        avgPerformance: 70,
        avgTraffic: 500,
        revenuePerVisitor: 0.02,
        sampleSize: 0,
      };
    }
  }

  /**
   * Calculate keyword strength
   */
  private calculateKeywordStrength(draft: ArticleDraft): number {
    let strength = 0.5; // Base strength

    // Check if primary keyword exists
    if (draft.primary_keyword) {
      const keyword = draft.primary_keyword.toLowerCase();
      const title = draft.title.toLowerCase();
      const content = (draft.content || '').toLowerCase();

      // Keyword in title
      if (title.includes(keyword)) {
        strength += 0.15;
      }

      // Keyword in first 100 chars
      if (content.slice(0, 100).includes(keyword)) {
        strength += 0.1;
      }

      // Keyword density (1-2% is optimal)
      const wordCount = this.estimateWordCount(content);
      const keywordCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
      const density = wordCount > 0 ? keywordCount / wordCount : 0;

      if (density >= 0.01 && density <= 0.02) {
        strength += 0.15;
      } else if (density > 0.02 && density <= 0.03) {
        strength += 0.05;
      }
    }

    // Secondary keywords
    if (draft.secondary_keywords && draft.secondary_keywords.length >= 3) {
      strength += 0.1;
    }

    return Math.min(1, strength);
  }

  /**
   * Calculate seasonal boost
   */
  private calculateSeasonalBoost(category: string): number {
    const month = new Date().getMonth();

    // Category-specific seasonal boosts
    const seasonalBoosts: Record<string, Record<number, number>> = {
      'credit-cards': {
        9: 1.3,  // October - Diwali shopping
        10: 1.4, // November - Diwali
        11: 1.2, // December - Year end
      },
      'taxes': {
        0: 1.3,  // January - Tax planning
        1: 1.4,  // February - Tax season
        2: 1.5,  // March - Tax deadline
      },
      'mutual-funds': {
        0: 1.2,  // January - New year investments
        2: 1.3,  // March - Tax saving
        3: 1.2,  // April - New FY
      },
    };

    return seasonalBoosts[category]?.[month] || 1.0;
  }

  /**
   * Estimate competition level
   */
  private estimateCompetition(keyword?: string): 'low' | 'medium' | 'high' {
    if (!keyword) return 'medium';
    
    // Simple heuristic based on keyword length and common terms
    const commonTerms = ['best', 'top', 'review', 'compare', '2026', '2025'];
    const hasCommonTerm = commonTerms.some(term => keyword.toLowerCase().includes(term));
    
    if (keyword.length < 15 && hasCommonTerm) return 'high';
    if (keyword.length > 30) return 'low';
    return 'medium';
  }

  /**
   * Calculate prediction confidence
   */
  private calculateConfidence(
    totalPatterns: number,
    matchedPatterns: number,
    categoryDataSize: number
  ): number {
    // Base confidence from pattern coverage
    const patternConfidence = totalPatterns > 0 
      ? (matchedPatterns / totalPatterns) * 0.5 
      : 0.3;

    // Confidence from data availability
    const dataConfidence = Math.min(0.5, categoryDataSize / 200);

    return Math.min(0.95, patternConfidence + dataConfidence);
  }

  /**
   * Generate recommendations based on pattern analysis
   */
  private generateRecommendations(
    draft: ArticleDraft,
    matches: LearnedPattern[],
    misses: LearnedPattern[]
  ): string[] {
    const recommendations: string[] = [];

    // Recommend based on misses
    for (const miss of misses.slice(0, 3)) {
      switch (miss.pattern_type) {
        case 'length':
          recommendations.push('Consider expanding content to 1,500-2,500 words for better engagement');
          break;
        case 'headline':
          if (!(/\d+/.test(draft.title))) {
            recommendations.push('Add numbers to your headline (e.g., "Top 10" or "5 Best")');
          }
          break;
        case 'structure':
          recommendations.push('Add comparison tables or bullet lists to improve readability');
          break;
        case 'cta':
          recommendations.push('Include 2-3 clear CTAs (Apply Now, Compare, Calculate)');
          break;
      }
    }

    // General recommendations
    if (!draft.has_calculator) {
      recommendations.push('Consider linking to relevant calculators for better engagement');
    }

    if (!draft.primary_keyword) {
      recommendations.push('Define a primary keyword for better SEO optimization');
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Get pattern description
   */
  private getPatternDescription(pattern: ContentPattern): string {
    const data = pattern.pattern_data as PatternData;
    if (data.description) return data.description as string;

    switch (pattern.pattern_type) {
      case 'length':
        return `Optimal length: ${data.avg_word_count || 'N/A'} words`;
      case 'headline':
        return 'Effective headline pattern';
      case 'structure':
        return 'Content structure pattern';
      case 'cta':
        return 'Call-to-action pattern';
      default:
        return `${pattern.pattern_type} pattern`;
    }
  }

  /**
   * Estimate word count from content
   */
  private estimateWordCount(content: string): number {
    if (!content) return 0;
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    return words.length;
  }

  /**
   * Generate hash for draft identification
   */
  private generateDraftHash(draft: ArticleDraft): string {
    const content = `${draft.title}|${(draft.content || '').slice(0, 500)}`;
    return createHash('sha256').update(content).digest('hex').slice(0, 32);
  }

  /**
   * Get default prediction when unable to predict
   */
  private getDefaultPrediction(): PredictionResult {
    return {
      score: 65,
      confidence: 0.3,
      traffic: { predicted: 300, range: [100, 600] },
      revenue: { predicted: 500, range: [100, 1000] },
      strengths: [],
      weaknesses: ['Unable to analyze - using defaults'],
      recommendations: ['Ensure content follows best practices'],
    };
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const performanceLearner = new PerformanceLearner();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Extract winning patterns for a category
 */
export async function extractWinningPatterns(
  category?: string,
  options?: PatternExtractionOptions
): Promise<LearnedPattern[]> {
  return performanceLearner.extractWinningPatterns(category, options);
}

/**
 * Predict performance of an article draft
 */
export async function predictPerformance(
  draft: ArticleDraft,
  options?: PredictionOptions
): Promise<PredictionResult> {
  return performanceLearner.predictPerformance(draft, options);
}
