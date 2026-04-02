/**
 * A/B Testing Framework
 * 
 * Purpose: Test different content variations to learn what works best
 * and automatically promote winning variants.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { engagementTracker } from '@/lib/intelligence/analyzers/engagement-tracker';

export interface ABTest {
  id: string;
  name: string;
  articleId: string;
  
  // Variants
  controlVariant: ContentVariant;
  testVariant: ContentVariant;
  
  // Test configuration
  trafficSplit: number; // 0-1 (e.g., 0.5 = 50/50 split)
  minSampleSize: number;
  confidenceLevel: number; // 0-1 (e.g., 0.95 = 95% confidence)
  
  // Status
  status: 'running' | 'completed' | 'winner_promoted';
  startedAt: number;
  completedAt?: number;
  
  // Results
  winner?: 'control' | 'test';
  winnerConfidence?: number;
}

export interface ContentVariant {
  id: string;
  title?: string;
  metaDescription?: string;
  openingParagraph?: string;
  cta?: string;
  
  // Performance
  views: number;
  qualityScore: number;
  conversionRate: number;
}

export class ABTestingFramework {
  private supabase = createClient();
  private activeTests: Map<string, ABTest> = new Map();

  /**
   * Create a new A/B test
   */
  async createTest(params: {
    name: string;
    articleId: string;
    controlVariant: Partial<ContentVariant>;
    testVariant: Partial<ContentVariant>;
    trafficSplit?: number;
    minSampleSize?: number;
  }): Promise<ABTest> {
    const test: ABTest = {
      id: this.generateId(),
      name: params.name,
      articleId: params.articleId,
      controlVariant: {
        id: 'control',
        ...params.controlVariant,
        views: 0,
        qualityScore: 0,
        conversionRate: 0
      },
      testVariant: {
        id: 'test',
        ...params.testVariant,
        views: 0,
        qualityScore: 0,
        conversionRate: 0
      },
      trafficSplit: params.trafficSplit || 0.5,
      minSampleSize: params.minSampleSize || 1000,
      confidenceLevel: 0.95,
      status: 'running',
      startedAt: Date.now()
    };

    // Save to database
    await this.supabase
      .from('ab_tests')
      .insert({
        id: test.id,
        name: test.name,
        article_id: test.articleId,
        control_variant: test.controlVariant,
        test_variant: test.testVariant,
        traffic_split: test.trafficSplit,
        min_sample_size: test.minSampleSize,
        confidence_level: test.confidenceLevel,
        status: test.status,
        started_at: new Date(test.startedAt).toISOString()
      });

    this.activeTests.set(test.id, test);
    logger.info(`Created A/B test: ${test.name}`);

    return test;
  }

  /**
   * Get variant for a user (assigns based on traffic split)
   */
  getVariant(testId: string, userId: string): 'control' | 'test' {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') {
      return 'control';
    }

    // Deterministic assignment based on user ID
    const hash = this.hashString(userId + testId);
    const assignment = hash % 100 / 100;

    return assignment < test.trafficSplit ? 'test' : 'control';
  }

  /**
   * Record variant view
   */
  async recordView(testId: string, variant: 'control' | 'test'): Promise<void> {
    const test = this.activeTests.get(testId);
    if (!test) return;

    if (variant === 'control') {
      test.controlVariant.views++;
    } else {
      test.testVariant.views++;
    }

    // Check if we have enough data to analyze
    const totalViews = test.controlVariant.views + test.testVariant.views;
    if (totalViews >= test.minSampleSize && totalViews % 100 === 0) {
      await this.analyzeTest(testId);
    }
  }

  /**
   * Analyze test results
   */
  async analyzeTest(testId: string): Promise<void> {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') return;

    try {
      logger.info(`Analyzing A/B test: ${test.name}`);

      // Get performance metrics for both variants
      const controlPerformance = await this.getVariantPerformance(test.articleId, 'control');
      const testPerformance = await this.getVariantPerformance(test.articleId, 'test');

      if (!controlPerformance || !testPerformance) {
        logger.warn('Insufficient data for analysis');
        return;
      }

      // Update variant scores
      test.controlVariant.qualityScore = controlPerformance.qualityScore;
      test.controlVariant.conversionRate = controlPerformance.conversionRate;
      test.testVariant.qualityScore = testPerformance.qualityScore;
      test.testVariant.conversionRate = testPerformance.conversionRate;

      // Statistical significance test (simplified)
      const { winner, confidence } = this.calculateWinner(test);

      if (confidence >= test.confidenceLevel) {
        test.winner = winner;
        test.winnerConfidence = confidence;
        test.status = 'completed';
        test.completedAt = Date.now();

        logger.info(`Test completed: ${winner} variant won with ${(confidence * 100).toFixed(1)}% confidence`);

        // Auto-promote winner
        await this.promoteWinner(test);
      }

      // Update database
      await this.supabase
        .from('ab_tests')
        .update({
          control_variant: test.controlVariant,
          test_variant: test.testVariant,
          status: test.status,
          winner: test.winner,
          winner_confidence: test.winnerConfidence,
          completed_at: test.completedAt ? new Date(test.completedAt).toISOString() : null
        })
        .eq('id', testId);

    } catch (error) {
      logger.error('Error analyzing A/B test', error as Error);
    }
  }

  /**
   * Get performance metrics for a variant
   */
  private async getVariantPerformance(articleId: string, variant: 'control' | 'test'): Promise<{
    qualityScore: number;
    conversionRate: number;
  } | null> {
    try {
      const { data } = await this.supabase
        .from('engagement_metrics')
        .select('*')
        .eq('article_id', articleId)
        .eq('variant', variant);

      if (!data || data.length === 0) return null;

      const avgQualityScore = data.reduce((sum: any, m: any) => {
        const score = (m.engaged ? 1 : 0) + (m.completed ? 0.5 : 0) - (m.bounced ? 0.5 : 0);
        return sum + Math.max(0, Math.min(1, score));
      }, 0) / data.length;

      const conversionRate = data.filter((m: any) => 
        m.calculator_used || m.affiliate_link_clicked || m.product_compared
      ).length / data.length;

      return {
        qualityScore: avgQualityScore,
        conversionRate
      };
    } catch (error) {
      logger.error('Error getting variant performance', error as Error);
      return null;
    }
  }

  /**
   * Calculate winner using statistical significance
   */
  private calculateWinner(test: ABTest): { winner: 'control' | 'test'; confidence: number } {
    const controlScore = test.controlVariant.qualityScore;
    const testScore = test.testVariant.qualityScore;
    const controlViews = test.controlVariant.views;
    const testViews = test.testVariant.views;

    // Simplified statistical test
    const diff = Math.abs(testScore - controlScore);
    const pooledStdDev = Math.sqrt(
      (controlScore * (1 - controlScore) / controlViews) +
      (testScore * (1 - testScore) / testViews)
    );

    const zScore = diff / pooledStdDev;
    
    // Convert z-score to confidence (simplified)
    const confidence = Math.min(0.99, 1 - Math.exp(-zScore * zScore / 2));

    const winner = testScore > controlScore ? 'test' : 'control';

    return { winner, confidence };
  }

  /**
   * Promote winning variant
   */
  private async promoteWinner(test: ABTest): Promise<void> {
    if (!test.winner) return;

    try {
      const winningVariant = test.winner === 'control' ? test.controlVariant : test.testVariant;

      // Update article with winning variant
      const updates: any = {};
      if (winningVariant.title) updates.title = winningVariant.title;
      if (winningVariant.metaDescription) updates.meta_description = winningVariant.metaDescription;
      if (winningVariant.openingParagraph) {
        // Update first paragraph in content
        // This would require more complex content manipulation
      }

      if (Object.keys(updates).length > 0) {
        await this.supabase
          .from('articles')
          .update(updates)
          .eq('id', test.articleId);

        test.status = 'winner_promoted';
        logger.info(`Promoted ${test.winner} variant for article ${test.articleId}`);
      }
    } catch (error) {
      logger.error('Error promoting winner', error as Error);
    }
  }

  /**
   * Helper: Generate unique ID
   */
  private generateId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper: Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get active tests
   */
  async getActiveTests(): Promise<ABTest[]> {
    try {
      const { data } = await this.supabase
        .from('ab_tests')
        .select('*')
        .eq('status', 'running');

      if (!data) return [];

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        articleId: d.article_id,
        controlVariant: d.control_variant,
        testVariant: d.test_variant,
        trafficSplit: d.traffic_split,
        minSampleSize: d.min_sample_size,
        confidenceLevel: d.confidence_level,
        status: d.status,
        startedAt: new Date(d.started_at).getTime(),
        completedAt: d.completed_at ? new Date(d.completed_at).getTime() : undefined,
        winner: d.winner,
        winnerConfidence: d.winner_confidence
      }));
    } catch (error) {
      logger.error('Error getting active tests', error as Error);
      return [];
    }
  }
}

// Singleton instance
export const abTestingFramework = new ABTestingFramework();
