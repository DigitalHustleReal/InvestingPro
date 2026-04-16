import Link from "next/link";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface EditorialItem {
  tag: string;
  tagBg: string;
  gradient: string;
  title: string;
  excerpt: string;
  time: string;
  href: string;
}

const CATEGORY_STYLES: Record<string, { tagBg: string; gradient: string }> = {
  "Credit Cards": {
    tagBg: "bg-blue-600/80",
    gradient: "from-[#1B2A4A] to-[#2C4A6A]",
  },
  "Mutual Funds": {
    tagBg: "bg-green-600/80",
    gradient: "from-[#14563B] to-[#1A6B4A]",
  },
  Tax: {
    tagBg: "bg-orange-600/80",
    gradient: "from-[#92400E] to-[#B45309]",
  },
  Loans: {
    tagBg: "bg-red-600/80",
    gradient: "from-[#991B1B] to-[#DC2626]",
  },
  Insurance: {
    tagBg: "bg-purple-600/80",
    gradient: "from-[#6B21A8] to-[#7C3AED]",
  },
  DEFAULT: {
    tagBg: "bg-gray-600/80",
    gradient: "from-[#374151] to-[#1F2937]",
  },
};

async function fetchEditorial(): Promise<EditorialItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("title, slug, excerpt, category, read_time")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .range(4, 6); // Skip first 4 (shown in MarketPulse) to avoid duplicates

    if (error || !data || data.length === 0) return [];

    return data.map((article) => {
      const cat = article.category || "Finance";
      const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES.DEFAULT;
      return {
        tag: cat,
        tagBg: style.tagBg,
        gradient: style.gradient,
        title: article.title,
        excerpt:
          article.excerpt ||
          `Read our in-depth analysis on ${cat.toLowerCase()}.`,
        time: article.read_time ? `${article.read_time} min read` : "Article",
        href: `/articles/${article.slug}`,
      };
    });
  } catch (err) {
    logger.error(
      "[Editorial] Failed to fetch",
      err instanceof Error ? err : undefined,
    );
    return [];
  }
}

const FALLBACK_ARTICLES: EditorialItem[] = [
  {
    tag: "Credit Cards",
    tagBg: "bg-blue-600/80",
    gradient: "from-[#1B2A4A] to-[#2C4A6A]",
    title: "Compare credit cards ranked by real data",
    excerpt:
      "Cashback, rewards, travel perks — find the best card for your spending pattern.",
    time: "Compare",
    href: "/credit-cards",
  },
  {
    tag: "Mutual Funds",
    tagBg: "bg-green-600/80",
    gradient: "from-[#14563B] to-[#1A6B4A]",
    title: "SIP Calculator: see your real returns after inflation",
    excerpt:
      "Most calculators ignore inflation and taxes. Ours shows what your money will actually buy.",
    time: "Calculator",
    href: "/calculators/sip",
  },
  {
    tag: "Tax",
    tagBg: "bg-orange-600/80",
    gradient: "from-[#92400E] to-[#B45309]",
    title: "Old vs New tax regime: which saves you more?",
    excerpt:
      "Enter your salary, HRA, and deductions — our calculator shows which regime wins.",
    time: "Calculator",
    href: "/calculators/income-tax",
  },
];

export default async function Editorial() {
  const articles = await fetchEditorial();
  const items = articles.length > 0 ? articles : FALLBACK_ARTICLES;

  return (
    <section className="py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
              Research Desk
            </div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              Honest analysis you won&apos;t find{" "}
              <span className="text-green-600">elsewhere</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            All articles →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((art) => (
            <Link
              key={art.title}
              href={art.href}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className={`h-28 bg-gradient-to-br ${art.gradient} relative flex items-end p-3.5`}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white ${art.tagBg}`}
                >
                  {art.tag}
                </span>
                <h3 className="text-[15px] font-semibold text-white leading-snug relative z-10">
                  {art.title}
                </h3>
              </div>
              <div className="p-3.5">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {art.excerpt}
                </p>
                <div className="mt-2 text-[11px] text-gray-500 flex gap-2">
                  <span>InvestingPro Research</span>
                  <span>{art.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
