import { z } from 'zod';
import { logger } from '@/lib/logger';

/**
 * Environment Variable Validation
 *
 * Features:
 * - Zod-based schema validation (safeParse: never throws at import time)
 * - validateEnvOnStartup(): logs missing vars; only throws in production when REQUIRE_STRICT_ENV=1
 * - Deploy-first: you can deploy with no/minimal env, then add vars in Vercel and redeploy
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
       logger.error("❌ Invalid Environment Variables:", _serverEnv.error.format());
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
 * Deploy-first friendly:
 * - Set REQUIRE_STRICT_ENV=1 in Vercel to throw in production when required vars are missing.
 * - Otherwise in production we only log errors/warnings so the build and first deploy succeed;
 *   add env vars in Vercel after deploy, then redeploy or let runtime use them.
 */
export function validateEnvOnStartup(): void {
    // Only run once
    if (validationComplete) return;
    validationComplete = true;

    // MINIMAL DEPLOY: Skip validation during Vercel build when no env are set (first deploy)
    const onVercel = !!process.env.VERCEL;
    const hasAnyEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.OPENAI_API_KEY);
    if (onVercel && !hasAnyEnv) {
        logger.info('✅ Env validation skipped (Vercel first deploy – add env in dashboard and redeploy)');
        return;
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const strictMode = process.env.REQUIRE_STRICT_ENV === '1';
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required environment variables (for full functionality)
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
    ];

    // Production-only recommended vars
    const productionRecommendedVars = [
        'INNGEST_EVENT_KEY',
        'INNGEST_SIGNING_KEY',
        'CRON_SECRET',
        'RESEND_API_KEY',
        'NEXT_PUBLIC_SENTRY_DSN',
    ];

    // AI providers - at least one needed for AI features
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

    // Check production recommended vars (warnings only)
    if (isProduction) {
        for (const key of productionRecommendedVars) {
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

    // Report results: only throw in production when REQUIRE_STRICT_ENV=1
    if (errors.length > 0) {
        const errorMsg = `\n❌ Environment Validation:\n${errors.map(e => `   - ${e}`).join('\n')}\n`;

        if (isProduction && strictMode) {
            logger.error(errorMsg);
            throw new Error(`Production startup blocked: ${errors.length} missing environment variables (REQUIRE_STRICT_ENV=1)`);
        }
        // Deploy-first: log but do not throw so build and first request succeed
        logger.warn(errorMsg);
        logger.warn('⚠️  Add these in Vercel → Settings → Environment Variables, then redeploy.\n');
    }

    if (warnings.length > 0) {
        logger.warn(`\n⚠️  Environment Warnings:\n${warnings.map(w => `   - ${w}`).join('\n')}\n`);
    }

    const configuredProviders = aiProviders.filter(key => process.env[key]);
    logger.info('✅ Environment validated (deploy-first: missing vars only block if REQUIRE_STRICT_ENV=1)');
    logger.info(`   Database: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 40) + '...' : 'Not set'}`);
    logger.info(`   AI Providers: ${configuredProviders.length > 0 ? configuredProviders.join(', ') : 'None'}`);
    logger.info(`   Mode: ${process.env.NODE_ENV || 'development'}\n`);
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

/**
 * Get the public base URL for server-side use (fetch, redirects, links).
 * In production: never returns localhost; uses VERCEL_URL if no env is set.
 * Use this for cron/API routes that call back into the app.
 */
export function getServerPublicUrl(): string {
    const inProd = process.env.NODE_ENV === 'production';
    const fromEnv =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_BASE_URL;
    if (fromEnv && (!inProd || !fromEnv.includes('localhost'))) return fromEnv;
    if (inProd && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (!inProd) return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return '';
}
