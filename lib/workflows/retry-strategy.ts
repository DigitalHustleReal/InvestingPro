/**
 * Retry Strategy
 * Implements retry logic with exponential backoff
 */

import { logger } from '@/lib/logger';

export interface RetryConfig {
  maxAttempts: number;
  backoff: 'linear' | 'exponential';
  delay: number; // Initial delay in milliseconds
  maxDelay?: number; // Maximum delay cap
  jitter?: boolean; // Add randomness to prevent thundering herd
}

export class RetryStrategy {
  /**
   * Execute function with retry logic
   */
  static async execute<T>(
    fn: () => Promise<T>,
    config: RetryConfig,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on last attempt
        if (attempt === config.maxAttempts) {
          break;
        }

        // Calculate delay
        const delay = this.calculateDelay(attempt, config);

        // Call retry callback
        if (onRetry) {
          onRetry(attempt, lastError);
        }

        logger.warn('Retrying operation', {
          attempt,
          maxAttempts: config.maxAttempts,
          delay,
          error: lastError.message,
        });

        // Wait before retry
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    throw lastError || new Error('Retry exhausted');
  }

  /**
   * Calculate delay for retry attempt
   */
  private static calculateDelay(attempt: number, config: RetryConfig): number {
    let delay: number;

    if (config.backoff === 'exponential') {
      // Exponential: delay * 2^(attempt - 1)
      delay = config.delay * Math.pow(2, attempt - 1);
    } else {
      // Linear: delay * attempt
      delay = config.delay * attempt;
    }

    // Apply max delay cap
    if (config.maxDelay) {
      delay = Math.min(delay, config.maxDelay);
    }

    // Add jitter (randomness) to prevent thundering herd
    if (config.jitter) {
      const jitterAmount = delay * 0.1; // 10% jitter
      const jitter = (Math.random() * 2 - 1) * jitterAmount; // -10% to +10%
      delay = Math.max(0, delay + jitter);
    }

    return Math.round(delay);
  }

  /**
   * Sleep utility
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: Error): boolean {
    // Network errors, timeouts, and 5xx errors are retryable
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /ECONNREFUSED/i,
      /ETIMEDOUT/i,
      /ENOTFOUND/i,
      /503/i,
      /502/i,
      /504/i,
      /500/i,
    ];

    const errorMessage = error.message || '';
    return retryablePatterns.some(pattern => pattern.test(errorMessage));
  }
}
