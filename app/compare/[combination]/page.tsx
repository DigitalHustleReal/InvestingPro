/**
 * Product Comparison Page — Server Component with ISR
 *
 * URL format: /compare/hdfc-regalia-vs-axis-magnus
 *
 * Features:
 *   - Hero face-off with scores
 *   - Full feature comparison matrix (winner per row)
 *   - AI verdict (cached in DB or generated on-the-fly)
 *   - "Best for" scenarios
 *   - Related comparisons
 *   - Programmatic SEO: 1 URL = 1 cached page
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/lib/products/product-service";
import { getComparisonVerdict } from "@/lib/products/comparison-service";
import { createServiceClient } from "@/lib/supabase/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeftRight,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Users,
  Zap,
  Target,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import ComparisonPDFButton from "@/components/products/ComparisonPDFButton";
import { VersusSchema } from "@/components/seo/SchemaMarkup";
import { cn } from "@/lib/utils";

export const revalidate = 86400; // Cache comparison pages for 24h

export async function generateMetadata({
  params,
}: {
  params: { combination: string };
}): Promise<Metadata> {
  const parts = params.combination.split("-vs-");
  if (parts.length !== 2) return { title: "Compare Products" };

  const [p1, p2] = await Promise.all([
    productService.getProductBySlug(parts[0]),
    productService.getProductBySlug(parts[1]),
  ]);

  if (!p1 || !p2) return { title: "Compare Products" };

  return {
    title: `${p1.name} vs ${p2.name} (2026): Which Is Better?`,
    description: `Full side-by-side comparison of ${p1.name} and ${p2.name}. Fees, rewards, eligibility, expert verdict, and our recommendation.`,
    alternates: { canonical: `/compare/${params.combination}` },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: { combination: string };
}) {
  const { combination } = params;
  const parts = combination.split("-vs-");

  if (parts.length !== 2) {
    return (
      <InvalidComparison message="Use format: /compare/product-a-vs-product-b" />
    );
  }

  const supabase = createServiceClient();

  // Check for pre-generated programmatic SEO content
  const { data: versusPage } = await supabase
    .from("versus_pages")
    .select(
      "id, slug, product1_id, product2_id, verdict, view_count, last_viewed_at, meta_title, meta_description",
    )
    .eq("slug", combination)
    .single();

  let verdict = "";
  let p1: any, p2: any;

  if (versusPage) {
    [p1, p2] = await Promise.all([
      productService.getProductBySlug(versusPage.product1_id),
      productService.getProductBySlug(versusPage.product2_id),
    ]);
    verdict = versusPage.verdict;

    // Update view count (fire & forget)
    try {
      await supabase
        .from("versus_pages")
        .update({
          view_count: (versusPage.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString(),
        })
        .eq("id", versusPage.id);
    } catch {
      // Silently ignore view count errors
    }
  } else {
    [p1, p2] = await Promise.all([
      productService.getProductBySlug(parts[0]),
      productService.getProductBySlug(parts[1]),
    ]);

    if (!p1 || !p2) {
      return (
        <InvalidComparison message="One or both products don't exist in our database." />
      );
    }

    if (p1.category !== p2.category) {
      return (
        <InvalidComparison
          message={`Comparing a ${p1.category.replace("_", " ")} with a ${p2.category.replace("_", " ")} isn't meaningful.`}
        />
      );
    }

    verdict = await getComparisonVerdict(p1, p2);
  }

  if (!p1 || !p2) notFound();

  const comparisonRows = buildComparisonRows(p1, p2);
  const winner = determineWinner(p1, p2, comparisonRows);
  const scenarios = buildBestForScenarios(p1, p2);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema Markup for SEO */}
      <VersusSchema
        product1Name={p1.name}
        product1Slug={p1.slug || parts[0]}
        product1Image={p1.image_url}
        product1Rating={p1.rating}
        product2Name={p2.name}
        product2Slug={p2.slug || parts[1]}
        product2Image={p2.image_url}
        product2Rating={p2.rating}
        combination={combination}
        category={p1.category || "credit_cards"}
      />
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16" id="versus-report">
        {/* ── Hero Face-Off ─────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 sm:gap-16 mb-8">
            <ProductHero p={p1} isWinner={winner === "p1"} />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                VS
              </span>
            </div>
            <ProductHero p={p2} isWinner={winner === "p2"} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-4 leading-tight">
            {p1.name} vs {p2.name}
          </h1>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Detailed side-by-side comparison based on fees, rewards, benefits,
            and real user data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="text-xs">
              {p1.category?.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Updated{" "}
              {new Date().toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </Badge>
            <ComparisonPDFButton
              targetId="versus-report"
              productNames={[p1.name, p2.name]}
            />
          </div>
        </div>

        {/* ── Quick Score Summary ────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <ScoreCard p={p1} isWinner={winner === "p1"} label="Overall Score" />
          <ScoreCard p={p2} isWinner={winner === "p2"} label="Overall Score" />
        </div>

        {/* ── Feature Comparison Matrix ──────────────────────────── */}
        <div className="mb-12 rounded-2xl border border-border overflow-hidden">
          <div className="bg-muted/40 px-6 py-4 border-b border-border flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Feature-by-Feature Comparison
            </h2>
          </div>

          {/* Matrix header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-muted/20 border-b border-border">
            <div className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Feature
            </div>
            <div className="px-5 py-3 text-xs font-bold text-center border-l border-border">
              <span className="text-foreground">{p1.name}</span>
            </div>
            <div className="px-5 py-3 text-xs font-bold text-center border-l border-border">
              <span className="text-foreground">{p2.name}</span>
            </div>
          </div>

          {/* Matrix rows */}
          {comparisonRows.map((row, idx) => (
            <ComparisonRow key={idx} row={row} idx={idx} />
          ))}
        </div>

        {/* ── AI Verdict ─────────────────────────────────────────── */}
        <div className="mb-12 bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl" />
          <div className="flex items-center gap-3 mb-5 ml-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                InvestingPro Expert Verdict
              </h2>
              <p className="text-xs text-muted-foreground">
                Based on SEBI-compliant analysis • Affiliate disclosed
              </p>
            </div>
          </div>
          <div className="ml-2 prose prose-slate dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-primary prose-headings:text-foreground">
            <ReactMarkdown>{verdict}</ReactMarkdown>
          </div>
        </div>

        {/* ── Best For Scenarios ──────────────────────────────────── */}
        {scenarios.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Who Should Get Which?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {scenarios.map((s, i) => (
                <BestForCard key={i} scenario={s} />
              ))}
            </div>
          </div>
        )}

        {/* ── Apply CTAs ─────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <ApplyCTA p={p1} />
          <ApplyCTA p={p2} />
        </div>

        {/* ── Related comparisons ────────────────────────────────── */}
        <Suspense fallback={null}>
          <RelatedComparisons
            category={p1.category}
            excludeSlug={combination}
            supabase={supabase}
          />
        </Suspense>

        {/* SEBI disclaimer */}
        <div className="mt-10 p-4 bg-muted/30 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Disclaimer:</strong> This comparison is for informational
            purposes only. Product details may change; verify on official bank
            websites before applying. InvestingPro may earn affiliate commission
            on approved applications. Not SEBI registered investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductHero({ p, isWinner }: { p: any; isWinner: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {isWinner && (
        <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 fill-amber-500" />
          WINNER
        </div>
      )}
      <div
        className={cn(
          "w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-background border-2 p-3 shadow-sm flex items-center justify-center transition-all",
          isWinner
            ? "border-primary shadow-primary/20 shadow-lg"
            : "border-border",
        )}
      >
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-2xl font-black text-muted-foreground">
            {p.name[0]}
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="font-bold text-sm text-foreground">{p.name}</div>
        <div className="text-xs text-muted-foreground">{p.provider_name}</div>
      </div>
    </div>
  );
}

function ScoreCard({
  p,
  isWinner,
  label,
}: {
  p: any;
  isWinner: boolean;
  label: string;
}) {
  const score = Math.round((p.rating || 3.5) * 20); // convert 5-star to 100
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 text-center transition-all",
        isWinner
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border bg-muted/20",
      )}
    >
      {isWinner && (
        <div className="text-xs font-bold text-primary mb-1 flex items-center justify-center gap-1">
          <Trophy className="w-3 h-3 fill-primary" /> Recommended
        </div>
      )}
      <div className="text-4xl font-black text-foreground mb-1">{score}</div>
      <div className="text-xs text-muted-foreground mb-2">{label} / 100</div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className={cn(
            "h-1.5 rounded-full transition-all",
            isWinner ? "bg-primary" : "bg-muted-foreground/40",
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-3.5 h-3.5",
              i < Math.floor(p.rating || 0)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30",
            )}
          />
        ))}
        <span className="ml-1 text-xs font-semibold text-muted-foreground">
          {p.rating}/5
        </span>
      </div>
    </div>
  );
}

interface CompRow {
  feature: string;
  v1: string;
  v2: string;
  winner: "p1" | "p2" | "tie" | null;
  category?: string;
}

function ComparisonRow({ row, idx }: { row: CompRow; idx: number }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_1fr_1fr] border-b border-border last:border-0",
        idx % 2 === 0 ? "bg-background" : "bg-muted/20",
      )}
    >
      <div className="px-5 py-4 text-sm font-medium text-muted-foreground flex items-center gap-2">
        {row.category && (
          <span className="text-[10px] font-bold uppercase text-muted-foreground/50 tracking-widest w-full">
            {row.category}
          </span>
        )}
        {!row.category && row.feature}
      </div>
      <CellValue value={row.v1} isWinner={row.winner === "p1"} />
      <CellValue value={row.v2} isWinner={row.winner === "p2"} />
    </div>
  );
}

function CellValue({ value, isWinner }: { value: string; isWinner: boolean }) {
  return (
    <div
      className={cn(
        "px-5 py-4 text-sm text-center border-l border-border flex items-center justify-center gap-2",
        isWinner
          ? "text-green-700 dark:text-green-400 font-semibold bg-green-50/50 dark:bg-green-900/10"
          : "text-foreground",
      )}
    >
      {isWinner && (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
      )}
      {value || "—"}
    </div>
  );
}

function BestForCard({
  scenario,
}: {
  scenario: { product: string; reason: string; icon: string };
}) {
  return (
    <div className="flex gap-4 p-5 rounded-xl border border-border bg-muted/20 hover:border-primary/30 transition-colors">
      <div className="text-2xl flex-shrink-0">{scenario.icon}</div>
      <div>
        <div className="font-bold text-sm text-foreground mb-1">
          Choose {scenario.product}
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {scenario.reason}
        </div>
      </div>
    </div>
  );
}

function ApplyCTA({ p }: { p: any }) {
  return (
    <div className="rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {p.image_url && (
          <div className="w-10 h-10 rounded-lg bg-background border border-border p-1.5 flex items-center justify-center">
            <img
              src={p.image_url}
              alt={p.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
        <div>
          <div className="font-bold text-sm text-foreground">{p.name}</div>
          <div className="text-xs text-muted-foreground">{p.provider_name}</div>
        </div>
      </div>
      <Link
        href={p.affiliate_link || p.official_link || "#"}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <Button className="w-full gap-2" size="sm">
          Apply for {p.name}
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </Link>
      <p className="text-[10px] text-muted-foreground text-center">
        Opens official {p.provider_name} website
      </p>
    </div>
  );
}

async function RelatedComparisons({
  category,
  excludeSlug,
  supabase,
}: {
  category: string;
  excludeSlug: string;
  supabase: any;
}) {
  const { data: related } = await supabase
    .from("versus_pages")
    .select("slug, product1_name, product2_name")
    .eq("category", category)
    .neq("slug", excludeSlug)
    .order("view_count", { ascending: false })
    .limit(6);

  if (!related?.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">
          Related Comparisons
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {related.map((r: any) => (
          <Link key={r.slug} href={`/compare/${r.slug}`}>
            <div className="rounded-xl border border-border p-3 hover:border-primary/40 hover:bg-muted/30 transition-all text-sm text-center">
              <span className="font-medium text-foreground text-xs">
                {r.product1_name}
              </span>
              <span className="text-muted-foreground mx-1 text-xs">vs</span>
              <span className="font-medium text-foreground text-xs">
                {r.product2_name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function InvalidComparison({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
      <AlertCircle className="w-12 h-12 text-muted-foreground/40" />
      <h1 className="text-xl font-bold text-foreground">Invalid Comparison</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>
      <Link href="/products">
        <Button>Browse Products</Button>
      </Link>
    </div>
  );
}

// ─── Comparison Logic ─────────────────────────────────────────────────────────

function buildComparisonRows(p1: any, p2: any): CompRow[] {
  const f1 = p1.features || {};
  const f2 = p2.features || {};
  const rows: CompRow[] = [];

  const row = (
    feature: string,
    v1: string,
    v2: string,
    lowerIsBetter = false,
  ): CompRow => {
    const n1 = parseFloat(v1.replace(/[^0-9.]/g, ""));
    const n2 = parseFloat(v2.replace(/[^0-9.]/g, ""));
    let winner: CompRow["winner"] = null;
    if (!isNaN(n1) && !isNaN(n2) && n1 !== n2) {
      winner = lowerIsBetter ? (n1 < n2 ? "p1" : "p2") : n1 > n2 ? "p1" : "p2";
    }
    return { feature, v1: v1 || "—", v2: v2 || "—", winner };
  };

  // Universal rows
  if (f1.annual_fee || f2.annual_fee)
    rows.push(
      row("Annual Fee", f1.annual_fee || "—", f2.annual_fee || "—", true),
    );
  if (f1.joining_fee || f2.joining_fee)
    rows.push(
      row("Joining Fee", f1.joining_fee || "—", f2.joining_fee || "—", true),
    );
  if (f1.interest_rate || f2.interest_rate)
    rows.push(
      row(
        "Interest Rate",
        f1.interest_rate || "—",
        f2.interest_rate || "—",
        true,
      ),
    );
  if (f1.reward_rate || f2.reward_rate)
    rows.push(
      row("Reward Rate", f1.reward_rate || "—", f2.reward_rate || "—", false),
    );
  if (f1.welcome_bonus || f2.welcome_bonus)
    rows.push(
      row(
        "Welcome Bonus",
        f1.welcome_bonus || "None",
        f2.welcome_bonus || "None",
        false,
      ),
    );
  if (f1.lounge_access || f2.lounge_access)
    rows.push(
      row(
        "Lounge Access",
        f1.lounge_access || "None",
        f2.lounge_access || "None",
        false,
      ),
    );
  if (f1.min_income || f2.min_income)
    rows.push(
      row("Min. Income", f1.min_income || "—", f2.min_income || "—", true),
    );
  if (f1.min_credit_score || f2.min_credit_score)
    rows.push(
      row(
        "Min. Credit Score",
        String(f1.min_credit_score || "—"),
        String(f2.min_credit_score || "—"),
        true,
      ),
    );

  // Mutual fund specific
  if (f1.nav || f2.nav)
    rows.push(row("NAV", `₹${f1.nav || "—"}`, `₹${f2.nav || "—"}`, false));
  if (f1.expense_ratio || f2.expense_ratio)
    rows.push(
      row(
        "Expense Ratio",
        f1.expense_ratio || "—",
        f2.expense_ratio || "—",
        true,
      ),
    );
  if (f1.returns_1y || f2.returns_1y)
    rows.push(
      row("1Y Returns", f1.returns_1y || "—", f2.returns_1y || "—", false),
    );
  if (f1.returns_3y || f2.returns_3y)
    rows.push(
      row("3Y CAGR", f1.returns_3y || "—", f2.returns_3y || "—", false),
    );

  // Fallback: show first 5 features from JSONB
  if (rows.length === 0) {
    const allKeys = [
      ...new Set([...Object.keys(f1), ...Object.keys(f2)]),
    ].slice(0, 6);
    for (const key of allKeys) {
      rows.push(
        row(
          key.replace(/_/g, " "),
          String(f1[key] ?? "—"),
          String(f2[key] ?? "—"),
        ),
      );
    }
  }

  return rows;
}

function determineWinner(
  p1: any,
  p2: any,
  rows: CompRow[],
): "p1" | "p2" | "tie" {
  let p1wins = 0,
    p2wins = 0;
  for (const r of rows) {
    if (r.winner === "p1") p1wins++;
    if (r.winner === "p2") p2wins++;
  }
  // Weight by overall rating too
  if ((p1.rating || 0) > (p2.rating || 0)) p1wins++;
  else if ((p2.rating || 0) > (p1.rating || 0)) p2wins++;

  if (p1wins > p2wins) return "p1";
  if (p2wins > p1wins) return "p2";
  return "tie";
}

function buildBestForScenarios(
  p1: any,
  p2: any,
): { product: string; reason: string; icon: string }[] {
  const f1 = p1.features || {};
  const f2 = p2.features || {};
  const scenarios = [];

  // Generic heuristics — expand per category
  const fee1 = parseFloat(
    String(f1.annual_fee || "9999").replace(/[^0-9.]/g, ""),
  );
  const fee2 = parseFloat(
    String(f2.annual_fee || "9999").replace(/[^0-9.]/g, ""),
  );

  if (!isNaN(fee1) && !isNaN(fee2)) {
    if (fee1 < fee2) {
      scenarios.push({
        product: p1.name,
        reason:
          "Lower annual fees — ideal for budget-conscious users who want value without high costs.",
        icon: "💰",
      });
      scenarios.push({
        product: p2.name,
        reason:
          "Higher fee but more premium perks like lounge access and higher reward rates — best for frequent spenders.",
        icon: "✈️",
      });
    } else if (fee2 < fee1) {
      scenarios.push({
        product: p2.name,
        reason:
          "Lower annual fees — ideal for budget-conscious users who want value without high costs.",
        icon: "💰",
      });
      scenarios.push({
        product: p1.name,
        reason:
          "Higher fee but more premium perks — best for power users who maximize rewards.",
        icon: "✈️",
      });
    }
  }

  if (scenarios.length === 0) {
    scenarios.push({
      product: p1.name,
      reason: `Best if ${p1.provider_name} is your primary bank.`,
      icon: "🏦",
    });
    scenarios.push({
      product: p2.name,
      reason: `Best if ${p2.provider_name} is your primary bank.`,
      icon: "🏦",
    });
  }

  return scenarios.slice(0, 4);
}
