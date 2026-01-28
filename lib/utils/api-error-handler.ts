/**
 * API Error Handler Utility
 * 
 * Provides consistent error handling for API routes with proper logging,
 * error codes, and user-friendly messages.
 * 
 * Usage:
 * import { handleAPIError, APIError } from '@/lib/utils/api-error-handler';
 * 
 * try {
 *   // your code
 * } catch (error) {
 *   return handleAPIError(error, 'Failed to fetch articles', { route: '/api/articles' });
 * }
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { captureException } from '@/lib/monitoring/sentry';

export interface APIErrorResponse {
    error: string;
    code: string;
    message: string;
    requestId?: string;
    timestamp: string;
    details?: any;
}

export class APIError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public details?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * Generate a unique request ID for tracking
 */
function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Handle API errors consistently
 * 
 * @param error - The error object
 * @param userMessage - User-friendly error message
 * @param context - Additional context for logging
 * @returns NextResponse with error details
 */
export function handleAPIError(
    error: unknown,
    userMessage: string = 'An error occurred',
    context?: Record<string, any>
): NextResponse<APIErrorResponse> {
    const requestId = generateRequestId();
    const timestamp = new Date().toISOString();

    // Handle APIError instances
    if (error instanceof APIError) {
        logger.error(error.message, error, {
            ...context,
            requestId,
            code: error.code,
            statusCode: error.statusCode,
        });

        return NextResponse.json({
            error: userMessage,
            code: error.code,
            message: error.message,
            requestId,
            timestamp,
            details: error.details,
        }, { status: error.statusCode });
    }

    // Handle standard Error instances
    if (error instanceof Error) {
        // Determine error code and status based on error message
        let code = 'INTERNAL_ERROR';
        let statusCode = 500;

        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('not found')) {
            code = 'NOT_FOUND';
            statusCode = 404;
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
            code = 'UNAUTHORIZED';
            statusCode = 401;
        } else if (errorMessage.includes('forbidden') || errorMessage.includes('permission')) {
            code = 'FORBIDDEN';
            statusCode = 403;
        } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
            code = 'VALIDATION_ERROR';
            statusCode = 400;
        } else if (errorMessage.includes('timeout')) {
            code = 'TIMEOUT';
            statusCode = 504;
        } else if (errorMessage.includes('database') || errorMessage.includes('connection')) {
            code = 'DATABASE_ERROR';
            statusCode = 503;
        } else if (errorMessage.includes('rate limit')) {
            code = 'RATE_LIMIT';
            statusCode = 429;
        }

        logger.error(userMessage, error, {
            ...context,
            requestId,
            code,
            statusCode,
        });

        // Capture in Sentry for production monitoring
        if (process.env.NODE_ENV === 'production') {
            captureException(error, {
                ...context,
                requestId,
                code,
                userMessage,
            });
        }

        return NextResponse.json({
            error: userMessage,
            code,
            message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred',
            requestId,
            timestamp,
        }, { status: statusCode });
    }

    // Handle unknown errors
    logger.error(userMessage, new Error(String(error)), {
        ...context,
        requestId,
        code: 'UNKNOWN_ERROR',
    });

    return NextResponse.json({
        error: userMessage,
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        requestId,
        timestamp,
    }, { status: 500 });
}

/**
 * Wrap an API handler with error handling
 * 
 * @example
 * export const GET = withAPIErrorHandler(async (request) => {
 *   const data = await fetchData();
 *   return NextResponse.json(data);
 * }, 'Failed to fetch data');
 */
export function withAPIErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T,
    errorMessage: string = 'An error occurred',
    context?: Record<string, any>
): T {
    return (async (...args: any[]) => {
        try {
            return await handler(...args);
        } catch (error) {
            return handleAPIError(error, errorMessage, context);
        }
    }) as T;
}

/**
 * Common API error creators
 */
export const APIErrors = {
    notFound: (resource: string, details?: any) =>
        new APIError(`${resource} not found`, 'NOT_FOUND', 404, details),

    unauthorized: (message: string = 'Unauthorized', details?: any) =>
        new APIError(message, 'UNAUTHORIZED', 401, details),

    forbidden: (message: string = 'Forbidden', details?: any) =>
        new APIError(message, 'FORBIDDEN', 403, details),

    validation: (message: string, details?: any) =>
        new APIError(message, 'VALIDATION_ERROR', 400, details),

    rateLimit: (message: string = 'Rate limit exceeded', details?: any) =>
        new APIError(message, 'RATE_LIMIT', 429, details),

    database: (message: string = 'Database error', details?: any) =>
        new APIError(message, 'DATABASE_ERROR', 503, details),

    timeout: (message: string = 'Request timeout', details?: any) =>
        new APIError(message, 'TIMEOUT', 504, details),

    internal: (message: string = 'Internal server error', details?: any) =>
        new APIError(message, 'INTERNAL_ERROR', 500, details),
};
