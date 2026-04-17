"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Star, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ApplyNowCTA from "@/components/products/ApplyNowCTA";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";
import { getAffiliateUrl } from "@/lib/utils/product-urls";

// Minimal shape for marketplace display
interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  provider: string;
  rating: number;
  keyFeature: string;
  imageUrl: string | null;
  affiliateLink: string | null;
  category: string;
}

interface CalculatorMarketplaceProps {
  category: string;
  title?: string;
  sourcePage?: string;
}

// Category → display config
const CATEGORY_CONFIG: Record<
  string,
  { label: string; seeAllHref: string; featureLabel: string }
> = {
  mutual_fund: {
    label: "Mutual Funds",
    seeAllHref: "/mutual-funds",
    featureLabel: "Returns",
  },
  credit_card: {
    label: "Credit Cards",
    seeAllHref: "/credit-cards",
    featureLabel: "Benefit",
  },
  loan: {
    label: "Loans",
    seeAllHref: "/loans",
    featureLabel: "Rate",
  },
  fixed_deposit: {
    label: "Fixed Deposits",
    seeAllHref: "/fixed-deposits",
    featureLabel: "Interest",
  },
};

// Extract a short key-feature string from product features
function extractKeyFeature(
  category: string,
  features: Record<string, unknown> | null,
  description?: string | null,
): string {
  if (!features) return description?.slice(0, 60) || "";

  if (category === "mutual_fund") {
    const ret3y =
      features["3y_returns"] ??
      features["returns_3y"] ??
      features["three_year_returns"];
    if (ret3y) return `3Y Returns: ${ret3y}%`;
    const ret1y =
      features["1y_returns"] ??
      features["returns_1y"] ??
      features["one_year_returns"];
    if (ret1y) return `1Y Returns: ${ret1y}%`;
  }

  if (category === "fixed_deposit") {
    const rate =
      features["interest_rate"] ??
      features["rate"] ??
      features["max_rate"] ??
      features["fd_rate"];
    if (rate) return `Rate: ${rate}% p.a.`;
  }

  if (category === "loan") {
    const rate =
      features["interest_rate"] ??
      features["rate"] ??
      features["min_rate"] ??
      features["starting_rate"];
    if (rate) return `Rate from ${rate}% p.a.`;
    const maxAmt =
      features["max_amount"] ?? features["loan_amount"] ?? features["max_loan"];
    if (maxAmt) return `Up to ₹${maxAmt}`;
  }

  if (category === "credit_card") {
    const cashback =
      features["cashback"] ?? features["cashback_rate"] ?? features["rewards"];
    if (cashback) return String(cashback);
    const annualFee =
      features["annual_fee"] ?? features["fee"] ?? features["joining_fee"];
    if (annualFee === 0 || annualFee === "0") return "Zero Annual Fee";
    if (annualFee) return `Fee: ₹${annualFee}`;
  }

  // Generic fallback: first non-empty value from features
  const first = Object.values(features).find(
    (v) => v !== null && v !== undefined && String(v).trim() !== "",
  );
  if (first) return String(first).slice(0, 60);

  return description?.slice(0, 60) || "";
}

async function fetchProducts(category: string): Promise<MarketplaceProduct[]> {
  const supabase = createClient();

  if (category === "credit_card") {
    // credit_cards is a separate table
    const { data, error } = await supabase
      .from("credit_cards")
      .select(
        "id, slug, name, bank, image_url, rating, reward_rate, reward_type, annual_fee, description, apply_link",
      )
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(4);

    if (error || !data) return [];

    return data.map((c: Record<string, unknown>) => ({
      id: c.id as string,
      slug: c.slug as string,
      name: c.name as string,
      provider: (c.bank as string | null) ?? "",
      rating: typeof c.rating === "number" ? c.rating : 0,
      keyFeature:
        c.reward_rate && c.reward_type
          ? `${c.reward_type as string}: ${c.reward_rate as string}`
          : c.annual_fee === 0
            ? "Zero Annual Fee"
            : ((c.description as string | null)?.slice(0, 60) ?? ""),
      imageUrl: (c.image_url as string | null) ?? null,
      affiliateLink: (c.apply_link as string | null) ?? null,
      category: "credit_card",
    }));
  }

  // All other categories use the products table
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, provider_name, image_url, rating, features, description, affiliate_link",
    )
    .eq("category", category)
    .eq("is_active", true)
    .order("rating->overall", { ascending: false })
    .limit(4);

  if (error || !data) return [];

  return data.map((p: Record<string, unknown>) => ({
    id: p.id as string,
    slug: p.slug as string,
    name: p.name as string,
    provider: (p.provider_name as string | null) ?? "",
    rating:
      typeof p.rating === "number"
        ? p.rating
        : (((p.rating as { overall?: number }) ?? {})?.overall ?? 0),
    keyFeature: extractKeyFeature(
      category,
      p.features as Record<string, unknown> | null,
      p.description as string | null,
    ),
    imageUrl: (p.image_url as string | null) ?? null,
    affiliateLink: (p.affiliate_link as string | null) ?? null,
    category,
  }));
}

// Skeleton row
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-sm" />
    </div>
  );
}

export default function CalculatorMarketplace({
  category,
  title,
  sourcePage = "calculator",
}: CalculatorMarketplaceProps) {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const config = CATEGORY_CONFIG[category] ?? {
    label: category.replace(/_/g, " "),
    seeAllHref: `/${category.replace(/_/g, "-")}`,
    featureLabel: "Feature",
  };

  const heading = title ?? `Compare Top ${config.label}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts(category)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  // Don't render section if no products and not loading
  if (!loading && products.length === 0) return null;

  return (
    <section className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {heading}
          </h2>
        </div>
        <a
          href={config.seeAllHref}
          className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 font-medium transition-colors"
        >
          See all →
        </a>
      </div>

      {/* Product rows */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          products.map((product) => {
            const href = getAffiliateUrl({
              id: product.id,
              slug: product.slug,
              category: product.category,
              affiliate_link: product.affiliateLink,
            });

            return (
              <div
                key={product.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Logo / Initial */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
                      {product.name.slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* Name + provider */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  {product.provider && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {product.provider}
                    </p>
                  )}
                </div>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 shrink-0 hidden sm:flex">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Key feature */}
                {product.keyFeature && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 shrink-0 hidden md:block max-w-[120px] truncate">
                    {product.keyFeature}
                  </span>
                )}

                {/* CTA */}
                <div className="shrink-0">
                  <ApplyNowCTA
                    href={href}
                    productName={product.name}
                    productSlug={product.slug}
                    productId={product.id}
                    category={product.category}
                    providerName={product.provider}
                    sourcePage={sourcePage}
                    variant="compact"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Advertiser Disclosure */}
      <div className="mt-3">
        <AdvertiserDisclosure variant="expandable" />
      </div>
    </section>
  );
}
