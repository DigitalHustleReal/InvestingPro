import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface EditorialItem {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  href: string;
  image: string | null;
}

async function fetchEditorial(): Promise<EditorialItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("title, slug, excerpt, category, read_time, featured_image")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(7);

    if (error || !data || data.length === 0) return [];

    return data.map((article) => ({
      title: article.title,
      excerpt: article.excerpt || "",
      category: (article.category || "finance").replace(/[-_]/g, " "),
      readTime: article.read_time ? `${article.read_time} min` : "",
      href: `/articles/${article.slug}`,
      image: article.featured_image || null,
    }));
  } catch (err) {
    logger.error(
      "[Editorial] Failed to fetch",
      err instanceof Error ? err : undefined,
    );
    return [];
  }
}

export default async function Editorial() {
  const items = await fetchEditorial();
  if (items.length === 0) return null;

  const featured = items[0];
  const rest = items.slice(1, 7);

  return (
    <section className="py-16 md:py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-3">
              Latest Research
            </div>
            <h2 className="font-display text-[28px] sm:text-[36px] font-black leading-[1.0] tracking-tight text-[#0A1F14] dark:text-white">
              We did the reading.{" "}
              <span className="text-[#D97706]">You make the decision.</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex font-data text-[11px] uppercase tracking-[2px] text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            All articles &rarr;
          </Link>
        </div>

        {/* Asymmetric grid: 1 large + 6 small */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          {/* Featured article (large) */}
          <Link
            href={featured.href}
            className="lg:col-span-2 group border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10"
          >
            {featured.image && (
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6">
              <span className="font-data text-[10px] uppercase tracking-[2px] text-[#16A34A]">
                {featured.category}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A1F14] dark:text-white leading-tight mt-2 mb-3 group-hover:text-[#16A34A] transition-colors">
                {featured.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-3 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="mt-4 font-data text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider">
                InvestingPro Research · {featured.readTime}
              </div>
            </div>
          </Link>

          {/* Rest (small cards) */}
          <div className="lg:col-span-3">
            {rest.map((art, i) => (
              <Link
                key={art.href}
                href={art.href}
                className={`group flex items-start gap-4 p-5 ${
                  i < rest.length - 1
                    ? "border-b border-gray-200 dark:border-white/10"
                    : ""
                } hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex-1 min-w-0">
                  <span className="font-data text-[10px] uppercase tracking-[2px] text-[#D97706]">
                    {art.category}
                  </span>
                  <h3 className="font-display text-[15px] font-bold text-[#0A1F14] dark:text-white leading-snug mt-1 group-hover:text-[#16A34A] transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <span className="font-data text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider mt-1 inline-block">
                    {art.readTime}
                  </span>
                </div>
                {art.image && (
                  <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden">
                    <Image
                      src={art.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/articles"
          className="sm:hidden inline-flex mt-6 font-data text-[11px] uppercase tracking-[2px] text-[#D97706]"
        >
          All articles &rarr;
        </Link>
      </div>
    </section>
  );
}
