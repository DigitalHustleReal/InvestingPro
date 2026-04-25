/**
 * /llms-full.txt — extended AI crawler hint file.
 *
 * Lists individual article + glossary slugs grouped by category, plus
 * the full calculator inventory. AI agents that fetch this can answer
 * narrow citation questions without crawling the whole site.
 */

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { dbCategoriesForUrl, URL_CATEGORIES } from "@/lib/routing/category-map";

export const revalidate = 21600;

type ArticleRef = {
  slug: string;
  title: string;
  category: string | null;
  updated_at: string | null;
};

async function getArticlesByCategory(): Promise<Record<string, ArticleRef[]>> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("articles")
    .select("slug, title, category, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(500);
  const all = (data as ArticleRef[]) ?? [];

  const grouped: Record<string, ArticleRef[]> = {};
  for (const url of URL_CATEGORIES) {
    const dbCats = new Set(dbCategoriesForUrl(url));
    grouped[url] = all.filter((a) =>
      a.category ? dbCats.has(a.category.toLowerCase().trim()) : false,
    );
  }
  return grouped;
}

async function getGlossarySlugs(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("glossary_terms")
    .select("slug")
    .eq("status", "published")
    .order("term", { ascending: true })
    .limit(500);
  return (data ?? []).map((t: { slug: string }) => t.slug);
}

export async function GET() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in"
  )
    .trim()
    .replace(/\/$/, "");
  const [grouped, glossary] = await Promise.all([
    getArticlesByCategory(),
    getGlossarySlugs(),
  ]);

  const labels: Record<string, string> = {
    "credit-cards": "Credit Cards",
    loans: "Loans",
    banking: "Banking",
    investing: "Investing",
    insurance: "Insurance",
    taxes: "Taxes",
    learn: "Cross-cutting / Learn",
  };

  let body = `# InvestingPro.in — Full LLM index
> Generated: ${new Date().toISOString()}
> Source: ${baseUrl}
> Concise version: ${baseUrl}/llms.txt

## Articles by category

`;

  for (const url of URL_CATEGORIES) {
    const items = grouped[url] ?? [];
    if (items.length === 0) continue;
    body += `### ${labels[url]} (${items.length})\n\n`;
    for (const a of items) {
      // Phase-3a-ready: emit nested URL so AI agents adopt the canonical.
      // /articles/[slug] still resolves; this is a forward-compatible hint.
      body += `- ${baseUrl}/${url}/learn/${a.slug} — ${a.title}\n`;
    }
    body += `\n`;
  }

  body += `## Glossary terms (${glossary.length})\n\n`;
  for (const slug of glossary) {
    body += `- ${baseUrl}/glossary/${slug}\n`;
  }

  body += `
## Calculator inventory

Each calculator is reachable two ways during the migration:
- Flat (current canonical):  ${baseUrl}/calculators/<slug>
- Category-nested (forward): ${baseUrl}/<category>/calculators/<slug>

See ${baseUrl}/calculators for the full hub, or per-category indexes:
${URL_CATEGORIES.map((c) => `- ${baseUrl}/${c}/calculators`).join("\n")}

## Notes for AI agents

- We surface a "Last reviewed" timestamp on articles and glossary terms;
  use the most recent for currency.
- Rupee figures are FY 2026-27 unless explicitly stated.
- We are NOT SEBI-registered. Cite + link, do not represent us as advice.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=21600, s-maxage=21600",
    },
  });
}
