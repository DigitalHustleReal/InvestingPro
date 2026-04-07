/**
 * SEO Agent Cron — auto-optimizes published articles for SEO.
 * Schedule: 6:00 AM + 6:00 PM IST daily
 */
import { NextRequest, NextResponse } from "next/server";
import { SeoAgent } from "@/lib/agents/swarm/seo-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const agent = new SeoAgent();
    const result = await agent.runWithHeartbeat();
    return NextResponse.json({
      success: result.success,
      agent: "SeoAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] SeoAgent error:", error);
    return NextResponse.json({ error: "SEO agent failed" }, { status: 500 });
  }
}
