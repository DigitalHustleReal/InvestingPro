import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import redisService from '@/lib/cache/redis-service';
import stripeService from '@/lib/payments/stripe-service';

/**
 * Health Check Endpoint
 * Reports status of all external services for monitoring
 */
export async function GET() {
    const startTime = Date.now();
    
    try {
        const health: any = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            services: {},
        };

        // Check Supabase
        const hasSupabaseConfig = !!(
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        if (hasSupabaseConfig) {
            try {
                const supabaseStart = Date.now();
                const supabase = await createClient();
                const { error } = await supabase.from('articles').select('count').limit(1);
                health.services.supabase = {
                    status: error ? 'degraded' : 'ok',
                    latency: Date.now() - supabaseStart,
                    error: error?.message,
                };
            } catch (dbError: any) {
                health.services.supabase = {
                    status: 'error',
                    error: dbError.message,
                };
                health.status = 'degraded';
            }
        } else {
            health.services.supabase = { status: 'not_configured' };
        }

        // Check Redis (Upstash)
        if (redisService.isConfigured) {
            try {
                const redisStart = Date.now();
                await redisService.cacheSet('health_check', 'ok', 10);
                const value = await redisService.cacheGet('health_check');
                health.services.redis = {
                    status: value === 'ok' ? 'ok' : 'error',
                    latency: Date.now() - redisStart,
                };
            } catch (error: any) {
                health.services.redis = { status: 'error', error: error.message };
            }
        } else {
            health.services.redis = { status: 'not_configured' };
        }

        // Check Stripe
        health.services.stripe = {
            status: stripeService.isConfigured ? 'ok' : 'not_configured',
        };

        // Check Sentry
        health.services.sentry = {
            status: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'ok' : 'not_configured',
        };

        // Check Resend
        health.services.resend = {
            status: process.env.RESEND_API_KEY ? 'ok' : 'not_configured',
        };

        // Check PostHog
        health.services.posthog = {
            status: process.env.NEXT_PUBLIC_POSTHOG_KEY ? 'ok' : 'not_configured',
        };

        // Check AI Providers
        const aiProviders = [];
        if (process.env.GROQ_API_KEY) aiProviders.push('groq');
        if (process.env.MISTRAL_API_KEY) aiProviders.push('mistral');
        if (process.env.OPENAI_API_KEY) aiProviders.push('openai');
        if (process.env.ANTHROPIC_API_KEY) aiProviders.push('anthropic');
        if (process.env.GOOGLE_GEMINI_API_KEY) aiProviders.push('gemini');
        
        health.services.ai = {
            status: aiProviders.length > 0 ? 'ok' : 'not_configured',
            providers: aiProviders,
        };

        // Calculate overall status
        const serviceStatuses = Object.values(health.services) as any[];
        const hasErrors = serviceStatuses.some(s => s.status === 'error');
        const hasDegraded = serviceStatuses.some(s => s.status === 'degraded');
        health.status = hasErrors ? 'error' : hasDegraded ? 'degraded' : 'ok';
        health.totalLatency = Date.now() - startTime;

        const statusCode = health.status === 'ok' ? 200 : health.status === 'degraded' ? 503 : 500;
        return NextResponse.json(health, { status: statusCode });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: errorMessage,
                totalLatency: Date.now() - startTime,
            },
            { status: 500 }
        );
    }
}
