/**
 * Request Context Middleware
 * Manages correlation IDs and request context for logging
 */

import { nanoid } from 'nanoid';

let currentCorrelationId: string | undefined;
let currentRequestId: string | undefined;
let currentUserId: string | undefined;

/**
 * Set request context from headers or generate new IDs
 */
export function setRequestContext(
    correlationId?: string,
    requestId?: string,
    userId?: string
) {
    currentCorrelationId = correlationId || nanoid();
    currentRequestId = requestId || nanoid();
    if (userId) currentUserId = userId;
}

/**
 * Get current correlation ID
 */
export function getCorrelationId(): string | undefined {
    return currentCorrelationId;
}

/**
 * Get current request ID
 */
export function getRequestId(): string | undefined {
    return currentRequestId;
}

/**
 * Get current user ID
 */
export function getUserId(): string | undefined {
    return currentUserId;
}

/**
 * Clear request context (call after request completes)
 */
export function clearRequestContext() {
    currentCorrelationId = undefined;
    currentRequestId = undefined;
    currentUserId = undefined;
}
