/**
 * Article Publishing Workflow Definition
 * Standard workflow for publishing articles
 */

import { WorkflowDefinition } from '../types';
import { randomUUID } from 'crypto';

export const ARTICLE_PUBLISHING_WORKFLOW: WorkflowDefinition = {
  id: randomUUID(),
  name: 'article-publishing',
  version: '1.0',
  description: 'Standard workflow for publishing articles',
  steps: [
    {
      id: 'validate',
      name: 'Validate Article',
      action: 'validateArticle',
      onError: 'retry',
      retry: {
        maxAttempts: 3,
        backoff: 'exponential',
        delay: 1000
      }
    },
    {
      id: 'generate-seo',
      name: 'Generate SEO Metadata',
      action: 'generateSEO',
      dependsOn: ['validate'],
      timeout: 60000
    },
    {
      id: 'publish',
      name: 'Publish Article',
      action: 'publishArticle',
      dependsOn: ['validate', 'generate-seo'],
      onError: 'fail'
    }
  ],
  errorHandling: {
    strategy: 'fail-fast'
  },
  retryPolicy: {
    maxRetries: 2,
    backoff: 'exponential',
    delay: 5000
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
