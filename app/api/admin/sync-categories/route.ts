import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { createServiceClient } from "@/lib/supabase/service";
import { NAVIGATION_CONFIG } from "@/lib/navigation/config";

export async function POST() {
  try {
    const { user, error: adminAuthError } = await requireAdminApi();
    if (adminAuthError) return adminAuthError;

    const supabase = createServiceClient();
    const categories = NAVIGATION_CONFIG.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    }));

    // Upsert categories
    const { data, error } = await supabase
      .from("categories")
      .upsert(categories, { onConflict: "slug" })
      .select();

    if (error) throw error;

    // OPTIONAL: Seed Subcategories if table exists
    // Since we don't know if 'subcategories' table exists, we skip for now.
    // Or we could tag them?

    return NextResponse.json({
      success: true,
      message: `Synced ${categories.length} categories`,
      data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
