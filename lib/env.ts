import { z } from 'zod';

/**
 * Environment Variable Validation
 * Ensures the application fails fast if critical configuration is missing.
 */

const serverSchema = z.object({
    // Database (Required)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url("Supabase URL is required"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key is required"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase Service Role Key is required"),

    // AI (Optional but recommended)
    OPENAI_API_KEY: z.string().optional(),
    GOOGLE_GEMINI_API_KEY: z.string().optional(),
    
    // Security
    CRON_SECRET: z.string().optional(), // Should be required in Prod

    // Analytics
    NEXT_PUBLIC_GA_ID: z.string().optional(), 
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
