/**
 * OpenTelemetry Tracing Setup
 * Integrates with Axiom for distributed tracing
 * 
 * This module initializes OpenTelemetry SDK and exports traces to Axiom
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, context, Span, SpanStatusCode } from '@opentelemetry/api';
import { logger } from '../logger';

let sdk: NodeSDK | null = null;
let isInitialized = false;

/**
 * Initialize OpenTelemetry SDK
 * Should be called once during app startup
 */
export function initializeTracing(): void {
    // Only initialize in server-side (not in browser)
    if (typeof window !== 'undefined') {
        return;
    }

    // Skip if already initialized
    if (isInitialized) {
        return;
    }

    const enabled = process.env.OTEL_ENABLED === 'true';
    if (!enabled) {
        logger.debug('OpenTelemetry tracing disabled (OTEL_ENABLED not set to true)');
        return;
    }

    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 
                    process.env.AXIOM_OTLP_ENDPOINT ||
                    'https://api.axiom.co/v1/traces';

    const apiKey = process.env.AXIOM_API_KEY || process.env.OTEL_EXPORTER_OTLP_HEADERS?.split(':')[1];
    
    if (!apiKey) {
        logger.warn('OpenTelemetry enabled but no API key found. Set AXIOM_API_KEY or OTEL_EXPORTER_OTLP_HEADERS');
        return;
    }

    try {
        // Create trace exporter for Axiom
        const traceExporter = new OTLPTraceExporter({
            url: endpoint,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }) as any;

        // Create resource with service information
        const resource = resourceFromAttributes({
            [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'investingpro-api',
            [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
        });

        // Initialize SDK
        sdk = new NodeSDK({
            resource,
            traceExporter,
            instrumentations: [
                getNodeAutoInstrumentations({
                    // Disable HTTP instrumentation (we'll add custom)
                    '@opentelemetry/instrumentation-http': {
                        enabled: true,
                        ignoreIncomingRequestHook: (req) => {
                            // Ignore health checks and metrics endpoints
                            const url = req.url || '';
                            return url.includes('/api/health') || url.includes('/api/metrics');
                        },
                    },
                    '@opentelemetry/instrumentation-fs': {
                        enabled: false, // Disable file system tracing (too noisy)
                    },
                }),
            ],
        });

        // Start SDK
        sdk.start();
        isInitialized = true;

        logger.info('OpenTelemetry tracing initialized', {
            endpoint,
            service: process.env.SERVICE_NAME || 'investingpro-api',
        });
    } catch (error) {
        logger.error('Failed to initialize OpenTelemetry', error as Error);
    }
}

/**
 * Shutdown OpenTelemetry SDK
 * Call this on app shutdown to flush remaining traces
 */
export async function shutdownTracing(): Promise<void> {
    if (sdk) {
        try {
            await sdk.shutdown();
            logger.info('OpenTelemetry tracing shutdown complete');
        } catch (error) {
            logger.error('Error shutting down OpenTelemetry', error as Error);
        }
    }
}

/**
 * Get tracer instance
 */
export function getTracer(name: string = 'investingpro-api') {
    return trace.getTracer(name);
}

/**
 * Create a span for an operation
 */
export async function withSpan<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, string | number | boolean>
): Promise<T> {
    const tracer = getTracer();
    return tracer.startActiveSpan(name, async (span) => {
        try {
            // Add attributes
            if (attributes) {
                Object.entries(attributes).forEach(([key, value]) => {
                    span.setAttribute(key, value);
                });
            }

            // Add correlation ID if available
            const { getCorrelationId, getRequestId, getUserId } = await import('../middleware/request-context');
            const correlationId = getCorrelationId();
            const requestId = getRequestId();
            const userId = getUserId();

            if (correlationId) {
                span.setAttribute('correlation.id', correlationId);
            }
            if (requestId) {
                span.setAttribute('request.id', requestId);
            }
            if (userId) {
                span.setAttribute('user.id', userId);
            }

            const result = await fn(span);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: (error as Error).message,
            });
            span.recordException(error as Error);
            throw error;
        } finally {
            span.end();
        }
    });
}

/**
 * Add event to current span
 */
export function addSpanEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    const activeSpan = trace.getActiveSpan();
    if (activeSpan) {
        activeSpan.addEvent(name, attributes);
    }
}

/**
 * Set attribute on current span
 */
export function setSpanAttribute(key: string, value: string | number | boolean): void {
    const activeSpan = trace.getActiveSpan();
    if (activeSpan) {
        activeSpan.setAttribute(key, value);
    }
}

/**
 * Check if tracing is enabled
 */
export function isTracingEnabled(): boolean {
    return isInitialized && process.env.OTEL_ENABLED === 'true';
}
