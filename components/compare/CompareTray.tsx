"use client";

import React from "react";
import { useCompare } from "@/contexts/CompareContext";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";

// CompareTray — v3 Bold Redesign.
// Floating ink tray that appears when products are selected for comparison.
// Sibling to CompareBar (different containers use one or the other).
// Removed: framer-motion, gradients, rounded-xl, backdrop-blur, scale transforms.

export function CompareTray() {
  const { selectedProducts, clearAll } = useCompare();

  if (selectedProducts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Comparison tray"
      className="fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
    >
      <div className="bg-ink text-canvas rounded-sm border-2 border-indian-gold shadow-[0_6px_20px_rgba(10,31,20,0.2)] px-5 py-3 flex items-center gap-4 pointer-events-auto max-w-2xl w-full">
        {/* Count badge — square, mono */}
        <div className="flex items-center gap-3">
          <div className="bg-indian-gold text-ink w-9 h-9 flex items-center justify-center font-mono font-bold text-[18px] tabular-nums rounded-sm flex-shrink-0">
            {selectedProducts.length}
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold font-semibold">
              Ready to Compare
            </div>
            <p className="font-mono text-[11px] text-canvas-70">
              Up to 4 products
            </p>
          </div>
        </div>

        {/* Selected product initials */}
        <div className="hidden sm:flex -space-x-1.5 flex-1">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="w-9 h-9 border-2 border-ink bg-canvas text-ink text-[11px] font-mono font-bold flex items-center justify-center rounded-sm flex-shrink-0"
              title={p.name}
            >
              {p.name.substring(0, 2).toUpperCase()}
            </div>
          ))}
        </div>

        <div className="flex-1 sm:hidden" />

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-canvas-70 hover:text-canvas transition-colors px-2 py-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
          <Link
            href="/credit-cards/compare"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider bg-indian-gold text-ink px-4 py-2 rounded-sm hover:bg-canvas transition-colors font-semibold whitespace-nowrap"
          >
            Compare Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
