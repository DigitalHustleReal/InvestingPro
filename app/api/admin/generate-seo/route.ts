import { NextRequest, NextResponse } from "next/server";
import { VersusGenerator } from "@/lib/seo/versus-generator";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export const dynamic = "force-dynamic"; // Prevent static caching
export const maxDuration = 60; // Allow longer run time for AI generation

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await request.json();
    const { category = "credit_cards", limit = 5 } = body;

    logger.info(
      `Admin triggered SEO Generation for ${category} (Limit: ${limit})`,
    );

    const generator = new VersusGenerator();
    const result = await generator.generatePairsForCategory(category, limit);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error("SEO Generation API Failed", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
