import { logger } from './logger';

/**
 * Environment Variable Validator
 * Ensures all critical variables are present and valid at runtime.
 * Implementation of Audit 1, Item 48 (Environment variables validated at runtime).
 */

const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
];

export function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        const errorMsg = `CRITICAL: Missing required environment variables: ${missing.join(', ')}`;
        logger.error(errorMsg);
        
        // In production, we might want to throw an error to prevent the app from starting
        if (process.env.NODE_ENV === 'production') {
            throw new Error(errorMsg);
        }
        
        return {
            valid: false,
            missing
        };
    }
    
    logger.info('Environment validation successful.');
    return {
        valid: true,
        missing: []
    };
}

// Self-executing if imported in a global context (e.g., layout or middleware)
if (typeof window === 'undefined') {
    // Only run on server-side
    validateEnv();
}
