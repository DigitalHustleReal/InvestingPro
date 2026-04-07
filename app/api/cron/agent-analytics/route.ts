/**
 * Analytics Agent Cron — tracks article performance, identifies optimization opportunities.
 * Schedule: 3:30 AM IST daily
 */
import { NextRequest, NextResponse } from "next/server";
import { AnalyticsAgent } from "@/lib/agents/swarm/analytics-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const agent = new AnalyticsAgent();
    const result = await agent.runWithHeartbeat();
    return NextResponse.json({
      success: result.success,
      agent: "AnalyticsAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] AnalyticsAgent error:", error);
    return NextResponse.json(
      { error: "Analytics agent failed" },
      { status: 500 },
    );
  }
}
