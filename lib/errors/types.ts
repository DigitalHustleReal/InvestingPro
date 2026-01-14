/**
 * Standardized Error Types
 * Provides consistent error handling across the application
 */

export enum ErrorCode {
    // Client Errors (4xx)
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    CONFLICT = 'CONFLICT',
    RATE_LIMITED = 'RATE_LIMITED',
    PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
    UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
    
    // Server Errors (5xx)
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    WORKFLOW_ERROR = 'WORKFLOW_ERROR',
    AI_PROVIDER_ERROR = 'AI_PROVIDER_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}

export interface ErrorDetails {
    field?: string;
    value?: any;
    reason?: string;
    [key: string]: any;
}

/**
 * Standard API Error Class
 */
export class ApiError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly details?: ErrorDetails;
    public readonly isRetryable: boolean;
    public readonly correlationId?: string;
    public readonly timestamp: string;

    constructor(
        code: ErrorCode,
        message: string,
        statusCode: number,
        options?: {
            details?: ErrorDetails;
            isRetryable?: boolean;
            correlationId?: string;
            cause?: Error;
        }
    ) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = options?.details;
        this.isRetryable = options?.isRetryable ?? false;
        this.correlationId = options?.correlationId;
        this.timestamp = new Date().toISOString();

        // Preserve original error stack if provided
        if (options?.cause) {
            this.cause = options.cause;
            this.stack = options.cause.stack;
        }

        // Ensure stack trace is captured
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Convert error to JSON for API responses
     */
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message,
                statusCode: this.statusCode,
                details: this.details,
                correlationId: this.correlationId,
                timestamp: this.timestamp,
            },
        };
    }
}

/**
 * Convenience constructors for common error types
 */
export class ValidationError extends ApiError {
    constructor(message: string, details?: ErrorDetails) {
        super(
            ErrorCode.VALIDATION_ERROR,
            message,
            400,
            { details, isRetryable: false }
        );
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends ApiError {
    constructor(resource: string, id?: string) {
        super(
            ErrorCode.NOT_FOUND,
            `${resource}${id ? ` with id "${id}"` : ''} not found`,
            404,
            {
                details: { resource, id },
                isRetryable: false,
            }
        );
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(
            ErrorCode.UNAUTHORIZED,
            message,
            401,
            { isRetryable: false }
        );
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = 'Access denied') {
        super(
            ErrorCode.FORBIDDEN,
            message,
            403,
            { isRetryable: false }
        );
        this.name = 'ForbiddenError';
    }
}

export class ConflictError extends ApiError {
    constructor(message: string, details?: ErrorDetails) {
        super(
            ErrorCode.CONFLICT,
            message,
            409,
            { details, isRetryable: false }
        );
        this.name = 'ConflictError';
    }
}

export class RateLimitError extends ApiError {
    constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
        super(
            ErrorCode.RATE_LIMITED,
            message,
            429,
            {
                details: retryAfter ? { retryAfter } : undefined,
                isRetryable: true,
            }
        );
        this.name = 'RateLimitError';
    }
}

export class InternalError extends ApiError {
    constructor(message: string, cause?: Error) {
        super(
            ErrorCode.INTERNAL_ERROR,
            message,
            500,
            { isRetryable: false, cause }
        );
        this.name = 'InternalError';
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(message: string = 'Service temporarily unavailable', retryAfter?: number) {
        super(
            ErrorCode.SERVICE_UNAVAILABLE,
            message,
            503,
            {
                details: retryAfter ? { retryAfter } : undefined,
                isRetryable: true,
            }
        );
        this.name = 'ServiceUnavailableError';
    }
}

export class ExternalServiceError extends ApiError {
    constructor(service: string, message: string, cause?: Error) {
        super(
            ErrorCode.EXTERNAL_SERVICE_ERROR,
            `${service}: ${message}`,
            502,
            {
                details: { service },
                isRetryable: true,
                cause,
            }
        );
        this.name = 'ExternalServiceError';
    }
}

export class DatabaseError extends ApiError {
    constructor(message: string, cause?: Error) {
        super(
            ErrorCode.DATABASE_ERROR,
            `Database error: ${message}`,
            500,
            {
                isRetryable: true,
                cause,
            }
        );
        this.name = 'DatabaseError';
    }
}

export class WorkflowError extends ApiError {
    constructor(workflowId: string, message: string, cause?: Error) {
        super(
            ErrorCode.WORKFLOW_ERROR,
            `Workflow ${workflowId}: ${message}`,
            500,
            {
                details: { workflowId },
                isRetryable: true,
                cause,
            }
        );
        this.name = 'WorkflowError';
    }
}

export class AIProviderError extends ApiError {
    constructor(provider: string, message: string, cause?: Error) {
        super(
            ErrorCode.AI_PROVIDER_ERROR,
            `${provider}: ${message}`,
            502,
            {
                details: { provider },
                isRetryable: true,
                cause,
            }
        );
        this.name = 'AIProviderError';
    }
}

export class TimeoutError extends ApiError {
    constructor(operation: string, timeoutMs: number) {
        super(
            ErrorCode.TIMEOUT_ERROR,
            `${operation} timed out after ${timeoutMs}ms`,
            504,
            {
                details: { operation, timeoutMs },
                isRetryable: true,
            }
        );
        this.name = 'TimeoutError';
    }
}

/**
 * Check if an error is an ApiError
 */
export function isApiError(error: any): error is ApiError {
    return error instanceof ApiError;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
    if (isApiError(error)) {
        return error.isRetryable;
    }
    
    // Default retryable errors
    if (error instanceof Error) {
        const retryableMessages = [
            'timeout',
            'network',
            'connection',
            'econnrefused',
            'etimedout',
            'service unavailable',
        ];
        return retryableMessages.some(msg => 
            error.message.toLowerCase().includes(msg)
        );
    }
    
    return false;
}
