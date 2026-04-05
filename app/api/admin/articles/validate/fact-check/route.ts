/**
 * Fact-Check Validation API
 *
 * POST /api/admin/articles/validate/fact-check
 * Validates article content for fact-check issues
 */

import { NextRequest, NextResponse } from "next/server";
import { factCheckArticle } from "@/lib/validation/fact-checker";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/articles/validate/fact-check
 * Run fact-check validation on article content
 */
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await request.json();
    const { content, title, category } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    const result = await factCheckArticle(content, {
      category,
      title,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Error running fact-check validation", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
