import { NextRequest, NextResponse } from "next/server";
import { runContentSensor } from "@/lib/sensing/content-sensor";
import { logger } from "@/lib/logger";

export const maxDuration = 120;

/**
 * GET /api/cron/content-sense
 * Called every 4 hours by Vercel cron. Senses trending topics,
 * stores top candidates in feed_items table for generation pipeline.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    logger.info("Cron: content-sense starting");

    const result = await runContentSensor(15, 10);

    logger.info(
      `Cron: content-sense complete — ${result.topicsFound} items, ${result.topTopics.length} actionable topics`,
    );

    // Log top 5 for monitoring
    result.topTopics.slice(0, 5).forEach((t, i) => {
      logger.info(
        `  Topic ${i + 1}: [${t.score}] ${t.title} (${t.sourceName})`,
      );
    });

    if (result.errors.length > 0) {
      logger.warn(
        `Cron: content-sense had ${result.errors.length} errors: ${result.errors.join("; ")}`,
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Cron: content-sense failed", error as Error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sensor failed" },
      { status: 500 },
    );
  }
}
