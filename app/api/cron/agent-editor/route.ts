/**
 * Editor Agent Cron
 *
 * CREATE phase — quality checks and auto-improves articles.
 * Schedule: 8:00 AM + 8:00 PM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { EditorAgent } from "@/lib/agents/swarm/editor-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized editor attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new EditorAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "EditorAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] EditorAgent error:", error);
    return NextResponse.json({ error: "Editor failed" }, { status: 500 });
  }
}
