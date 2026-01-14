/**
 * Canonical URL Management
 * 
 * Generates canonical URLs and handles URL normalization
 */

export interface CanonicalConfig {
    baseUrl: string;
    trailingSlash?: boolean;
    lowercase?: boolean;
}

const defaultConfig: CanonicalConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in',
    trailingSlash: false,
    lowercase: true,
};

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, config?: Partial<CanonicalConfig>): string {
    const mergedConfig = { ...defaultConfig, ...config };
    
    // Normalize path
    let normalizedPath = path;
    
    // Remove leading/trailing slashes (except root)
    normalizedPath = normalizedPath.replace(/^\/+|\/+$/g, '');
    if (normalizedPath && !normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
    }
    
    // Convert to lowercase if configured
    if (mergedConfig.lowercase) {
        normalizedPath = normalizedPath.toLowerCase();
    }
    
    // Add trailing slash if configured
    if (mergedConfig.trailingSlash && normalizedPath !== '/') {
        normalizedPath = normalizedPath + '/';
    }
    
    // Remove query parameters and hash
    normalizedPath = normalizedPath.split('?')[0].split('#')[0];
    
    // Combine with base URL
    const baseUrl = mergedConfig.baseUrl.replace(/\/+$/, '');
    return `${baseUrl}${normalizedPath}`;
}

/**
 * Get canonical URL for current page
 */
export function getCanonicalUrl(pathname: string, searchParams?: URLSearchParams): string {
    // Remove query parameters for canonical (unless they're important)
    const importantParams = ['page', 'sort']; // Keep pagination/sorting params if needed
    let canonicalPath = pathname;
    
    if (searchParams && importantParams.some(param => searchParams.has(param))) {
        const filteredParams = new URLSearchParams();
        importantParams.forEach(param => {
            if (searchParams.has(param)) {
                filteredParams.set(param, searchParams.get(param)!);
            }
        });
        canonicalPath = `${pathname}?${filteredParams.toString()}`;
    }
    
    return generateCanonicalUrl(canonicalPath);
}

/**
 * Check if URL is canonical
 */
export function isCanonicalUrl(url: string, canonicalUrl: string): boolean {
    // Normalize both URLs for comparison
    const normalize = (u: string) => u.toLowerCase().replace(/\/+$/, '');
    return normalize(url) === normalize(canonicalUrl);
}
