/**
 * Error Handler
 * Centralized error handling and formatting
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getCorrelationId, getRequestId } from '@/lib/middleware/request-context';
import { ApiError, isApiError, ErrorCode } from './types';
import { recordAPIRequest } from '@/lib/metrics/prometheus';

/**
 * Error response format
 */
export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        statusCode: number;
        correlationId?: string;
        requestId?: string;
        details?: any;
        timestamp: string;
    };
}

/**
 * Handle and format errors for API responses
 */
export function handleError(
    error: unknown,
    request?: NextRequest
): NextResponse<ErrorResponse> {
    const correlationId = getCorrelationId();
    const requestId = getRequestId();
    const path = request?.nextUrl.pathname || 'unknown';
    const method = request?.method || 'unknown';

    // If it's already an ApiError, use it directly
    if (isApiError(error)) {
        // Add correlation ID if not present
        if (!error.correlationId && correlationId) {
            (error as any).correlationId = correlationId;
        }

        // Log error
        logger.error('API Error', error, {
            code: error.code,
            statusCode: error.statusCode,
            path,
            method,
            correlationId,
            requestId,
            details: error.details,
            isRetryable: error.isRetryable,
        });

        // Record error metric
        if (typeof window === 'undefined') {
            try {
                recordAPIRequest(method, path, error.statusCode, 0);
            } catch (e) {
                // Ignore metrics errors
            }
        }

        // Return formatted error response
        return NextResponse.json(
            {
                code: error.code,
                statusCode: error.statusCode,
                error: {
                    code: error.code,
                    message: error.message,
                    statusCode: error.statusCode,
                    correlationId: error.correlationId || correlationId,
                    requestId,
                    details: error.details,
                    timestamp: error.timestamp,
                },
            },
            {
                status: error.statusCode,
                headers: {
                    'X-Correlation-ID': error.correlationId || correlationId || '',
                    'X-Request-ID': requestId || '',
                    'X-Error-Code': error.code,
                },
            }
        );
    }

    // Handle unknown errors
    const unknownError = error instanceof Error ? error : new Error(String(error));
    
    // Determine if it's a known error type we can map
    const mappedError = mapUnknownError(unknownError);
    
    if (mappedError) {
        return handleError(mappedError, request);
    }

    // Log unknown error
    logger.error('Unknown Error', unknownError, {
        path,
        method,
        correlationId,
        requestId,
        stack: unknownError.stack,
    });

    // Record error metric
    if (typeof window === 'undefined') {
        try {
            recordAPIRequest(method, path, 500, 0);
        } catch (e) {
            // Ignore metrics errors
        }
    }

    // Return generic error (don't expose internal details in production)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
        {
            code: ErrorCode.INTERNAL_ERROR,
            statusCode: 500,
            error: {
                code: ErrorCode.INTERNAL_ERROR,
                message: isDevelopment 
                    ? unknownError.message 
                    : 'An internal error occurred',
                statusCode: 500,
                correlationId,
                requestId,
                details: isDevelopment ? {
                    stack: unknownError.stack,
                    name: unknownError.name,
                } : undefined,
                timestamp: new Date().toISOString(),
            },
        },
        {
            status: 500,
            headers: {
                'X-Correlation-ID': correlationId || '',
                'X-Request-ID': requestId || '',
                'X-Error-Code': ErrorCode.INTERNAL_ERROR,
            },
        }
    );
}

/**
 * Map unknown errors to ApiError types
 */
function mapUnknownError(error: Error): ApiError | null {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Database errors
    if (
        name.includes('postgres') ||
        name.includes('supabase') ||
        message.includes('database') ||
        message.includes('connection') ||
        message.includes('query')
    ) {
        return new ApiError(
            ErrorCode.DATABASE_ERROR,
            'Database operation failed',
            500,
            { cause: error, isRetryable: true }
        );
    }

    // Network/timeout errors
    if (
        message.includes('timeout') ||
        message.includes('etimedout') ||
        name.includes('timeout')
    ) {
        return new ApiError(
            ErrorCode.TIMEOUT_ERROR,
            'Request timed out',
            504,
            { cause: error, isRetryable: true }
        );
    }

    // Connection errors
    if (
        message.includes('econnrefused') ||
        message.includes('network') ||
        message.includes('fetch failed')
    ) {
        return new ApiError(
            ErrorCode.EXTERNAL_SERVICE_ERROR,
            'External service unavailable',
            502,
            { cause: error, isRetryable: true }
        );
    }

    // Validation errors (common patterns)
    if (
        message.includes('invalid') ||
        message.includes('required') ||
        message.includes('missing') ||
        message.includes('validation')
    ) {
        return new ApiError(
            ErrorCode.VALIDATION_ERROR,
            error.message,
            400,
            { cause: error, isRetryable: false }
        );
    }

    // Not found errors
    if (
        message.includes('not found') ||
        message.includes('does not exist') ||
        message.includes('not exist')
    ) {
        return new ApiError(
            ErrorCode.NOT_FOUND,
            error.message,
            404,
            { cause: error, isRetryable: false }
        );
    }

    // Rate limit errors
    if (
        message.includes('rate limit') ||
        message.includes('too many requests') ||
        name.includes('ratelimit')
    ) {
        return new ApiError(
            ErrorCode.RATE_LIMITED,
            'Rate limit exceeded',
            429,
            { cause: error, isRetryable: true }
        );
    }

    return null;
}

/**
 * Wrap async handler with error handling
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T,
    routeName?: string
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await handler(...args);
        } catch (error) {
            const request = args[0] as NextRequest;
            return handleError(error, request);
        }
    }) as T;
}
