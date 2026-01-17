/**
 * User-Friendly Error Messages
 * 
 * Maps technical errors to user-friendly messages
 */

export interface ErrorMapping {
    pattern: RegExp | string;
    message: string;
    action?: string; // Suggested action
}

const errorMappings: ErrorMapping[] = [
    // Authentication errors
    {
        pattern: /unauthorized|401/i,
        message: 'You need to sign in to continue.',
        action: 'Please sign in and try again.',
    },
    {
        pattern: /forbidden|403/i,
        message: "You don't have permission to perform this action.",
        action: 'Contact your administrator if you need access.',
    },
    // Not found errors
    {
        pattern: /not found|404/i,
        message: "The item you're looking for doesn't exist.",
        action: 'It may have been deleted or moved.',
    },
    // Network errors
    {
        pattern: /network|failed to fetch|fetch failed/i,
        message: 'Unable to connect to the server.',
        action: 'Please check your internet connection and try again.',
    },
    {
        pattern: /timeout/i,
        message: 'The request took too long to complete.',
        action: 'Please try again in a moment.',
    },
    // Validation errors
    {
        pattern: /validation|invalid/i,
        message: 'Some information is missing or incorrect.',
        action: 'Please check the form and try again.',
    },
    {
        pattern: /required|missing/i,
        message: 'Some required fields are missing.',
        action: 'Please fill in all required fields.',
    },
    // Server errors
    {
        pattern: /server error|500|internal server error/i,
        message: 'Something went wrong on our end.',
        action: 'We\'ve been notified. Please try again in a few moments.',
    },
    {
        pattern: /service unavailable|503/i,
        message: 'The service is temporarily unavailable.',
        action: 'Please try again in a few minutes.',
    },
    // Rate limiting
    {
        pattern: /rate limit|too many requests|429/i,
        message: 'You\'ve made too many requests. Please slow down.',
        action: 'Wait a moment before trying again.',
    },
    // Article-specific errors
    {
        pattern: /duplicate.*slug|slug.*already exists/i,
        message: 'An article with this URL already exists.',
        action: 'Please change the title or slug to create a unique URL.',
    },
    {
        pattern: /article.*not found/i,
        message: 'Article not found.',
        action: 'It may have been deleted or you may not have permission to view it.',
    },
];

/**
 * Convert technical error to user-friendly message
 */
export function getUserFriendlyError(error: Error | string | unknown): {
    message: string;
    action?: string;
    original?: string;
} {
    const errorString = error instanceof Error ? error.message : String(error);
    
    // Check for exact matches first
    for (const mapping of errorMappings) {
        const pattern = typeof mapping.pattern === 'string' 
            ? new RegExp(mapping.pattern, 'i') 
            : mapping.pattern;
        
        if (pattern.test(errorString)) {
            return {
                message: mapping.message,
                action: mapping.action,
                original: errorString,
            };
        }
    }

    // Default fallback
    return {
        message: 'Something went wrong. Please try again.',
        action: 'If the problem persists, contact support.',
        original: errorString,
    };
}

/**
 * Format error for display in UI
 */
export function formatErrorForUI(error: Error | string | unknown): string {
    const { message, action } = getUserFriendlyError(error);
    return action ? `${message} ${action}` : message;
}
