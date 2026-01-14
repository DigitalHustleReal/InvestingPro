/**
 * Workflow Registry
 * Maps workflow names to definitions
 */

import { WorkflowDefinition } from './types';
import { ARTICLE_PUBLISHING_WORKFLOW } from './definitions/article-publishing';
import { CONTENT_GENERATION_WORKFLOW } from './definitions/content-generation';

/**
 * Registry of available workflows
 */
const WORKFLOW_REGISTRY: Record<string, WorkflowDefinition> = {
  'article-publishing': ARTICLE_PUBLISHING_WORKFLOW,
  'content-generation': CONTENT_GENERATION_WORKFLOW,
};

/**
 * Get workflow definition by name
 */
export function getWorkflowDefinition(name: string): WorkflowDefinition | null {
  return WORKFLOW_REGISTRY[name] || null;
}

/**
 * Get all registered workflow names
 */
export function getRegisteredWorkflowNames(): string[] {
  return Object.keys(WORKFLOW_REGISTRY);
}

/**
 * Register a workflow definition
 */
export function registerWorkflow(name: string, definition: WorkflowDefinition): void {
  WORKFLOW_REGISTRY[name] = definition;
}

/**
 * Check if workflow is registered
 */
export function isWorkflowRegistered(name: string): boolean {
  return name in WORKFLOW_REGISTRY;
}
