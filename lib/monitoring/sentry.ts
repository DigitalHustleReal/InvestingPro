/**
 * Sentry Error Monitoring Integration
 * 
 * Provides real-time error tracking, alerting, and debugging for production issues.
 * 
 * Setup:
 * 1. Install: npm install @sentry/nextjs
 * 2. Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 * 3. Call initSentry() in app/layout.tsx
 */

import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/logger';

let sentryInitialized = false;

/**
 * Initialize Sentry error monitoring
 * Call this once in app/layout.tsx
 */
export function initSentry() {
    // Only initialize once
    if (sentryInitialized) {
        return;
    }

    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    
    if (!dsn) {
        if (process.env.NODE_ENV === 'production') {
            logger.warn('Sentry DSN not configured - error monitoring disabled');
        }
        return;
    }

    try {
        Sentry.init({
            dsn,
            environment: process.env.NODE_ENV || 'development',
            
            // Performance Monitoring
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            
            // Session Replay (optional - captures user sessions for debugging)
            replaysSessionSampleRate: 0.1, // 10% of sessions
            replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
            
            // Integrations
            integrations: [
                new Sentry.BrowserTracing({
                    // Set sampling rate for performance monitoring
                    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
                }),
                new Sentry.Replay({
                    maskAllText: true,
                    blockAllMedia: true,
                }),
            ],
            
            // Filter out sensitive data
            beforeSend(event, hint) {
                // Remove sensitive headers
                if (event.request?.headers) {
                    delete event.request.headers['authorization'];
                    delete event.request.headers['cookie'];
                    delete event.request.headers['x-api-key'];
                }
                
                // Remove sensitive cookies
                if (event.request?.cookies) {
                    delete event.request.cookies;
                }
                
                // Filter out known non-critical errors
                const error = hint.originalException;
                if (error instanceof Error) {
                    // Ignore network errors from ad blockers
                    if (error.message.includes('blocked by client')) {
                        return null;
                    }
                    
                    // Ignore ResizeObserver errors (browser quirk)
                    if (error.message.includes('ResizeObserver')) {
                        return null;
                    }
                }
                
                return event;
            },
            
            // Ignore certain errors
            ignoreErrors: [
                // Browser extensions
                'top.GLOBALS',
                // Random plugins/extensions
                'originalCreateNotification',
                'canvas.contentDocument',
                'MyApp_RemoveAllHighlights',
                // Facebook borked
                'fb_xd_fragment',
                // ISP injected ads
                'bmi_SafeAddOnload',
                'EBCallBackMessageReceived',
                // Chrome extensions
                'chrome-extension://',
                'moz-extension://',
            ],
        });

        sentryInitialized = true;
        logger.info('Sentry error monitoring initialized');
    } catch (error) {
        logger.error('Failed to initialize Sentry', error as Error);
    }
}

/**
 * Capture an exception in Sentry
 * Use this for critical errors that need immediate attention
 */
export function captureException(error: Error, context?: Record<string, any>) {
    if (!sentryInitialized) {
        logger.error('Sentry not initialized, logging error locally', error, context);
        return;
    }

    Sentry.captureException(error, {
        extra: context,
    });
}

/**
 * Capture a message in Sentry
 * Use this for important events or warnings
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
    if (!sentryInitialized) {
        logger.info(message, undefined, context);
        return;
    }

    Sentry.captureMessage(message, {
        level,
        extra: context,
    });
}

/**
 * Set user context for error tracking
 * Call this when user logs in
 */
export function setUserContext(user: { id: string; email?: string; username?: string }) {
    if (!sentryInitialized) return;

    Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
    });
}

/**
 * Clear user context
 * Call this when user logs out
 */
export function clearUserContext() {
    if (!sentryInitialized) return;

    Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 * Use this to track user actions leading up to an error
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
    if (!sentryInitialized) return;

    Sentry.addBreadcrumb({
        message,
        data,
        timestamp: Date.now() / 1000,
    });
}

/**
 * Wrap async function with error tracking
 * Automatically captures and reports errors
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: Record<string, any>
): T {
    return (async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            captureException(error as Error, {
                ...context,
                functionName: fn.name,
                arguments: args,
            });
            throw error;
        }
    }) as T;
}

/**
 * Create a Sentry transaction for performance monitoring
 */
export function startTransaction(name: string, op: string) {
    if (!sentryInitialized) return null;

    return Sentry.startTransaction({
        name,
        op,
    });
}

// Export Sentry for advanced usage
export { Sentry };
