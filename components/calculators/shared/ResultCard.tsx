"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Hero result block for calculator widgets.
 * v3 Bold Redesign: cream editorial bg, Playfair display value,
 * mono eyebrow label, gold underline accent (matches investment-calculator
 * gold-standard prototype).
 */

interface Metric {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultCardProps {
  title: string;
  value: string;
  ratingLabel?: string;
  ratingType?: "positive" | "neutral" | "negative";
  metrics: Metric[];
  className?: string;
}

export function ResultCard({
  title,
  value,
  ratingLabel,
  ratingType = "positive",
  metrics,
  className,
}: ResultCardProps) {
  const RatingIcon =
    ratingType === "positive"
      ? ArrowUpRight
      : ratingType === "negative"
        ? ArrowDownRight
        : Minus;
  const ratingColor =
    ratingType === "positive"
      ? "text-action-green"
      : ratingType === "negative"
        ? "text-warning-red"
        : "text-indian-gold";

  return (
    <div
      className={cn(
        "relative bg-indian-gold/5 border-2 border-ink/10 rounded-sm p-7 flex flex-col justify-between min-h-[220px]",
        className,
      )}
    >
      {/* Gold underline accent — brainstorm signature */}
      <div className="absolute bottom-0 left-7 w-14 h-[3px] bg-indian-gold rounded-t" />

      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-60 font-semibold mb-3">
          {title}
        </p>
        <div className="mt-2 flex items-end gap-3 flex-wrap">
          <span className="font-display font-black text-[44px] sm:text-[56px] lg:text-[64px] text-ink tracking-tight leading-none tabular-nums">
            {value}
          </span>
          {ratingLabel && (
            <span
              className={cn(
                "flex items-center gap-0.5 font-mono text-[11px] uppercase tracking-wider font-semibold mb-3",
                ratingColor,
              )}
            >
              <RatingIcon size={14} />
              {ratingLabel}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4 mt-6 pt-5 border-t border-ink/10",
          metrics.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
              {m.label}
            </p>
            <p
              className={cn(
                "font-mono text-[15px] font-bold mt-1 tabular-nums",
                m.highlight ? "text-action-green" : "text-ink",
              )}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
