/**
 * Update Autonomous System Initializer with Phase 2 Components
 */

import { contentOrchestrator } from '@/lib/intelligence/orchestrators/content-orchestrator';
import { dataOrchestrator } from '@/lib/intelligence/orchestrators/data-sync-orchestrator';
import { qualityLearningEngine } from '@/lib/intelligence/learners/quality-learning-engine';
import { logger } from '@/lib/logger';

let isInitialized = false;

/**
 * Initialize all autonomous systems
 */
export async function initializeAutonomousSystems(): Promise<void> {
  if (isInitialized) {
    logger.warn('Autonomous systems already initialized');
    return;
  }

  // Only run on server-side
  if (typeof window !== 'undefined') {
    return;
  }

  try {
    logger.info('Initializing autonomous systems...');

    // Phase 1: Orchestrators
    await contentOrchestrator.start();
    logger.info('✓ Content orchestrator started');

    await dataOrchestrator.start();
    logger.info('✓ Data sync orchestrator started');

    // Phase 2: Learning Systems
    await qualityLearningEngine.start();
    logger.info('✓ Quality learning engine started');

    isInitialized = true;
    logger.info('All autonomous systems initialized successfully');

  } catch (error) {
    logger.error('Failed to initialize autonomous systems', error as Error);
    throw error;
  }
}

/**
 * Shutdown all autonomous systems gracefully
 */
export function shutdownAutonomousSystems(): void {
  if (!isInitialized) {
    return;
  }

  logger.info('Shutting down autonomous systems...');

  contentOrchestrator.stop();
  dataOrchestrator.stop();
  qualityLearningEngine.stop();

  isInitialized = false;
  logger.info('All autonomous systems shut down');
}

// Handle graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', shutdownAutonomousSystems);
  process.on('SIGINT', shutdownAutonomousSystems);
}
