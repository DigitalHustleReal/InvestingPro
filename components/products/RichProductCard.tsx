"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Check, ChevronDown, X } from "lucide-react";
import { RichProduct } from "@/types/rich-product";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { getProductUrl, getAffiliateUrl } from "@/lib/utils/product-urls";
import {
  getCategoryImageConfig,
  getCategoryImageSizes,
  type ProductCategory,
} from "@/lib/images/category-image-config";
import ApplyNowCTA from "./ApplyNowCTA";
import { ScoreBreakdownItem } from "./ScoreExplanation";

interface RichProductCardProps {
  product: RichProduct;
  layout?: "grid" | "list";
  onCompare?: (id: string) => void;
  matchScore?: number;
  isScored?: boolean;
  scoreBreakdown?: ScoreBreakdownItem[];
  rawScore?: number;
}

type AccordionSection = "benefits" | "details" | "ourTake";

export function RichProductCard({
  product,
  layout = "grid",
  onCompare,
}: RichProductCardProps) {
  const { addProduct, removeProduct, isSelected } = useCompare();
  const isCompareSelected = isSelected(product.id);
  const [openSections, setOpenSections] = useState<Set<AccordionSection>>(
    new Set(),
  );

  // Normalize Rating
  const ratingObj = React.useMemo(() => {
    if (typeof product.rating === "number") {
      return {
        overall: product.rating,
        trust_score: 80,
        breakdown: {},
      };
    }
    return product.rating || { overall: 0, trust_score: 0, breakdown: {} };
  }, [product.rating]);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompareSelected) {
      removeProduct(product.id);
    } else {
      const success = addProduct(product);
      if (!success) {
        console.warn("Maximum products reached");
      }
    }
    if (onCompare) onCompare(product.id);
  };

  const toggleSection = (section: AccordionSection) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Get category-specific image config
  const imageConfig = getCategoryImageConfig(
    (product.category || "mutual_fund") as ProductCategory,
  );
  const imageSizes = getCategoryImageSizes(
    (product.category || "mutual_fund") as ProductCategory,
  );

  // Extract top 4 features for the data strip
  const topFeatures = product.key_features.slice(0, 4);
  // Remaining features for the "Card Details" accordion
  const extraFeatures = product.key_features.slice(4);

  const affiliateUrl = getAffiliateUrl(product);
  const productUrl = getProductUrl(product);

  return (
    <div className="mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Green "Our pick" pill */}
      {product.bestFor && (
        <div className="bg-green-50 dark:bg-green-900/30 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <span className="inline-block bg-green-700 dark:bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Our pick for: {product.bestFor}
          </span>
        </div>
      )}

      {/* Product header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5">
        {/* Left: Product image */}
        <Link href={productUrl} className="shrink-0">
          <div className="w-20 h-[50px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={80}
                height={50}
                className="w-full h-full object-contain"
                sizes="80px"
                quality={imageConfig.quality}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Center: Provider + Name + Compare */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
            {product.provider_name}
          </p>
          <Link href={productUrl}>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight hover:text-green-700 dark:hover:text-green-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={handleCompareClick}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                isCompareSelected
                  ? "bg-green-600 border-green-600"
                  : "border-gray-300 dark:border-gray-600",
              )}
            >
              {isCompareSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span>Add to compare</span>
          </button>
        </div>

        {/* Right-center: Rating */}
        <div className="flex flex-col items-center shrink-0 mr-0 sm:mr-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-green-600 dark:text-green-500 fill-green-600 dark:fill-green-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {typeof ratingObj.overall === "number"
                ? ratingObj.overall.toFixed(1)
                : ratingObj.overall}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight">
            InvestingPro
            <br />
            rating
          </span>
        </div>

        {/* Far right: Apply Now CTA */}
        <div className="shrink-0 w-full sm:w-auto">
          <ApplyNowCTA
            href={affiliateUrl}
            productName={product.name}
            productSlug={product.slug}
            productId={product.id}
            category={product.category}
            providerName={product.provider_name}
            sourcePage="listing"
          />
        </div>
      </div>

      {/* Data strip - 4 column grid */}
      {topFeatures.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-4">
          {topFeatures.map((feat, i) => (
            <div
              key={i}
              className={cn(
                "px-4 py-3",
                i < topFeatures.length - 1 &&
                  "border-r border-gray-200 dark:border-gray-700 sm:border-r",
                // On mobile 2-col, remove right border from 2nd and 4th items
                i % 2 === 1 && "border-r-0 sm:border-r",
                // Last item in sm:4-col never has right border
                i === topFeatures.length - 1 && "sm:border-r-0",
                // Add bottom border on mobile for first row
                i < 2 &&
                  topFeatures.length > 2 &&
                  "border-b border-gray-200 dark:border-gray-700 sm:border-b-0",
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
                {feat.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {feat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Expandable accordion sections */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex divide-x divide-gray-200 dark:divide-gray-700">
          {/* Key Benefits */}
          {product.pros && product.pros.length > 0 && (
            <button
              onClick={() => toggleSection("benefits")}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  openSections.has("benefits") && "rotate-180",
                )}
              />
              Key Benefits
            </button>
          )}

          {/* Card Details */}
          {extraFeatures.length > 0 && (
            <button
              onClick={() => toggleSection("details")}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  openSections.has("details") && "rotate-180",
                )}
              />
              Card Details
            </button>
          )}

          {/* Our Take */}
          {product.description && (
            <button
              onClick={() => toggleSection("ourTake")}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  openSections.has("ourTake") && "rotate-180",
                )}
              />
              Our Take
            </button>
          )}
        </div>

        {/* Accordion content panels */}
        {openSections.has("benefits") &&
          product.pros &&
          product.pros.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4">
              <ul className="space-y-2">
                {product.pros.map((pro, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Check className="w-4 h-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
              {product.cons && product.cons.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                    Things to consider
                  </p>
                  <ul className="space-y-2">
                    {product.cons.map((con, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                      >
                        <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        {openSections.has("details") && extraFeatures.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extraFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="flex justify-between items-baseline py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {feat.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-4">
                    {feat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {openSections.has("ourTake") && product.description && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
            <Link
              href={productUrl}
              className="inline-block mt-3 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
            >
              Read full review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
