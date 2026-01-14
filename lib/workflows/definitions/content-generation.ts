/**
 * Content Generation Workflow Definition
 * AI-powered content generation workflow
 */

import { WorkflowDefinition } from '../types';
import { randomUUID } from 'crypto';

export const CONTENT_GENERATION_WORKFLOW: WorkflowDefinition = {
  id: randomUUID(),
  name: 'content-generation',
  version: '1.0',
  description: 'AI-powered content generation workflow',
  steps: [
    {
      id: 'research',
      name: 'Research Topic',
      action: 'researchTopic',
      timeout: 300000, // 5 minutes
      onError: 'retry',
      retry: {
        maxAttempts: 2,
        backoff: 'exponential',
        delay: 5000
      }
    },
    {
      id: 'generate',
      name: 'Generate Content',
      action: 'generateContent',
      dependsOn: ['research'],
      timeout: 600000, // 10 minutes
      onError: 'retry',
      retry: {
        maxAttempts: 2,
        backoff: 'exponential',
        delay: 10000
      }
    },
    {
      id: 'quality-check',
      name: 'Quality Check',
      action: 'qualityCheck',
      dependsOn: ['generate'],
      timeout: 120000, // 2 minutes
      onError: 'skip' // Continue even if quality check fails
    },
    {
      id: 'review',
      name: 'Human Review',
      action: 'reviewContent',
      dependsOn: ['generate'],
      manual: true, // Requires human intervention
      onError: 'skip'
    }
  ],
  errorHandling: {
    strategy: 'continue-on-error'
  },
  retryPolicy: {
    maxRetries: 3,
    backoff: 'exponential',
    delay: 5000
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
