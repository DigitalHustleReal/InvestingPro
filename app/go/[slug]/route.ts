/**
 * Affiliate Link Router - Enhanced
 * Handles /go/[slug] redirects with full click tracking across all
 * monetized product tables. notFound() fires outside try/catch so the
 * v3 /not-found.tsx page renders on miss.
 */

import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type ResolvedLink = {
  destinationUrl: string;
  entityId: string;
  entityType: string;
};

/**
 * Chain-resolve an affiliate slug across every table that might own it.
 * Order is by volume / likelihood of match:
 *   affiliate_links (typed) → products (36/2584) → credit_cards (81/81)
 *   → loans → insurance → brokers.
 * mutual_funds deliberately excluded — no outbound link column.
 */
async function resolveSlug(slug: string): Promise<ResolvedLink | null> {
  // 1. affiliate_links with short_code
  const { data: link } = await supabase
    .from("affiliate_links")
    .select("id, destination_url, is_active, partner_id")
    .eq("short_code", slug)
    .single();
  if (link && link.is_active) {
    return {
      destinationUrl: link.destination_url,
      entityId: link.id,
      entityType: "affiliate_link",
    };
  }

  // 2. products
  const { data: product } = await supabase
    .from("products")
    .select("id, affiliate_link, official_link, is_active, category")
    .eq("slug", slug)
    .single();
  if (product && product.is_active) {
    const dest = product.affiliate_link || product.official_link || "";
    if (dest) {
      return {
        destinationUrl: dest,
        entityId: product.id,
        entityType: "product",
      };
    }
  }

  // 3. credit_cards — 81/81 have apply_link
  const { data: cc } = await supabase
    .from("credit_cards")
    .select("id, apply_link")
    .eq("slug", slug)
    .single();
  if (cc && cc.apply_link && cc.apply_link !== "#") {
    return {
      destinationUrl: cc.apply_link,
      entityId: cc.id,
      entityType: "credit_card",
    };
  }

  // 4. loans / insurance / brokers — chain across known link columns
  const tables: Array<{ table: string; linkCols: readonly string[] }> = [
    {
      table: "loans",
      linkCols: ["affiliate_link", "apply_link", "official_link"] as const,
    },
    {
      table: "insurance",
      linkCols: ["apply_link", "official_link"] as const,
    },
    {
      table: "brokers",
      linkCols: ["affiliate_link", "official_link"] as const,
    },
  ];
  for (const { table, linkCols } of tables) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("slug", slug)
      .single();
    if (!data) continue;
    const row = data as unknown as Record<string, unknown>;
    for (const col of linkCols) {
      const url = row[col];
      if (typeof url === "string" && url && url !== "#") {
        return {
          destinationUrl: url,
          entityId: (row.id as string) ?? "",
          entityType: table,
        };
      }
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const startTime = Date.now();

  let resolved: ResolvedLink | null = null;
  try {
    resolved = await resolveSlug(slug);
  } catch (err) {
    logger.error(
      "[Affiliate Redirect] resolveSlug threw",
      err instanceof Error ? err : undefined,
    );
    // Swallow and fall through to notFound() — the user shouldn't land
    // on a random destination just because a single DB lookup errored.
  }

  // notFound() outside the try/catch so its NEXT_NOT_FOUND signal isn't
  // swallowed. This renders app/not-found.tsx with status 404.
  if (!resolved) {
    notFound();
  }

  const { destinationUrl, entityId, entityType } = resolved;

  // Capture tracking metadata
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referer = request.headers.get("referer") || "direct";
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const ipHash = Buffer.from(ip).toString("base64").substring(0, 16);

  // Record click (async, don't block redirect)
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

  // Increment counter on affiliate_links
  if (entityType === "affiliate_link") {
    void supabase.rpc("increment_affiliate_clicks", { link_id: entityId });
  }

  logger.info(
    `[Affiliate Redirect] ${slug} -> ${entityType} | ${Date.now() - startTime}ms`,
  );

  return NextResponse.redirect(destinationUrl);
}
