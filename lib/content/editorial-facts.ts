/**
 * Editorial fact runtime accessor — DB-first with static fallback.
 *
 * Source of truth: Supabase `editorial_facts` table. When the DB query
 * fails or returns empty, we fall back to `./editorial-facts-data.ts`
 * so a network blip never empties the strip on /not-found.
 *
 * Architectural principle (locked 2026-04-25): public content routes
 * through the CMS first.
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import {
  EDITORIAL_FACTS_STATIC,
  type EditorialFact,
} from "./editorial-facts-data";

export type { EditorialFact };

export const getEditorialFacts = cache(async (): Promise<EditorialFact[]> => {
  const supabase = createServiceClient();
  try {
    const { data, error } = await supabase
      .from("editorial_facts")
      .select("headline, value, note")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as EditorialFact[];
    }
  } catch {
    // fall through to static
  }
  return EDITORIAL_FACTS_STATIC;
});
