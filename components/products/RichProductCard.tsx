"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, X, ChevronDown } from "lucide-react";
import { RichProduct } from "@/types/rich-product";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { getProductUrl, getAffiliateUrl } from "@/lib/utils/product-urls";
import {
  getCategoryImageConfig,
  type ProductCategory,
} from "@/lib/images/category-image-config";
import ApplyNowCTA from "./ApplyNowCTA";
import { ScoreBreakdownItem } from "./ScoreExplanation";

// NerdWallet-parity+ editorial product card. v3 Bold Redesign tokens.
//
// Layout hierarchy:
//   1. Optional gold "Editor's Pick" strip (when product.bestFor set)
//   2. Main row: image · name+pros/cons · square score · Apply Now CTA
//   3. Data strip: 4 key features in mono (ink header + mono values)
//   4. "Our Take" — 2-line editorial verdict, always visible, gold methodology link
//   5. Single expandable accordion: "Full details"
//
// Every opinion links to methodology (brainstorm Signature Element #1 rule).

interface RichProductCardProps {
  product: RichProduct;
  layout?: "grid" | "list";
  onCompare?: (id: string) => void;
  matchScore?: number;
  isScored?: boolean;
  scoreBreakdown?: ScoreBreakdownItem[];
  rawScore?: number;
}

export function RichProductCard({ product, onCompare }: RichProductCardProps) {
  const { addProduct, removeProduct, isSelected } = useCompare();
  const isCompareSelected = isSelected(product.id);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Normalise rating to 0-100 score for editorial display.
  // Returns null when no real rating exists — UI shows "—" instead of
  // a fabricated 75/100. This is the no-fake-data principle.
  const scoreNum = React.useMemo<number | null>(() => {
    if (typeof product.rating === "number" && product.rating > 0) {
      return Math.round(product.rating * 20);
    }
    if (
      typeof product.rating === "object" &&
      product.rating?.overall &&
      product.rating.overall > 0
    ) {
      return Math.round(product.rating.overall * 20);
    }
    return null;
  }, [product.rating]);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompareSelected) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
    if (onCompare) onCompare(product.id);
  };

  const imageConfig = getCategoryImageConfig(
    (product.category || "mutual_fund") as ProductCategory,
  );

  // Map product category → segment-specific methodology page slug.
  // Every product card links to the rubric used to score it (E-E-A-T).
  // Cast through string because some product categories in the DB
  // ("savings_account", "govt_scheme", "fixed_deposit") aren't members
  // of the narrow ProductCategory image-config enum.
  const methodologyPath = React.useMemo<string>(() => {
    const cat = String(product.category || "");
    switch (cat) {
      case "credit_card":
        return "/methodology/credit-cards";
      case "loan":
        return "/methodology/loans";
      case "mutual_fund":
        return "/methodology/mutual-funds";
      case "insurance":
        return "/methodology/insurance";
      case "fixed_deposit":
      case "savings_account":
      case "govt_scheme":
        return "/methodology/banking";
      case "demat_account":
      case "broker":
        return "/methodology/brokers";
      default:
        return "/methodology";
    }
  }, [product.category]);

  // Key features: first 4 in the data strip, rest in accordion
  const topFeatures = product.key_features?.slice(0, 4) || [];
  const extraFeatures = product.key_features?.slice(4) || [];
  const topPros = (product.pros || []).slice(0, 3);
  const topCons = (product.cons || []).slice(0, 2);

  const affiliateUrl = getAffiliateUrl(product);
  const productUrl = getProductUrl(product);

  return (
    <div
      className={cn(
        "mb-4 border-2 rounded-sm bg-white overflow-hidden transition-colors",
        isCompareSelected
          ? "border-ink"
          : product.bestFor
            ? "border-indian-gold/50"
            : "border-ink/10 hover:border-ink/25",
      )}
    >
      {/* Editor's Pick gold strip */}
      {product.bestFor && (
        <div className="bg-indian-gold/10 border-b border-indian-gold/30 px-5 py-2 flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-indian-gold">
            Editor&apos;s Pick
          </span>
          <span className="font-mono text-[10px] text-ink-60">
            · {product.bestFor}
          </span>
        </div>
      )}

      {/* Main row */}
      <div className="flex flex-col lg:flex-row gap-5 p-5">
        {/* Product image */}
        <Link
          href={productUrl}
          className="shrink-0 block"
          aria-label={`View ${product.name} details`}
        >
          <div className="w-28 h-[60px] lg:w-32 lg:h-[70px] bg-ink/5 rounded-sm overflow-hidden relative">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={128}
                height={70}
                className="w-full h-full object-contain"
                sizes="(max-width: 768px) 112px, 128px"
                quality={imageConfig.quality}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-ink/30">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Name + meta + pros/cons */}
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-1">
            {product.provider_name}
          </div>
          <Link href={productUrl} className="group">
            <h3 className="font-display font-bold text-lg lg:text-xl text-ink leading-tight group-hover:text-authority-green transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Editorial byline — NerdWallet-style author attribution (our edge:
              we use DESK bylines which are more honest than fake individual
              authors). Makes the card feel editorial, not algorithmic. */}
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-60/80">
            Reviewed by InvestingPro{" "}
            {product.category === "credit_card"
              ? "Credit Team"
              : product.category === "mutual_fund"
                ? "Investment Desk"
                : product.category === "loan"
                  ? "Lending Desk"
                  : product.category === "insurance"
                    ? "Insurance Desk"
                    : "Editorial Team"}
          </div>

          {/* Pros / Cons data strip */}
          {(topPros.length > 0 || topCons.length > 0) && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {topPros.map((pro, i) => (
                <div
                  key={`p-${i}`}
                  className="flex items-start gap-1.5 text-[13px] text-ink leading-snug"
                >
                  <Check className="w-3.5 h-3.5 text-action-green shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{pro}</span>
                </div>
              ))}
              {topCons.map((con, i) => (
                <div
                  key={`c-${i}`}
                  className="flex items-start gap-1.5 text-[13px] text-ink-60 leading-snug"
                >
                  <X className="w-3.5 h-3.5 text-warning-red shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{con}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score badge — square, ink border, mono. Renders "—" when no
            real rating is available rather than a fabricated number. */}
        <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-3 shrink-0">
          <Link
            href={methodologyPath}
            className="w-16 h-16 border-2 border-ink bg-canvas flex flex-col items-center justify-center hover:bg-ink/5 transition-colors group"
            title="See how we calculate this score"
          >
            <span className="font-mono text-[24px] font-bold text-ink leading-none tabular-nums">
              {scoreNum ?? "—"}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-60 mt-0.5 group-hover:text-indian-gold transition-colors">
              {scoreNum != null ? "/100" : "n/a"}
            </span>
          </Link>

          <div className="lg:w-36 flex flex-col gap-2">
            <ApplyNowCTA
              href={affiliateUrl}
              productName={product.name}
              productSlug={product.slug}
              productId={product.id}
              category={product.category}
              providerName={product.provider_name}
              sourcePage="listing"
            />
            <button
              onClick={handleCompareClick}
              className={cn(
                "flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-wider py-1.5 border transition-colors",
                isCompareSelected
                  ? "border-ink bg-ink text-canvas"
                  : "border-ink/20 text-ink-60 hover:border-ink hover:text-ink",
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 border flex items-center justify-center",
                  isCompareSelected
                    ? "bg-canvas border-canvas"
                    : "border-ink/40",
                )}
              >
                {isCompareSelected && <Check className="w-2 h-2 text-ink" />}
              </div>
              {isCompareSelected ? "Selected" : "Compare"}
            </button>
          </div>
        </div>
      </div>

      {/* Key features data strip — mono values */}
      {topFeatures.length > 0 && (
        <div className="border-t border-ink/10 bg-canvas grid grid-cols-2 sm:grid-cols-4">
          {topFeatures.map((feat, i) => (
            <div
              key={i}
              className={cn(
                "px-4 py-3",
                i < topFeatures.length - 1 && "sm:border-r border-ink/10",
                i < 2 &&
                  topFeatures.length > 2 &&
                  "border-b sm:border-b-0 border-ink/10",
                i % 2 === 1 &&
                  i < topFeatures.length - 1 &&
                  "border-r-0 sm:border-r",
              )}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-0.5">
                {feat.label}
              </div>
              <div className="font-mono text-sm font-semibold text-ink truncate tabular-nums">
                {feat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Our Take — always visible editorial verdict */}
      {product.description && (
        <div className="border-t border-ink/10 px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1.5">
            Our Take
          </div>
          <p className="font-display text-[15px] text-ink leading-snug line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <Link
              href={productUrl}
              className="font-mono text-[11px] uppercase tracking-wider text-action-green hover:text-authority-green"
            >
              Read full review &rarr;
            </Link>
            <Link
              href={methodologyPath}
              className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
              title="See the per-segment scoring rubric we used to rate this product"
            >
              How we score this &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Expandable full details — single accordion */}
      {extraFeatures.length > 0 && (
        <div className="border-t border-ink/10">
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-canvas hover:bg-ink/5 transition-colors"
            aria-expanded={detailsOpen}
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60">
              {detailsOpen ? "Hide" : "Show"} full details
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-ink-60 transition-transform",
                detailsOpen && "rotate-180",
              )}
            />
          </button>
          {detailsOpen && (
            <div className="px-5 py-4 border-t border-ink/10 bg-canvas">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {extraFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-baseline py-1.5 border-b border-ink/5 last:border-b-0"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60">
                      {feat.label}
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-ink ml-4 text-right tabular-nums">
                      {feat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
