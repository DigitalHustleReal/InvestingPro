/**
 * OpenAPI Documentation Endpoint
 * 
 * Serves OpenAPI 3.0 specification for API documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    generateOpenAPISpec,
    type OpenAPISchema,
    type OpenAPIResponses,
} from '@/lib/api/openapi-generator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Build a success response with a custom data schema. */
function createSuccessResponse(dataSchema: OpenAPISchema): OpenAPIResponses[string] {
    return {
        description: 'Successful response',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: dataSchema,
                    },
                },
            },
        },
    };
}

/** Build an error response. */
function createErrorResponse(description: string): OpenAPIResponses[string] {
    return {
        description,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    required: ['success', 'error'],
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string' },
                    },
                },
            },
        },
    };
}

export async function GET(request: NextRequest) {
    try {
        // Define API paths
        const paths = [
            // Articles
            {
                path: '/api/articles/public',
                method: 'get' as const,
                summary: 'Get public articles',
                description: 'Retrieve published articles with pagination and filtering',
                tags: ['Articles'],
                parameters: [
                    {
                        name: 'page',
                        in: 'query' as const,
                        required: false,
                        schema: { type: 'integer', minimum: 1, default: 1 },
                        description: 'Page number',
                    },
                    {
                        name: 'limit',
                        in: 'query' as const,
                        required: false,
                        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                        description: 'Items per page',
                    },
                    {
                        name: 'category',
                        in: 'query' as const,
                        required: false,
                        schema: { type: 'string' },
                        description: 'Filter by category',
                    },
                    {
                        name: 'search',
                        in: 'query' as const,
                        required: false,
                        schema: { type: 'string' },
                        description: 'Search query',
                    },
                ],
                responses: {
                    '200': createSuccessResponse({
                        type: 'object',
                        properties: {
                            articles: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        title: { type: 'string' },
                                        slug: { type: 'string' },
                                        excerpt: { type: 'string' },
                                        category: { type: 'string' },
                                        published_at: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                            pagination: {
                                type: 'object',
                                properties: {
                                    page: { type: 'integer' },
                                    limit: { type: 'integer' },
                                    total: { type: 'integer' },
                                    totalPages: { type: 'integer' },
                                },
                            },
                        },
                    }),
                    '400': createErrorResponse('Bad request'),
                    '500': createErrorResponse('Internal server error'),
                },
            },
            // Health endpoints
            {
                path: '/api/health',
                method: 'get' as const,
                summary: 'Health Check',
                description: 'Check API health and service status',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'Service is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status', 'timestamp', 'uptime_seconds', 'components'],
                                    properties: {
                                        status: {
                                            type: 'string',
                                            enum: ['healthy', 'degraded', 'unhealthy'],
                                        },
                                        timestamp: {
                                            type: 'string',
                                            format: 'date-time',
                                        },
                                        uptime_seconds: {
                                            type: 'number',
                                        },
                                        components: {
                                            type: 'object',
                                            required: ['database', 'cache', 'ai_providers'],
                                            properties: {
                                                database: {
                                                    type: 'string',
                                                    enum: ['healthy', 'degraded', 'unhealthy'],
                                                },
                                                cache: {
                                                    type: 'string',
                                                    enum: ['healthy', 'degraded', 'unhealthy'],
                                                },
                                                ai_providers: {
                                                    type: 'string',
                                                    enum: ['healthy', 'degraded', 'unhealthy'],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                path: '/api/health/liveness',
                method: 'get' as const,
                summary: 'Liveness probe',
                description: 'Kubernetes liveness probe endpoint',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'Service is alive',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status', 'timestamp'],
                                    properties: {
                                        status: { type: 'string', example: 'alive' },
                                        timestamp: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                        },
                    },
                    '503': {
                        description: 'Service is not alive',
                    },
                },
            },
            {
                path: '/api/health/readiness',
                method: 'get' as const,
                summary: 'Readiness probe',
                description: 'Kubernetes readiness probe endpoint',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'Service is ready',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status', 'timestamp'],
                                    properties: {
                                        status: { type: 'string', example: 'ready' },
                                        timestamp: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                        },
                    },
                    '503': {
                        description: 'Service is not ready',
                    },
                },
            },
            // Metrics
            {
                path: '/api/metrics',
                method: 'get' as const,
                summary: 'Prometheus metrics',
                description: 'Exposes Prometheus metrics in text format',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Prometheus metrics',
                        content: {
                            'text/plain': {
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            // Database Performance
            {
                path: '/api/v1/admin/database/performance',
                method: 'get' as const,
                summary: 'Database performance metrics',
                description: 'Get database performance metrics (admin only)',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': createSuccessResponse({
                        type: 'object',
                        properties: {
                            slowQueries: {
                                type: 'array',
                                items: { type: 'object' },
                            },
                            connectionPool: { type: 'object' },
                            tableSizes: {
                                type: 'array',
                                items: { type: 'object' },
                            },
                            tableGrowth: {
                                type: 'array',
                                items: { type: 'object' },
                            },
                        },
                    }),
                },
            },
        ];

        const spec = generateOpenAPISpec(paths as OpenAPIPath[]);

        return NextResponse.json(spec, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to generate OpenAPI spec',
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
