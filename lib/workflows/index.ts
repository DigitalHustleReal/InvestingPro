/**
 * Workflow System
 * Central exports for workflow functionality
 * 
 * WARNING: Most exports are SERVER-ONLY
 * Do not import from this barrel in client components
 */

// Core (server-only)
export * from './types';
export * from './state-machine';
export * from './workflow-engine';
export * from './workflow-repository';
export * from './workflow-service'; // SERVER-ONLY
export * from './workflow-monitor';

// Definitions
export * from './definitions';

// Actions (server-only)
export * from './actions/article-actions';

// Hooks (server-only)
export * from './hooks/article-workflow-hooks'; // SERVER-ONLY

// Registry
export * from './workflow-registry';
