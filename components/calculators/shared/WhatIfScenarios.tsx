"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface Scenario {
  label: string;
  description: string;
  value: string;
  subtext?: string;
  type: "conservative" | "moderate" | "aggressive";
}

interface WhatIfScenariosProps {
  scenarios: Scenario[];
}

const typeStyles = {
  conservative: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  moderate: {
    border: "border-green-300",
    bg: "bg-action-green/10",
    text: "text-authority-green",
    badge: "bg-green-100 text-authority-green",
    ring: "ring-2 ring-green-200",
  },
  aggressive: {
    border: "border-amber-200",
    bg: "bg-indian-gold/10",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
};

export function WhatIfScenarios({ scenarios }: WhatIfScenariosProps) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
        <TrendingUp size={15} className="text-action-green" />
        What-If Scenarios
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((s) => {
          const style = typeStyles[s.type];
          return (
            <div
              key={s.label}
              className={cn(
                "rounded-xl border p-4 transition-all",
                style.border,
                style.bg,
                s.type === "moderate" && "ring-2 ring-green-200",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    style.badge,
                  )}
                >
                  {s.label}
                </span>
                {s.type === "moderate" && (
                  <span className="text-[10px] font-semibold text-action-green">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-60 mb-2">{s.description}</p>
              <p className={cn("text-2xl font-bold", style.text)}>{s.value}</p>
              {s.subtext && (
                <p className="text-[11px] text-ink-60 mt-1">{s.subtext}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
