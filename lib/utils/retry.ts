/**
 * Retry utility for resilient operations
 */

import { logger } from '@/lib/logger';

export interface RetryOptions {
    maxRetries?: number;
    delay?: number; // Initial delay in ms
    backoff?: 'exponential' | 'linear' | 'fixed';
    onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        delay = 1000,
        backoff = 'exponential',
        onRetry
    } = options;
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            // Don't retry on rate limit errors (429) - wait longer
            if (lastError.message.includes('Rate limit') || lastError.message.includes('429')) {
                logger.warn('Rate limit hit - skipping retry', { error: lastError.message });
                throw lastError;
            }
            
            // Don't retry on timeout errors immediately
            if (lastError.message.includes('timeout') && attempt < maxRetries) {
                // Wait longer for timeout errors
                const waitTime = delay * Math.pow(2, attempt + 1); // Extra delay for timeouts
                logger.info(`Timeout error - waiting ${waitTime}ms before retry`, {
                    attempt: attempt + 1,
                    maxRetries
                });
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            if (attempt === maxRetries) {
                logger.warn(`Retry exhausted after ${maxRetries} attempts`, { error: lastError.message });
                throw lastError;
            }
            
            // Calculate delay
            let waitTime = delay;
            if (backoff === 'exponential') {
                waitTime = delay * Math.pow(2, attempt);
            } else if (backoff === 'linear') {
                waitTime = delay * (attempt + 1);
            }
            
            // Cap maximum wait time at 30 seconds
            waitTime = Math.min(waitTime, 30000);
            
            // Call onRetry callback
            if (onRetry) {
                onRetry(attempt + 1, lastError);
            }
            
            logger.info(`Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms`, {
                error: lastError.message
            });
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    
    throw lastError || new Error('Retry failed');
}

/**
 * Retry with circuit breaker pattern
 */
export class CircuitBreaker {
    private failures = 0;
    private lastFailureTime?: Date;
    private state: 'closed' | 'open' | 'half-open' = 'closed';
    
    constructor(
        private threshold: number = 5,
        private timeout: number = 60000 // 1 minute
    ) {}
    
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        // Check if circuit is open
        if (this.state === 'open') {
            if (this.lastFailureTime && 
                Date.now() - this.lastFailureTime.getTime() > this.timeout) {
                // Try half-open
                this.state = 'half-open';
            } else {
                throw new Error('Circuit breaker is open');
            }
        }
        
        try {
            const result = await fn();
            
            // Success - reset failures
            if (this.state === 'half-open') {
                this.state = 'closed';
                this.failures = 0;
            } else {
                this.failures = 0;
            }
            
            return result;
        } catch (error) {
            this.failures++;
            this.lastFailureTime = new Date();
            
            if (this.failures >= this.threshold) {
                this.state = 'open';
            }
            
            throw error;
        }
    }
    
    getState(): 'closed' | 'open' | 'half-open' {
        return this.state;
    }
}
