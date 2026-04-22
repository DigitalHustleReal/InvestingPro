"use client";

import { useCompare } from "@/contexts/CompareContext";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Sticky compare bar — v3 Bold Redesign editorial style.
// Shows selected products (max 4), lets users jump to /compare page.
// Replaces prior glassmorphic rounded-xl shadow-2xl gradient design with
// flat ink bar + gold accent — no gradients, no scale transforms.

export default function CompareBar() {
  const { selectedProducts, removeProduct, clearAll } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || selectedProducts.length === 0) return null;

  const compareUrl = `/compare?products=${selectedProducts.map((p) => p.slug).join(",")}`;

  return (
    <div
      role="region"
      aria-label="Product comparison tray"
      className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-canvas border-t-2 border-indian-gold shadow-[0_-4px_20px_rgba(10,31,20,0.15)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Count indicator */}
          <div className="hidden sm:flex flex-col items-start flex-shrink-0">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold font-semibold">
              Comparing
            </div>
            <div className="font-mono text-[16px] font-bold text-canvas tabular-nums">
              {selectedProducts.length}/4
            </div>
          </div>

          {/* Product chips */}
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide min-w-0">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 bg-canvas/5 border border-canvas/20 rounded-sm hover:border-indian-gold/50 transition-colors min-w-[140px]"
              >
                {product.image_url && (
                  <div className="w-7 h-7 bg-canvas rounded-sm overflow-hidden flex-shrink-0 p-0.5">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={28}
                      height={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] font-semibold text-canvas truncate leading-tight">
                    {product.name}
                  </p>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  aria-label={`Remove ${product.name}`}
                  className="text-canvas-70 hover:text-warning-red transition-colors flex-shrink-0 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={clearAll}
              className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-wider text-canvas-70 hover:text-canvas transition-colors"
            >
              Clear
            </button>
            <Link
              href={compareUrl}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider bg-indian-gold text-ink px-4 py-2 rounded-sm hover:bg-canvas transition-colors font-semibold whitespace-nowrap"
            >
              Compare
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
