import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/products — Public headless API for financial products
 * Query params: page, per_page, category, sort_by
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(
      parseInt(searchParams.get("per_page") || "20"),
      100,
    );
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sort_by") || "name";

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("products")
      .select(
        "id, slug, name, category, provider_name, description, rating, features, pros, cons, affiliate_link, is_active, trust_score, best_for",
        { count: "exact" },
      )
      .eq("is_active", true)
      .order(sortBy, { ascending: sortBy === "name" })
      .range(from, to);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      meta: {
        page,
        per_page: perPage,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / perPage),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
