/**
 * Error Recovery Strategies
 * Provides retry logic and recovery mechanisms for retryable errors
 */

import { logger } from '@/lib/logger';
import { ApiError, isRetryableError, isApiError } from './types';

export interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
    retryableErrors?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    retryableErrors: isRetryableError,
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: unknown;
    let delay = opts.initialDelayMs;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if error is retryable
            if (!opts.retryableErrors(error)) {
                throw error;
            }

            // Don't retry on last attempt
            if (attempt === opts.maxRetries) {
                break;
            }

            // Log retry attempt
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.warn('Retrying operation', {
                attempt: attempt + 1,
                maxRetries: opts.maxRetries,
                delay,
                error: errorMessage,
            });

            // Wait before retry
            await sleep(delay);

            // Exponential backoff
            delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
        }
    }

    // All retries exhausted
    throw lastError;
}

/**
 * Retry with circuit breaker pattern
 */
export class CircuitBreaker {
    private failures = 0;
    private lastFailureTime?: number;
    private state: 'closed' | 'open' | 'half-open' = 'closed';

    constructor(
        private readonly failureThreshold: number = 5,
        private readonly resetTimeoutMs: number = 60000
    ) {}

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check circuit state
        if (this.state === 'open') {
            if (this.shouldAttemptReset()) {
                this.state = 'half-open';
            } else {
                throw new ApiError(
                    'SERVICE_UNAVAILABLE' as any,
                    'Circuit breaker is open',
                    503,
                    { isRetryable: true }
                );
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failures = 0;
        if (this.state === 'half-open') {
            this.state = 'closed';
        }
    }

    private onFailure(): void {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.failures >= this.failureThreshold) {
            this.state = 'open';
            logger.error('Circuit breaker opened', {
                failures: this.failures,
                threshold: this.failureThreshold,
            });
        }
    }

    private shouldAttemptReset(): boolean {
        if (!this.lastFailureTime) return false;
        return Date.now() - this.lastFailureTime >= this.resetTimeoutMs;
    }

    getState(): string {
        return this.state;
    }

    reset(): void {
        this.failures = 0;
        this.lastFailureTime = undefined;
        this.state = 'closed';
    }
}

/**
 * Timeout wrapper for async operations
 */
export async function withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    errorMessage?: string
): Promise<T> {
    return Promise.race([
        fn(),
        new Promise<T>((_, reject) => {
            setTimeout(() => {
                reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        }),
    ]);
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fallback value provider
 */
export async function withFallback<T>(
    fn: () => Promise<T>,
    fallback: T | (() => Promise<T>),
    logError: boolean = true
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (logError) {
            logger.warn('Using fallback value', {
                error: error instanceof Error ? error.message : String(error),
            });
        }

        if (typeof fallback === 'function') {
            return await (fallback as () => Promise<T>)();
        }
        return fallback;
    }
}

/**
 * Graceful degradation: try primary, fallback to secondary
 */
export async function gracefulDegradation<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    logError: boolean = true
): Promise<T> {
    try {
        return await primary();
    } catch (error) {
        if (logError) {
            logger.warn('Primary operation failed, using fallback', {
                error: error instanceof Error ? error.message : String(error),
            });
        }

        try {
            return await fallback();
        } catch (fallbackError) {
            logger.error('Fallback operation also failed', fallbackError as Error);
            throw fallbackError;
        }
    }
}
