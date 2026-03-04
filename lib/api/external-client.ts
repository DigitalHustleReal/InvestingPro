interface CircuitBreakerState {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    lastFailureTime: number;
}

interface RequestOptions extends RequestInit {
    retries?: number;
    timeout?: number;
    circuitBreakerKey?: string; // Unique key for the service (e.g., "openai", "amfi")
}

const CIRCUIT_BREAKER_THRESHOLD = 5; // Failures before opening
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute cooldown
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 3;

// In-memory store for circuit breaker states
const breakerStates: Record<string, CircuitBreakerState> = {};

function getBreakerState(key: string): CircuitBreakerState {
    if (!breakerStates[key]) {
        breakerStates[key] = { status: 'CLOSED', failureCount: 0, lastFailureTime: 0 };
    }
    return breakerStates[key];
}

/**
 * Robust External API Client
 * Features:
 * - Timeouts
 * - Retries with exponential backoff
 * - Circuit Breaker pattern
 */
export async function externalInfoFetch(url: string, options: RequestOptions = {}) {
    const key = options.circuitBreakerKey || new URL(url).hostname;
    const state = getBreakerState(key);

    // 1. Check Circuit Breaker
    if (state.status === 'OPEN') {
        if (Date.now() - state.lastFailureTime > CIRCUIT_BREAKER_TIMEOUT) {
            state.status = 'HALF_OPEN'; // Try one request
        } else {
            throw new Error(`Circuit Breaker OPEN for ${key}. Request blocked.`);
        }
    }

    const retries = options.retries ?? DEFAULT_RETRIES;
    const timeout = options.timeout ?? DEFAULT_TIMEOUT;
    
    let lastError: unknown;

    for (let i = 0; i <= retries; i++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            clearTimeout(id);

            if (!response.ok) {
                 // 5xx errors are retryable, 4xx are not (usually)
                if (response.status >= 500 || response.status === 429) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                // For 4xx errors, don't retry, just return
                return response;
            }

            // Success: Reset Circuit Breaker
            if (state.status !== 'CLOSED') {
                state.status = 'CLOSED';
                state.failureCount = 0;
            }
            return response;

        } catch (error: unknown) {
            lastError = error;
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.warn(`Attempt ${i + 1}/${retries + 1} failed for ${url}:`, errorMessage);

            // Don't retry if aborted (timeout) and it was the last try
            if (i === retries) break;

            // Wait with exponential backoff: 1s, 2s, 4s...
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // Failure after retries
    state.failureCount++;
    state.lastFailureTime = Date.now();
    
    if (state.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
        state.status = 'OPEN';
        logger.error(`Circuit Breaker TRIPPED for ${key}`);
    }

    throw lastError;
}

/**
 * Wrapper for JSON requests
 */
export async function fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const response = await externalInfoFetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

/**
 * Wrapper for Text requests
 */
export async function fetchText(url: string, options: RequestOptions = {}): Promise<string> {
    const response = await externalInfoFetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.text();
}
