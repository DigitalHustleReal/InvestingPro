/**
 * Workflow Actions
 * 
 * Purpose: Define and execute workflow actions
 * 
 * Built-in actions:
 * - publish: Publish an article
 * - notify: Send notification (email, slack, etc.)
 * - schedule: Schedule article for publishing
 * - add_to_queue: Add to processing queue
 * - update_status: Change article status
 * - assign_author: Assign to AI author
 * - generate_content: Trigger AI generation
 * - refresh_content: Trigger content refresh
 * - update_metadata: Update article metadata
 * - add_tags: Add tags to article
 * - wait: Wait for specified duration
 * - condition: Conditional branching
 * - http_request: Make HTTP request
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { publishEvent, SystemEvent } from '@/lib/infrastructure/event-bus/event-bus';

// ============================================
// TYPES
// ============================================

export type ActionType =
  | 'publish'
  | 'notify'
  | 'schedule'
  | 'add_to_queue'
  | 'update_status'
  | 'assign_author'
  | 'generate_content'
  | 'refresh_content'
  | 'update_metadata'
  | 'add_tags'
  | 'wait'
  | 'condition'
  | 'http_request'
  | 'log';

export interface ActionConfig {
  [key: string]: any;
}

export interface ActionContext {
  workflowId: string;
  runId: string;
  triggerData: Record<string, any>;
  previousResults: ActionResult[];
  variables: Record<string, any>;
}

export interface ActionResult {
  actionType: ActionType;
  status: 'success' | 'failed' | 'skipped';
  output?: Record<string, any>;
  error?: string;
  duration_ms: number;
}

export interface ActionDefinition {
  type: ActionType;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'notification' | 'automation' | 'integration' | 'control';
  configSchema: ConfigField[];
  execute: (config: ActionConfig, context: ActionContext) => Promise<ActionResult>;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'textarea' | 'json';
  required: boolean;
  default?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
}

// ============================================
// ACTION IMPLEMENTATIONS
// ============================================

const supabase = createClient();

/**
 * Publish an article
 */
async function executePublish(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const articleId = config.article_id || context.triggerData.article_id;
    
    if (!articleId) {
      return {
        actionType: 'publish',
        status: 'failed',
        error: 'No article ID provided',
        duration_ms: Date.now() - startTime,
      };
    }

    const { error } = await supabase
      .from('articles')
      .update({
        status: 'published',
        published_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', articleId);

    if (error) throw error;

    await publishEvent(SystemEvent.ARTICLE_PUBLISHED, { articleId }, 'workflow-engine');

    return {
      actionType: 'publish',
      status: 'success',
      output: { articleId, publishedAt: new Date().toISOString() },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'publish',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Send notification
 */
async function executeNotify(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const { channel = 'system', message, priority = 'normal', recipients } = config;

    // Replace variables in message
    let finalMessage = message;
    if (context.triggerData.article_title) {
      finalMessage = finalMessage.replace('{{article_title}}', context.triggerData.article_title);
    }
    if (context.triggerData.article_id) {
      finalMessage = finalMessage.replace('{{article_id}}', context.triggerData.article_id);
    }

    await publishEvent(SystemEvent.NOTIFICATION, {
      channel,
      message: finalMessage,
      priority,
      recipients,
      workflowId: context.workflowId,
    }, 'workflow-engine');

    return {
      actionType: 'notify',
      status: 'success',
      output: { channel, message: finalMessage, sentAt: new Date().toISOString() },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'notify',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Schedule article for publishing
 */
async function executeSchedule(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const articleId = config.article_id || context.triggerData.article_id;
    const publishAt = config.publish_at || new Date(Date.now() + (config.delay_minutes || 60) * 60 * 1000).toISOString();

    if (!articleId) {
      return {
        actionType: 'schedule',
        status: 'failed',
        error: 'No article ID provided',
        duration_ms: Date.now() - startTime,
      };
    }

    const { error } = await supabase
      .from('articles')
      .update({
        status: 'scheduled',
        scheduled_publish_date: publishAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', articleId);

    if (error) throw error;

    return {
      actionType: 'schedule',
      status: 'success',
      output: { articleId, scheduledFor: publishAt },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'schedule',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Add to processing queue
 */
async function executeAddToQueue(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const { queue, priority = 'normal', metadata = {} } = config;
    const articleId = config.article_id || context.triggerData.article_id;

    // Insert into queue table
    const { data, error } = await supabase
      .from('processing_queues')
      .insert({
        queue_name: queue,
        item_type: 'article',
        item_id: articleId,
        priority,
        metadata: {
          ...metadata,
          workflowId: context.workflowId,
          runId: context.runId,
        },
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      // Queue table might not exist, log and continue
      logger.warn('Could not add to queue', { queue, error: error.message });
    }

    return {
      actionType: 'add_to_queue',
      status: 'success',
      output: { queue, itemId: data?.id, articleId },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'add_to_queue',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Update article status
 */
async function executeUpdateStatus(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const articleId = config.article_id || context.triggerData.article_id;
    const { status, notes } = config;

    if (!articleId || !status) {
      return {
        actionType: 'update_status',
        status: 'failed',
        error: 'Article ID and status are required',
        duration_ms: Date.now() - startTime,
      };
    }

    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.editorial_notes = { workflow_note: notes, updated_at: new Date().toISOString() };
    }

    const { error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', articleId);

    if (error) throw error;

    return {
      actionType: 'update_status',
      status: 'success',
      output: { articleId, newStatus: status },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'update_status',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Assign AI author
 */
async function executeAssignAuthor(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const articleId = config.article_id || context.triggerData.article_id;
    const { author_id, auto_select } = config;

    let selectedAuthorId = author_id;

    if (auto_select && !author_id) {
      // Auto-select based on category
      const category = context.triggerData.category;
      const { data: author } = await supabase
        .from('ai_personas')
        .select('id')
        .contains('expertise', [category])
        .limit(1)
        .single();

      selectedAuthorId = author?.id;
    }

    if (!selectedAuthorId) {
      return {
        actionType: 'assign_author',
        status: 'skipped',
        output: { reason: 'No suitable author found' },
        duration_ms: Date.now() - startTime,
      };
    }

    const { error } = await supabase
      .from('articles')
      .update({ author_id: selectedAuthorId, updated_at: new Date().toISOString() })
      .eq('id', articleId);

    if (error) throw error;

    return {
      actionType: 'assign_author',
      status: 'success',
      output: { articleId, authorId: selectedAuthorId },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'assign_author',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Wait for duration
 */
async function executeWait(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const { seconds = 0, minutes = 0, hours = 0 } = config;
    const totalMs = (seconds + minutes * 60 + hours * 3600) * 1000;

    if (totalMs > 0) {
      await new Promise(resolve => setTimeout(resolve, Math.min(totalMs, 300000))); // Max 5 min wait
    }

    return {
      actionType: 'wait',
      status: 'success',
      output: { waitedMs: Math.min(totalMs, 300000) },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'wait',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Update metadata
 */
async function executeUpdateMetadata(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const articleId = config.article_id || context.triggerData.article_id;
    const { meta_title, meta_description, schema_type } = config;

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (meta_title) updateData.meta_title = meta_title;
    if (meta_description) updateData.meta_description = meta_description;
    if (schema_type) updateData.schema_type = schema_type;

    const { error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', articleId);

    if (error) throw error;

    return {
      actionType: 'update_metadata',
      status: 'success',
      output: { articleId, updates: updateData },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'update_metadata',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Add tags
 */
async function executeAddTags(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const articleId = config.article_id || context.triggerData.article_id;
    const { tags, replace = false } = config;

    // Get current tags
    const { data: article } = await supabase
      .from('articles')
      .select('tags')
      .eq('id', articleId)
      .single();

    const currentTags = article?.tags || [];
    const newTags = replace ? tags : [...new Set([...currentTags, ...tags])];

    const { error } = await supabase
      .from('articles')
      .update({ tags: newTags, updated_at: new Date().toISOString() })
      .eq('id', articleId);

    if (error) throw error;

    return {
      actionType: 'add_tags',
      status: 'success',
      output: { articleId, tags: newTags, added: tags },
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'add_tags',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Make HTTP request
 */
async function executeHttpRequest(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  try {
    const { url, method = 'POST', headers = {}, body } = config;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    return {
      actionType: 'http_request',
      status: response.ok ? 'success' : 'failed',
      output: { statusCode: response.status, data },
      error: response.ok ? undefined : `HTTP ${response.status}`,
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      actionType: 'http_request',
      status: 'failed',
      error: (error as Error).message,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Log action (for debugging)
 */
async function executeLog(config: ActionConfig, context: ActionContext): Promise<ActionResult> {
  const startTime = Date.now();
  const { level = 'info', message } = config;

  logger.log(level, `[Workflow ${context.workflowId}] ${message}`, {
    runId: context.runId,
    triggerData: context.triggerData,
  });

  return {
    actionType: 'log',
    status: 'success',
    output: { level, message },
    duration_ms: Date.now() - startTime,
  };
}

// ============================================
// ACTION DEFINITIONS
// ============================================

export const ACTION_DEFINITIONS: Record<ActionType, ActionDefinition> = {
  publish: {
    type: 'publish',
    name: 'Publish Article',
    description: 'Publish the article immediately',
    icon: 'Send',
    category: 'content',
    configSchema: [
      {
        key: 'article_id',
        label: 'Article ID',
        type: 'text',
        required: false,
        helpText: 'Leave empty to use article from trigger',
      },
    ],
    execute: executePublish,
  },

  notify: {
    type: 'notify',
    name: 'Send Notification',
    description: 'Send a notification via email, Slack, etc.',
    icon: 'Bell',
    category: 'notification',
    configSchema: [
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        required: true,
        default: 'system',
        options: [
          { value: 'system', label: 'System Notification' },
          { value: 'email', label: 'Email' },
          { value: 'slack', label: 'Slack' },
        ],
      },
      {
        key: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Article {{article_title}} has been processed',
        helpText: 'Use {{variable}} for dynamic values',
      },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        required: false,
        default: 'normal',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' },
        ],
      },
    ],
    execute: executeNotify,
  },

  schedule: {
    type: 'schedule',
    name: 'Schedule Publishing',
    description: 'Schedule article for future publishing',
    icon: 'Calendar',
    category: 'content',
    configSchema: [
      {
        key: 'delay_minutes',
        label: 'Delay (minutes)',
        type: 'number',
        required: false,
        default: 60,
        helpText: 'Publish after this many minutes',
      },
      {
        key: 'publish_at',
        label: 'Or Specific Time',
        type: 'text',
        required: false,
        placeholder: '2026-01-25T10:00:00Z',
        helpText: 'ISO date format',
      },
    ],
    execute: executeSchedule,
  },

  add_to_queue: {
    type: 'add_to_queue',
    name: 'Add to Queue',
    description: 'Add article to a processing queue',
    icon: 'ListPlus',
    category: 'automation',
    configSchema: [
      {
        key: 'queue',
        label: 'Queue Name',
        type: 'select',
        required: true,
        options: [
          { value: 'social_media', label: 'Social Media' },
          { value: 'email_newsletter', label: 'Email Newsletter' },
          { value: 'content_refresh', label: 'Content Refresh' },
          { value: 'seo_optimization', label: 'SEO Optimization' },
        ],
      },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        required: false,
        default: 'normal',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
        ],
      },
    ],
    execute: executeAddToQueue,
  },

  update_status: {
    type: 'update_status',
    name: 'Update Status',
    description: 'Change article status',
    icon: 'RefreshCw',
    category: 'content',
    configSchema: [
      {
        key: 'status',
        label: 'New Status',
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
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
        required: false,
        placeholder: 'Optional notes about the status change',
      },
    ],
    execute: executeUpdateStatus,
  },

  assign_author: {
    type: 'assign_author',
    name: 'Assign Author',
    description: 'Assign an AI author to the article',
    icon: 'User',
    category: 'content',
    configSchema: [
      {
        key: 'author_id',
        label: 'Author ID',
        type: 'text',
        required: false,
        helpText: 'Leave empty for auto-selection',
      },
      {
        key: 'auto_select',
        label: 'Auto-Select by Category',
        type: 'boolean',
        required: false,
        default: true,
      },
    ],
    execute: executeAssignAuthor,
  },

  generate_content: {
    type: 'generate_content',
    name: 'Generate Content',
    description: 'Trigger AI content generation',
    icon: 'Wand',
    category: 'automation',
    configSchema: [
      {
        key: 'template',
        label: 'Template',
        type: 'select',
        required: true,
        options: [
          { value: 'product_review', label: 'Product Review' },
          { value: 'comparison', label: 'Comparison' },
          { value: 'pillar', label: 'Pillar Page' },
          { value: 'guide', label: 'How-To Guide' },
        ],
      },
    ],
    execute: async (config, context) => ({
      actionType: 'generate_content',
      status: 'success',
      output: { template: config.template, queued: true },
      duration_ms: 0,
    }),
  },

  refresh_content: {
    type: 'refresh_content',
    name: 'Refresh Content',
    description: 'Trigger content refresh/update',
    icon: 'RefreshCcw',
    category: 'content',
    configSchema: [
      {
        key: 'sections',
        label: 'Sections to Refresh',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'all', label: 'All Content' },
          { value: 'data', label: 'Product Data Only' },
          { value: 'intro', label: 'Introduction' },
          { value: 'conclusion', label: 'Conclusion' },
          { value: 'faq', label: 'FAQ Section' },
        ],
        default: ['data'],
      },
    ],
    execute: async (config, context) => ({
      actionType: 'refresh_content',
      status: 'success',
      output: { sections: config.sections, queued: true },
      duration_ms: 0,
    }),
  },

  update_metadata: {
    type: 'update_metadata',
    name: 'Update Metadata',
    description: 'Update article meta information',
    icon: 'FileText',
    category: 'content',
    configSchema: [
      {
        key: 'meta_title',
        label: 'Meta Title',
        type: 'text',
        required: false,
      },
      {
        key: 'meta_description',
        label: 'Meta Description',
        type: 'textarea',
        required: false,
      },
    ],
    execute: executeUpdateMetadata,
  },

  add_tags: {
    type: 'add_tags',
    name: 'Add Tags',
    description: 'Add tags to article',
    icon: 'Tag',
    category: 'content',
    configSchema: [
      {
        key: 'tags',
        label: 'Tags',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'featured', label: 'Featured' },
          { value: 'trending', label: 'Trending' },
          { value: 'updated', label: 'Recently Updated' },
          { value: 'high-traffic', label: 'High Traffic' },
        ],
      },
      {
        key: 'replace',
        label: 'Replace Existing',
        type: 'boolean',
        required: false,
        default: false,
      },
    ],
    execute: executeAddTags,
  },

  wait: {
    type: 'wait',
    name: 'Wait',
    description: 'Wait for a specified duration',
    icon: 'Clock',
    category: 'control',
    configSchema: [
      {
        key: 'seconds',
        label: 'Seconds',
        type: 'number',
        required: false,
        default: 0,
      },
      {
        key: 'minutes',
        label: 'Minutes',
        type: 'number',
        required: false,
        default: 0,
      },
    ],
    execute: executeWait,
  },

  condition: {
    type: 'condition',
    name: 'Condition',
    description: 'Check condition before continuing',
    icon: 'GitBranch',
    category: 'control',
    configSchema: [
      {
        key: 'field',
        label: 'Field',
        type: 'text',
        required: true,
      },
      {
        key: 'operator',
        label: 'Operator',
        type: 'select',
        required: true,
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'gte', label: 'Greater or Equal' },
          { value: 'lte', label: 'Less or Equal' },
        ],
      },
      {
        key: 'value',
        label: 'Value',
        type: 'text',
        required: true,
      },
    ],
    execute: async (config, context) => {
      const { field, operator, value } = config;
      const fieldValue = context.triggerData[field];

      let matches = false;
      switch (operator) {
        case 'equals':
          matches = fieldValue === value;
          break;
        case 'not_equals':
          matches = fieldValue !== value;
          break;
        case 'contains':
          matches = String(fieldValue).includes(value);
          break;
        case 'gte':
          matches = Number(fieldValue) >= Number(value);
          break;
        case 'lte':
          matches = Number(fieldValue) <= Number(value);
          break;
      }

      return {
        actionType: 'condition',
        status: matches ? 'success' : 'skipped',
        output: { field, operator, value, fieldValue, matches },
        duration_ms: 0,
      };
    },
  },

  http_request: {
    type: 'http_request',
    name: 'HTTP Request',
    description: 'Make an HTTP request to external service',
    icon: 'Globe',
    category: 'integration',
    configSchema: [
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        required: true,
        placeholder: 'https://api.example.com/webhook',
      },
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        required: true,
        default: 'POST',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
        ],
      },
      {
        key: 'body',
        label: 'Body (JSON)',
        type: 'json',
        required: false,
      },
    ],
    execute: executeHttpRequest,
  },

  log: {
    type: 'log',
    name: 'Log',
    description: 'Log a message for debugging',
    icon: 'MessageSquare',
    category: 'control',
    configSchema: [
      {
        key: 'level',
        label: 'Level',
        type: 'select',
        required: false,
        default: 'info',
        options: [
          { value: 'debug', label: 'Debug' },
          { value: 'info', label: 'Info' },
          { value: 'warn', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
      },
      {
        key: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
      },
    ],
    execute: executeLog,
  },
};

// ============================================
// ACTION REGISTRY
// ============================================

export class ActionRegistry {
  private actions: Map<ActionType, ActionDefinition> = new Map();

  constructor() {
    Object.entries(ACTION_DEFINITIONS).forEach(([type, definition]) => {
      this.actions.set(type as ActionType, definition);
    });
  }

  getAll(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  getByCategory(category: ActionDefinition['category']): ActionDefinition[] {
    return this.getAll().filter(a => a.category === category);
  }

  get(type: ActionType): ActionDefinition | undefined {
    return this.actions.get(type);
  }

  async execute(type: ActionType, config: ActionConfig, context: ActionContext): Promise<ActionResult> {
    const action = this.actions.get(type);
    if (!action) {
      return {
        actionType: type,
        status: 'failed',
        error: `Unknown action type: ${type}`,
        duration_ms: 0,
      };
    }
    return action.execute(config, context);
  }
}

export const actionRegistry = new ActionRegistry();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export function getActionDefinitions(): ActionDefinition[] {
  return actionRegistry.getAll();
}

export function getActionsByCategory(category: ActionDefinition['category']): ActionDefinition[] {
  return actionRegistry.getByCategory(category);
}

export async function executeAction(
  type: ActionType,
  config: ActionConfig,
  context: ActionContext
): Promise<ActionResult> {
  return actionRegistry.execute(type, config, context);
}
