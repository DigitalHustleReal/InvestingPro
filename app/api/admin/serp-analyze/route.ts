/**
 * POST /api/admin/serp-analyze
 *
 * Analyzes the SERP landscape for a given keyword.
 * Auth-guarded: requires admin role.
 *
 * Body: { keyword: string }
 * Returns: SERPAnalysis JSON
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { analyzeSERP } from "@/lib/ai/serp-analyzer";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Auth check — admin only
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    // Parse body
    let body: { keyword?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "Invalid JSON body" } },
        { status: 400 },
      );
    }

    const keyword = body.keyword?.trim();
    if (!keyword) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_KEYWORD",
            message: "keyword is required in request body",
          },
        },
        { status: 400 },
      );
    }

    logger.info("SERP analyze API called", { keyword });

    const analysis = await analyzeSERP(keyword);

    return NextResponse.json({ data: analysis });
  } catch (err) {
    logger.error("SERP analyze API error", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to analyze SERP",
        },
      },
      { status: 500 },
    );
  }
}
