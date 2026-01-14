/**
 * OpenAPI Specification Generator
 * 
 * Generates OpenAPI 3.0 specification from Zod schemas and route metadata
 * Integrates with existing validation schemas
 */

import { z } from 'zod';
import { createHash } from 'crypto';

export interface OpenAPIPath {
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    summary?: string;
    description?: string;
    tags?: string[];
    parameters?: OpenAPIParameter[];
    requestBody?: OpenAPIRequestBody;
    responses: OpenAPIResponses;
    security?: OpenAPISecurity[];
}

export interface OpenAPIParameter {
    name: string;
    in: 'query' | 'path' | 'header';
    required?: boolean;
    schema: OpenAPISchema;
    description?: string;
}

export interface OpenAPIRequestBody {
    required?: boolean;
    content: {
        'application/json': {
            schema: OpenAPISchema;
        };
    };
    description?: string;
}

export interface OpenAPIResponses {
    [statusCode: string]: {
        description: string;
        content?: {
            'application/json': {
                schema: OpenAPISchema;
                example?: any;
            };
        };
    };
}

export interface OpenAPISchema {
    type?: string;
    format?: string;
    properties?: Record<string, OpenAPISchema>;
    required?: string[];
    items?: OpenAPISchema;
    enum?: any[];
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    example?: any;
    $ref?: string;
    oneOf?: OpenAPISchema[];
    anyOf?: OpenAPISchema[];
    allOf?: OpenAPISchema[];
}

export interface OpenAPISecurity {
    [name: string]: string[];
}

/**
 * Convert Zod schema to OpenAPI schema
 */
export function zodToOpenAPI(schema: z.ZodTypeAny): OpenAPISchema {
    if (schema instanceof z.ZodString) {
        const openApiSchema: OpenAPISchema = {
            type: 'string',
        };

        if (schema._def.checks) {
            for (const check of schema._def.checks) {
                if (check.kind === 'min') {
                    openApiSchema.minLength = check.value;
                } else if (check.kind === 'max') {
                    openApiSchema.maxLength = check.value;
                } else if (check.kind === 'email') {
                    openApiSchema.format = 'email';
                } else if (check.kind === 'uuid') {
                    openApiSchema.format = 'uuid';
                } else if (check.kind === 'url') {
                    openApiSchema.format = 'uri';
                } else if (check.kind === 'regex') {
                    openApiSchema.pattern = check.regex.source;
                }
            }
        }

        return openApiSchema;
    }

    if (schema instanceof z.ZodNumber) {
        const openApiSchema: OpenAPISchema = {
            type: 'number',
        };

        if (schema._def.checks) {
            for (const check of schema._def.checks) {
                if (check.kind === 'min') {
                    openApiSchema.minimum = check.value;
                } else if (check.kind === 'max') {
                    openApiSchema.maximum = check.value;
                } else if (check.kind === 'int') {
                    openApiSchema.type = 'integer';
                }
            }
        }

        return openApiSchema;
    }

    if (schema instanceof z.ZodBoolean) {
        return { type: 'boolean' };
    }

    if (schema instanceof z.ZodDate) {
        return { type: 'string', format: 'date-time' };
    }

    if (schema instanceof z.ZodEnum) {
        return {
            type: 'string',
            enum: schema._def.values,
        };
    }

    if (schema instanceof z.ZodArray) {
        return {
            type: 'array',
            items: zodToOpenAPI(schema._def.type),
        };
    }

    if (schema instanceof z.ZodObject) {
        const properties: Record<string, OpenAPISchema> = {};
        const required: string[] = [];

        for (const [key, value] of Object.entries(schema.shape)) {
            properties[key] = zodToOpenAPI(value as z.ZodTypeAny);
            
            // Check if field is required
            if (!(value as z.ZodTypeAny)._def.typeName === 'ZodOptional') {
                required.push(key);
            }
        }

        return {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined,
        };
    }

    if (schema instanceof z.ZodOptional) {
        return zodToOpenAPI(schema._def.innerType);
    }

    if (schema instanceof z.ZodNullable) {
        return zodToOpenAPI(schema._def.innerType);
    }

    if (schema instanceof z.ZodDefault) {
        return zodToOpenAPI(schema._def.innerType);
    }

    // Fallback
    return { type: 'object' };
}

/**
 * Generate OpenAPI specification
 */
export function generateOpenAPISpec(paths: OpenAPIPath[]): any {
    const spec = {
        openapi: '3.0.0',
        info: {
            title: 'InvestingPro API',
            version: '1.0.0',
            description: 'API documentation for InvestingPro platform',
            contact: {
                email: 'digitalhustlereal@gmail.com',
            },
        },
        servers: [
            {
                url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                description: 'Production server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        tags: [
            { name: 'Articles', description: 'Article management endpoints' },
            { name: 'Products', description: 'Product comparison endpoints' },
            { name: 'Analytics', description: 'Analytics and tracking endpoints' },
            { name: 'Admin', description: 'Admin-only endpoints' },
            { name: 'Health', description: 'Health check endpoints' },
            { name: 'Workflows', description: 'Workflow management endpoints' },
            { name: 'Automation', description: 'Automation endpoints' },
        ],
        paths: {} as Record<string, any>,
        components: {
            schemas: {} as Record<string, OpenAPISchema>,
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token from Supabase Auth',
                },
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'API key for service-to-service authentication',
                },
            },
        },
    };

    // Convert paths to OpenAPI format
    for (const path of paths) {
        if (!spec.paths[path.path]) {
            spec.paths[path.path] = {};
        }

        spec.paths[path.path][path.method] = {
            summary: path.summary,
            description: path.description,
            tags: path.tags,
            parameters: path.parameters,
            requestBody: path.requestBody,
            responses: {
                ...path.responses,
                '400': {
                    description: 'Bad Request - Validation error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            code: { type: 'string', example: 'VALIDATION_ERROR' },
                                            message: { type: 'string' },
                                            statusCode: { type: 'number', example: 400 },
                                            correlationId: { type: 'string' },
                                            details: { type: 'object' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized - Authentication required',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            code: { type: 'string', example: 'UNAUTHORIZED' },
                                            message: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '403': {
                    description: 'Forbidden - Insufficient permissions',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            code: { type: 'string', example: 'FORBIDDEN' },
                                            message: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal Server Error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            code: { type: 'string', example: 'INTERNAL_ERROR' },
                                            message: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            security: path.security,
        };
    }

    return spec;
}

/**
 * Common response schemas
 */
export const commonResponses = {
    success: {
        '200': {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean', example: true },
                            data: { type: 'object' },
                        },
                    },
                },
            },
        },
    },
    created: {
        '201': {
            description: 'Created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean', example: true },
                            data: { type: 'object' },
                        },
                    },
                },
            },
        },
    },
    noContent: {
        '204': {
            description: 'No Content',
        },
    },
};
