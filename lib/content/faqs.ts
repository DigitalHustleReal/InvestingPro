/**
 * FAQ runtime accessor — DB-first with static fallback.
 *
 * Source-of-truth: Supabase `category_faqs` table (see migration
 * `create_category_faqs`). The static export from `./faq-data` is kept
 * as a fallback when the DB query fails / returns empty so a network
 * blip never empties the FAQ block in production.
 *
 * Architectural principle (locked 2026-04-25):
 * "Every piece of content shown on the public site flows through the
 * CMS / database — even content I (Claude) generate manually inside a
 * session. Code-resident content arrays are an anti-pattern."
 *
 * See docs/MANUAL_ACTIONS_TRACKER.md "Content sources — route through CMS / DB".
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import { getCategoryFAQs as getStaticFAQs } from "./faq-data";

export type FAQ = { question: string; answer: string };

/**
 * Fetch FAQs for a URL category. Wrapped in React.cache so that
 * generateMetadata + render share one DB query per request.
 */
export const getFAQsForCategory = cache(
  async (urlCategory: string): Promise<FAQ[]> => {
    const supabase = createServiceClient();
    try {
      const { data, error } = await supabase
        .from("category_faqs")
        .select("question, answer")
        .eq("url_category", urlCategory)
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data as FAQ[];
      }
    } catch {
      // fall through to static
    }
    // Resilience fallback — keeps the FAQ block populated if DB is down
    // or the seed hasn't run yet.
    return getStaticFAQs(urlCategory);
  },
);
