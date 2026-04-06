import { NextRequest, NextResponse } from "next/server";
import {
  cmsOrchestrator,
  OrchestrationContext,
} from "@/lib/agents/orchestrator";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * CMS Orchestrator Canary API
 *
 * Tests system with a single article generation
 * Safe mode for initial testing
 */
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await request.json();

    const context: OrchestrationContext = {
      mode: "semi-automated", // Canary uses semi-automated for safety
      goals: {
        volume: 1, // Only 1 article for canary
        quality: body.goals?.quality || 80,
        revenue: 0,
        seo: true,
      },
      constraints: {
        budget: 5.0, // Limit to $5 for canary
        ...body.constraints,
      },
    };

    logger.info("Executing CMS canary test...", { context });

    // Execute canary cycle
    const result = await cmsOrchestrator.executeCycle(context);

    return NextResponse.json({
      success: result.success,
      canary: true,
      result: {
        articlesGenerated: result.articlesGenerated,
        articlesPublished: result.articlesPublished,
        performanceScore: result.performanceScore,
        errors: result.errors,
      },
      message: result.success
        ? "Canary test passed! System is ready for full execution."
        : "Canary test completed with issues. Review errors before full execution.",
    });
  } catch (error: any) {
    logger.error("Canary API error", error);
    return NextResponse.json(
      {
        success: false,
        canary: true,
        error: error.message,
        message: "Canary test failed. Check system configuration.",
      },
      { status: 500 },
    );
  }
}

/**
 * Get canary test status
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Canary endpoint ready",
    usage: {
      method: "POST",
      body: {
        goals: {
          quality: 80,
        },
        constraints: {
          budget: 5.0,
        },
      },
    },
  });
}
