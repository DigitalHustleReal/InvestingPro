/**
 * Quality Learning Engine
 * 
 * Purpose: Learn from user engagement to autonomously improve content quality.
 * Analyzes patterns in high/low performing content and updates AI prompts.
 */

import { engagementTracker, AggregatedMetrics } from '@/lib/intelligence/analyzers/engagement-tracker';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/client';
import { publishEvent, SystemEvent } from '@/lib/infrastructure/event-bus/event-bus';

interface ContentPattern {
  pattern: string;
  category: 'structure' | 'tone' | 'length' | 'formatting' | 'cta';
  impact: number; // -1 to 1
  confidence: number; // 0 to 1
  examples: string[];
}

interface ImprovementSuggestion {
  articleId: string;
  currentScore: number;
  suggestions: Array<{
    type: string;
    description: string;
    expectedImpact: number;
  }>;
}

export class QualityLearningEngine {
  private supabase = createClient();
  private learningInterval = 24 * 60 * 60 * 1000; // 24 hours
  private isRunning = false;

  /**
   * Start the learning loop
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Quality learning engine already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting quality learning engine');

    // Run learning cycle
    this.learningLoop();
  }

  /**
   * Stop the learning loop
   */
  stop(): void {
    this.isRunning = false;
    logger.info('Stopping quality learning engine');
  }

  /**
   * Main learning loop
   */
  private async learningLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        logger.info('Starting quality learning cycle');

        // 1. Analyze successful patterns
        const successPatterns = await this.analyzeSuccessPatterns();
        logger.info(`Identified ${successPatterns.length} success patterns`);

        // 2. Analyze failure patterns
        const failurePatterns = await this.analyzeFailurePatterns();
        logger.info(`Identified ${failurePatterns.length} failure patterns`);

        // 3. Update content generation prompts
        await this.updateGenerationPrompts(successPatterns, failurePatterns);

        // 4. Identify articles needing improvement
        const lowPerformers = await engagementTracker.getLowPerformers(20, 100);
        
        for (const article of lowPerformers) {
          const suggestions = await this.generateImprovements(article);
          
          if (suggestions.suggestions.length > 0) {
            // Trigger autonomous improvement
            await this.triggerImprovement(suggestions);
          }
        }

        logger.info('Quality learning cycle completed');
      } catch (error) {
        logger.error('Error in quality learning cycle', error as Error);
      }

      // Wait for next cycle
      await this.sleep(this.learningInterval);
    }
  }

  /**
   * Analyze patterns in high-performing content
   */
  private async analyzeSuccessPatterns(): Promise<ContentPattern[]> {
    const patterns: ContentPattern[] = [];

    try {
      // Get top performers
      const topPerformers = await engagementTracker.getTopPerformers(50);

      // Get article content for analysis
      const articleIds = topPerformers.map(p => p.articleId);
      const { data: articles } = await this.supabase
        .from('articles')
        .select('id, title, content, meta_description, word_count')
        .in('id', articleIds);

      if (!articles) return patterns;

      // Analyze word count patterns
      const avgWordCount = articles.reduce((sum: any, a: any) => sum + (a.word_count || 0), 0) / articles.length;
      patterns.push({
        pattern: `Optimal word count: ${Math.round(avgWordCount)} words`,
        category: 'length',
        impact: 0.7,
        confidence: 0.8,
        examples: articles.slice(0, 3).map((a: any) => a.title)
      });

      // Analyze title patterns
      const titlesWithNumbers = articles.filter((a: any) => /\d+/.test(a.title)).length;
      if (titlesWithNumbers / articles.length > 0.6) {
        patterns.push({
          pattern: 'Titles with numbers perform better',
          category: 'structure',
          impact: 0.6,
          confidence: 0.7,
          examples: articles.filter((a: any) => /\d+/.test(a.title)).slice(0, 3).map((a: any) => a.title)
        });
      }

      // Analyze content structure (looking for lists, tables, etc.)
      const articlesWithLists = articles.filter((a: any) => 
        (a.content || '').includes('<ul>') || (a.content || '').includes('<ol>')
      ).length;
      
      if (articlesWithLists / articles.length > 0.7) {
        patterns.push({
          pattern: 'Articles with lists/bullet points perform better',
          category: 'formatting',
          impact: 0.8,
          confidence: 0.85,
          examples: ['Use bullet points for key takeaways']
        });
      }

      return patterns;
    } catch (error) {
      logger.error('Error analyzing success patterns', error as Error);
      return [];
    }
  }

  /**
   * Analyze patterns in low-performing content
   */
  private async analyzeFailurePatterns(): Promise<ContentPattern[]> {
    const patterns: ContentPattern[] = [];

    try {
      const lowPerformers = await engagementTracker.getLowPerformers(50, 100);
      const articleIds = lowPerformers.map(p => p.articleId);
      
      const { data: articles } = await this.supabase
        .from('articles')
        .select('id, title, content, word_count')
        .in('id', articleIds);

      if (!articles) return patterns;

      // Analyze word count
      const avgWordCount = articles.reduce((sum: any, a: any) => sum + (a.word_count || 0), 0) / articles.length;
      
      if (avgWordCount < 800) {
        patterns.push({
          pattern: 'Articles under 800 words perform poorly',
          category: 'length',
          impact: -0.6,
          confidence: 0.75,
          examples: ['Increase content depth']
        });
      }

      // Check for missing CTAs
      const articlesWithoutCTA = articles.filter((a: any) => 
        !(a.content || '').toLowerCase().includes('calculator') &&
        !(a.content || '').toLowerCase().includes('compare')
      ).length;

      if (articlesWithoutCTA / articles.length > 0.5) {
        patterns.push({
          pattern: 'Missing clear CTAs reduces engagement',
          category: 'cta',
          impact: -0.7,
          confidence: 0.8,
          examples: ['Add calculator links', 'Include comparison tools']
        });
      }

      return patterns;
    } catch (error) {
      logger.error('Error analyzing failure patterns', error as Error);
      return [];
    }
  }

  /**
   * Update AI content generation prompts based on learned patterns
   */
  private async updateGenerationPrompts(
    successPatterns: ContentPattern[],
    failurePatterns: ContentPattern[]
  ): Promise<void> {
    try {
      // Build improved prompt instructions
      const improvements: string[] = [];

      for (const pattern of successPatterns) {
        if (pattern.confidence > 0.7) {
          improvements.push(`✓ ${pattern.pattern} (Impact: ${(pattern.impact * 100).toFixed(0)}%)`);
        }
      }

      for (const pattern of failurePatterns) {
        if (pattern.confidence > 0.7) {
          improvements.push(`✗ Avoid: ${pattern.pattern}`);
        }
      }

      // Save to database for AI to use
      await this.supabase
        .from('ai_prompt_improvements')
        .insert({
          category: 'content_quality',
          improvements: improvements,
          learned_at: new Date().toISOString(),
          confidence: successPatterns.reduce((sum, p) => sum + p.confidence, 0) / successPatterns.length
        });

      logger.info(`Updated generation prompts with ${improvements.length} improvements`);
    } catch (error) {
      logger.error('Error updating generation prompts', error as Error);
    }
  }

  /**
   * Generate improvement suggestions for an article
   */
  private async generateImprovements(metrics: AggregatedMetrics): Promise<ImprovementSuggestion> {
    const suggestions: ImprovementSuggestion = {
      articleId: metrics.articleId,
      currentScore: metrics.qualityScore,
      suggestions: []
    };

    // Analyze specific issues
    if (metrics.bounceRate > 0.6) {
      suggestions.suggestions.push({
        type: 'hook',
        description: 'High bounce rate - improve opening hook and first paragraph',
        expectedImpact: 0.15
      });
    }

    if (metrics.avgScrollDepth < 40) {
      suggestions.suggestions.push({
        type: 'structure',
        description: 'Low scroll depth - break content into smaller sections with subheadings',
        expectedImpact: 0.12
      });
    }

    if (metrics.avgTimeOnPage < 45) {
      suggestions.suggestions.push({
        type: 'engagement',
        description: 'Low time on page - add interactive elements (calculators, comparisons)',
        expectedImpact: 0.18
      });
    }

    if (metrics.conversionRate < 0.05) {
      suggestions.suggestions.push({
        type: 'cta',
        description: 'Low conversion rate - add clear CTAs and product recommendations',
        expectedImpact: 0.20
      });
    }

    return suggestions;
  }

  /**
   * Trigger autonomous content improvement
   */
  private async triggerImprovement(suggestions: ImprovementSuggestion): Promise<void> {
    logger.info(`Triggering improvement for article ${suggestions.articleId}`);

    await publishEvent(
      SystemEvent.CONTENT_UPDATE_TRIGGERED,
      {
        articleId: suggestions.articleId,
        reason: 'quality_improvement',
        currentScore: suggestions.currentScore,
        suggestions: suggestions.suggestions
      },
      'quality-learning-engine'
    );
  }

  /**
   * Helper: Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const qualityLearningEngine = new QualityLearningEngine();
