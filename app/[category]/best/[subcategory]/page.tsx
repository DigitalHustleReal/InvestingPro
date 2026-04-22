import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Shield,
  CalendarDays,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/static";
import { formatSlug } from "@/lib/utils";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";
import { RichProduct } from "@/types/rich-product";
import BestOfProductList from "./BestOfProductList";

export const revalidate = 86400; // Daily ISR

// ─── Category config ───────────────────────────────────────────────
interface CategoryConfig {
  slug: string;
  label: string;
  dbTable: string;
  dbCategory: string;
  desk: string;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  "credit-cards": {
    slug: "credit-cards",
    label: "Credit Cards",
    dbTable: "credit_cards",
    dbCategory: "credit_card",
    desk: "Credit Team",
  },
  loans: {
    slug: "loans",
    label: "Loans",
    dbTable: "products",
    dbCategory: "loan",
    desk: "Editorial Team",
  },
  "mutual-funds": {
    slug: "mutual-funds",
    label: "Mutual Funds",
    dbTable: "products",
    dbCategory: "mutual_fund",
    desk: "Editorial Team",
  },
  insurance: {
    slug: "insurance",
    label: "Insurance",
    dbTable: "products",
    dbCategory: "insurance",
    desk: "Editorial Team",
  },
  "fixed-deposits": {
    slug: "fixed-deposits",
    label: "Fixed Deposits",
    dbTable: "products",
    dbCategory: "fixed_deposit",
    desk: "Editorial Team",
  },
  "demat-accounts": {
    slug: "demat-accounts",
    label: "Demat Accounts",
    dbTable: "products",
    dbCategory: "demat_account",
    desk: "Editorial Team",
  },
};

// Top subcategories per category for static generation
const STATIC_SUBCATEGORIES: Record<string, string[]> = {
  "credit-cards": [
    "rewards",
    "cashback",
    "travel",
    "no-annual-fee",
    "premium",
    "fuel",
    "shopping",
    "lifetime-free",
  ],
  loans: ["personal", "home", "education", "car", "business", "gold"],
  "mutual-funds": [
    "large-cap",
    "mid-cap",
    "small-cap",
    "elss",
    "index-funds",
    "debt",
    "hybrid",
  ],
  insurance: ["term-life", "health", "car", "two-wheeler", "travel"],
  "fixed-deposits": [
    "high-interest",
    "senior-citizen",
    "short-term",
    "tax-saving",
  ],
  "demat-accounts": ["beginners", "active-traders", "low-brokerage"],
};

// FAQ data per category (3-5 questions each)
const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  "credit-cards": [
    {
      q: "How do you pick the best credit cards?",
      a: "We evaluate every card on 23 data points including rewards rate, annual fee value, welcome bonus worth, interest rates, and real-world benefits. No bank pays for higher placement.",
    },
    {
      q: "Should I get a rewards or cashback card?",
      a: "If you prefer simplicity, cashback cards credit savings directly to your statement. Rewards cards can deliver higher value if you redeem points strategically for travel or products.",
    },
    {
      q: "What credit score do I need?",
      a: "Premium cards typically require 750+ CIBIL score. Mid-tier cards work with 700+. Some secured cards accept 650+. Check your score for free before applying.",
    },
    {
      q: "Will applying hurt my credit score?",
      a: "Each application triggers a hard inquiry that can lower your score by 5-10 points temporarily. Apply for 1-2 cards at a time and space applications 3-6 months apart.",
    },
  ],
  loans: [
    {
      q: "How are the best loans selected?",
      a: "We compare interest rates, processing fees, prepayment charges, loan tenure flexibility, and disbursal speed across 30+ lenders. Our ratings are independent of commercial partnerships.",
    },
    {
      q: "What credit score do I need for a loan?",
      a: "Most lenders require a CIBIL score of 700+ for competitive rates. Some NBFCs offer loans with 650+ but at higher interest rates. Home loans may have different criteria.",
    },
    {
      q: "Should I go for fixed or floating interest rate?",
      a: "Floating rates are generally lower and follow RBI repo rate changes. Fixed rates offer predictability. In a declining rate environment, floating is usually better.",
    },
  ],
  "mutual-funds": [
    {
      q: "How do you rank mutual funds?",
      a: "We analyze 5-year rolling returns, risk-adjusted performance (Sharpe ratio), expense ratio, fund manager track record, and AUM stability. Past performance alone does not drive our rankings.",
    },
    {
      q: "Should I invest via SIP or lump sum?",
      a: "SIP is recommended for most investors as it averages out market volatility. Lump sum can work when markets are undervalued, but timing the market is difficult.",
    },
    {
      q: "What is the minimum investment amount?",
      a: "Most mutual funds allow SIP investments starting from just Rs 500 per month. Lump sum minimum is typically Rs 1,000-5,000 depending on the fund house.",
    },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────
function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.toLocaleString("en-IN", { month: "long" }),
    year: now.getFullYear(),
  };
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Static params ─────────────────────────────────────────────────
export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  for (const [cat, subs] of Object.entries(STATIC_SUBCATEGORIES)) {
    for (const sub of subs) {
      params.push({ category: cat, subcategory: sub });
    }
  }
  return params;
}

// ─── Metadata ──────────────────────────────────────────────────────
type PageParams = { category: string; subcategory: string };

export async function generateMetadata(props: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { category, subcategory } = await props.params;
  const config = CATEGORY_MAP[category];
  if (!config) return {};

  const { month, year } = getCurrentMonthYear();
  const subLabel = formatSlug(subcategory);
  const catLabel = config.label;
  const title = `Best ${subLabel} ${catLabel} in India ${month} ${year}`;
  const description = `Compare the best ${subLabel.toLowerCase()} ${catLabel.toLowerCase()} in India. Independent ratings, real data, no paid placements. Updated ${month} ${year}.`;

  return {
    title: `${title} | InvestingPro`,
    description,
    openGraph: {
      title,
      description,
      url: `https://investingpro.in/${category}/best/${subcategory}`,
      type: "website",
    },
    alternates: {
      canonical: `https://investingpro.in/${category}/best/${subcategory}`,
    },
  };
}

// ─── Data fetching ─────────────────────────────────────────────────
async function fetchProducts(
  config: CategoryConfig,
  subcategory: string,
): Promise<RichProduct[]> {
  const supabase = createClient();

  if (config.dbTable === "credit_cards") {
    // Credit cards have their own table with different schema
    const { data, error } = await supabase
      .from("credit_cards")
      .select(
        "id, slug, name, bank, image_url, description, rating, type, features, pros, cons, apply_link, updated_at, annual_fee, joining_fee, reward_rate, reward_type, min_income",
      )
      .or(
        `type.ilike.%${subcategory.replace(/-/g, " ")}%,type.ilike.%${subcategory.replace(/-/g, "%")}%`,
      )
      .order("rating", { ascending: false })
      .limit(10);

    if (error || !data) return [];

    return data.map((card: any) => ({
      id: card.id || card.slug || "unknown",
      slug: card.slug,
      name: card.name,
      category: "credit_card" as const,
      provider_name: card.bank,
      image_url: card.image_url,
      description: card.description || "",
      rating: {
        overall: Number(card.rating) || 4.5,
        trust_score: 85,
        breakdown: {},
      },
      bestFor: card.type || "General",
      specs: {
        annual_fee: card.annual_fee,
        joining_fee: card.joining_fee,
        rewardRate: card.reward_rate,
        rewardsType: card.reward_type,
        min_income: card.min_income,
      },
      features: card.features || {},
      key_features: [
        ...(card.annual_fee != null
          ? [
              {
                label: "Annual Fee",
                value:
                  card.annual_fee === 0
                    ? "FREE"
                    : `Rs ${card.annual_fee.toLocaleString("en-IN")}`,
              },
            ]
          : []),
        ...(card.reward_rate
          ? [{ label: "Reward Rate", value: card.reward_rate }]
          : []),
        ...(card.reward_type
          ? [{ label: "Reward Type", value: card.reward_type }]
          : []),
        ...(card.min_income
          ? [
              {
                label: "Min Income",
                value: `Rs ${Number(card.min_income).toLocaleString("en-IN")}`,
              },
            ]
          : []),
      ].slice(0, 4),
      pros: card.pros || [],
      cons: card.cons || [],
      is_verified: true,
      updated_at: card.updated_at,
      affiliate_link: card.apply_link,
    }));
  }

  // Generic products table
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, provider_name, category, image_url, description, rating, features, pros, cons, affiliate_link, official_link, updated_at",
    )
    .eq("category", config.dbCategory)
    .or(
      `name.ilike.%${subcategory.replace(/-/g, " ")}%,description.ilike.%${subcategory.replace(/-/g, " ")}%`,
    )
    .order("rating", { ascending: false })
    .limit(10);

  if (error || !data) return [];

  return data.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    provider_name: p.provider_name || "",
    image_url: p.image_url,
    description: p.description || "",
    rating:
      typeof p.rating === "number"
        ? { overall: p.rating, trust_score: 80, breakdown: {} }
        : p.rating || { overall: 4.0, trust_score: 80, breakdown: {} },
    bestFor: undefined,
    features: p.features || {},
    key_features: [],
    pros: p.pros || [],
    cons: p.cons || [],
    is_verified: true,
    updated_at: p.updated_at,
    affiliate_link: p.affiliate_link,
    official_link: p.official_link,
  }));
}

async function fetchRelatedArticles(
  category: string,
): Promise<{ title: string; slug: string; excerpt: string }[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("title, slug, excerpt")
    .eq("status", "published")
    .ilike("category", `%${category.replace(/-/g, " ")}%`)
    .order("published_at", { ascending: false })
    .limit(4);

  if (error || !data) return [];
  return data;
}

// ─── Page ──────────────────────────────────────────────────────────
export default async function BestOfPage(props: {
  params: Promise<PageParams>;
}) {
  const { category, subcategory } = await props.params;
  const config = CATEGORY_MAP[category];
  if (!config) notFound();

  const { month, year } = getCurrentMonthYear();
  const subLabel = formatSlug(subcategory);
  const catLabel = config.label;
  const pageTitle = `Best ${subLabel} ${catLabel} in India ${month} ${year}`;
  const todayStr = formatDate();

  // Fetch data in parallel
  let products: RichProduct[] = [];
  let articles: { title: string; slug: string; excerpt: string }[] = [];

  try {
    [products, articles] = await Promise.all([
      fetchProducts(config, subcategory),
      fetchRelatedArticles(category),
    ]);
  } catch {
    products = [];
    articles = [];
  }

  // Structured data
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: pageTitle,
      description: `Compare the best ${subLabel.toLowerCase()} ${catLabel.toLowerCase()} in India. Independent ratings updated ${month} ${year}.`,
      url: `https://investingpro.in/${category}/best/${subcategory}`,
      numberOfItems: products.length,
      publisher: {
        "@type": "Organization",
        name: "InvestingPro",
        url: "https://investingpro.in",
        logo: {
          "@type": "ImageObject",
          url: "https://investingpro.in/logo.png",
        },
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://investingpro.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: catLabel,
            item: `https://investingpro.in/${category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Best",
            item: `https://investingpro.in/${category}/best`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: subLabel,
            item: `https://investingpro.in/${category}/best/${subcategory}`,
          },
        ],
      },
    },
    // FAQ schema (if available)
    ...(FAQ_DATA[category]
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA[category].map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Green Hero Header ── */}
      <section className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-green-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={12} />
              </li>
              <li>
                <Link
                  href={`/${category}`}
                  className="hover:text-white transition-colors"
                >
                  {catLabel}
                </Link>
              </li>
              <li>
                <ChevronRight size={12} />
              </li>
              <li className="text-white font-medium">Best {subLabel}</li>
            </ol>
          </nav>

          <AdvertiserDisclosure
            variant="expandable"
            className="mb-3 [&_button]:text-green-200 [&_button]:border-green-600 [&_button:hover]:bg-authority-green/50 [&_p]:text-green-100"
          />

          <h1 className="font-display font-black text-[32px] md:text-[48px] lg:text-[56px] tracking-tight leading-[1.05]">
            {pageTitle}
          </h1>
          <p className="text-[15px] text-canvas-70 mt-3 max-w-2xl leading-relaxed">
            Our editorial team analysed every{" "}
            {catLabel.toLowerCase().replace(/s$/, "")} in this category to find
            the top picks. Ranked by real outcomes, not what pays us most.
          </p>
        </div>
      </section>

      {/* ── Editorial Meta Row ── */}
      <section className="bg-white border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center gap-4 text-[12px] text-ink-60">
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-ink">
              InvestingPro {config.desk}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} className="text-action-green" />
            Updated {todayStr}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-action-green" />
            Fact-checked
          </span>
          <span className="flex items-center gap-1.5">
            <Shield size={13} className="text-action-green" />
            Independent ratings
          </span>
        </div>
      </section>

      {/* ── Intro Paragraph ── */}
      <section className="bg-gray-50 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <p className="text-sm text-ink leading-relaxed max-w-3xl">
            Looking for the best {subLabel.toLowerCase()}{" "}
            {catLabel.toLowerCase()}? We reviewed and compared every option
            available in India, scoring each on fees, features, rewards value,
            and real-world performance. Below are our top{" "}
            {products.length > 0 ? products.length : ""} picks for {month}{" "}
            {year} — updated monthly.
          </p>
        </div>
      </section>

      {/* ── Product List ── */}
      <section className="bg-gray-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {products.length > 0 ? (
            <BestOfProductList products={products} />
          ) : (
            <div className="text-center py-16">
              <p className="text-ink-60 text-sm">
                No products found for this subcategory yet. Check back soon as
                we add more products.
              </p>
              <Link
                href={`/${category}`}
                className="inline-block mt-4 text-sm font-semibold text-authority-green hover:text-green-800 transition-colors"
              >
                Browse all {catLabel} &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Methodology Section ── */}
      <section className="bg-white border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-ink mb-5">
            How We Rate {catLabel}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                num: "23+",
                label: "Data points per product",
                desc: "Fees, returns, benefits, eligibility, customer service, and more",
              },
              {
                num: "Monthly",
                label: "Update frequency",
                desc: "Rates and features verified against official sources and RBI data",
              },
              {
                num: "Rs 0",
                label: "Paid placements",
                desc: "No company pays for higher ranking. Editorial is fully independent",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <p className="text-2xl font-black text-action-green">{stat.num}</p>
                <p className="text-sm font-semibold text-ink mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-ink-60 mt-1 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-60 leading-relaxed max-w-2xl">
            When you apply through our links, we may earn an affiliate
            commission. This never influences our ratings. See our{" "}
            <Link
              href="/methodology"
              className="text-action-green font-medium hover:text-authority-green"
            >
              methodology
            </Link>{" "}
            and{" "}
            <Link
              href="/how-we-make-money"
              className="text-action-green font-medium hover:text-authority-green"
            >
              how we make money
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      {FAQ_DATA[category] && FAQ_DATA[category].length > 0 && (
        <section className="bg-gray-50 border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <h2 className="text-lg font-bold text-ink mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {FAQ_DATA[category].map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white border border-ink/10 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-ink hover:bg-gray-50 transition-colors list-none">
                    {faq.q}
                    <ChevronRight
                      size={16}
                      className="text-ink-60 transition-transform group-open:rotate-90 flex-shrink-0 ml-4"
                    />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-ink-60 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Articles ── */}
      {articles.length > 0 && (
        <section className="bg-white border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <h2 className="text-lg font-bold text-ink mb-5">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="flex items-start gap-3 p-4 bg-gray-50 border border-ink/10 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"
                >
                  <BookOpen
                    size={16}
                    className="text-action-green mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink group-hover:text-authority-green transition-colors">
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p className="text-xs text-ink-60 mt-1 leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
