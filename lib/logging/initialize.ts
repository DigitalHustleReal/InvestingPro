/**
 * Initialize External Logging Service
 * Call this during app startup to enable external logging
 */

import { initializeExternalLogger, LoggingService } from './external-logger';

/**
 * Initialize external logging based on environment variables
 * Should be called in app startup (e.g., in middleware or app layout)
 */
export function initializeLogging(): void {
    // Only initialize in server-side (not in browser)
    if (typeof window !== 'undefined') {
        return;
    }

    const enabled = process.env.EXTERNAL_LOGGING_ENABLED === 'true';
    if (!enabled) {
        return;
    }

    const service = (process.env.EXTERNAL_LOGGING_SERVICE || 'axiom') as LoggingService;
    const apiKey = process.env.AXIOM_API_KEY || process.env.BETTER_STACK_API_KEY || process.env.DATADOG_API_KEY;
    const dataset = process.env.AXIOM_DATASET;
    const source = process.env.BETTER_STACK_SOURCE;

    if (!apiKey) {
        console.warn('[Logging] External logging enabled but no API key found. Set AXIOM_API_KEY, BETTER_STACK_API_KEY, or DATADOG_API_KEY');
        return;
    }

    // Validate service-specific requirements
    if (service === 'axiom' && !dataset) {
        console.warn('[Logging] Axiom requires AXIOM_DATASET environment variable');
        return;
    }

    if (service === 'better-stack' && !source) {
        console.warn('[Logging] Better Stack requires BETTER_STACK_SOURCE environment variable');
        return;
    }

    try {
        initializeExternalLogger({
            service,
            enabled: true,
            apiKey,
            dataset,
            source,
            batchSize: parseInt(process.env.EXTERNAL_LOGGING_BATCH_SIZE || '10', 10),
            flushInterval: parseInt(process.env.EXTERNAL_LOGGING_FLUSH_INTERVAL || '5000', 10),
        });

        console.log(`[Logging] External logging initialized: ${service}`);
    } catch (error) {
        console.error('[Logging] Failed to initialize external logging:', error);
    }
}

/**
 * Shutdown external logging (call on app shutdown)
 */
export async function shutdownLogging(): Promise<void> {
    const { shutdownExternalLogger } = await import('./external-logger');
    await shutdownExternalLogger();
}
