/**
 * Automated Canonical URL Generator
 * 
 * Generates canonical URLs automatically to prevent duplicate content issues
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in';

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(pathname: string, queryParams?: Record<string, string>): string {
    // Remove trailing slash
    const path = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
    
    // Remove query parameters that don't affect content
    // Keep only essential params (if any)
    const essentialParams = queryParams ? 
        Object.entries(queryParams)
            .filter(([key]) => !['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'].includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
        : {};

    // Build URL
    const url = new URL(path, BASE_URL);
    
    // Add essential params
    Object.entries(essentialParams).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });

    return url.toString();
}

/**
 * Normalize pathname for canonical URL
 */
export function normalizePathname(pathname: string): string {
    // Remove trailing slash (except root)
    if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }

    // Normalize case (lowercase)
    pathname = pathname.toLowerCase();

    // Remove index.html, index, etc.
    pathname = pathname.replace(/\/index(\.html)?$/i, '');

    return pathname || '/';
}

/**
 * Check if URL should have canonical (exclude certain paths)
 */
export function shouldHaveCanonical(pathname: string): boolean {
    const excludePaths = [
        '/api/',
        '/admin/',
        '/_next/',
        '/404',
        '/500',
    ];

    return !excludePaths.some(path => pathname.startsWith(path));
}

