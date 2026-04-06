/**
 * Affiliate Link Router - Enhanced
 * Handles /go/[slug] redirects with full click tracking
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const startTime = Date.now();

  try {
    let destinationUrl = "";
    let entityId = "";
    let entityType = "";

    // 1. Try fetching from 'affiliate_links' table first
    const { data: link } = await supabase
      .from("affiliate_links")
      .select("id, destination_url, is_active, partner_id")
      .eq("short_code", slug)
      .single();

    if (link && link.is_active) {
      destinationUrl = link.destination_url;
      entityId = link.id;
      entityType = "affiliate_link";
    } else {
      // 2. Fallback: Fetch from 'products' table
      const { data: product } = await supabase
        .from("products")
        .select("id, affiliate_link, official_link, is_active, category")
        .eq("slug", slug)
        .single();

      if (product && product.is_active) {
        destinationUrl = product.affiliate_link || product.official_link || "";
        entityId = product.id;
        entityType = "product";
      }
    }

    if (!destinationUrl) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    // 3. Capture tracking metadata
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

    // Hash IP for privacy
    const ipHash = Buffer.from(ip).toString("base64").substring(0, 16);

    // 4. Record click to database (async, don't block redirect)
    void supabase.from("affiliate_clicks").insert({
      link_id: entityType === "affiliate_link" ? entityId : null,
      product_id: entityType === "product" ? entityId : null,
      entity_type: entityType,
      destination_url: destinationUrl,
      user_agent: userAgent.substring(0, 500),
      referrer: referer.substring(0, 500),
      ip_hash: ipHash,
      clicked_at: new Date().toISOString(),
      converted: false,
    });

    // 5. Increment click counter on affiliate links (fire and forget)
    if (entityType === "affiliate_link") {
      void supabase.rpc("increment_affiliate_clicks", { link_id: entityId });
    }

    // Log for monitoring
    const processingTime = Date.now() - startTime;
    logger.info(
      `[Affiliate Redirect] ${slug} -> ${entityType} | ${processingTime}ms`,
    );

    // 6. Redirect immediately (don't wait for DB)
    return NextResponse.redirect(destinationUrl);
  } catch (err) {
    logger.error(
      "[Affiliate Redirect] Error",
      err instanceof Error ? err : undefined,
    );
    return NextResponse.redirect(new URL("/", request.url));
  }
}
