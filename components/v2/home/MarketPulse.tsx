import Link from "next/link";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface PulseItem {
  tag: string;
  tagColor: string;
  title: string;
  take: string;
  date: string;
}

const TAG_COLORS: Record<string, string> = {
  "Credit Cards": "bg-blue-50 text-blue-700",
  "Mutual Funds": "bg-green-50 text-green-700",
  "Fixed Deposits": "bg-green-50 text-green-700",
  Tax: "bg-orange-50 text-orange-700",
  Loans: "bg-red-50 text-red-700",
  Insurance: "bg-purple-50 text-purple-700",
  DEFAULT: "bg-gray-50 text-gray-700",
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

async function fetchPulse(): Promise<PulseItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("title, excerpt, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(4);

    if (error || !data || data.length === 0) return [];

    return data.map((article) => {
      const cat = article.category || "Finance";
      return {
        tag: cat,
        tagColor: TAG_COLORS[cat] || TAG_COLORS.DEFAULT,
        title: article.title,
        take:
          article.excerpt?.slice(0, 120) ||
          `Latest insights on ${cat.toLowerCase()}.`,
        date: article.published_at ? formatDate(article.published_at) : "",
      };
    });
  } catch (err) {
    logger.error(
      "[MarketPulse] Failed to fetch",
      err instanceof Error ? err : undefined,
    );
    return [];
  }
}

const FALLBACK_PULSE: PulseItem[] = [
  {
    tag: "FD Rates",
    tagColor: "bg-green-50 text-green-700",
    title: "Compare FD rates across 25+ banks",
    take: "Find the best fixed deposit rates. Seniors get additional 0.5% at most banks.",
    date: "",
  },
  {
    tag: "Credit Cards",
    tagColor: "bg-blue-50 text-blue-700",
    title: "Best credit cards for your spending style",
    take: "Compare 80+ cards by rewards, cashback, travel perks and annual fees.",
    date: "",
  },
  {
    tag: "Tax",
    tagColor: "bg-orange-50 text-orange-700",
    title: "Maximize your 80C deductions",
    take: "ELSS gives 12% avg returns with 3yr lock-in. Plan before March deadline.",
    date: "",
  },
  {
    tag: "Loans",
    tagColor: "bg-red-50 text-red-700",
    title: "Personal loan rates compared",
    take: "Compare 60+ loans by interest rate, processing fee and tenure.",
    date: "",
  },
];

export default async function MarketPulse() {
  const items = await fetchPulse();
  const pulseData = items.length > 0 ? items : FALLBACK_PULSE;

  return (
    <section className="relative py-12 md:py-16 px-4 lg:px-8 bg-[--v2-cream] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(27,42,74,.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
              This Week
            </div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              What&apos;s moving your{" "}
              <span className="text-green-600">money</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            All updates →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pulseData.map((item) => (
            <article
              key={item.title}
              className="bg-white border border-[--v2-cream-border] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5"
            >
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide mb-2 ${item.tagColor}`}
              >
                {item.tag}
              </span>
              <h3 className="text-sm font-semibold text-[--v2-ink] leading-snug mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.take}
              </p>
              {item.date && (
                <div className="mt-2 text-[11px] text-gray-500">
                  InvestingPro Research · {item.date}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
