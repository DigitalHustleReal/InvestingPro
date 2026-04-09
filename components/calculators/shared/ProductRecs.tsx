"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRecsProps {
  category:
    | "mutual-funds"
    | "loans"
    | "fixed-deposits"
    | "credit-cards"
    | "demat-accounts";
  title?: string;
  matchCriteria?: string;
  limit?: number;
}

interface Product {
  name: string;
  slug: string;
  provider: string;
  rating: number;
  highlight?: string;
}

/**
 * Real product recommendations from our database.
 * ET Money shows "Top funds to start SIP" — we do this for EVERY category.
 */
export function ProductRecs({
  category,
  title,
  matchCriteria,
  limit = 4,
}: ProductRecsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Map category to API table
        const tableMap: Record<
          string,
          {
            table: string;
            nameField: string;
            providerField: string;
            sortField: string;
          }
        > = {
          "mutual-funds": {
            table: "mutual_funds",
            nameField: "name",
            providerField: "fund_house",
            sortField: "returns_3y",
          },
          loans: {
            table: "loans",
            nameField: "name",
            providerField: "bank_name",
            sortField: "rating",
          },
          "fixed-deposits": {
            table: "fixed_deposits",
            nameField: "name",
            providerField: "bank_name",
            sortField: "interest_rate",
          },
          "credit-cards": {
            table: "credit_cards",
            nameField: "name",
            providerField: "bank",
            sortField: "rating",
          },
          "demat-accounts": {
            table: "brokers",
            nameField: "name",
            providerField: "name",
            sortField: "rating",
          },
        };

        const config = tableMap[category];
        if (!config) return;

        // Use Supabase client-side
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data } = await supabase
          .from(config.table)
          .select(
            `${config.nameField}, slug, ${config.providerField}, rating, ${config.sortField}`,
          )
          .order(config.sortField, { ascending: false, nullsFirst: false })
          .limit(limit);

        if (data) {
          setProducts(
            data.map((d: any) => ({
              name: d[config.nameField],
              slug: d.slug,
              provider: d[config.providerField] || "",
              rating: Number(d.rating) || 0,
              highlight: d[config.sortField]
                ? category === "mutual-funds"
                  ? `${Number(d[config.sortField]).toFixed(1)}% 3Y`
                  : category === "fixed-deposits"
                    ? `${d[config.sortField]}% p.a.`
                    : `${Number(d[config.sortField]).toFixed(1)} ★`
                : undefined,
            })),
          );
        }
      } catch {
        // Silently fail — products just won't show
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-10 bg-gray-50 rounded" />
          <div className="h-10 bg-gray-50 rounded" />
          <div className="h-10 bg-gray-50 rounded" />
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  const routeMap: Record<string, string> = {
    "mutual-funds": "/mutual-funds",
    loans: "/loans",
    "fixed-deposits": "/fixed-deposits",
    "credit-cards": "/credit-cards",
    "demat-accounts": "/demat-accounts",
  };

  const defaultTitles: Record<string, string> = {
    "mutual-funds": "Top Performing Funds",
    loans: "Best Loan Rates",
    "fixed-deposits": "Highest FD Rates",
    "credit-cards": "Top Rated Cards",
    "demat-accounts": "Best Demat Accounts",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Star size={15} className="text-amber-500 fill-amber-500" />
          {title || defaultTitles[category] || "Recommended Products"}
        </h3>
        {matchCriteria && (
          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {matchCriteria}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {products.map((p, i) => (
          <Link
            key={p.slug || i}
            href={`${routeMap[category]}/${p.slug}`}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-green-50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-green-700 transition-colors">
                {p.name}
              </p>
              <p className="text-[11px] text-gray-400">{p.provider}</p>
            </div>
            {p.highlight && (
              <span className="text-xs font-bold text-green-700 bg-green-50 group-hover:bg-green-100 px-2 py-1 rounded-lg ml-3 whitespace-nowrap">
                {p.highlight}
              </span>
            )}
          </Link>
        ))}
      </div>

      <Link
        href={routeMap[category] || "/"}
        className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-100 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
      >
        View all {category.replace("-", " ")}
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
