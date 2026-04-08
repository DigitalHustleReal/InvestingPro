import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runContentSensor } from "@/lib/sensing/content-sensor";

/**
 * GET /api/admin/content-sensor — Run content sensor and return top topics
 * POST /api/admin/content-sensor — Run sensor + auto-generate top N articles
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await runContentSensor(10, 12);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sensor failed" },
      { status: 500 },
    );
  }
}
