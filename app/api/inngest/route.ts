import { serve } from 'inngest/next';
import { inngest } from '@/lib/queue/inngest-client';

// Import all job functions
// Temporarily commented out to fix production build
// import { autoContentGenerator } from '@/lib/queue/jobs/auto-content-generator';
// import { articleGenerationJob } from '@/lib/queue/jobs/article-generation';
// import { articleEnrichmentJob } from '@/lib/queue/jobs/article-enrichment';
// import { articlePublishingJob } from '@/lib/queue/jobs/article-publishing';
// import { seoOptimizationJob } from '@/lib/queue/jobs/seo-optimization';
// import { imageGenerationJob } from '@/lib/queue/jobs/image-generation';

// Export the Inngest serve handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Temporarily disabled for production build
    // autoContentGenerator,
    // articleGenerationJob,
    // articleEnrichmentJob,
    // articlePublishingJob,
    // seoOptimizationJob,
    // imageGenerationJob,
  ],
});
