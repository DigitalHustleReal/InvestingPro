/**
 * Input Sanitization Utilities
 * Sanitizes user inputs to prevent XSS and injection attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content
 * isomorphic-dompurify handles server/client environment detection automatically
 */
export function sanitizeHTML(html: string): string {
    // isomorphic-dompurify automatically handles both server and client environments
    return DOMPurify.sanitize(html);
}

/**
 * Sanitize text (remove HTML tags)
 */
export function sanitizeText(text: string): string {
    return sanitizeHTML(text).replace(/<[^>]*>/g, '');
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
    // Remove special characters that could be used for injection
    return query
        .replace(/[<>'"&]/g, '')
        .trim()
        .substring(0, 200); // Limit length
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): string {
    try {
        const parsed = new URL(url);
        // Only allow http/https
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error('Invalid protocol');
        }
        return parsed.toString();
    } catch {
        return '';
    }
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeText(sanitized[key]) as any;
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeObject(sanitized[key]) as any;
        }
    }
    return sanitized;
}
