/**
 * SERP Analyst Agent Cron
 *
 * ANALYZE phase — researches competitive landscape using free sources.
 * Schedule: 3:00 AM + 3:00 PM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { SerpAnalystAgent } from "@/lib/agents/swarm/serp-analyst-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized serp-analyst attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new SerpAnalystAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "SerpAnalystAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] SerpAnalystAgent error:", error);
    return NextResponse.json({ error: "SERP analyst failed" }, { status: 500 });
  }
}
