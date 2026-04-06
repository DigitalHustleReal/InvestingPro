import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/users — List all users with profiles
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch profiles (mirrors auth.users)
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      // If profiles table doesn't exist, try user_profiles
      const { data: userProfiles, error: err2 } = await supabase
        .from("user_profiles")
        .select(
          "id, email, full_name, avatar_url, role, created_at, updated_at",
        )
        .order("created_at", { ascending: false });

      if (err2) {
        return NextResponse.json({ data: [] });
      }
      return NextResponse.json({ data: userProfiles || [] });
    }

    return NextResponse.json({ data: profiles || [] });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
