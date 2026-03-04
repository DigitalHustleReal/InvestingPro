/**
 * Environment Variable Validation
 * Production Safety: Fail fast on missing required environment variables
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'INNGEST_EVENT_KEY',
    'INNGEST_SIGNING_KEY'
];

const requiredOneOf = [
    ['OPENAI_API_KEY', 'GOOGLE_GEMINI_API_KEY', 'GROQ_API_KEY', 'MISTRAL_API_KEY']
];

export function validateEnv() {
    // Only validate in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.VALIDATE_ENV) {
        logger.info('⚠️  Environment validation skipped (development mode)');
        return;
    }
    
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        const errorMessage = 
            `❌ Missing required environment variables:\n` +
            missing.map(key => `   - ${key}`).join('\n') +
            `\n\nPlease check your .env.local file or Vercel environment variables.`;
        
        throw new Error(errorMessage);
    }
    
    // Check at least one AI provider is configured
    const aiProviders = requiredOneOf[0];
    const hasAIProvider = aiProviders.some(key => process.env[key]);
    
    if (!hasAIProvider) {
        const errorMessage =
            `❌ At least one AI provider must be configured:\n` +
            aiProviders.map(key => `   - ${key}`).join(' OR\n') +
            `\n\nPlease add at least one AI provider API key.`;
        
        throw new Error(errorMessage);
    }
    
    logger.info('✅ Environment variables validated');
    logger.info(`   - Database: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...`);
    logger.info(`   - AI Providers: ${aiProviders.filter(key => process.env[key]).join(', ')}`);
}

/**
 * Get environment variable with validation
 */
export function getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key];
    
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    
    return value || defaultValue!;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}
