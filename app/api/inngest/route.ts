/**
 * Inngest API Route
 * Handles Inngest webhooks and function registration
 */
import { serve } from 'inngest/next';
import { inngest } from '@/lib/queue/inngest-client';
import { generateArticleJob, bulkGenerateJob, imageGenerationJob } from '@/lib/queue/jobs';
import { generateComprehensiveArticleJob } from '@/lib/queue/jobs/article-generation-comprehensive';
import { workflowStepJob } from '@/lib/queue/jobs/workflow-step';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateArticleJob,
    generateComprehensiveArticleJob,
    bulkGenerateJob,
    imageGenerationJob,
    workflowStepJob,
  ],
});
