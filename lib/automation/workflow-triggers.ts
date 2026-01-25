/**
 * Workflow Triggers
 * 
 * Purpose: Define and manage workflow triggers - events that start workflows
 * 
 * Built-in triggers:
 * - article_created: When a new article is created
 * - article_updated: When an article is updated
 * - article_status_changed: When article status changes
 * - quality_passed: When article passes quality threshold
 * - quality_failed: When article fails quality check
 * - scheduled: Cron-based scheduling
 * - manual: User-initiated
 * - webhook: External webhook call
 * - scraper_completed: When a scraper finishes
 * - revenue_threshold: When revenue crosses a threshold
 */

import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export type TriggerType =
  | 'article_created'
  | 'article_updated'
  | 'article_status_changed'
  | 'quality_passed'
  | 'quality_failed'
  | 'scheduled'
  | 'manual'
  | 'webhook'
  | 'scraper_completed'
  | 'revenue_threshold';

export interface TriggerConfig {
  [key: string]: any;
}

export interface TriggerContext {
  triggerId: string;
  triggerType: TriggerType;
  timestamp: string;
  data: Record<string, any>;
  source?: string;
}

export interface TriggerDefinition {
  type: TriggerType;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'quality' | 'schedule' | 'external' | 'revenue';
  configSchema: ConfigField[];
  validateConfig: (config: TriggerConfig) => { valid: boolean; errors: string[] };
  matchesEvent: (event: any, config: TriggerConfig) => boolean;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'cron' | 'json';
  required: boolean;
  default?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
}

// ============================================
// TRIGGER DEFINITIONS
// ============================================

export const TRIGGER_DEFINITIONS: Record<TriggerType, TriggerDefinition> = {
  // Content Triggers
  article_created: {
    type: 'article_created',
    name: 'Article Created',
    description: 'Fires when a new article is created',
    icon: 'FileText',
    category: 'content',
    configSchema: [
      {
        key: 'categories',
        label: 'Filter by Categories',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'credit-cards', label: 'Credit Cards' },
          { value: 'mutual-funds', label: 'Mutual Funds' },
          { value: 'loans', label: 'Loans' },
          { value: 'insurance', label: 'Insurance' },
          { value: 'taxes', label: 'Taxes' },
        ],
        helpText: 'Leave empty to trigger for all categories',
      },
    ],
    validateConfig: (config) => ({ valid: true, errors: [] }),
    matchesEvent: (event, config) => {
      if (!config.categories || config.categories.length === 0) return true;
      return config.categories.includes(event.category);
    },
  },

  article_updated: {
    type: 'article_updated',
    name: 'Article Updated',
    description: 'Fires when an existing article is updated',
    icon: 'Edit',
    category: 'content',
    configSchema: [
      {
        key: 'categories',
        label: 'Filter by Categories',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'credit-cards', label: 'Credit Cards' },
          { value: 'mutual-funds', label: 'Mutual Funds' },
          { value: 'loans', label: 'Loans' },
          { value: 'insurance', label: 'Insurance' },
        ],
      },
      {
        key: 'fields',
        label: 'Trigger on Fields',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'title', label: 'Title' },
          { value: 'content', label: 'Content' },
          { value: 'meta_description', label: 'Meta Description' },
          { value: 'status', label: 'Status' },
        ],
        helpText: 'Only trigger when these fields change',
      },
    ],
    validateConfig: (config) => ({ valid: true, errors: [] }),
    matchesEvent: (event, config) => {
      if (config.categories?.length > 0 && !config.categories.includes(event.category)) {
        return false;
      }
      if (config.fields?.length > 0) {
        const changedFields = event.changed_fields || [];
        return config.fields.some((f: string) => changedFields.includes(f));
      }
      return true;
    },
  },

  article_status_changed: {
    type: 'article_status_changed',
    name: 'Status Changed',
    description: 'Fires when article status changes',
    icon: 'ArrowRightCircle',
    category: 'content',
    configSchema: [
      {
        key: 'status_from',
        label: 'From Status',
        type: 'select',
        required: false,
        options: [
          { value: 'any', label: 'Any Status' },
          { value: 'draft', label: 'Draft' },
          { value: 'review', label: 'Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' },
        ],
        default: 'any',
      },
      {
        key: 'status_to',
        label: 'To Status',
        type: 'select',
        required: true,
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'review', label: 'Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' },
        ],
      },
    ],
    validateConfig: (config) => {
      if (!config.status_to) {
        return { valid: false, errors: ['Target status is required'] };
      }
      return { valid: true, errors: [] };
    },
    matchesEvent: (event, config) => {
      if (config.status_from && config.status_from !== 'any' && event.previous_status !== config.status_from) {
        return false;
      }
      return event.new_status === config.status_to;
    },
  },

  // Quality Triggers
  quality_passed: {
    type: 'quality_passed',
    name: 'Quality Passed',
    description: 'Fires when article meets quality threshold',
    icon: 'CheckCircle',
    category: 'quality',
    configSchema: [
      {
        key: 'min_quality_score',
        label: 'Minimum Quality Score',
        type: 'number',
        required: true,
        default: 80,
        placeholder: '80',
        helpText: 'Score from 0-100',
      },
      {
        key: 'require_all_gates',
        label: 'Require All Quality Gates',
        type: 'boolean',
        required: false,
        default: false,
        helpText: 'All quality gates must pass (plagiarism, fact-check, etc.)',
      },
    ],
    validateConfig: (config) => {
      if (config.min_quality_score < 0 || config.min_quality_score > 100) {
        return { valid: false, errors: ['Quality score must be 0-100'] };
      }
      return { valid: true, errors: [] };
    },
    matchesEvent: (event, config) => {
      if (event.quality_score < config.min_quality_score) return false;
      if (config.require_all_gates && !event.all_gates_passed) return false;
      return true;
    },
  },

  quality_failed: {
    type: 'quality_failed',
    name: 'Quality Failed',
    description: 'Fires when article fails quality check',
    icon: 'XCircle',
    category: 'quality',
    configSchema: [
      {
        key: 'max_quality_score',
        label: 'Maximum Quality Score',
        type: 'number',
        required: false,
        default: 60,
        helpText: 'Trigger if score is below this',
      },
      {
        key: 'failed_gates',
        label: 'Specific Failed Gates',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'plagiarism', label: 'Plagiarism Check' },
          { value: 'fact_check', label: 'Fact Check' },
          { value: 'readability', label: 'Readability' },
          { value: 'seo', label: 'SEO' },
          { value: 'links', label: 'Internal Links' },
        ],
        helpText: 'Trigger when any of these gates fail',
      },
    ],
    validateConfig: (config) => ({ valid: true, errors: [] }),
    matchesEvent: (event, config) => {
      if (config.max_quality_score && event.quality_score > config.max_quality_score) {
        return false;
      }
      if (config.failed_gates?.length > 0) {
        const failedGates = event.failed_gates || [];
        return config.failed_gates.some((g: string) => failedGates.includes(g));
      }
      return event.quality_score < 70 || (event.failed_gates && event.failed_gates.length > 0);
    },
  },

  // Schedule Triggers
  scheduled: {
    type: 'scheduled',
    name: 'Scheduled',
    description: 'Fires on a schedule (cron)',
    icon: 'Clock',
    category: 'schedule',
    configSchema: [
      {
        key: 'schedule',
        label: 'Cron Schedule',
        type: 'cron',
        required: true,
        placeholder: '0 9 * * *',
        helpText: 'Cron expression (e.g., "0 9 * * *" for 9 AM daily)',
      },
      {
        key: 'timezone',
        label: 'Timezone',
        type: 'select',
        required: false,
        default: 'Asia/Kolkata',
        options: [
          { value: 'Asia/Kolkata', label: 'India (IST)' },
          { value: 'UTC', label: 'UTC' },
          { value: 'America/New_York', label: 'US Eastern' },
        ],
      },
    ],
    validateConfig: (config) => {
      if (!config.schedule) {
        return { valid: false, errors: ['Cron schedule is required'] };
      }
      // Basic cron validation
      const parts = config.schedule.split(' ');
      if (parts.length !== 5) {
        return { valid: false, errors: ['Invalid cron format (need 5 parts)'] };
      }
      return { valid: true, errors: [] };
    },
    matchesEvent: () => true, // Schedule triggers are handled by scheduler
  },

  manual: {
    type: 'manual',
    name: 'Manual',
    description: 'Triggered manually by user',
    icon: 'Hand',
    category: 'schedule',
    configSchema: [
      {
        key: 'requires_confirmation',
        label: 'Require Confirmation',
        type: 'boolean',
        required: false,
        default: true,
      },
      {
        key: 'allowed_users',
        label: 'Allowed Users',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'editor', label: 'Editor' },
        ],
        helpText: 'Leave empty to allow all users',
      },
    ],
    validateConfig: (config) => ({ valid: true, errors: [] }),
    matchesEvent: () => true, // Manual triggers always match when invoked
  },

  // External Triggers
  webhook: {
    type: 'webhook',
    name: 'Webhook',
    description: 'Fires when webhook is called',
    icon: 'Globe',
    category: 'external',
    configSchema: [
      {
        key: 'secret',
        label: 'Webhook Secret',
        type: 'text',
        required: false,
        helpText: 'Optional secret for webhook validation',
      },
      {
        key: 'allowed_ips',
        label: 'Allowed IPs',
        type: 'text',
        required: false,
        placeholder: '0.0.0.0',
        helpText: 'Comma-separated list of allowed IPs',
      },
    ],
    validateConfig: (config) => ({ valid: true, errors: [] }),
    matchesEvent: (event, config) => {
      if (config.secret && event.secret !== config.secret) return false;
      if (config.allowed_ips) {
        const allowedIPs = config.allowed_ips.split(',').map((ip: string) => ip.trim());
        if (!allowedIPs.includes(event.source_ip) && !allowedIPs.includes('0.0.0.0')) {
          return false;
        }
      }
      return true;
    },
  },

  scraper_completed: {
    type: 'scraper_completed',
    name: 'Scraper Completed',
    description: 'Fires when a scraper finishes running',
    icon: 'Download',
    category: 'external',
    configSchema: [
      {
        key: 'scraper_names',
        label: 'Scraper Names',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'credit_cards', label: 'Credit Cards' },
          { value: 'mutual_funds', label: 'Mutual Funds' },
          { value: 'loans', label: 'Loans' },
          { value: 'insurance', label: 'Insurance' },
        ],
        helpText: 'Leave empty for all scrapers',
      },
      {
        key: 'on_success_only',
        label: 'On Success Only',
        type: 'boolean',
        required: false,
        default: true,
      },
    ],
    validateConfig: (config) => ({ valid: true, errors: [] }),
    matchesEvent: (event, config) => {
      if (config.scraper_names?.length > 0 && !config.scraper_names.includes(event.scraper_name)) {
        return false;
      }
      if (config.on_success_only && event.status !== 'success') {
        return false;
      }
      return true;
    },
  },

  // Revenue Triggers
  revenue_threshold: {
    type: 'revenue_threshold',
    name: 'Revenue Threshold',
    description: 'Fires on revenue changes',
    icon: 'DollarSign',
    category: 'revenue',
    configSchema: [
      {
        key: 'threshold_type',
        label: 'Threshold Type',
        type: 'select',
        required: true,
        options: [
          { value: 'above', label: 'Reaches Above' },
          { value: 'below', label: 'Falls Below' },
          { value: 'drop', label: 'Drops By %' },
          { value: 'increase', label: 'Increases By %' },
        ],
      },
      {
        key: 'value',
        label: 'Value',
        type: 'number',
        required: true,
        placeholder: '1000',
        helpText: 'Amount in ₹ or percentage depending on type',
      },
      {
        key: 'period',
        label: 'Time Period',
        type: 'select',
        required: false,
        default: 'daily',
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ],
      },
    ],
    validateConfig: (config) => {
      if (!config.threshold_type) {
        return { valid: false, errors: ['Threshold type is required'] };
      }
      if (config.value === undefined || config.value === null) {
        return { valid: false, errors: ['Threshold value is required'] };
      }
      return { valid: true, errors: [] };
    },
    matchesEvent: (event, config) => {
      const { threshold_type, value } = config;
      const { current_revenue, previous_revenue } = event;

      switch (threshold_type) {
        case 'above':
          return current_revenue >= value;
        case 'below':
          return current_revenue <= value;
        case 'drop':
          if (!previous_revenue || previous_revenue === 0) return false;
          const dropPercent = ((previous_revenue - current_revenue) / previous_revenue) * 100;
          return dropPercent >= value;
        case 'increase':
          if (!previous_revenue || previous_revenue === 0) return true;
          const increasePercent = ((current_revenue - previous_revenue) / previous_revenue) * 100;
          return increasePercent >= value;
        default:
          return false;
      }
    },
  },
};

// ============================================
// TRIGGER REGISTRY
// ============================================

export class TriggerRegistry {
  private triggers: Map<TriggerType, TriggerDefinition> = new Map();

  constructor() {
    // Register all built-in triggers
    Object.entries(TRIGGER_DEFINITIONS).forEach(([type, definition]) => {
      this.triggers.set(type as TriggerType, definition);
    });
  }

  /**
   * Get all registered triggers
   */
  getAll(): TriggerDefinition[] {
    return Array.from(this.triggers.values());
  }

  /**
   * Get triggers by category
   */
  getByCategory(category: TriggerDefinition['category']): TriggerDefinition[] {
    return this.getAll().filter(t => t.category === category);
  }

  /**
   * Get a specific trigger definition
   */
  get(type: TriggerType): TriggerDefinition | undefined {
    return this.triggers.get(type);
  }

  /**
   * Check if event matches trigger config
   */
  matchesEvent(type: TriggerType, event: any, config: TriggerConfig): boolean {
    const trigger = this.triggers.get(type);
    if (!trigger) {
      logger.warn(`Unknown trigger type: ${type}`);
      return false;
    }
    return trigger.matchesEvent(event, config);
  }

  /**
   * Validate trigger config
   */
  validateConfig(type: TriggerType, config: TriggerConfig): { valid: boolean; errors: string[] } {
    const trigger = this.triggers.get(type);
    if (!trigger) {
      return { valid: false, errors: [`Unknown trigger type: ${type}`] };
    }
    return trigger.validateConfig(config);
  }

  /**
   * Create context for trigger event
   */
  createContext(type: TriggerType, data: Record<string, any>, source?: string): TriggerContext {
    return {
      triggerId: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerType: type,
      timestamp: new Date().toISOString(),
      data,
      source,
    };
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const triggerRegistry = new TriggerRegistry();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export function getTriggerDefinitions(): TriggerDefinition[] {
  return triggerRegistry.getAll();
}

export function getTriggersByCategory(category: TriggerDefinition['category']): TriggerDefinition[] {
  return triggerRegistry.getByCategory(category);
}

export function validateTriggerConfig(type: TriggerType, config: TriggerConfig): { valid: boolean; errors: string[] } {
  return triggerRegistry.validateConfig(type, config);
}

export function createTriggerContext(type: TriggerType, data: Record<string, any>, source?: string): TriggerContext {
  return triggerRegistry.createContext(type, data, source);
}
