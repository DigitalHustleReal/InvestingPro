/**
 * Vault API — Environment Variable Status
 *
 * Returns boolean flags indicating which env vars are configured.
 * NEVER returns actual secret values.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

interface EnvGroup {
  label: string;
  description: string;
  vars: { key: string; configured: boolean; label: string }[];
}

export async function GET() {
  try {
    // Auth guard — only admins should see this
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const check = (key: string): boolean => {
      const val = process.env[key];
      return !!val && val !== "undefined" && val.length > 0;
    };

    const groups: EnvGroup[] = [
      {
        label: "Database (Supabase)",
        description: "Core database, auth and storage",
        vars: [
          {
            key: "NEXT_PUBLIC_SUPABASE_URL",
            configured: check("NEXT_PUBLIC_SUPABASE_URL"),
            label: "Supabase URL",
          },
          {
            key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
            configured: check("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
            label: "Supabase Anon Key",
          },
          {
            key: "SUPABASE_SERVICE_ROLE_KEY",
            configured: check("SUPABASE_SERVICE_ROLE_KEY"),
            label: "Supabase Service Role Key",
          },
        ],
      },
      {
        label: "AI Providers",
        description: "LLM API keys for multi-provider failover chain",
        vars: [
          {
            key: "GOOGLE_GEMINI_API_KEY",
            configured: check("GOOGLE_GEMINI_API_KEY"),
            label: "Google Gemini (Primary)",
          },
          {
            key: "GROQ_API_KEY",
            configured: check("GROQ_API_KEY"),
            label: "Groq (Fast Fallback)",
          },
          {
            key: "MISTRAL_API_KEY",
            configured: check("MISTRAL_API_KEY"),
            label: "Mistral (Fallback)",
          },
          {
            key: "OPENAI_API_KEY",
            configured: check("OPENAI_API_KEY"),
            label: "OpenAI (Fallback)",
          },
          {
            key: "ANTHROPIC_API_KEY",
            configured: check("ANTHROPIC_API_KEY"),
            label: "Anthropic Claude",
          },
          {
            key: "DEEPSEEK_API_KEY",
            configured: check("DEEPSEEK_API_KEY"),
            label: "DeepSeek",
          },
        ],
      },
      {
        label: "Payments (Stripe)",
        description: "Subscription billing and checkout",
        vars: [
          {
            key: "STRIPE_SECRET_KEY",
            configured: check("STRIPE_SECRET_KEY"),
            label: "Secret Key",
          },
          {
            key: "STRIPE_PUBLISHABLE_KEY",
            configured: check("STRIPE_PUBLISHABLE_KEY"),
            label: "Publishable Key",
          },
          {
            key: "STRIPE_WEBHOOK_SECRET",
            configured: check("STRIPE_WEBHOOK_SECRET"),
            label: "Webhook Secret",
          },
        ],
      },
      {
        label: "Email (Resend)",
        description: "Transactional email delivery",
        vars: [
          {
            key: "RESEND_API_KEY",
            configured: check("RESEND_API_KEY"),
            label: "Resend API Key",
          },
          {
            key: "SUPPORT_EMAIL",
            configured: check("SUPPORT_EMAIL"),
            label: "Support Email",
          },
        ],
      },
      {
        label: "Cache (Upstash Redis)",
        description: "Edge-compatible key-value cache",
        vars: [
          {
            key: "UPSTASH_REDIS_REST_URL",
            configured: check("UPSTASH_REDIS_REST_URL"),
            label: "Redis REST URL",
          },
          {
            key: "UPSTASH_REDIS_REST_TOKEN",
            configured: check("UPSTASH_REDIS_REST_TOKEN"),
            label: "Redis REST Token",
          },
        ],
      },
      {
        label: "Monitoring & Analytics",
        description: "Error tracking, analytics, and live chat",
        vars: [
          {
            key: "NEXT_PUBLIC_SENTRY_DSN",
            configured: check("NEXT_PUBLIC_SENTRY_DSN"),
            label: "Sentry DSN",
          },
          {
            key: "NEXT_PUBLIC_GA_ID",
            configured: check("NEXT_PUBLIC_GA_ID"),
            label: "Google Analytics 4",
          },
          {
            key: "NEXT_PUBLIC_TAWK_PROPERTY_ID",
            configured: check("NEXT_PUBLIC_TAWK_PROPERTY_ID"),
            label: "Tawk.to Chat",
          },
        ],
      },
      {
        label: "Application",
        description: "Base URLs and environment",
        vars: [
          {
            key: "NEXT_PUBLIC_BASE_URL",
            configured: check("NEXT_PUBLIC_BASE_URL"),
            label: "Base URL",
          },
          {
            key: "NODE_ENV",
            configured: check("NODE_ENV"),
            label: "Node Environment",
          },
          {
            key: "CRON_SECRET",
            configured: check("CRON_SECRET"),
            label: "Cron Secret",
          },
        ],
      },
      {
        label: "Event System",
        description: "Background job orchestration",
        vars: [
          {
            key: "INNGEST_EVENT_KEY",
            configured: check("INNGEST_EVENT_KEY"),
            label: "Inngest Event Key",
          },
          {
            key: "INNGEST_SIGNING_KEY",
            configured: check("INNGEST_SIGNING_KEY"),
            label: "Inngest Signing Key",
          },
        ],
      },
    ];

    // Summary stats
    const allVars = groups.flatMap((g) => g.vars);
    const configured = allVars.filter((v) => v.configured).length;
    const total = allVars.length;

    return NextResponse.json({
      groups,
      summary: {
        configured,
        total,
        percentage: Math.round((configured / total) * 100),
      },
    });
  } catch (error) {
    logger.error("[Vault API] Error:", error);
    return NextResponse.json(
      { error: "Failed to check environment" },
      { status: 500 },
    );
  }
}
