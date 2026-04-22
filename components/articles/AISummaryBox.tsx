"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISummaryBoxProps {
  excerpt: string;
  category?: string;
  readTime?: string;
}

/**
 * AI Summary Box — collapsible quick summary at the top of articles
 * Similar to MoneyControl/ClearTax "Quick Read" pattern
 * Shows the article excerpt as an AI-generated summary
 */
export default function AISummaryBox({
  excerpt,
  category,
  readTime,
}: AISummaryBoxProps) {
  const [expanded, setExpanded] = useState(true);

  if (!excerpt || excerpt.length < 30) return null;

  return (
    <div className="mb-8 rounded-lg border border-ink/10 bg-canvas overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-ink-60" />
          <span className="text-[13px] font-bold text-ink uppercase tracking-wider">
            Quick Summary
          </span>
          {readTime && (
            <span className="text-[11px] text-muted-foreground font-medium ml-2 hidden sm:inline">
              {readTime} min read — here is what you need to know
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Summary content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-5 pb-4 pt-1">
          <p className="text-[15px] text-ink dark:text-ink/20 leading-relaxed">
            {excerpt}
          </p>
          {category && (
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-ink-60 font-semibold uppercase tracking-wider">
                {category
                  .split("-")
                  .map((w) => {
                    const caps: Record<string, string> = {
                      hra: "HRA",
                      hdfc: "HDFC",
                      ipo: "IPO",
                      itr: "ITR",
                      nps: "NPS",
                      ppf: "PPF",
                      elss: "ELSS",
                      sip: "SIP",
                      fd: "FD",
                      gst: "GST",
                      cibil: "CIBIL",
                      emi: "EMI",
                    };
                    return (
                      caps[w.toLowerCase()] ||
                      w.charAt(0).toUpperCase() + w.slice(1)
                    );
                  })
                  .join(" ")}
              </span>
              <span>·</span>
              <span>Verified against official sources</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
