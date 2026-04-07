/**
 * Data Freshness Agent Cron — monitors product data accuracy.
 * Schedule: 1:00 AM IST daily
 */
import { NextRequest, NextResponse } from "next/server";
import { DataAgent } from "@/lib/agents/swarm/data-agent";
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
    const agent = new DataAgent();
    const result = await agent.runWithHeartbeat();
    return NextResponse.json({
      success: result.success,
      agent: "DataAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] DataAgent error:", error);
    return NextResponse.json({ error: "Data agent failed" }, { status: 500 });
  }
}
