import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Award, ArrowRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import Sparkline from "@/components/common/Sparkline";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 86400; // Daily

const CATEGORIES = [
  { slug: "large-cap", label: "Large Cap", dbCategory: "Equity - Large Cap" },
  { slug: "mid-cap", label: "Mid Cap", dbCategory: "Equity - Mid Cap" },
  { slug: "small-cap", label: "Small Cap", dbCategory: "Equity - Small Cap" },
  { slug: "flexi-cap", label: "Flexi Cap", dbCategory: "Equity - Flexi Cap" },
  { slug: "multi-cap", label: "Multi Cap", dbCategory: "Equity - Multi Cap" },
  {
    slug: "elss",
    label: "ELSS Tax Saver",
    dbCategory: "Equity - ELSS (Tax Saving)",
  },
  { slug: "index-funds", label: "Index Funds", dbCategory: "Index/ETF" },
  {
    slug: "balanced-advantage",
    label: "Balanced Advantage",
    dbCategory: "Hybrid - Balanced Advantage",
  },
  {
    slug: "aggressive-hybrid",
    label: "Aggressive Hybrid",
    dbCategory: "Hybrid - Aggressive",
  },
  { slug: "debt-liquid", label: "Liquid Funds", dbCategory: "Debt - Liquid" },
  {
    slug: "debt-short-duration",
    label: "Short Duration",
    dbCategory: "Debt - Short Duration",
  },
  {
    slug: "value-contra",
    label: "Value/Contra",
    dbCategory: "Equity - Value/Contra",
  },
  {
    slug: "sectoral-thematic",
    label: "Sectoral/Thematic",
    dbCategory: "Equity - Sectoral/Thematic",
  },
  {
    slug: "large-mid-cap",
    label: "Large & Mid Cap",
    dbCategory: "Equity - Large & Mid Cap",
  },
  { slug: "focused", label: "Focused Funds", dbCategory: "Equity - Focused" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentMonth = months[new Date().getMonth()];
const currentYear = new Date().getFullYear();

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "Best Mutual Funds" };

  return {
    title: `Best ${cat.label} Mutual Funds ${currentMonth} ${currentYear} — Top Performers`,
    description: `Top 10 best ${cat.label} mutual funds to invest in ${currentMonth} ${currentYear}. Ranked by 3-year CAGR returns. Compare NAV, expense ratio, risk, and start SIP.`,
  };
}

export default async function BestFundsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const supabase = createServiceClient();
  const { data: funds } = await supabase
    .from("products")
    .select("slug, name, provider_name, features, rating")
    .eq("category", "mutual_fund")
    .eq("is_active", true)
    .limit(500);

  if (!funds) notFound();

  // Filter to this category and sort by 3Y returns
  const categoryFunds = funds
    .filter((f: any) => (f.features?.category || f.best_for) === cat.dbCategory)
    .map((f: any) => {
      const feat = f.features || {};
      return {
        slug: f.slug,
        name: f.name.replace(/\s*-?\s*Direct\s+Plan\s*-?\s*Growth/i, "").trim(),
        provider: f.provider_name || feat.fund_house || "",
        nav: Number(feat.nav) || 0,
        returns1Y: feat.returns_1y != null ? Number(feat.returns_1y) : null,
        returns3Y: feat.returns_3y != null ? Number(feat.returns_3y) : null,
        returns5Y: feat.returns_5y != null ? Number(feat.returns_5y) : null,
        expenseRatio:
          feat.expense_ratio != null ? Number(feat.expense_ratio) : null,
        aumCrores: feat.aum_crores != null ? Number(feat.aum_crores) : null,
        riskLevel: feat.risk_level || "",
        fundManager: feat.fund_manager || "",
        rating: f.rating || feat.groww_rating || null,
      };
    })
    .sort((a: any, b: any) => (b.returns3Y ?? -999) - (a.returns3Y ?? -999));

  const top10 = categoryFunds.slice(0, 10);
  const allFunds = categoryFunds;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Best ${cat.label} Mutual Funds ${currentMonth} ${currentYear}`,
            description: `Top performing ${cat.label} mutual funds ranked by returns.`,
            numberOfItems: top10.length,
            itemListElement: top10.map((f, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: f.name,
              url: `https://investingpro.in/mutual-funds/${f.slug}`,
            })),
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <nav className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/mutual-funds" className="hover:text-gray-700">
                  Mutual Funds
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-700">Best {cat.label}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <Award className="w-7 h-7 text-amber-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Best {cat.label} Mutual Funds — {currentMonth} {currentYear}
            </h1>
          </div>
          <p className="text-gray-500 max-w-2xl">
            Top {cat.label} funds ranked by 3-year CAGR returns. Updated daily
            with real NAV data from AMFI. All funds shown are Direct Growth
            plans (lowest expense ratio).
          </p>

          {/* Category navigation */}
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.slice(0, 10).map((c) => (
              <Link
                key={c.slug}
                href={`/best-mutual-funds/${c.slug}`}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                  c.slug === category
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700",
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-8">
        {/* Top 10 Cards */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Top 10 {cat.label} Funds
        </h2>
        <div className="space-y-3 mb-10">
          {top10.map((fund, i) => (
            <Link key={fund.slug} href={`/mutual-funds/${fund.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                      i < 3
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {fund.name}
                    </p>
                    <p className="text-xs text-gray-400">{fund.provider}</p>
                  </div>

                  {/* Returns */}
                  <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                    <div className="text-center w-16">
                      <p className="text-[10px] text-gray-400">1Y</p>
                      <p
                        className={cn(
                          "text-xs font-semibold tabular-nums",
                          (fund.returns1Y ?? 0) >= 0
                            ? "text-green-600"
                            : "text-red-500",
                        )}
                      >
                        {fund.returns1Y !== null
                          ? `${fund.returns1Y >= 0 ? "+" : ""}${fund.returns1Y.toFixed(1)}%`
                          : "—"}
                      </p>
                    </div>
                    <div className="text-center w-16">
                      <p className="text-[10px] text-gray-400">3Y</p>
                      <p
                        className={cn(
                          "text-sm font-bold tabular-nums",
                          (fund.returns3Y ?? 0) >= 0
                            ? "text-green-600"
                            : "text-red-500",
                        )}
                      >
                        {fund.returns3Y !== null
                          ? `${fund.returns3Y >= 0 ? "+" : ""}${fund.returns3Y.toFixed(1)}%`
                          : "—"}
                      </p>
                    </div>
                    <div className="text-center w-16">
                      <p className="text-[10px] text-gray-400">5Y</p>
                      <p
                        className={cn(
                          "text-xs font-semibold tabular-nums",
                          (fund.returns5Y ?? 0) >= 0
                            ? "text-green-600"
                            : "text-red-500",
                        )}
                      >
                        {fund.returns5Y !== null
                          ? `${fund.returns5Y >= 0 ? "+" : ""}${fund.returns5Y.toFixed(1)}%`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* NAV */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">NAV</p>
                    <p className="text-sm font-semibold text-gray-900 tabular-nums">
                      ₹{fund.nav.toFixed(2)}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Full List Table */}
        {allFunds.length > 10 && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              All {cat.label} Funds ({allFunds.length})
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-2.5 px-4 text-gray-500 font-medium">
                          #
                        </th>
                        <th className="text-left py-2.5 px-4 text-gray-500 font-medium">
                          Fund
                        </th>
                        <th className="text-right py-2.5 px-3 text-gray-500 font-medium">
                          NAV
                        </th>
                        <th className="text-right py-2.5 px-3 text-gray-500 font-medium">
                          1Y
                        </th>
                        <th className="text-right py-2.5 px-3 text-gray-500 font-medium">
                          3Y
                        </th>
                        <th className="text-right py-2.5 px-3 text-gray-500 font-medium hidden md:table-cell">
                          5Y
                        </th>
                        <th className="text-right py-2.5 px-3 text-gray-500 font-medium hidden lg:table-cell">
                          Expense
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFunds.map((fund, i) => (
                        <tr
                          key={fund.slug}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="py-2 px-4 text-xs text-gray-400">
                            {i + 1}
                          </td>
                          <td className="py-2 px-4">
                            <Link
                              href={`/mutual-funds/${fund.slug}`}
                              className="text-xs font-medium text-gray-900 hover:text-green-600 line-clamp-1"
                            >
                              {fund.name}
                            </Link>
                            <p className="text-[10px] text-gray-400">
                              {fund.provider}
                            </p>
                          </td>
                          <td className="py-2 px-3 text-right text-xs text-gray-600 tabular-nums">
                            ₹{fund.nav.toFixed(2)}
                          </td>
                          <td
                            className={cn(
                              "py-2 px-3 text-right text-xs font-semibold tabular-nums",
                              (fund.returns1Y ?? 0) >= 0
                                ? "text-green-600"
                                : "text-red-500",
                            )}
                          >
                            {fund.returns1Y !== null
                              ? `${fund.returns1Y.toFixed(1)}%`
                              : "—"}
                          </td>
                          <td
                            className={cn(
                              "py-2 px-3 text-right text-xs font-semibold tabular-nums",
                              (fund.returns3Y ?? 0) >= 0
                                ? "text-green-600"
                                : "text-red-500",
                            )}
                          >
                            {fund.returns3Y !== null
                              ? `${fund.returns3Y.toFixed(1)}%`
                              : "—"}
                          </td>
                          <td
                            className={cn(
                              "py-2 px-3 text-right text-xs tabular-nums hidden md:table-cell",
                              (fund.returns5Y ?? 0) >= 0
                                ? "text-green-600"
                                : "text-red-500",
                            )}
                          >
                            {fund.returns5Y !== null
                              ? `${fund.returns5Y.toFixed(1)}%`
                              : "—"}
                          </td>
                          <td className="py-2 px-3 text-right text-xs text-gray-500 tabular-nums hidden lg:table-cell">
                            {fund.expenseRatio ? `${fund.expenseRatio}%` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-gray-400 mt-8 leading-relaxed text-center">
          Rankings based on 3-year CAGR returns from historical NAV data. Past
          performance does not guarantee future results. Mutual fund investments
          are subject to market risks. Read all scheme related documents
          carefully before investing. Data sourced from AMFI and mfapi.in. Last
          updated:{" "}
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
      </div>
    </div>
  );
}
