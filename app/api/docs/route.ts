/**
 * OpenAPI Documentation Endpoint
 * 
 * Serves OpenAPI 3.0 specification for API documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateOpenAPISpec } from '@/lib/api/openapi-generator';
import { 
    createArticleSchema, 
    updateArticleSchema,
    articleQuerySchema,
    articleParamsSchema,
} from '@/lib/validation/api-schemas';
import { zodToOpenAPI } from '@/lib/api/openapi-generator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
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
                                },
                            },
                        },
                    },
                } as import('@/lib/api/openapi-generator').OpenAPIResponses,
            },
            // Health endpoints
            {
                path: '/api/health',
                method: 'get' as const,
                summary: 'Health check',
                description: 'Comprehensive health check endpoint',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'System is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
                                        timestamp: { type: 'string', format: 'date-time' },
                                        uptime_seconds: { type: 'integer' },
                                        components: {
                                            type: 'object',
                                            properties: {
                                                database: { type: 'object' },
                                                cache: { type: 'object' },
                                                ai_providers: { type: 'object' },
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
                    '200': {
                        description: 'Database performance metrics',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
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
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ];

        const spec = generateOpenAPISpec(paths);

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
