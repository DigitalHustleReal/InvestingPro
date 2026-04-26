/**
 * /search — site-wide search results.
 * Was 404 before; CommandPalette ⌘K Enter routes here.
 * Searches across articles + glossary terms + product names.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Search } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — InvestingPro",
  description:
    "Search across InvestingPro articles, glossary terms, and product comparisons.",
  robots: { index: false, follow: true },
};

interface SearchResult {
  type:
    | "article"
    | "glossary"
    | "credit_card"
    | "mutual_fund"
    | "loan"
    | "other";
  title: string;
  description: string;
  href: string;
}

async function runSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const q = query.trim().slice(0, 100);
  const ilikePattern = `%${q}%`;

  // Run searches in parallel across the four highest-value sources
  const [articlesRes, glossaryRes, ccRes, mfRes] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, title, excerpt")
      .eq("status", "published")
      .or(`title.ilike.${ilikePattern},excerpt.ilike.${ilikePattern}`)
      .limit(8),
    supabase
      .from("glossary_terms")
      .select("slug, term, definition")
      .eq("status", "published")
      .or(`term.ilike.${ilikePattern},definition.ilike.${ilikePattern}`)
      .limit(8),
    supabase
      .from("credit_cards")
      .select("slug, name, bank, description")
      .ilike("name", ilikePattern)
      .limit(6),
    supabase
      .from("mutual_funds")
      .select("slug, name, fund_house")
      .eq("is_active", true)
      .ilike("name", ilikePattern)
      .limit(6),
  ]);

  const results: SearchResult[] = [];
  for (const a of articlesRes.data || []) {
    results.push({
      type: "article",
      title: a.title || "(untitled)",
      description: a.excerpt || "",
      href: `/articles/${a.slug}`,
    });
  }
  for (const g of glossaryRes.data || []) {
    results.push({
      type: "glossary",
      title: g.term || "(undefined)",
      description: (g.definition || "").slice(0, 160),
      href: `/glossary/${g.slug}`,
    });
  }
  for (const c of ccRes.data || []) {
    results.push({
      type: "credit_card",
      title: c.name,
      description: c.description?.slice(0, 160) || `${c.bank} credit card`,
      href: `/credit-cards/${c.slug}`,
    });
  }
  for (const m of mfRes.data || []) {
    results.push({
      type: "mutual_fund",
      title: m.name,
      description: m.fund_house || "Mutual fund",
      href: `/mutual-funds/${m.slug}`,
    });
  }
  return results;
}

const TYPE_LABELS: Record<SearchResult["type"], string> = {
  article: "Article",
  glossary: "Glossary",
  credit_card: "Credit card",
  mutual_fund: "Mutual fund",
  loan: "Loan",
  other: "Other",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const results = await runSearch(query);

  return (
    <div className="min-h-screen bg-canvas">
      <section className="surface-ink pt-12 pb-10">
        <div className="max-w-[900px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              <li>
                <Link
                  href="/"
                  className="hover:text-indian-gold transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Search</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Search
          </div>
          <h1 className="font-display font-black text-[36px] md:text-[48px] leading-[1.05] tracking-tight text-canvas">
            {query ? (
              <>
                Results for{" "}
                <span className="text-indian-gold">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              <>
                What are you{" "}
                <span className="text-indian-gold">looking for</span>?
              </>
            )}
          </h1>

          <form
            action="/search"
            method="get"
            className="mt-8 flex gap-2 max-w-[600px]"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search articles, glossary, products…"
              className="flex-1 px-4 py-3 bg-canvas/10 border-2 border-canvas/20 text-canvas placeholder:text-canvas-70 focus:border-indian-gold focus:outline-none font-mono text-[14px]"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-indian-gold text-ink font-mono text-[11px] uppercase tracking-wider hover:bg-canvas transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </form>
        </div>
      </section>

      <section className="bg-canvas py-12">
        <div className="max-w-[900px] mx-auto px-6">
          {!query && (
            <div className="text-center py-16">
              <p className="text-[16px] text-ink-80 max-w-[480px] mx-auto leading-relaxed">
                Try searching for a fund name, credit card, tax term, or article
                topic.
              </p>
            </div>
          )}
          {query && results.length === 0 && (
            <div className="text-center py-16">
              <div className="font-mono text-[11px] uppercase tracking-wider text-warning-red mb-3">
                No results
              </div>
              <p className="text-[16px] text-ink-80 max-w-[520px] mx-auto leading-relaxed mb-6">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;.
                Try fewer or different words, or browse the listings below.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-wider">
                <Link
                  href="/articles"
                  className="text-indian-gold hover:underline"
                >
                  Browse articles &rarr;
                </Link>
                <Link
                  href="/glossary"
                  className="text-indian-gold hover:underline"
                >
                  Browse glossary &rarr;
                </Link>
                <Link
                  href="/credit-cards"
                  className="text-indian-gold hover:underline"
                >
                  All credit cards &rarr;
                </Link>
              </div>
            </div>
          )}
          {results.length > 0 && (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-60 mb-3">
                {results.length} result{results.length === 1 ? "" : "s"}
              </div>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <Link
                    key={`${r.type}-${i}-${r.href}`}
                    href={r.href}
                    className="group block border-2 border-ink-12 hover:border-ink p-5 transition-colors"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-2">
                      {TYPE_LABELS[r.type]}
                    </div>
                    <h2 className="font-display text-[18px] md:text-[20px] font-bold text-ink mb-1 group-hover:text-indian-gold transition-colors">
                      {r.title}
                    </h2>
                    {r.description && (
                      <p className="text-[14px] text-ink-80 leading-[1.5] line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
