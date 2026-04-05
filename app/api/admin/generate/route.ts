import { NextRequest, NextResponse } from "next/server";
import { createAPIWrapper } from "@/lib/middleware/api-wrapper";
import { generateArticleCore } from "@/lib/automation/article-generator";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export const POST = createAPIWrapper("/api/admin/generate", {
  rateLimitType: "admin",
  trackMetrics: true,
})(async (request: NextRequest) => {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const logs: string[] = [];
    const logFn = (msg: string) => logs.push(msg);

    // Run the generator
    const result = await generateArticleCore(topic, logFn);

    return NextResponse.json({
      ...result,
      logs,
    });
  } catch (error: any) {
    logger.error(
      "Admin generate error",
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error; // Let API wrapper handle error response
  }
});
