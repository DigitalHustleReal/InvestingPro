/**
 * Automation Settings & Controls
 * 
 * Purpose: Configure what gets automated vs. what requires manual approval.
 * Gives authors full control over the autonomous systems.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface AutomationSettings {
  // Content Creation
  autoCreateContent: boolean;
  autoCreateThreshold: number; // Quality score threshold (0-1)
  requireApprovalForTopics: string[]; // Topics that always need approval
  
  // Content Updates
  autoUpdateContent: boolean;
  autoUpdateThreshold: number; // Min quality score to trigger update
  requireApprovalForUpdates: boolean;
  
  // Data Synchronization
  autoSyncData: boolean;
  autoPublishDataChanges: boolean;
  
  // Quality Improvements
  autoImproveContent: boolean;
  autoImproveThreshold: number; // Max quality score to trigger improvement
  
  // A/B Testing
  autoPromoteWinners: boolean;
  requireApprovalForPromotion: boolean;
  
  // Publishing
  autoPublish: boolean;
  requireEditorialReview: boolean;
  
  // Notifications
  notifyOnAutoCreation: boolean;
  notifyOnAutoUpdate: boolean;
  notifyOnAutoImprovement: boolean;
  
  // Safety Limits
  maxAutoCreationsPerDay: number;
  maxAutoUpdatesPerDay: number;
}

export const DEFAULT_SETTINGS: AutomationSettings = {
  // Conservative defaults - require approval for most things
  autoCreateContent: true,
  autoCreateThreshold: 0.7, // Only auto-create if AI confidence > 70%
  requireApprovalForTopics: ['tax', 'legal', 'investment advice'],
  
  autoUpdateContent: true,
  autoUpdateThreshold: 0.4, // Update if quality < 40%
  requireApprovalForUpdates: true, // Always require approval for updates
  
  autoSyncData: true,
  autoPublishDataChanges: false, // Don't auto-publish data changes
  
  autoImproveContent: true,
  autoImproveThreshold: 0.5, // Improve if quality < 50%
  
  autoPromoteWinners: false, // Don't auto-promote A/B test winners
  requireApprovalForPromotion: true,
  
  autoPublish: false, // Never auto-publish without approval
  requireEditorialReview: true,
  
  notifyOnAutoCreation: true,
  notifyOnAutoUpdate: true,
  notifyOnAutoImprovement: true,
  
  maxAutoCreationsPerDay: 10,
  maxAutoUpdatesPerDay: 20
};

class AutomationController {
  private supabase = createClient();
  private settings: AutomationSettings = DEFAULT_SETTINGS;
  private dailyCounters = {
    creations: 0,
    updates: 0,
    lastReset: Date.now()
  };

  /**
   * Load settings from database
   */
  async loadSettings(): Promise<AutomationSettings> {
    try {
      const { data } = await this.supabase
        .from('automation_settings')
        .select('*')
        .single();

      if (data) {
        this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
      }

      return this.settings;
    } catch (error) {
      logger.error('Error loading automation settings', error as Error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Update settings
   */
  async updateSettings(newSettings: Partial<AutomationSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...newSettings };

      await this.supabase
        .from('automation_settings')
        .upsert({
          id: 'default',
          settings: this.settings,
          updated_at: new Date().toISOString()
        });

      logger.info('Automation settings updated');
    } catch (error) {
      logger.error('Error updating automation settings', error as Error);
    }
  }

  /**
   * Check if content creation should be automated
   */
  async canAutoCreate(topic: string, confidence: number): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    // Reset daily counters if needed
    this.resetDailyCountersIfNeeded();

    // Check if auto-creation is enabled
    if (!this.settings.autoCreateContent) {
      return { allowed: false, reason: 'Auto-creation disabled in settings' };
    }

    // Check daily limit
    if (this.dailyCounters.creations >= this.settings.maxAutoCreationsPerDay) {
      return { allowed: false, reason: 'Daily auto-creation limit reached' };
    }

    // Check confidence threshold
    if (confidence < this.settings.autoCreateThreshold) {
      return { allowed: false, reason: 'AI confidence below threshold' };
    }

    // Check if topic requires approval
    const requiresApproval = this.settings.requireApprovalForTopics.some(
      approvalTopic => topic.toLowerCase().includes(approvalTopic.toLowerCase())
    );

    if (requiresApproval) {
      return { allowed: false, reason: 'Topic requires manual approval' };
    }

    // Increment counter
    this.dailyCounters.creations++;

    return { allowed: true };
  }

  /**
   * Check if content update should be automated
   */
  async canAutoUpdate(articleId: string, currentQuality: number): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    this.resetDailyCountersIfNeeded();

    if (!this.settings.autoUpdateContent) {
      return { allowed: false, reason: 'Auto-update disabled in settings' };
    }

    if (this.dailyCounters.updates >= this.settings.maxAutoUpdatesPerDay) {
      return { allowed: false, reason: 'Daily auto-update limit reached' };
    }

    if (currentQuality > this.settings.autoUpdateThreshold) {
      return { allowed: false, reason: 'Quality above update threshold' };
    }

    if (this.settings.requireApprovalForUpdates) {
      return { allowed: false, reason: 'Updates require manual approval' };
    }

    this.dailyCounters.updates++;
    return { allowed: true };
  }

  /**
   * Check if content improvement should be automated
   */
  canAutoImprove(qualityScore: number): boolean {
    return this.settings.autoImproveContent && 
           qualityScore < this.settings.autoImproveThreshold;
  }

  /**
   * Check if A/B test winner should be auto-promoted
   */
  canAutoPromoteWinner(): boolean {
    return this.settings.autoPromoteWinners && 
           !this.settings.requireApprovalForPromotion;
  }

  /**
   * Check if content should be auto-published
   */
  canAutoPublish(): boolean {
    return this.settings.autoPublish && 
           !this.settings.requireEditorialReview;
  }

  /**
   * Reset daily counters
   */
  private resetDailyCountersIfNeeded(): void {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    if (now - this.dailyCounters.lastReset > dayInMs) {
      this.dailyCounters = {
        creations: 0,
        updates: 0,
        lastReset: now
      };
    }
  }

  /**
   * Get current settings
   */
  getSettings(): AutomationSettings {
    return { ...this.settings };
  }

  /**
   * Get daily counters
   */
  getDailyCounters() {
    this.resetDailyCountersIfNeeded();
    return { ...this.dailyCounters };
  }
}

// Singleton instance
export const automationController = new AutomationController();
