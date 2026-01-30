import { z } from 'zod';

/**
 * Environment Variable Validation
 * Ensures the application fails fast if critical configuration is missing.
 * 
 * Features:
 * - Zod-based schema validation
 * - Runtime validation on startup
 * - Fail-fast in production
 * - Graceful handling in development
 */

// Track if validation has run
let validationComplete = false;

const serverSchema = z.object({
    // Database (Required)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url("Supabase URL is required"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key is required"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase Service Role Key is required"),

    // Event System (Required for production workflows)
    INNGEST_EVENT_KEY: z.string().optional(),
    INNGEST_SIGNING_KEY: z.string().optional(),

    // AI Providers (at least one should be configured)
    OPENAI_API_KEY: z.string().optional(),
    GOOGLE_GEMINI_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
    MISTRAL_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    DEEPSEEK_API_KEY: z.string().optional(),
    
    // Security
    CRON_SECRET: z.string().optional(),

    // Analytics
    NEXT_PUBLIC_GA_ID: z.string().optional(),
    
    // Application
    NEXT_PUBLIC_BASE_URL: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
    
    // Email
    RESEND_API_KEY: z.string().optional(),
    SUPPORT_EMAIL: z.string().email().optional(),

    // Monitoring
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

    // Cache (Optional)
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

// Validate process.env
// Note: We use safeParse to avoid crashing the build if envs are missing during CI/CD checks that don't need them
const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
    if (process.env.NODE_ENV === 'production') {
       // Log error but don't hard crash yet, let the specific service helper throw
       console.error("❌ Invalid Environment Variables:", _serverEnv.error.format());
    }
}

export const env = _serverEnv.success ? _serverEnv.data : process.env as unknown as z.infer<typeof serverSchema>;

/**
 * Helper to enforce required keys at runtime
 */
export function requireEnv(key: keyof z.infer<typeof serverSchema>) {
    const value = env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

/**
 * Validate environment on startup
 * Call this in app/layout.tsx before other initializations
 * 
 * In production: throws on missing required vars
 * In development: logs warnings but continues
 */
export function validateEnvOnStartup(): void {
    // Only run once
    if (validationComplete) return;
    validationComplete = true;
    
    const isProduction = process.env.NODE_ENV === 'production';
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required environment variables
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
    ];
    
    // Production-only required vars
    const productionRequiredVars = [
        'INNGEST_EVENT_KEY',
        'INNGEST_SIGNING_KEY',
        'CRON_SECRET',
        'RESEND_API_KEY',
        'NEXT_PUBLIC_SENTRY_DSN',
    ];
    
    // AI providers - at least one required
    const aiProviders = [
        'OPENAI_API_KEY',
        'GOOGLE_GEMINI_API_KEY',
        'GROQ_API_KEY',
        'MISTRAL_API_KEY',
        'ANTHROPIC_API_KEY',
        'DEEPSEEK_API_KEY',
    ];
    
    // Check required vars
    for (const key of requiredVars) {
        if (!process.env[key]) {
            errors.push(`Missing required: ${key}`);
        }
    }
    
    // Check production-only required vars
    if (isProduction) {
        for (const key of productionRequiredVars) {
            if (!process.env[key]) {
                warnings.push(`Missing (recommended for production): ${key}`);
            }
        }
    }
    
    // Check at least one AI provider
    const hasAIProvider = aiProviders.some(key => process.env[key]);
    if (!hasAIProvider) {
        errors.push(`No AI provider configured. Add at least one: ${aiProviders.join(', ')}`);
    }
    
    // Report results
    if (errors.length > 0) {
        const errorMsg = `\n❌ Environment Validation Failed:\n${errors.map(e => `   - ${e}`).join('\n')}\n`;
        
        if (isProduction) {
            console.error(errorMsg);
            throw new Error(`Production startup blocked: ${errors.length} missing environment variables`);
        } else {
            console.warn(errorMsg);
            console.warn('⚠️  Continuing in development mode with missing vars...\n');
        }
    }
    
    if (warnings.length > 0) {
        console.warn(`\n⚠️  Environment Warnings:\n${warnings.map(w => `   - ${w}`).join('\n')}\n`);
    }
    
    // Success message
    const configuredProviders = aiProviders.filter(key => process.env[key]);
    console.log('✅ Environment validated');
    console.log(`   Database: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40)}...`);
    console.log(`   AI Providers: ${configuredProviders.length > 0 ? configuredProviders.join(', ') : 'None'}`);
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}\n`);
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
