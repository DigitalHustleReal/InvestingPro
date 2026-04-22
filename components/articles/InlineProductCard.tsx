"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  productService,
  Product,
  type ProductCategory,
} from "@/lib/products/product-service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineProductCardProps {
  productType: string;
  maxProducts?: number;
}

/** Map hyphenated slug to DB category key */
function toCategoryKey(productType: string): ProductCategory {
  const map: Record<string, ProductCategory> = {
    "credit-card": "credit_card",
    "credit-cards": "credit_card",
    "mutual-fund": "mutual_fund",
    "mutual-funds": "mutual_fund",
    loan: "loan",
    loans: "loan",
    insurance: "insurance",
    "demat-account": "demat_account",
    "demat-accounts": "demat_account",
    "fixed-deposit": "fixed_deposit",
    "fixed-deposits": "fixed_deposit",
    broker: "broker",
    stock: "stock",
    ppf: "ppf",
    nps: "nps",
  };
  return (
    map[productType] ?? (productType.replace(/-/g, "_") as ProductCategory)
  );
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < stars
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-ink/20 dark:text-ink-60",
          )}
        />
      ))}
    </div>
  );
}

export default function InlineProductCard({
  productType,
  maxProducts = 2,
}: InlineProductCardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = toCategoryKey(productType);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts({
          category,
          limit: maxProducts,
        });
        setProducts(Array.isArray(data) ? data.slice(0, maxProducts) : []);
      } catch (error) {
        console.error("InlineProductCard fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, maxProducts]);

  if (!loading && products.length === 0) return null;
  if (loading) return null; // Don't show skeleton in article flow

  const getRating = (p: Product): number => {
    if (typeof p.rating === "number") return p.rating;
    return p.rating?.overall ?? 0;
  };

  const getFeatureLine = (p: Product): string | null => {
    if (
      p.key_features &&
      Array.isArray(p.key_features) &&
      p.key_features.length > 0
    ) {
      const first = p.key_features[0];
      return typeof first === "string"
        ? first
        : (first?.label ?? first?.text ?? null);
    }
    if (p.description)
      return (
        p.description.slice(0, 80) + (p.description.length > 80 ? "..." : "")
      );
    return null;
  };

  return (
    <div className="my-8 rounded-sm border border-green-200 dark:border-green-800 bg-action-green/10/50 dark:bg-green-950/20 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-action-green dark:text-green-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-authority-green dark:text-green-300">
          Editor&apos;s Choice
        </span>
      </div>

      {/* Product cards */}
      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-lg bg-white dark:bg-green-950/40 border border-green-100 dark:border-green-800/60 p-3 sm:p-4"
          >
            {/* Sponsored badge */}
            <Badge
              variant="outline"
              className="absolute top-2 right-2 text-[10px] px-1.5 py-0 text-ink-60 dark:text-ink-60 border-ink/10 dark:border-gray-700"
            >
              Sponsored
            </Badge>

            {/* Image / icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-canvas dark:bg-green-900/40 rounded-lg p-1 shrink-0 relative overflow-hidden">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-action-green/20 dark:bg-green-800 rounded" />
              )}
            </div>

            {/* Name + feature */}
            <div className="flex-1 min-w-0 pr-16 sm:pr-0">
              <h4 className="font-bold text-sm text-ink dark:text-gray-100 truncate">
                {p.name}
              </h4>
              {getFeatureLine(p) && (
                <p className="text-xs text-ink-60 dark:text-ink-60 mt-0.5 line-clamp-1">
                  {getFeatureLine(p)}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="shrink-0 hidden sm:block">
              <StarRating rating={getRating(p)} />
            </div>

            {/* CTA */}
            <Link
              href={`/go/${p.slug}`}
              target="_blank"
              className="shrink-0 w-full sm:w-auto"
            >
              <Button
                size="sm"
                className="w-full sm:w-auto bg-action-green hover:bg-authority-green text-white text-xs font-bold gap-1"
              >
                Apply Now <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>

            {/* Mobile rating - show below name on small screens */}
            <div className="sm:hidden -mt-1">
              <StarRating rating={getRating(p)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
