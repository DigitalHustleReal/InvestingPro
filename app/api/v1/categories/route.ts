import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/categories — Public headless API for product categories
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get product counts per category
    const { data: products, error } = await supabase
      .from("products")
      .select("category")
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Count products per category
    const counts: Record<string, number> = {};
    (products || []).forEach((p: { category: string }) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const categories = [
      {
        slug: "credit-cards",
        name: "Credit Cards",
        count: counts["credit-cards"] || 0,
      },
      {
        slug: "mutual-funds",
        name: "Mutual Funds",
        count: counts["mutual-funds"] || 0,
      },
      { slug: "loans", name: "Loans", count: counts["loans"] || 0 },
      {
        slug: "fixed-deposits",
        name: "Fixed Deposits",
        count: counts["fixed-deposits"] || 0,
      },
      {
        slug: "demat-accounts",
        name: "Demat Accounts",
        count: counts["demat-accounts"] || 0,
      },
      { slug: "insurance", name: "Insurance", count: counts["insurance"] || 0 },
      { slug: "banking", name: "Banking", count: counts["banking"] || 0 },
    ];

    return NextResponse.json({ data: categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
