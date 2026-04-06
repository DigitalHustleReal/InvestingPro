"use client";

/**
 * ShortcodeCheatsheet — Admin CMS panel
 *
 * Shows all available visual shortcodes with copy-to-clipboard buttons.
 * Paste these directly into the TipTap editor and they will render
 * as styled HTML components on the public article page.
 *
 * Place this panel in the right sidebar of the article editor.
 */

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shortcode {
  name: string;
  description: string;
  preview: string; // visual description
  template: string;
  color: string;
}

const SHORTCODES: Shortcode[] = [
  {
    name: "Key Takeaways",
    description: "Green summary box — use at top of every article",
    preview: "📌 Green box with checkmarks",
    color: "border-green-200 bg-green-50",
    template: `[key-takeaways]
- First key point readers will remember
- Second key point with specific data
- Third actionable insight
- Fourth point (4-5 total)
[/key-takeaways]`,
  },
  {
    name: "Pro Tip",
    description: "Blue box for expert insights and actionable advice",
    preview: "💡 Blue box with tip",
    color: "border-blue-200 bg-blue-50",
    template: `[pro-tip title="Expert Insight"]
Your specific, actionable tip here. Be concrete and useful.
[/pro-tip]`,
  },
  {
    name: "Warning Box",
    description: "Amber box for risks, cautions, regulatory notes",
    preview: "⚠️ Amber warning box",
    color: "border-amber-200 bg-amber-50",
    template: `[warning title="Important Caution"]
The risk or caution the reader absolutely must know about.
[/warning]`,
  },
  {
    name: "Quick Verdict",
    description: "Slate box for expert recommendation summary",
    preview: "⚡ Verdict box",
    color: "border-gray-200 bg-gray-50",
    template: `[quick-verdict]
Our evidence-based recommendation in 2-3 clear sentences. Best for X type of user.
[/quick-verdict]`,
  },
  {
    name: "Stats / Metrics",
    description: "Grid of metric cards — great for data-heavy sections",
    preview: "📊 4-card metrics grid",
    color: "border-green-200 bg-green-50",
    template: `[stats]
Repo Rate | 6.50% | success
Inflation (CPI) | 5.1% | warning
GDP Growth | 6.8% | info
Sensex YTD | +12.3% | success
[/stats]`,
  },
  {
    name: "Comparison Grid",
    description: "Side-by-side product comparison cards",
    preview: "🗃️ Product comparison cards",
    color: "border-purple-200 bg-purple-50",
    template: `[comparison-grid]
[comparison-card title="Product A"]
- Feature one: ₹X
- Feature two: benefit
- Feature three: value
- Best for: use case
[/comparison-card]
[comparison-card title="Product B"]
- Feature one: ₹Y
- Feature two: benefit
- Feature three: value
- Best for: use case
[/comparison-card]
[/comparison-grid]`,
  },
  {
    name: "Portfolio Allocation",
    description: "Allocation breakdown with colored bars",
    preview: "🥧 Portfolio allocation display",
    color: "border-green-200 bg-green-50",
    template: `[allocation title="Suggested Portfolio Mix"]
Large Cap Equity | 40% | 40
Mid Cap Equity | 25% | 25
Small Cap | 15% | 15
Debt Funds | 10% | 10
Gold ETF | 10% | 10
[/allocation]`,
  },
  {
    name: "Fact Box",
    description: "Source-attributed data box for RBI/SEBI/AMFI stats",
    preview: "📋 Sourced fact box",
    color: "border-emerald-200 bg-emerald-50",
    template: `[fact-box source="RBI Annual Report 2025"]
India's household savings rate stands at 18.4% of GDP, but only 4.8% is invested in financial assets.
[/fact-box]`,
  },
  {
    name: "Expert Quote",
    description: "Styled blockquote with attribution",
    preview: '"Quote" with name + role',
    color: "border-rose-200 bg-rose-50",
    template: `[expert-quote name="Nilesh Shah" role="MD, Kotak Mutual Fund"]
"Equity mutual funds remain the most accessible vehicle for long-term wealth creation for retail investors."
[/expert-quote]`,
  },
  {
    name: "Badge (inline)",
    description: "Inline colored badge — use sparingly",
    preview: "[SEBI Regulated] badge",
    color: "border-gray-200 bg-gray-50",
    template: `[badge type="success"]SEBI Regulated[/badge]  [badge type="warning"]Lock-in Period[/badge]  [badge type="info"]Tax Saver[/badge]`,
  },
];

export default function ShortcodeCheatsheet() {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>("Key Takeaways");

  const copy = async (name: string, template: string) => {
    await navigator.clipboard.writeText(template);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-bold text-foreground">Visual Shortcodes</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Paste into editor — renders as styled components
        </p>
      </div>

      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {SHORTCODES.map((sc) => {
          const isOpen = expanded === sc.name;
          const isCopied = copied === sc.name;

          return (
            <div key={sc.name} className="group">
              {/* Header row */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(isOpen ? null : sc.name)}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    sc.color.includes("green")
                      ? "bg-green-400"
                      : sc.color.includes("blue")
                        ? "bg-blue-400"
                        : sc.color.includes("amber")
                          ? "bg-amber-400"
                          : sc.color.includes("teal")
                            ? "bg-green-400"
                            : sc.color.includes("purple")
                              ? "bg-purple-400"
                              : sc.color.includes("indigo")
                                ? "bg-green-400"
                                : sc.color.includes("cyan")
                                  ? "bg-emerald-400"
                                  : sc.color.includes("rose")
                                    ? "bg-rose-400"
                                    : "bg-gray-400",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {sc.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {sc.preview}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded code block */}
              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {sc.description}
                  </p>
                  <div className="relative">
                    <pre className="text-[10px] font-mono bg-muted/50 rounded-lg p-3 overflow-x-auto text-foreground/80 leading-relaxed whitespace-pre-wrap border border-border">
                      {sc.template}
                    </pre>
                    <button
                      onClick={() => copy(sc.name, sc.template)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      title="Copy shortcode"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
