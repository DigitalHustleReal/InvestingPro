/**
 * Workflow Engine Types
 * Type definitions for workflow engine and state machine
 */

/**
 * Content Lifecycle States
 * Main publishing workflow states
 */
export type ContentState = 
  | 'draft'
  | 'review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

/**
 * Submission States
 * User submission workflow states
 */
export type SubmissionState =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'revision-requested';

/**
 * Workflow Execution States
 * Internal workflow execution states
 */
export type WorkflowState =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

/**
 * State Transition
 */
export interface StateTransition {
  from: ContentState | SubmissionState | WorkflowState;
  to: ContentState | SubmissionState | WorkflowState;
  action: string;
  metadata?: Record<string, any>;
  timestamp: string;
  userId?: string;
}

/**
 * State Machine Configuration
 */
export interface StateMachineConfig {
  states: string[];
  transitions: {
    from: string;
    to: string[];
    action: string;
    conditions?: (context: any) => boolean;
  }[];
  initial: string;
}

/**
 * Workflow Step
 */
export interface WorkflowStep {
  id: string;
  name: string;
  action: string; // Function/service to call
  dependsOn?: string[]; // Step IDs this depends on
  timeout?: number; // Milliseconds
  retry?: {
    maxAttempts: number;
    backoff: 'linear' | 'exponential';
    delay: number; // Initial delay in ms
  };
  onError?: 'retry' | 'fail' | 'skip' | 'rollback';
  onSuccess?: string; // Next step ID (optional, can use dependsOn)
  manual?: boolean; // Requires human intervention
  metadata?: Record<string, any>;
}

/**
 * Workflow Definition
 */
export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  description?: string;
  steps: WorkflowStep[];
  errorHandling?: {
    strategy: 'fail-fast' | 'continue-on-error';
    onFailure?: string; // Step ID to execute on failure
  };
  retryPolicy?: {
    maxRetries: number;
    backoff: 'linear' | 'exponential';
    delay: number;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Workflow Instance
 */
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowVersion: string;
  state: WorkflowState;
  currentStep?: string; // Current step ID
  completedSteps: string[];
  failedSteps: string[];
  context: Record<string, any>; // Workflow execution context
  result?: any; // Final result
  error?: string; // Error message if failed
  startedAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Workflow Execution History
 */
export interface WorkflowExecutionHistory {
  id: string;
  workflowInstanceId: string;
  stepId: string;
  state: 'started' | 'completed' | 'failed' | 'skipped';
  input?: any;
  output?: any;
  error?: string;
  duration?: number; // Milliseconds
  retryAttempt?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}
