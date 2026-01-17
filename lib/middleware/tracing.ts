/**
 * Tracing Middleware for Next.js API Routes
 * Adds OpenTelemetry spans to API requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { withSpan, setSpanAttribute, addSpanEvent, isTracingEnabled } from '../tracing/opentelemetry';
import { getCorrelationId, getRequestId, setRequestContext } from './request-context';

/**
 * Wrap API route handler with tracing
 */
export function withTracing<T extends any[]>(
    handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
    routeName?: string
) {
    return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
        // Skip tracing if disabled
        if (!isTracingEnabled()) {
            return handler(request, ...args);
        }

        const method = request.method;
        const path = request.nextUrl.pathname;
        const route = routeName || `${method} ${path}`;

        // Get or create correlation ID
        const correlationId = request.headers.get('X-Correlation-ID') || 
                             request.headers.get('X-Request-ID') ||
                             undefined;
        const requestId = request.headers.get('X-Request-ID') || undefined;

        // Set request context
        setRequestContext(correlationId, requestId);

        return withSpan(
            route,
            async (span) => {
                // Add request attributes
                setSpanAttribute('http.method', method);
                setSpanAttribute('http.url', path);
                setSpanAttribute('http.route', route);
                
                const userAgent = request.headers.get('user-agent');
                if (userAgent) {
                    setSpanAttribute('http.user_agent', userAgent);
                }

                const startTime = Date.now();

                try {
                    // Execute handler
                    const response = await handler(request, ...args);

                    const duration = Date.now() - startTime;

                    // Add response attributes
                    setSpanAttribute('http.status_code', response.status);
                    setSpanAttribute('http.duration_ms', duration);
                    setSpanAttribute('http.status_text', response.statusText);

                    // Add event for response
                    addSpanEvent('http.response', {
                        status: response.status,
                        duration_ms: duration,
                    });

                    // Add correlation ID to response headers
                    const correlationId = getCorrelationId();
                    const requestId = getRequestId();
                    
                    if (correlationId) {
                        response.headers.set('X-Correlation-ID', correlationId);
                    }
                    if (requestId) {
                        response.headers.set('X-Request-ID', requestId);
                    }

                    return response;
                } catch (error) {
                    const duration = Date.now() - startTime;
                    setSpanAttribute('http.duration_ms', duration);
                    setSpanAttribute('http.error', true);
                    
                    addSpanEvent('http.error', {
                        error: (error as Error).message,
                        duration_ms: duration,
                    });

                    throw error;
                }
            },
            {
                'http.method': method,
                'http.path': path,
            }
        );
    };
}
