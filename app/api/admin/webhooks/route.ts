import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/webhooks
 * List all webhooks + recent delivery logs
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all webhooks
    const { data: webhooks, error: webhooksError } = await supabase
      .from("webhooks")
      .select("*")
      .order("created_at", { ascending: false });

    if (webhooksError) {
      return NextResponse.json(
        { error: webhooksError.message },
        { status: 500 },
      );
    }

    // Fetch recent delivery logs (last 50)
    const { data: deliveries, error: deliveriesError } = await supabase
      .from("webhook_deliveries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (deliveriesError) {
      return NextResponse.json(
        { error: deliveriesError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: { webhooks: webhooks ?? [], deliveries: deliveries ?? [] },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * POST /api/admin/webhooks
 * Create a new webhook endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, events, is_active } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "At least one event is required" },
        { status: 400 },
      );
    }

    // Generate a signing secret server-side
    const secret = `whsec_${crypto.randomUUID().replace(/-/g, "")}`;

    const { data: webhook, error: insertError } = await supabase
      .from("webhooks")
      .insert({
        url: url.trim(),
        secret,
        events,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data: webhook }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
