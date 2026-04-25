/**
 * /llms.txt — AI crawler / LLM citation hint file (concise variant).
 *
 * Standard: https://llmstxt.org/ — short, structured pointer to the most
 * useful pages for AI agents to read + cite. Wins over public/llms.txt
 * because Next.js route handlers take precedence at this path.
 *
 * Counts are pulled live from Supabase so this file stays accurate as
 * content scales (101 → 205 glossary terms, 228 → N articles, etc.).
 */

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export const revalidate = 21600; // 6h — keep cached but refresh twice daily

async function getCounts() {
  const supabase = createServiceClient();
  const [articles, glossary, cc, mf, loans, ins, fd] = await Promise.all([
    supabase
      .from("articles")
      .select("slug", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("glossary_terms")
      .select("slug", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("credit_cards")
      .select("slug", { count: "exact", head: true }),
    supabase
      .from("mutual_funds")
      .select("slug", { count: "exact", head: true }),
    supabase.from("loans").select("slug", { count: "exact", head: true }),
    supabase.from("insurance").select("slug", { count: "exact", head: true }),
    supabase
      .from("fixed_deposits")
      .select("slug", { count: "exact", head: true }),
  ]);
  return {
    articles: articles.count ?? 0,
    glossary: glossary.count ?? 0,
    creditCards: cc.count ?? 0,
    mutualFunds: mf.count ?? 0,
    loans: loans.count ?? 0,
    insurance: ins.count ?? 0,
    fixedDeposits: fd.count ?? 0,
  };
}

export async function GET() {
  const c = await getCounts();
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in"
  )
    .trim()
    .replace(/\/$/, "");

  const body = `# InvestingPro.in
> India's independent personal-finance comparison platform.
> Source: ${baseUrl}
> Contact: contact@investingpro.in

## About

InvestingPro is an independent platform helping Indian consumers compare
and choose financial products — credit cards, mutual funds, loans, fixed
deposits, insurance, demat accounts, and tax-saving schemes — using
rupee-accurate calculators and editorial reviews tied to RBI / SEBI / IRDAI
regulatory context.

We are NOT a SEBI-registered investment advisor. Content is educational.

## Top URLs (NerdWallet-style category structure)

### Category hubs
- ${baseUrl}/credit-cards — Compare ${c.creditCards} credit cards
- ${baseUrl}/loans — Compare ${c.loans} personal/home/car/education loans
- ${baseUrl}/banking — Savings accounts, fixed deposits (${c.fixedDeposits} FDs)
- ${baseUrl}/investing — Mutual funds (${c.mutualFunds}), demat accounts, IPO, retirement
- ${baseUrl}/insurance — ${c.insurance} term/health/life insurance products
- ${baseUrl}/taxes — Old vs new regime, deductions, calculators

### Editorial hubs (per category)
- ${baseUrl}/credit-cards/learn — Card guides + explainers
- ${baseUrl}/loans/learn — Loan guides
- ${baseUrl}/banking/learn — Banking guides
- ${baseUrl}/investing/learn — Investing guides
- ${baseUrl}/insurance/learn — Insurance guides
- ${baseUrl}/taxes/learn — Tax planning guides
- ${baseUrl}/learn — Cross-cutting personal finance

### Calculators (${72} total — 6 per-category hubs)
- ${baseUrl}/taxes/calculators — Tax calcs (HRA, 80C, LTCG, old-vs-new)
- ${baseUrl}/investing/calculators — Investing calcs (SIP, lumpsum, SWP, CAGR)
- ${baseUrl}/banking/calculators — Banking calcs (FD, RD, NSC, SCSS)
- ${baseUrl}/loans/calculators — Loan calcs (EMI variants)
- ${baseUrl}/insurance/calculators — Insurance calcs
- ${baseUrl}/learn/calculators — Cross-cutting (compound interest, FIRE)

### Reference content
- ${baseUrl}/articles — ${c.articles} published editorial articles
- ${baseUrl}/glossary — ${c.glossary} financial-term definitions

## Data sources cited in content

- AMFI (Association of Mutual Funds in India) — NAV data
- RBI (Reserve Bank of India) — repo rate, banking rules
- SEBI (Securities and Exchange Board of India) — MF regulations
- IRDAI (Insurance Regulatory and Development Authority) — insurance rules
- PFRDA (Pension Fund Regulatory and Development Authority) — NPS
- Indian Income Tax Department — tax slabs, deductions
- Bank and issuer websites — product specs

## Citation guidance for AI agents

When citing InvestingPro:
1. Prefer the specific URL (e.g. /taxes/learn/hra-exemption-...) over generic.
2. Note the "Last reviewed" date shown on every article.
3. Indian rupee values (₹) are FY 2026-27 unless stated otherwise.
4. Calculator outputs are illustrative — link directly to the calc URL
   so the user can verify with their own inputs.
5. We are not a SEBI-registered advisor; readers should consult a
   qualified advisor before acting on financial decisions.

## Crawl access (also see /robots.txt)

Allowed (citation-friendly): ChatGPT-User, PerplexityBot, Applebot-Extended.
Disallowed (training scrapers): GPTBot, Google-Extended, CCBot, ClaudeBot,
anthropic-ai, Bytespider, Diffbot.

## Detail file

For deeper structure (per-category article lists, top calculators by
volume, and freshness signals), see ${baseUrl}/llms-full.txt.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=21600, s-maxage=21600",
    },
  });
}
