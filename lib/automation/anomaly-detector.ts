/**
 * Anomaly Detector
 * 
 * Purpose: Detect unusual patterns in content that may indicate:
 * - AI hallucinations
 * - Data integrity issues
 * - Content quality problems
 * - Security concerns
 * - Compliance violations
 * 
 * Flags content for human review when anomalies are detected.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type { Article } from '@/types/article';

// ============================================
// TYPES
// ============================================

export type AnomalyType =
  | 'content_length'
  | 'topic_deviation'
  | 'quality_spike'
  | 'suspicious_links'
  | 'sensitive_content'
  | 'data_inconsistency'
  | 'structural_issue'
  | 'compliance_risk'
  | 'ai_hallucination'
  | 'plagiarism_risk'
  | 'spam_patterns'
  | 'unusual_keywords';

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Anomaly {
  type: AnomalyType;
  severity: AnomalySeverity;
  message: string;
  details?: any;
  requiresReview: boolean;
  autoFixable: boolean;
  suggestedAction?: string;
}

export interface AnomalyDetectionResult {
  articleId: string;
  hasAnomalies: boolean;
  anomalyCount: number;
  criticalCount: number;
  highCount: number;
  anomalies: Anomaly[];
  overallRisk: AnomalySeverity;
  requiresHumanReview: boolean;
  timestamp: string;
}

export interface DetectorConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  enabledChecks: AnomalyType[];
  categoryOverrides: Record<string, Partial<DetectorConfig>>;
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

const DEFAULT_CONFIG: DetectorConfig = {
  enabled: true,
  sensitivity: 'medium',
  enabledChecks: [
    'content_length',
    'topic_deviation',
    'quality_spike',
    'suspicious_links',
    'sensitive_content',
    'data_inconsistency',
    'structural_issue',
    'compliance_risk',
    'ai_hallucination',
    'spam_patterns',
    'unusual_keywords',
  ],
  categoryOverrides: {
    'taxes': {
      sensitivity: 'high',
    },
    'insurance': {
      sensitivity: 'high',
    },
  },
};

// Thresholds based on sensitivity
const SENSITIVITY_THRESHOLDS = {
  low: {
    minWordCount: 200,
    maxWordCount: 15000,
    qualitySpikeThreshold: 30,
    suspiciousLinkCount: 20,
    repetitionThreshold: 5,
  },
  medium: {
    minWordCount: 500,
    maxWordCount: 10000,
    qualitySpikeThreshold: 25,
    suspiciousLinkCount: 15,
    repetitionThreshold: 4,
  },
  high: {
    minWordCount: 800,
    maxWordCount: 6000,
    qualitySpikeThreshold: 20,
    suspiciousLinkCount: 10,
    repetitionThreshold: 3,
  },
};

// ============================================
// ANOMALY DETECTOR CLASS
// ============================================

export class AnomalyDetector {
  private supabase = createClient();
  private config: DetectorConfig;

  constructor(config?: Partial<DetectorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================
  // MAIN DETECTION METHOD
  // ============================================

  /**
   * Detect anomalies in an article
   */
  async detectAnomalies(
    article: Partial<Article> & { id: string }
  ): Promise<AnomalyDetectionResult> {
    const anomalies: Anomaly[] = [];
    const timestamp = new Date().toISOString();

    if (!this.config.enabled) {
      return {
        articleId: article.id,
        hasAnomalies: false,
        anomalyCount: 0,
        criticalCount: 0,
        highCount: 0,
        anomalies: [],
        overallRisk: 'low',
        requiresHumanReview: false,
        timestamp,
      };
    }

    // Get effective config (with category overrides)
    const effectiveConfig = this.getEffectiveConfig(article.category || '');
    const thresholds = SENSITIVITY_THRESHOLDS[effectiveConfig.sensitivity];

    try {
      // Run all enabled checks
      if (effectiveConfig.enabledChecks.includes('content_length')) {
        const lengthAnomalies = this.checkContentLength(article, thresholds);
        anomalies.push(...lengthAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('topic_deviation')) {
        const topicAnomalies = await this.checkTopicDeviation(article);
        anomalies.push(...topicAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('quality_spike')) {
        const qualityAnomalies = await this.checkQualitySpike(article, thresholds);
        anomalies.push(...qualityAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('suspicious_links')) {
        const linkAnomalies = this.checkSuspiciousLinks(article, thresholds);
        anomalies.push(...linkAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('sensitive_content')) {
        const sensitiveAnomalies = this.checkSensitiveContent(article);
        anomalies.push(...sensitiveAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('data_inconsistency')) {
        const dataAnomalies = this.checkDataInconsistency(article);
        anomalies.push(...dataAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('structural_issue')) {
        const structuralAnomalies = this.checkStructuralIssues(article);
        anomalies.push(...structuralAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('compliance_risk')) {
        const complianceAnomalies = this.checkComplianceRisk(article);
        anomalies.push(...complianceAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('ai_hallucination')) {
        const hallucinationAnomalies = this.checkAIHallucination(article);
        anomalies.push(...hallucinationAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('spam_patterns')) {
        const spamAnomalies = this.checkSpamPatterns(article, thresholds);
        anomalies.push(...spamAnomalies);
      }

      if (effectiveConfig.enabledChecks.includes('unusual_keywords')) {
        const keywordAnomalies = this.checkUnusualKeywords(article);
        anomalies.push(...keywordAnomalies);
      }

      // Calculate summary
      const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
      const highCount = anomalies.filter(a => a.severity === 'high').length;
      const overallRisk = this.calculateOverallRisk(anomalies);
      const requiresHumanReview = anomalies.some(a => a.requiresReview);

      // Log detection
      await this.logDetection(article.id, anomalies.length, overallRisk);

      return {
        articleId: article.id,
        hasAnomalies: anomalies.length > 0,
        anomalyCount: anomalies.length,
        criticalCount,
        highCount,
        anomalies,
        overallRisk,
        requiresHumanReview,
        timestamp,
      };
    } catch (error) {
      logger.error('Error detecting anomalies', error as Error);
      return {
        articleId: article.id,
        hasAnomalies: true,
        anomalyCount: 1,
        criticalCount: 0,
        highCount: 1,
        anomalies: [
          {
            type: 'data_inconsistency',
            severity: 'high',
            message: 'Error during anomaly detection',
            requiresReview: true,
            autoFixable: false,
          },
        ],
        overallRisk: 'high',
        requiresHumanReview: true,
        timestamp,
      };
    }
  }

  // ============================================
  // INDIVIDUAL CHECKS
  // ============================================

  /**
   * Check content length anomalies
   */
  private checkContentLength(
    article: Partial<Article>,
    thresholds: typeof SENSITIVITY_THRESHOLDS['medium']
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = article.content || '';
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    if (wordCount < thresholds.minWordCount) {
      anomalies.push({
        type: 'content_length',
        severity: wordCount < 200 ? 'high' : 'medium',
        message: `Article too short: ${wordCount} words (minimum: ${thresholds.minWordCount})`,
        details: { wordCount, minimum: thresholds.minWordCount },
        requiresReview: wordCount < 300,
        autoFixable: false,
        suggestedAction: 'Expand content with more details, examples, or sections',
      });
    }

    if (wordCount > thresholds.maxWordCount) {
      anomalies.push({
        type: 'content_length',
        severity: 'medium',
        message: `Article unusually long: ${wordCount} words (maximum: ${thresholds.maxWordCount})`,
        details: { wordCount, maximum: thresholds.maxWordCount },
        requiresReview: false,
        autoFixable: false,
        suggestedAction: 'Consider splitting into multiple articles',
      });
    }

    return anomalies;
  }

  /**
   * Check if topic deviates from category
   */
  private async checkTopicDeviation(article: Partial<Article>): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];
    const content = (article.content || '').toLowerCase();
    const title = (article.title || '').toLowerCase();
    const category = article.category || '';

    // Category-specific keywords
    const categoryKeywords: Record<string, string[]> = {
      'credit-cards': ['credit card', 'card', 'rewards', 'cashback', 'annual fee', 'credit limit'],
      'mutual-funds': ['mutual fund', 'sip', 'nav', 'amc', 'fund manager', 'portfolio', 'returns'],
      'loans': ['loan', 'emi', 'interest rate', 'principal', 'tenure', 'processing fee'],
      'insurance': ['insurance', 'premium', 'cover', 'claim', 'policy', 'sum assured'],
      'taxes': ['tax', 'income tax', 'gst', 'deduction', 'section 80', 'itr'],
    };

    const expectedKeywords = categoryKeywords[category] || [];
    if (expectedKeywords.length === 0) return anomalies;

    // Check if article contains category-specific keywords
    const matchedKeywords = expectedKeywords.filter(
      kw => content.includes(kw) || title.includes(kw)
    );

    if (matchedKeywords.length === 0) {
      anomalies.push({
        type: 'topic_deviation',
        severity: 'high',
        message: `Article may not match category "${category}" - no relevant keywords found`,
        details: { category, expectedKeywords, matchedKeywords },
        requiresReview: true,
        autoFixable: false,
        suggestedAction: 'Verify article is in correct category',
      });
    } else if (matchedKeywords.length < 2) {
      anomalies.push({
        type: 'topic_deviation',
        severity: 'low',
        message: `Article has limited category-specific content`,
        details: { category, matchedKeywords },
        requiresReview: false,
        autoFixable: false,
        suggestedAction: 'Consider adding more category-relevant content',
      });
    }

    return anomalies;
  }

  /**
   * Check for unusual quality score spikes
   */
  private async checkQualitySpike(
    article: Partial<Article>,
    thresholds: typeof SENSITIVITY_THRESHOLDS['medium']
  ): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    if (!article.author_id || !article.quality_score) return anomalies;

    try {
      // Get author's average quality score
      const { data: authorArticles } = await this.supabase
        .from('articles')
        .select('quality_score')
        .eq('author_id', article.author_id)
        .not('id', 'eq', article.id);

      if (authorArticles && authorArticles.length >= 5) {
        const avgScore = authorArticles.reduce(
          (sum: any, a: any) => sum + (a.quality_score || 0),
          0
        ) / authorArticles.length;

        const scoreDiff = (article.quality_score || 0) - avgScore;

        if (scoreDiff > thresholds.qualitySpikeThreshold) {
          anomalies.push({
            type: 'quality_spike',
            severity: 'medium',
            message: `Quality score unusually high compared to author average (+${Math.round(scoreDiff)} points)`,
            details: {
              articleScore: article.quality_score,
              authorAverage: Math.round(avgScore),
              difference: Math.round(scoreDiff),
            },
            requiresReview: false,
            autoFixable: false,
            suggestedAction: 'Verify content quality is genuine',
          });
        }
      }
    } catch (error) {
      logger.error('Error checking quality spike', error as Error);
    }

    return anomalies;
  }

  /**
   * Check for suspicious links
   */
  private checkSuspiciousLinks(
    article: Partial<Article>,
    thresholds: typeof SENSITIVITY_THRESHOLDS['medium']
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = article.content || '';

    // Extract all links
    const linkRegex = /https?:\/\/[^\s<>"']+/gi;
    const links = content.match(linkRegex) || [];

    // Check link count
    if (links.length > thresholds.suspiciousLinkCount) {
      anomalies.push({
        type: 'suspicious_links',
        severity: 'medium',
        message: `High number of links: ${links.length} (threshold: ${thresholds.suspiciousLinkCount})`,
        details: { linkCount: links.length },
        requiresReview: links.length > thresholds.suspiciousLinkCount * 1.5,
        autoFixable: false,
        suggestedAction: 'Review links for relevance and remove unnecessary ones',
      });
    }

    // Check for suspicious domains
    const suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', // URL shorteners
      't.co', 'is.gd', 'buff.ly', // More shorteners
    ];

    const suspiciousLinks = links.filter(link =>
      suspiciousDomains.some(domain => link.toLowerCase().includes(domain))
    );

    if (suspiciousLinks.length > 0) {
      anomalies.push({
        type: 'suspicious_links',
        severity: 'high',
        message: `Found ${suspiciousLinks.length} shortened/suspicious URLs`,
        details: { suspiciousLinks },
        requiresReview: true,
        autoFixable: false,
        suggestedAction: 'Replace shortened URLs with full, transparent links',
      });
    }

    return anomalies;
  }

  /**
   * Check for sensitive content
   */
  private checkSensitiveContent(article: Partial<Article>): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = (article.content || '').toLowerCase();
    const title = (article.title || '').toLowerCase();
    const combined = `${title} ${content}`;

    // Sensitive patterns
    const sensitivePatterns = [
      { pattern: /(?:tax\s*evasion|evade\s*tax)/i, message: 'Potential tax evasion advice', severity: 'critical' as AnomalySeverity },
      { pattern: /(?:guaranteed\s*returns|100%\s*safe)/i, message: 'Misleading investment claims', severity: 'high' as AnomalySeverity },
      { pattern: /(?:get\s*rich\s*quick|make\s*money\s*fast)/i, message: 'Get-rich-quick language', severity: 'high' as AnomalySeverity },
      { pattern: /(?:illegal|fraud|scam)/i, message: 'Contains sensitive keywords (review context)', severity: 'medium' as AnomalySeverity },
      { pattern: /(?:insider\s*trading|market\s*manipulation)/i, message: 'Securities violation language', severity: 'critical' as AnomalySeverity },
      { pattern: /(?:ponzi|pyramid\s*scheme)/i, message: 'Ponzi/pyramid scheme reference', severity: 'critical' as AnomalySeverity },
    ];

    for (const { pattern, message, severity } of sensitivePatterns) {
      if (pattern.test(combined)) {
        anomalies.push({
          type: 'sensitive_content',
          severity,
          message,
          requiresReview: severity === 'critical' || severity === 'high',
          autoFixable: false,
          suggestedAction: 'Review content context and remove or rephrase if inappropriate',
        });
      }
    }

    return anomalies;
  }

  /**
   * Check for data inconsistencies
   */
  private checkDataInconsistency(article: Partial<Article>): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = article.content || '';

    // Check for contradictory statements about numbers/percentages
    const percentages = content.match(/(\d+(?:\.\d+)?)\s*%/g) || [];
    const uniquePercentages = new Set(percentages.map(p => parseFloat(p)));

    // Check for "best" claims with conflicting products
    const bestClaims = content.match(/best\s+(?:credit\s+)?card|top\s+(?:credit\s+)?card|#1\s+(?:credit\s+)?card/gi) || [];
    if (bestClaims.length > 3) {
      anomalies.push({
        type: 'data_inconsistency',
        severity: 'low',
        message: `Multiple "best" claims found (${bestClaims.length}) - may confuse readers`,
        requiresReview: false,
        autoFixable: false,
        suggestedAction: 'Clarify ranking criteria for each "best" claim',
      });
    }

    // Check for missing required fields
    if (!article.seo_title && !article.title) {
      anomalies.push({
        type: 'data_inconsistency',
        severity: 'high',
        message: 'Article missing title',
        requiresReview: true,
        autoFixable: false,
      });
    }

    if (!article.category) {
      anomalies.push({
        type: 'data_inconsistency',
        severity: 'high',
        message: 'Article missing category',
        requiresReview: true,
        autoFixable: false,
      });
    }

    return anomalies;
  }

  /**
   * Check for structural issues
   */
  private checkStructuralIssues(article: Partial<Article>): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = article.content || '';

    // Check for headings
    const h2Count = (content.match(/<h2>|##\s/gi) || []).length;
    if (content.length > 3000 && h2Count === 0) {
      anomalies.push({
        type: 'structural_issue',
        severity: 'medium',
        message: 'Long article without section headings',
        requiresReview: false,
        autoFixable: true,
        suggestedAction: 'Add H2 headings to break up content',
      });
    }

    // Check for empty content blocks
    const emptyBlocks = content.match(/<p>\s*<\/p>|<div>\s*<\/div>/gi) || [];
    if (emptyBlocks.length > 2) {
      anomalies.push({
        type: 'structural_issue',
        severity: 'low',
        message: `Found ${emptyBlocks.length} empty content blocks`,
        requiresReview: false,
        autoFixable: true,
        suggestedAction: 'Remove empty paragraphs/divs',
      });
    }

    // Check for broken HTML
    const openTags = (content.match(/<[^/][^>]*>/g) || []).length;
    const closeTags = (content.match(/<\/[^>]+>/g) || []).length;
    if (Math.abs(openTags - closeTags) > 5) {
      anomalies.push({
        type: 'structural_issue',
        severity: 'medium',
        message: 'Potentially malformed HTML (tag mismatch)',
        details: { openTags, closeTags },
        requiresReview: false,
        autoFixable: true,
        suggestedAction: 'Review and fix HTML structure',
      });
    }

    return anomalies;
  }

  /**
   * Check for compliance risks
   */
  private checkComplianceRisk(article: Partial<Article>): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = (article.content || '').toLowerCase();
    const category = article.category || '';

    // Financial categories require disclaimers
    const financialCategories = ['credit-cards', 'mutual-funds', 'insurance', 'loans', 'taxes'];
    if (financialCategories.includes(category)) {
      // Check for SEBI/RBI/IRDAI compliance
      const hasDisclaimer = 
        content.includes('disclaimer') ||
        content.includes('terms and conditions') ||
        content.includes('subject to market risk') ||
        content.includes('past performance');

      if (!hasDisclaimer && content.length > 1000) {
        anomalies.push({
          type: 'compliance_risk',
          severity: 'medium',
          message: 'Financial content missing standard disclaimer',
          requiresReview: category === 'taxes',
          autoFixable: true,
          suggestedAction: 'Add appropriate financial disclaimer',
        });
      }

      // Check for specific regulatory mentions when needed
      if (category === 'mutual-funds' && !content.includes('sebi')) {
        anomalies.push({
          type: 'compliance_risk',
          severity: 'low',
          message: 'Mutual fund content should reference SEBI regulations',
          requiresReview: false,
          autoFixable: true,
        });
      }
    }

    return anomalies;
  }

  /**
   * Check for potential AI hallucinations
   */
  private checkAIHallucination(article: Partial<Article>): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = article.content || '';

    // Check for overly specific numbers that might be fabricated
    const specificNumbers = content.match(/\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\s*(?:crore|lakh|thousand|%)/gi) || [];
    
    // Check for suspicious date patterns (future dates or very specific historical dates)
    const currentYear = new Date().getFullYear();
    const futureYearRegex = new RegExp(`\\b(${currentYear + 2}|${currentYear + 3}|${currentYear + 4})\\b`, 'g');
    const futureYears = content.match(futureYearRegex) || [];

    if (futureYears.length > 0) {
      anomalies.push({
        type: 'ai_hallucination',
        severity: 'medium',
        message: `Content references future years: ${futureYears.join(', ')}`,
        details: { futureYears },
        requiresReview: true,
        autoFixable: false,
        suggestedAction: 'Verify date references are accurate',
      });
    }

    // Check for repetitive phrases that might indicate AI loop
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const sentenceSet = new Set<string>();
    const duplicates: string[] = [];

    for (const sentence of sentences) {
      const normalized = sentence.trim().toLowerCase();
      if (sentenceSet.has(normalized)) {
        duplicates.push(normalized.slice(0, 50));
      }
      sentenceSet.add(normalized);
    }

    if (duplicates.length > 2) {
      anomalies.push({
        type: 'ai_hallucination',
        severity: 'high',
        message: `Found ${duplicates.length} repeated sentences - possible AI generation issue`,
        details: { duplicateCount: duplicates.length },
        requiresReview: true,
        autoFixable: false,
        suggestedAction: 'Review and remove duplicate content',
      });
    }

    return anomalies;
  }

  /**
   * Check for spam patterns
   */
  private checkSpamPatterns(
    article: Partial<Article>,
    thresholds: typeof SENSITIVITY_THRESHOLDS['medium']
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = article.content || '';
    const title = article.title || '';

    // Check for excessive capitalization
    const capsWords = content.match(/\b[A-Z]{3,}\b/g) || [];
    if (capsWords.length > 10) {
      anomalies.push({
        type: 'spam_patterns',
        severity: 'medium',
        message: `Excessive capitalization: ${capsWords.length} all-caps words`,
        requiresReview: false,
        autoFixable: true,
        suggestedAction: 'Reduce use of all-caps text',
      });
    }

    // Check for excessive exclamation marks
    const exclamations = (content.match(/!/g) || []).length;
    if (exclamations > 10) {
      anomalies.push({
        type: 'spam_patterns',
        severity: 'low',
        message: `Excessive exclamation marks: ${exclamations}`,
        requiresReview: false,
        autoFixable: true,
      });
    }

    // Check for keyword stuffing
    if (article.primary_keyword) {
      const keywordCount = (
        content.toLowerCase().match(new RegExp(article.primary_keyword.toLowerCase(), 'g')) || []
      ).length;
      const wordCount = content.split(/\s+/).length;
      const density = keywordCount / wordCount;

      if (density > 0.03) {
        // More than 3% is keyword stuffing
        anomalies.push({
          type: 'spam_patterns',
          severity: 'medium',
          message: `Potential keyword stuffing: "${article.primary_keyword}" appears ${keywordCount} times (${(density * 100).toFixed(1)}% density)`,
          details: { keyword: article.primary_keyword, count: keywordCount, density },
          requiresReview: density > 0.05,
          autoFixable: false,
          suggestedAction: 'Reduce keyword repetition for natural reading',
        });
      }
    }

    return anomalies;
  }

  /**
   * Check for unusual keywords
   */
  private checkUnusualKeywords(article: Partial<Article>): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const content = (article.content || '').toLowerCase();

    // Words that shouldn't appear in financial content
    const inappropriateWords = [
      'crypto', 'bitcoin', 'ethereum', 'nft', // Unless in crypto category
      'gambling', 'casino', 'betting',
      'xxx', 'porn', 'nude',
    ];

    const category = article.category || '';
    if (category !== 'crypto' && category !== 'investing') {
      for (const word of inappropriateWords.slice(0, 4)) {
        if (content.includes(word)) {
          anomalies.push({
            type: 'unusual_keywords',
            severity: 'medium',
            message: `Unexpected keyword "${word}" in ${category} content`,
            requiresReview: true,
            autoFixable: false,
            suggestedAction: 'Verify content relevance to category',
          });
        }
      }
    }

    // Always flag inappropriate words
    for (const word of inappropriateWords.slice(4)) {
      if (content.includes(word)) {
        anomalies.push({
          type: 'unusual_keywords',
          severity: 'critical',
          message: `Inappropriate content detected: "${word}"`,
          requiresReview: true,
          autoFixable: false,
        });
      }
    }

    return anomalies;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get effective config with category overrides
   */
  private getEffectiveConfig(category: string): DetectorConfig {
    const override = this.config.categoryOverrides[category];
    if (override) {
      return { ...this.config, ...override };
    }
    return this.config;
  }

  /**
   * Calculate overall risk level
   */
  private calculateOverallRisk(anomalies: Anomaly[]): AnomalySeverity {
    if (anomalies.some(a => a.severity === 'critical')) return 'critical';
    if (anomalies.filter(a => a.severity === 'high').length >= 2) return 'critical';
    if (anomalies.some(a => a.severity === 'high')) return 'high';
    if (anomalies.filter(a => a.severity === 'medium').length >= 3) return 'high';
    if (anomalies.some(a => a.severity === 'medium')) return 'medium';
    if (anomalies.length > 0) return 'low';
    return 'low';
  }

  /**
   * Log detection to database
   */
  private async logDetection(
    articleId: string,
    anomalyCount: number,
    overallRisk: AnomalySeverity
  ): Promise<void> {
    try {
      await this.supabase
        .from('anomaly_detections')
        .insert({
          article_id: articleId,
          anomaly_count: anomalyCount,
          overall_risk: overallRisk,
          detected_at: new Date().toISOString(),
        });
    } catch (error) {
      // Table might not exist, just log
      logger.debug('Could not log anomaly detection', { articleId });
    }
  }

  // ============================================
  // CONFIGURATION METHODS
  // ============================================

  /**
   * Update configuration
   */
  updateConfig(config: Partial<DetectorConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('Updated anomaly detector config');
  }

  /**
   * Get current configuration
   */
  getConfig(): DetectorConfig {
    return { ...this.config };
  }

  /**
   * Set sensitivity level
   */
  setSensitivity(sensitivity: 'low' | 'medium' | 'high'): void {
    this.config.sensitivity = sensitivity;
    logger.info(`Anomaly detection sensitivity set to: ${sensitivity}`);
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const anomalyDetector = new AnomalyDetector();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Detect anomalies in an article
 */
export async function detectAnomalies(
  article: Partial<Article> & { id: string }
): Promise<AnomalyDetectionResult> {
  return anomalyDetector.detectAnomalies(article);
}

/**
 * Quick check if article has critical anomalies
 */
export async function hasCriticalAnomalies(
  article: Partial<Article> & { id: string }
): Promise<boolean> {
  const result = await anomalyDetector.detectAnomalies(article);
  return result.criticalCount > 0;
}
