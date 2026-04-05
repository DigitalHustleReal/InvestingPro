import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/v1/articles — Public headless API for articles
 * Query params: page, per_page, status, category
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
    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("articles")
      .select(
        "id, title, slug, excerpt, category, tags, published_at, featured_image, seo_title, seo_description, quality_score",
        { count: "exact" },
      )
      .eq("status", status)
      .order("published_at", { ascending: false })
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
