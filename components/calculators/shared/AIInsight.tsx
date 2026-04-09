"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface AIInsightProps {
  insights: string[];
}

/**
 * AI-powered contextual insights — our moat.
 * No competitor has this. Shows personalized financial advice based on calculation.
 */
export function AIInsight({ insights }: AIInsightProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-1.5 text-amber-800">
        <Sparkles size={14} className="text-amber-600" />
        <span className="text-xs font-bold uppercase tracking-wider">
          AI Insight
        </span>
      </div>
      {insights.map((insight, i) => (
        <p key={i} className="text-sm text-amber-900 leading-relaxed">
          {insight}
        </p>
      ))}
    </div>
  );
}
