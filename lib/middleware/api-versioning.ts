/**
 * API Versioning Middleware
 * Phase 1: Critical Security & Stability
 * 
 * Enforces API versioning for all routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export type ApiVersion = 'v1';

const SUPPORTED_VERSIONS: ApiVersion[] = ['v1'];
const DEFAULT_VERSION: ApiVersion = 'v1';

/**
 * Extract API version from request
 */
export function extractApiVersion(request: NextRequest): ApiVersion {
    // 1. Check X-API-Version header
    const headerVersion = request.headers.get('X-API-Version');
    if (headerVersion && SUPPORTED_VERSIONS.includes(headerVersion as ApiVersion)) {
        return headerVersion as ApiVersion;
    }
    
    // 2. Check query parameter
    const queryVersion = request.nextUrl.searchParams.get('v');
    if (queryVersion && SUPPORTED_VERSIONS.includes(queryVersion as ApiVersion)) {
        return queryVersion as ApiVersion;
    }
    
    // 3. Check path (e.g., /api/v1/articles)
    const pathMatch = request.nextUrl.pathname.match(/^\/api\/(v\d+)\//);
    if (pathMatch && SUPPORTED_VERSIONS.includes(pathMatch[1] as ApiVersion)) {
        return pathMatch[1] as ApiVersion;
    }
    
    // 4. Default to v1
    return DEFAULT_VERSION;
}

/**
 * Create versioned error response
 */
function createVersionErrorResponse(version: string | null): NextResponse {
    return NextResponse.json(
        {
            error: {
                code: 'INVALID_API_VERSION',
                message: `Unsupported API version: ${version}. Supported versions: ${SUPPORTED_VERSIONS.join(', ')}`,
                supported_versions: SUPPORTED_VERSIONS,
                default_version: DEFAULT_VERSION
            }
        },
        {
            status: 400,
            headers: {
                'X-API-Version': DEFAULT_VERSION,
                'X-Supported-Versions': SUPPORTED_VERSIONS.join(', ')
            }
        }
    );
}

/**
 * Wrapper for API route handlers with versioning
 */
export function withApiVersioning<T extends any[]>(
    handler: (request: NextRequest, version: ApiVersion, ...args: T) => Promise<NextResponse>
) {
    return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
        const version = extractApiVersion(request);
        
        // Validate version
        if (!SUPPORTED_VERSIONS.includes(version)) {
            logger.warn('Invalid API version requested', {
                version,
                path: request.nextUrl.pathname,
                supported: SUPPORTED_VERSIONS
            });
            return createVersionErrorResponse(version);
        }
        
        // Add version to response headers
        const response = await handler(request, version, ...args);
        response.headers.set('X-API-Version', version);
        response.headers.set('X-Supported-VersIONS', SUPPORTED_VERSIONS.join(', '));
        
        return response;
    };
}

/**
 * Get API version from request (for use in route handlers)
 */
export function getApiVersion(request: NextRequest): ApiVersion {
    return extractApiVersion(request);
}

/**
 * Create deprecation warning header
 */
export function addDeprecationWarning(response: NextResponse, deprecatedVersion: ApiVersion, sunsetDate: string): NextResponse {
    response.headers.set('X-API-Deprecated', 'true');
    response.headers.set('X-API-Deprecated-Version', deprecatedVersion);
    response.headers.set('Sunset', sunsetDate);
    response.headers.set('Warning', `299 - "This API version is deprecated. Sunset date: ${sunsetDate}"`);
    return response;
}
