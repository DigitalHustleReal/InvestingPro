/**
 * Centralized Logging Utility
 * Production-ready structured logging with correlation IDs and external service support
 * 
 * Features:
 * - Structured JSON logging
 * - Correlation IDs for request tracking
 * - Log levels (DEBUG, INFO, WARN, ERROR)
 * - External service integration (Sentry, Datadog, etc.)
 * - Performance metrics
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    correlationId?: string;
    requestId?: string;
    userId?: string;
    service?: string;
    environment?: string;
    context?: Record<string, any>;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
    metrics?: {
        duration?: number;
        memory?: number;
        cpu?: number;
    };
}

// Import request context management
import { getCorrelationId, getRequestId, getUserId } from './middleware/request-context';

// Correlation ID management (for request tracking)
// Uses request context from middleware

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isProduction = process.env.NODE_ENV === 'production';
    private isStaging = (process.env.NODE_ENV as string) === 'staging' || process.env.VERCEL_ENV === 'preview';
    private serviceName = process.env.SERVICE_NAME || 'investingpro-api';
    private logAggregationService = process.env.LOG_AGGREGATION_SERVICE; // 'datadog' | 'logrocket' | 'axiom' | 'better-stack'

    /**
     * Set correlation ID for request tracking
     * @deprecated Use setRequestContext from lib/middleware/request-context instead
     */
    setCorrelationId(id: string) {
        // Delegate to request context
        const { setRequestContext } = require('./middleware/request-context');
        setRequestContext(id);
    }

    /**
     * Set request ID for API request tracking
     * @deprecated Use setRequestContext from lib/middleware/request-context instead
     */
    setRequestId(id: string) {
        // Delegate to request context
        const { setRequestContext } = require('./middleware/request-context');
        setRequestContext(undefined, id);
    }

    /**
     * Set user ID for user-specific logging
     * @deprecated Use setRequestContext from lib/middleware/request-context instead
     */
    setUserId(id: string) {
        // Delegate to request context
        const { setRequestContext } = require('./middleware/request-context');
        setRequestContext(undefined, undefined, id);
    }

    /**
     * Clear all context (useful for cleanup)
     * @deprecated Use clearRequestContext from lib/middleware/request-context instead
     */
    clearContext() {
        const { clearRequestContext } = require('./middleware/request-context');
        clearRequestContext();
    }

    private formatMessage(
        level: LogLevel,
        message: string,
        context?: Record<string, any>,
        error?: Error
    ): LogEntry {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            environment: this.isProduction ? 'production' : this.isStaging ? 'staging' : 'development',
        };

        // Add correlation IDs if available
        const correlationId = getCorrelationId();
        const requestId = getRequestId();
        const userId = getUserId();
        
        if (correlationId) {
            entry.correlationId = correlationId;
        }
        if (requestId) {
            entry.requestId = requestId;
        }
        if (userId) {
            entry.userId = userId;
        }

        // Add context
        if (context) {
            entry.context = context;
        }

        // Add error details
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
                code: (error as any).code,
            };
        }

        // Add performance metrics in production (Node.js only, not Edge Runtime)
        if (this.isProduction && typeof process !== 'undefined' && typeof process.memoryUsage === 'function') {
            try {
                const memUsage = process.memoryUsage();
                entry.metrics = {
                    memory: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
                };
            } catch {
                // Silently skip if memoryUsage is not available (Edge Runtime)
            }
        }

        return entry;
    }

    private async sendToExternalService(entry: LogEntry) {
        // Skip if no external service configured
        if (!this.logAggregationService) {
            return;
        }

        try {
            // External logging service integration (Axiom, Better Stack, Datadog)
            if (typeof window === 'undefined' && process.env.EXTERNAL_LOGGING_ENABLED === 'true') {
                const { logToExternal } = await import('./logging/external-logger');
                await logToExternal(entry);
            }

            // Sentry integration (for errors) - keep for error tracking
            if (entry.level === 'error' && typeof window === 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
                const Sentry = await import('@sentry/nextjs').catch(() => null);
                if (Sentry?.default) {
                    Sentry.default.captureException(new Error(entry.message), {
                        extra: entry.context,
                        tags: {
                            correlationId: entry.correlationId,
                            requestId: entry.requestId,
                        },
                    });
                }
            }

            // LogRocket integration (if configured) - client-side only
            if (this.logAggregationService === 'logrocket' && typeof window !== 'undefined' && (window as any).LogRocket) {
                (window as any).LogRocket.captureMessage(entry.message, {
                    level: entry.level,
                    extra: entry.context,
                });
            }
        } catch (error) {
            // Fail silently - don't break application if logging fails
            if (process.env.NODE_ENV === 'development') {
                console.error('Failed to send log to external service', error);
            }
        }
    }

    public log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
        const entry = this.formatMessage(level, message, context, error);

        // In production, only log errors and warnings to console
        if (this.isProduction && level === 'debug') {
            // Still send to external service
            this.sendToExternalService(entry).catch(() => {});
            return;
        }

        // Format for console output
        const consoleMessage = this.isProduction
            ? JSON.stringify(entry) // JSON in production
            : `[${entry.timestamp}] [${level.toUpperCase()}] ${message}${entry.correlationId ? ` [${entry.correlationId}]` : ''}`;

        // Use console methods
        switch (level) {
            case 'error':
                console.error(consoleMessage, entry.context || '', entry.error || '');
                break;
            case 'warn':
                console.warn(consoleMessage, entry.context || '');
                break;
            case 'info':
                if (this.isDevelopment || this.isStaging) {
                    console.log(consoleMessage, entry.context || '');
                }
                break;
            case 'debug':
                if (this.isDevelopment) {
                    console.debug(consoleMessage, entry.context || '');
                }
                break;
        }

        // Send to external service
        this.sendToExternalService(entry).catch(() => {});
    }

    /**
     * Log info message
     */
    info(message: string, context?: Record<string, any>) {
        this.log('info', message, context);
    }

    /**
     * Log warning message
     */
    warn(message: string, context?: Record<string, any>) {
        this.log('warn', message, context);
    }

    /**
     * Log error message
     */
    error(message: string, error?: Error, context?: Record<string, any>) {
        this.log('error', message, context, error);
    }

    /**
     * Log debug message (development only)
     */
    debug(message: string, context?: Record<string, any>) {
        this.log('debug', message, context);
    }

    /**
     * Log performance metric
     */
    performance(operation: string, duration: number, context?: Record<string, any>) {
        const entry = this.formatMessage('info', `Performance: ${operation}`, {
            ...context,
            duration_ms: duration,
        });
        entry.metrics = { duration };
        this.log('info', `Performance: ${operation}`, { ...context, duration_ms: duration });
    }

    /**
     * Log API request
     */
    apiRequest(method: string, path: string, statusCode: number, duration: number, context?: Record<string, any>) {
        const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
        this.log(level, `API ${method} ${path} ${statusCode}`, {
            ...context,
            method,
            path,
            statusCode,
            duration_ms: duration,
        });
    }
}

export const logger = new Logger();

/**
 * Middleware helper to set correlation ID from request
 * Re-exported from request-context for convenience
 */
export { setRequestContext, clearRequestContext } from './middleware/request-context';