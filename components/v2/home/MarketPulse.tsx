import Link from "next/link";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface PulseItem {
  tag: string;
  title: string;
  take: string;
  date: string;
  href: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

async function fetchPulse(): Promise<PulseItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("title, slug, excerpt, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(4);

    if (error || !data || data.length === 0) return [];

    return data.map((article) => ({
      tag: (article.category || "finance").replace(/[-_]/g, " "),
      title: article.title,
      take: article.excerpt?.slice(0, 120) || "",
      date: article.published_at ? formatDate(article.published_at) : "",
      href: `/articles/${article.slug}`,
    }));
  } catch (err) {
    logger.error(
      "[MarketPulse] Failed to fetch",
      err instanceof Error ? err : undefined,
    );
    return [];
  }
}

export default async function MarketPulse() {
  const items = await fetchPulse();
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-3">
              Editor&apos;s Picks
            </div>
            <h2 className="font-display text-[28px] sm:text-[36px] font-black leading-[1.0] tracking-tight text-[#0A1F14] dark:text-white">
              What we&apos;re reading{" "}
              <span className="text-[#D97706]">this week.</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex font-data text-[11px] uppercase tracking-[2px] text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            All articles &rarr;
          </Link>
        </div>

        <div className="grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          {items.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group p-5 ${
                i < items.length - 1
                  ? "border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10"
                  : ""
              } hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors`}
            >
              <span className="font-data text-[10px] uppercase tracking-[2px] text-[#16A34A] mb-2 block">
                {item.tag}
              </span>
              <h3 className="font-display text-[15px] font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-[#16A34A] transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed line-clamp-3">
                {item.take}
              </p>
              {item.date && (
                <div className="mt-3 font-data text-[10px] text-gray-300 dark:text-white/30 uppercase tracking-wider">
                  {item.date}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
