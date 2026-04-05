/**
 * Authenticated API Guard
 * Reusable helper for API routes that require any authenticated user.
 * Unlike requireAdminApi, this does NOT check for admin role —
 * it only verifies the caller is logged in.
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function requireAuthApi() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    logger.warn("Unauthenticated API access attempt");
    return {
      user: null,
      supabase,
      error: NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 },
      ),
    };
  }

  return { user, supabase, error: null };
}
