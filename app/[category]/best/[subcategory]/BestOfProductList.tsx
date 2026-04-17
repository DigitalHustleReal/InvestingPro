"use client";

import React from "react";
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import { Trophy } from "lucide-react";

interface BestOfProductListProps {
  products: RichProduct[];
}

export default function BestOfProductList({
  products,
}: BestOfProductListProps) {
  return (
    <div>
      {products.map((product, index) => (
        <div key={product.id} className="relative">
          {/* Rank badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
              {index === 0 && <Trophy className="w-3.5 h-3.5 text-green-700" />}
              #{index + 1}
            </span>
            {index === 0 && (
              <span className="text-xs font-semibold text-green-700">
                Editor&apos;s Pick
              </span>
            )}
          </div>
          <RichProductCard product={product} layout="list" />
        </div>
      ))}
    </div>
  );
}
