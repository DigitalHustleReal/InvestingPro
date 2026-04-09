"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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
      ? "text-green-600"
      : ratingType === "negative"
        ? "text-red-500"
        : "text-amber-600";

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]",
        className,
      )}
    >
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className="mt-2 flex items-end gap-3 flex-wrap">
          <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-green-700 tracking-tight leading-none">
            {value}
          </span>
          {ratingLabel && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-semibold mb-1.5",
                ratingColor,
              )}
            >
              <RatingIcon size={16} />
              {ratingLabel}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4 mt-6 pt-5 border-t border-green-200/60",
          metrics.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-[11px] text-gray-500 font-medium">{m.label}</p>
            <p
              className={cn(
                "text-[15px] font-bold mt-0.5",
                m.highlight ? "text-green-700" : "text-gray-900",
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
