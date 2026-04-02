/**
 * Update Content Orchestrator with Approval Workflow
 */

import { eventBus, SystemEvent, publishEvent } from '@/lib/infrastructure/event-bus/event-bus';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/client';
import { automationController } from '@/lib/intelligence/automation-controller';
import { approvalQueue } from '@/lib/intelligence/approval-queue';

interface TrendSignal {
  topic: string;
  score: number;
  source: 'google_trends' | 'user_searches' | 'competitor' | 'seasonal';
  metadata?: Record<string, any>;
}

interface ContentTask {
  type: 'CREATE' | 'UPDATE' | 'OPTIMIZE';
  priority: number;
  topic: string;
  category: string;
  reason: string;
  metadata?: Record<string, any>;
}

interface ContentPlan {
  tasks: ContentTask[];
  generatedAt: number;
  validUntil: number;
}

export class AutonomousContentOrchestrator {
  private isRunning = false;
  private cycleInterval = 3600000; // 1 hour
  private supabase = createClient();

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Content orchestrator already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting autonomous content orchestrator');

    // Load automation settings
    await automationController.loadSettings();

    this.setupEventSubscriptions();
    this.autonomousLoop();
  }

  stop(): void {
    this.isRunning = false;
    logger.info('Stopping autonomous content orchestrator');
  }

  private async autonomousLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        logger.info('Starting content orchestration cycle');

        const signals = await this.analyzeTrends();
        logger.info(`Detected ${signals.length} trend signals`);

        const plan = await this.createContentPlan(signals);
        logger.info(`Generated plan with ${plan.tasks.length} tasks`);

        // Execute with approval workflow
        await this.executePlanWithApproval(plan);

        await this.monitorQuality();

        logger.info('Content orchestration cycle completed');
      } catch (error) {
        logger.error('Error in content orchestration cycle', error as Error);
      }

      await this.sleep(this.cycleInterval);
    }
  }

  /**
   * Execute plan with approval workflow
   */
  private async executePlanWithApproval(plan: ContentPlan): Promise<void> {
    const tasksToExecute = plan.tasks.slice(0, 3);

    for (const task of tasksToExecute) {
      try {
        if (task.type === 'CREATE') {
          await this.triggerContentCreationWithApproval(task);
        } else if (task.type === 'UPDATE') {
          await this.triggerContentUpdateWithApproval(task);
        }
      } catch (error) {
        logger.error(`Error executing task: ${task.type} for ${task.topic}`, error as Error);
      }
    }
  }

  /**
   * Trigger content creation with approval check
   */
  private async triggerContentCreationWithApproval(task: ContentTask): Promise<void> {
    const aiConfidence = task.priority; // Use priority as confidence score

    // Check if auto-creation is allowed
    const { allowed, reason } = await automationController.canAutoCreate(task.topic, aiConfidence);

    if (allowed) {
      // Auto-create without approval
      logger.info(`Auto-creating content for: ${task.topic}`);
      await this.executeContentCreation(task);
    } else {
      // Add to approval queue
      logger.info(`Adding to approval queue: ${task.topic} (${reason})`);
      
      await approvalQueue.addToQueue({
        type: 'content_creation',
        title: `Create article: ${task.topic}`,
        description: `AI suggests creating content about "${task.topic}"`,
        reason: reason || 'Requires manual approval',
        data: {
          topic: task.topic,
          category: task.category,
          priority: task.priority
        },
        aiConfidence,
        priority: task.priority > 0.8 ? 'high' : 'medium'
      });
    }
  }

  /**
   * Trigger content update with approval check
   */
  private async triggerContentUpdateWithApproval(task: ContentTask): Promise<void> {
    const articleId = task.metadata?.articleId;
    if (!articleId) return;

    // Get current quality score
    const { data: performance } = await this.supabase
      .from('article_performance')
      .select('quality_score')
      .eq('article_id', articleId)
      .single();

    const currentQuality = performance?.quality_score || 0;

    const { allowed, reason } = await automationController.canAutoUpdate(articleId, currentQuality);

    if (allowed) {
      logger.info(`Auto-updating content for: ${task.topic}`);
      await this.executeContentUpdate(task);
    } else {
      logger.info(`Adding update to approval queue: ${task.topic} (${reason})`);
      
      await approvalQueue.addToQueue({
        type: 'content_update',
        title: `Update article: ${task.topic}`,
        description: `AI suggests updating content (current quality: ${(currentQuality * 100).toFixed(0)}%)`,
        reason: reason || 'Requires manual approval',
        data: {
          articleId,
          topic: task.topic,
          currentQuality
        },
        aiConfidence: 0.8,
        qualityScore: currentQuality,
        priority: currentQuality < 0.3 ? 'high' : 'medium'
      });
    }
  }

  /**
   * Execute content creation (actual implementation)
   */
  private async executeContentCreation(task: ContentTask): Promise<void> {
    await publishEvent(
      SystemEvent.CONTENT_CREATION_TRIGGERED,
      {
        topic: task.topic,
        category: task.category,
        priority: task.priority,
        reason: task.reason
      },
      'content-orchestrator',
      task.metadata
    );
  }

  /**
   * Execute content update (actual implementation)
   */
  private async executeContentUpdate(task: ContentTask): Promise<void> {
    await publishEvent(
      SystemEvent.CONTENT_UPDATE_TRIGGERED,
      {
        articleId: task.metadata?.articleId,
        topic: task.topic,
        reason: task.reason
      },
      'content-orchestrator'
    );
  }

  // ... (rest of the methods remain the same as before)
  
  private async analyzeTrends(): Promise<TrendSignal[]> {
    const signals: TrendSignal[] = [];
    try {
      const userSearches = await this.analyzeUserSearches();
      signals.push(...userSearches);
      const seasonalSignals = await this.analyzeSeasonalPatterns();
      signals.push(...seasonalSignals);
      return signals.sort((a, b) => b.score - a.score);
    } catch (error) {
      logger.error('Error analyzing trends', error as Error);
      return [];
    }
  }

  private async analyzeUserSearches(): Promise<TrendSignal[]> {
    try {
      const { data: searches } = await this.supabase
        .from('search_analytics')
        .select('query, count')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('count', { ascending: false })
        .limit(20);

      if (!searches) return [];

      return searches.map((s: any) => ({
        topic: s.query,
        score: s.count / 100,
        source: 'user_searches' as const,
        metadata: { searchCount: s.count }
      }));
    } catch (error) {
      logger.error('Error analyzing user searches', error as Error);
      return [];
    }
  }

  private async analyzeSeasonalPatterns(): Promise<TrendSignal[]> {
    const now = new Date();
    const month = now.getMonth();
    const signals: TrendSignal[] = [];

    if (month >= 0 && month <= 2) {
      signals.push({
        topic: 'income tax calculator',
        score: 0.9,
        source: 'seasonal',
        metadata: { season: 'tax_season' }
      });
    }

    if (month >= 9 && month <= 10) {
      signals.push({
        topic: 'festival offers credit cards',
        score: 0.8,
        source: 'seasonal',
        metadata: { season: 'festival_season' }
      });
    }

    return signals;
  }

  private async createContentPlan(signals: TrendSignal[]): Promise<ContentPlan> {
    const tasks: ContentTask[] = [];

    for (const signal of signals.slice(0, 10)) {
      const existingContent = await this.findExistingContent(signal.topic);

      if (!existingContent) {
        tasks.push({
          type: 'CREATE',
          priority: signal.score,
          topic: signal.topic,
          category: this.inferCategory(signal.topic),
          reason: `Trending topic from ${signal.source}`,
          metadata: signal.metadata
        });
      } else if (this.isOutdated(existingContent)) {
        tasks.push({
          type: 'UPDATE',
          priority: signal.score * 0.8,
          topic: signal.topic,
          category: existingContent.category,
          reason: 'Content is outdated',
          metadata: { articleId: existingContent.id }
        });
      }
    }

    tasks.sort((a, b) => b.priority - a.priority);

    return {
      tasks,
      generatedAt: Date.now(),
      validUntil: Date.now() + this.cycleInterval
    };
  }

  private async monitorQuality(): Promise<void> {
    try {
      const { data: lowPerformers } = await this.supabase
        .from('articles')
        .select('id, title, views, avg_time_on_page')
        .lt('avg_time_on_page', 30)
        .gt('views', 100)
        .limit(5);

      if (lowPerformers) {
        for (const article of lowPerformers) {
          await publishEvent(
            SystemEvent.CONTENT_QUALITY_LOW,
            { articleId: article.id, title: article.title },
            'content-orchestrator'
          );
        }
      }
    } catch (error) {
      logger.error('Error monitoring quality', error as Error);
    }
  }

  private setupEventSubscriptions(): void {
    eventBus.subscribe(SystemEvent.RATE_UPDATED, async (payload) => {
      logger.info(`Rate updated for ${payload.data.product}, triggering content update`);
    });

    eventBus.subscribe(SystemEvent.NEW_PRODUCT_DETECTED, async (payload) => {
      logger.info(`New product detected: ${payload.data.name}, creating content`);
    });
  }

  private async findExistingContent(topic: string): Promise<any | null> {
    const { data } = await this.supabase
      .from('articles')
      .select('id, title, category, updated_at')
      .ilike('title', `%${topic}%`)
      .single();

    return data;
  }

  private isOutdated(content: any): boolean {
    const daysSinceUpdate = (Date.now() - new Date(content.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 90;
  }

  private inferCategory(topic: string): string {
    const keywords = {
      'credit-cards': ['credit card', 'cashback', 'rewards'],
      'mutual-funds': ['mutual fund', 'sip', 'investment'],
      'loans': ['loan', 'emi', 'interest rate'],
      'insurance': ['insurance', 'policy', 'coverage'],
      'tax': ['tax', 'deduction', 'exemption']
    };

    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some(term => topic.toLowerCase().includes(term))) {
        return category;
      }
    }

    return 'general';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const contentOrchestrator = new AutonomousContentOrchestrator();
