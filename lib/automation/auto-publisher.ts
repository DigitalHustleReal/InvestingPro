/**
 * Auto Publisher
 * 
 * Purpose: Automatically publish articles that meet confidence thresholds,
 * or flag them for human review if they don't.
 * 
 * Features:
 * - Confidence-based auto-publishing
 * - Exception flagging for human review
 * - Category-specific rules
 * - Audit logging
 * - Rate limiting
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { confidenceScorer, ConfidenceResult, ConfidenceThresholds } from './confidence-scorer';
import { approvalQueue } from '@/lib/intelligence/approval-queue';
import { publishEvent, SystemEvent } from '@/lib/infrastructure/event-bus/event-bus';
import type { Article } from '@/types/article';

// ============================================
// TYPES
// ============================================

export interface AutoPublishResult {
  articleId: string;
  action: 'published' | 'queued_for_review' | 'rejected' | 'skipped';
  reason: string;
  confidence: ConfidenceResult;
  timestamp: string;
}

export interface AutoPublishConfig {
  enabled: boolean;
  maxAutoPublishPerHour: number;
  maxAutoPublishPerDay: number;
  dryRun: boolean; // If true, don't actually publish
  notifyOnAutoPublish: boolean;
  notifyOnException: boolean;
  excludedCategories: string[];
  requireExpertReviewCategories: string[];
}

export interface AutoPublishStats {
  totalProcessed: number;
  autoPublished: number;
  queuedForReview: number;
  rejected: number;
  skipped: number;
  avgConfidence: number;
  lastProcessed: string | null;
}

// ============================================
// DEFAULT CONFIGURATION
// ============================================

const DEFAULT_CONFIG: AutoPublishConfig = {
  enabled: true,
  maxAutoPublishPerHour: 10,
  maxAutoPublishPerDay: 50,
  dryRun: false,
  notifyOnAutoPublish: true,
  notifyOnException: true,
  excludedCategories: [],
  requireExpertReviewCategories: ['taxes', 'legal'],
};

// ============================================
// AUTO PUBLISHER CLASS
// ============================================

export class AutoPublisher {
  private supabase = createClient();
  private config: AutoPublishConfig;
  private publishedThisHour = 0;
  private publishedToday = 0;
  private hourStartTime = Date.now();
  private dayStartTime = Date.now();

  constructor(config?: Partial<AutoPublishConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================
  // MAIN PUBLISH METHODS
  // ============================================

  /**
   * Process an article for auto-publishing
   */
  async processArticle(article: Partial<Article> & { id: string }): Promise<AutoPublishResult> {
    const timestamp = new Date().toISOString();

    try {
      // Check if auto-publish is enabled
      if (!this.config.enabled) {
        return {
          articleId: article.id,
          action: 'skipped',
          reason: 'Auto-publish is disabled',
          confidence: await this.getMinimalConfidence(article),
          timestamp,
        };
      }

      // Check rate limits
      this.checkRateLimits();
      if (!this.canPublishMore()) {
        return {
          articleId: article.id,
          action: 'skipped',
          reason: 'Rate limit reached',
          confidence: await this.getMinimalConfidence(article),
          timestamp,
        };
      }

      // Check excluded categories
      if (this.config.excludedCategories.includes(article.category || '')) {
        return {
          articleId: article.id,
          action: 'queued_for_review',
          reason: `Category ${article.category} is excluded from auto-publish`,
          confidence: await this.getMinimalConfidence(article),
          timestamp,
        };
      }

      // Calculate confidence
      const confidence = await confidenceScorer.calculateConfidence(article);

      // Log the evaluation
      await this.logEvaluation(article.id, confidence);

      // Determine action based on confidence
      let action: AutoPublishResult['action'];
      let reason: string;

      if (confidence.canAutoPublish) {
        // Auto-publish
        action = this.config.dryRun ? 'skipped' : 'published';
        reason = confidence.reason;

        if (!this.config.dryRun) {
          await this.publishArticle(article, confidence);
          this.publishedThisHour++;
          this.publishedToday++;
        } else {
          reason = `[DRY RUN] Would auto-publish: ${confidence.reason}`;
        }
      } else if (confidence.score >= 60) {
        // Queue for review
        action = 'queued_for_review';
        reason = confidence.reason;
        await this.queueForReview(article, confidence);
      } else {
        // Reject
        action = 'rejected';
        reason = `Score too low (${confidence.score}/100): ${confidence.reason}`;
        await this.handleRejection(article, confidence);
      }

      // Notify if configured
      if (action === 'published' && this.config.notifyOnAutoPublish) {
        await this.notifyAutoPublish(article, confidence);
      }
      if (action === 'queued_for_review' && this.config.notifyOnException) {
        await this.notifyException(article, confidence);
      }

      return {
        articleId: article.id,
        action,
        reason,
        confidence,
        timestamp,
      };
    } catch (error) {
      logger.error('Error processing article for auto-publish', error as Error);
      return {
        articleId: article.id,
        action: 'skipped',
        reason: `Error: ${(error as Error).message}`,
        confidence: await this.getMinimalConfidence(article),
        timestamp,
      };
    }
  }

  /**
   * Process multiple articles
   */
  async processArticles(articles: (Partial<Article> & { id: string })[]): Promise<AutoPublishResult[]> {
    const results: AutoPublishResult[] = [];

    for (const article of articles) {
      const result = await this.processArticle(article);
      results.push(result);

      // Stop if rate limit reached
      if (!this.canPublishMore()) {
        logger.warn('Rate limit reached, stopping batch processing');
        break;
      }
    }

    return results;
  }

  /**
   * Process pending articles from database
   */
  async processPendingArticles(limit: number = 20): Promise<AutoPublishResult[]> {
    try {
      // Get articles in review status that haven't been processed
      const { data: articles, error } = await this.supabase
        .from('articles')
        .select('*')
        .eq('status', 'review')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        logger.error('Error fetching pending articles', error);
        return [];
      }

      if (!articles || articles.length === 0) {
        return [];
      }

      return this.processArticles(articles);
    } catch (error) {
      logger.error('Error processing pending articles', error as Error);
      return [];
    }
  }

  // ============================================
  // PUBLISH ACTIONS
  // ============================================

  /**
   * Actually publish the article
   */
  private async publishArticle(
    article: Partial<Article> & { id: string },
    confidence: ConfidenceResult
  ): Promise<void> {
    try {
      // Update article status
      const { error } = await this.supabase
        .from('articles')
        .update({
          status: 'published',
          published_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', article.id);

      if (error) throw error;

      // Publish event
      await publishEvent(
        SystemEvent.ARTICLE_PUBLISHED,
        {
          articleId: article.id,
          title: article.title,
          autoPublished: true,
          confidence: confidence.score,
          confidenceLevel: confidence.confidence,
        },
        'auto-publisher'
      );

      // Log audit
      await this.logAudit(article.id, 'auto_published', {
        confidence_score: confidence.score,
        confidence_level: confidence.confidence,
        factors: confidence.factors,
      });

      logger.info(`Auto-published article: ${article.id}`, {
        title: article.title,
        confidence: confidence.score,
      });
    } catch (error) {
      logger.error('Error publishing article', error as Error);
      throw error;
    }
  }

  /**
   * Queue article for human review
   */
  private async queueForReview(
    article: Partial<Article> & { id: string },
    confidence: ConfidenceResult
  ): Promise<void> {
    try {
      // Determine priority based on confidence
      let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
      if (confidence.score >= 80) priority = 'low';
      else if (confidence.score >= 70) priority = 'medium';
      else if (confidence.score >= 60) priority = 'high';
      else priority = 'urgent';

      // Add to approval queue
      await approvalQueue.addToQueue({
        type: 'content_creation',
        title: `Review: ${article.title}`,
        description: `Article needs human review before publishing`,
        reason: confidence.reason,
        data: {
          articleId: article.id,
          article: article,
        },
        aiConfidence: confidence.confidence * 100,
        qualityScore: confidence.score,
        priority,
        metadata: {
          flags: confidence.flags,
          factors: confidence.factors,
          recommendations: confidence.recommendations,
        },
      });

      // Log audit
      await this.logAudit(article.id, 'queued_for_review', {
        confidence_score: confidence.score,
        reason: confidence.reason,
        flags: confidence.flags.map(f => f.code),
      });

      logger.info(`Queued article for review: ${article.id}`, {
        title: article.title,
        confidence: confidence.score,
        priority,
      });
    } catch (error) {
      logger.error('Error queuing article for review', error as Error);
      throw error;
    }
  }

  /**
   * Handle rejected article
   */
  private async handleRejection(
    article: Partial<Article> & { id: string },
    confidence: ConfidenceResult
  ): Promise<void> {
    try {
      // Update article status to draft with notes
      const { error } = await this.supabase
        .from('articles')
        .update({
          status: 'draft',
          editorial_notes: {
            auto_publish_rejected: true,
            rejection_reason: confidence.reason,
            rejection_date: new Date().toISOString(),
            confidence_score: confidence.score,
            recommendations: confidence.recommendations,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', article.id);

      if (error) throw error;

      // Log audit
      await this.logAudit(article.id, 'rejected', {
        confidence_score: confidence.score,
        reason: confidence.reason,
        recommendations: confidence.recommendations,
      });

      logger.info(`Rejected article: ${article.id}`, {
        title: article.title,
        confidence: confidence.score,
        reason: confidence.reason,
      });
    } catch (error) {
      logger.error('Error handling rejection', error as Error);
    }
  }

  // ============================================
  // NOTIFICATION METHODS
  // ============================================

  /**
   * Notify about auto-publish
   */
  private async notifyAutoPublish(
    article: Partial<Article> & { id: string },
    confidence: ConfidenceResult
  ): Promise<void> {
    await publishEvent(
      SystemEvent.NOTIFICATION,
      {
        type: 'auto_publish',
        title: 'Article Auto-Published',
        message: `"${article.title}" was auto-published with ${confidence.score}% confidence`,
        articleId: article.id,
        confidence: confidence.score,
      },
      'auto-publisher'
    );
  }

  /**
   * Notify about exception requiring review
   */
  private async notifyException(
    article: Partial<Article> & { id: string },
    confidence: ConfidenceResult
  ): Promise<void> {
    await publishEvent(
      SystemEvent.NOTIFICATION,
      {
        type: 'review_required',
        title: 'Article Needs Review',
        message: `"${article.title}" requires manual review: ${confidence.reason}`,
        articleId: article.id,
        confidence: confidence.score,
        flags: confidence.flags.map(f => f.code),
      },
      'auto-publisher'
    );
  }

  // ============================================
  // RATE LIMITING
  // ============================================

  /**
   * Check and reset rate limit counters
   */
  private checkRateLimits(): void {
    const now = Date.now();

    // Reset hourly counter
    if (now - this.hourStartTime > 60 * 60 * 1000) {
      this.publishedThisHour = 0;
      this.hourStartTime = now;
    }

    // Reset daily counter
    if (now - this.dayStartTime > 24 * 60 * 60 * 1000) {
      this.publishedToday = 0;
      this.dayStartTime = now;
    }
  }

  /**
   * Check if we can publish more
   */
  private canPublishMore(): boolean {
    return (
      this.publishedThisHour < this.config.maxAutoPublishPerHour &&
      this.publishedToday < this.config.maxAutoPublishPerDay
    );
  }

  // ============================================
  // LOGGING & AUDIT
  // ============================================

  /**
   * Log confidence evaluation
   */
  private async logEvaluation(articleId: string, confidence: ConfidenceResult): Promise<void> {
    try {
      await this.supabase
        .from('auto_publish_evaluations')
        .insert({
          article_id: articleId,
          confidence_score: confidence.score,
          confidence_level: confidence.confidence,
          can_auto_publish: confidence.canAutoPublish,
          reason: confidence.reason,
          factors: confidence.factors,
          flags: confidence.flags,
          recommendations: confidence.recommendations,
          evaluated_at: new Date().toISOString(),
        });
    } catch (error) {
      // Log to table might not exist, just log to console
      logger.debug('Could not log evaluation to database', { articleId });
    }
  }

  /**
   * Log audit trail
   */
  private async logAudit(articleId: string, action: string, metadata: any): Promise<void> {
    try {
      await this.supabase
        .from('audit_log')
        .insert({
          entity_type: 'article',
          entity_id: articleId,
          action: `auto_publish_${action}`,
          metadata,
          performed_by: 'system:auto-publisher',
          performed_at: new Date().toISOString(),
        });
    } catch (error) {
      logger.debug('Could not log audit to database', { articleId, action });
    }
  }

  // ============================================
  // STATS & CONFIGURATION
  // ============================================

  /**
   * Get auto-publish statistics
   */
  async getStats(days: number = 7): Promise<AutoPublishStats> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data } = await this.supabase
        .from('audit_log')
        .select('action, metadata, performed_at')
        .like('action', 'auto_publish_%')
        .gte('performed_at', startDate);

      if (!data || data.length === 0) {
        return {
          totalProcessed: 0,
          autoPublished: 0,
          queuedForReview: 0,
          rejected: 0,
          skipped: 0,
          avgConfidence: 0,
          lastProcessed: null,
        };
      }

      const stats: AutoPublishStats = {
        totalProcessed: data.length,
        autoPublished: data.filter((d: any) => d.action === 'auto_publish_auto_published').length,
        queuedForReview: data.filter((d: any) => d.action === 'auto_publish_queued_for_review').length,
        rejected: data.filter((d: any) => d.action === 'auto_publish_rejected').length,
        skipped: data.filter((d: any) => d.action === 'auto_publish_skipped').length,
        avgConfidence: 0,
        lastProcessed: data[0]?.performed_at || null,
      };

      // Calculate average confidence
      const confidenceScores = data
        .map((d: any) => d.metadata?.confidence_score)
        .filter((s: any) => typeof s === 'number');

      if (confidenceScores.length > 0) {
        stats.avgConfidence = Math.round(
          confidenceScores.reduce((sum: any, s: any) => sum + s, 0) / confidenceScores.length
        );
      }

      return stats;
    } catch (error) {
      logger.error('Error getting auto-publish stats', error as Error);
      return {
        totalProcessed: 0,
        autoPublished: 0,
        queuedForReview: 0,
        rejected: 0,
        skipped: 0,
        avgConfidence: 0,
        lastProcessed: null,
      };
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AutoPublishConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('Updated auto-publisher config', { config: this.config });
  }

  /**
   * Get current configuration
   */
  getConfig(): AutoPublishConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable auto-publish
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    logger.info(`Auto-publish ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Set dry run mode
   */
  setDryRun(dryRun: boolean): void {
    this.config.dryRun = dryRun;
    logger.info(`Auto-publish dry run mode ${dryRun ? 'enabled' : 'disabled'}`);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get minimal confidence result for skipped articles
   */
  private async getMinimalConfidence(
    article: Partial<Article> & { id: string }
  ): Promise<ConfidenceResult> {
    return {
      score: 0,
      confidence: 0,
      canAutoPublish: false,
      reason: 'Not evaluated',
      factors: [],
      flags: [],
      recommendations: [],
    };
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const autoPublisher = new AutoPublisher();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Process a single article for auto-publishing
 */
export async function processArticleForAutoPublish(
  article: Partial<Article> & { id: string }
): Promise<AutoPublishResult> {
  return autoPublisher.processArticle(article);
}

/**
 * Process all pending articles
 */
export async function processPendingArticles(limit?: number): Promise<AutoPublishResult[]> {
  return autoPublisher.processPendingArticles(limit);
}

/**
 * Get auto-publish statistics
 */
export async function getAutoPublishStats(days?: number): Promise<AutoPublishStats> {
  return autoPublisher.getStats(days);
}
