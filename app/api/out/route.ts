import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

// Use Service Role to allow writing to affiliate_clicks without RLS blocking
// and to read products that might be hidden/inactive
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const linkId = searchParams.get("link_id");
  const productId = searchParams.get("id");
  const userId = searchParams.get("u"); // Optional User ID
  const sourcePage = searchParams.get("src") || "unknown";

  if (!productId && !linkId) {
    return new NextResponse("Missing Product ID or Link ID", { status: 400 });
  }

  try {
    let targetUrl = "";
    const finalLinkId = linkId;

    // CASE 1: Direct Affiliate Link ID (Preferred)
    if (linkId) {
      const { data: link } = await supabase
        .from("affiliate_links")
        .select("destination_url, partner_id")
        .eq("id", linkId)
        .single();

      if (link) {
        targetUrl = link.destination_url;
      } else {
        return new NextResponse("Affiliate Link Not Found", { status: 404 });
      }
    }
    // CASE 2: Legacy/Product ID Lookup
    else if (productId) {
      // Try Credit Card Table
      const { data: cc } = await supabase
        .from("credit_cards")
        .select("apply_link")
        .eq("id", productId)
        .single();

      if (cc && cc.apply_link && cc.apply_link !== "#") {
        targetUrl = cc.apply_link;
        // Ideally we should find/create a link_id for this product to track it properly in the new schema
        // For now, we'll log it with null link_id but valid product_id
      } else {
        return new NextResponse("Product Link Not Found in Database", {
          status: 404,
        });
      }
    }

    // 2. Extract article_id from source URL if it's an article page (before generating clickId)
    let articleId: string | null = null;
    if (sourcePage && sourcePage.startsWith("/article/")) {
      const slug = sourcePage.replace("/article/", "").split("?")[0];
      if (slug) {
        // Look up article by slug to get article_id
        const { data: article } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", slug)
          .single();
        if (article) {
          articleId = article.id;
        }
      }
    }

    // 3. Determine product_type and category from source
    let productType: string | null = null;
    let category: string | null = null;

    if (
      sourcePage.includes("credit-card") ||
      sourcePage.includes("credit-cards")
    ) {
      productType = "credit_card";
      category = "credit-cards";
    } else if (
      sourcePage.includes("mutual-fund") ||
      sourcePage.includes("mutual-funds")
    ) {
      productType = "mutual_fund";
      category = "mutual-funds";
    } else if (sourcePage.includes("insurance")) {
      productType = "insurance";
      category = "insurance";
    } else if (sourcePage.includes("loan") || sourcePage.includes("loans")) {
      productType = "loan";
      category = "loans";
    }

    // 4. Generate Click ID for tracking
    const clickId = crypto.randomUUID();

    // 5. Append Sub ID to Target URL
    const separator = targetUrl.includes("?") ? "&" : "?";
    const finalUrl = `${targetUrl}${separator}sub1=${clickId}${userId ? `&sub2=${userId}` : ""}`;

    // 6. Log Click - Map to actual affiliate_clicks schema
    const clickData: any = {
      product_id: productId || null,
      source_page: sourcePage,
      source_url: request.headers.get("referer") || sourcePage,
      user_agent: request.headers.get("user-agent") || null,
      ip_hash: "anonymized", // Privacy-friendly
      affiliate_link: targetUrl,
      conversion_status: "pending",
    };

    // Add optional fields only if they have values
    if (productType) clickData.product_type = productType;
    if (category) clickData.category = category;
    if (articleId) clickData.article_id = articleId; // Will work after migration adds column

    const { error: logError } = await supabase
      .from("affiliate_clicks")
      .insert(clickData);

    if (logError) {
      logger.error("Failed to log click:", logError);
      // Don't block redirect on logging error - allow user to continue
    }

    // 7. Redirect User
    return NextResponse.redirect(finalUrl);
  } catch (error) {
    logger.error("Click Tracking Error catch:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
