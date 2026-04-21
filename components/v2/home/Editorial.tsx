import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { ArrowRight } from "lucide-react";

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
      readTime: article.read_time ? `${article.read_time} min read` : "",
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
    <section className="py-16 md:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
              Latest <em className="italic text-indian-gold">research</em>
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Independent analysis. No sponsored content.
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured + list layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured article — large card */}
          <Link
            href={featured.href}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 hover:shadow-md transition-all"
          >
            {featured.image ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <span className="text-4xl font-black text-green-200">IP</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-green-600">
                  {featured.category}
                </span>
                {featured.readTime && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400">
                      {featured.readTime}
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition-colors">
                {featured.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {featured.excerpt}
              </p>
            </div>
          </Link>

          {/* Rest — stacked list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {rest.map((art) => (
              <Link
                key={art.href}
                href={art.href}
                className="group flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {art.image ? (
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={art.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-200">IP</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                      {art.category}
                    </span>
                    {art.readTime && (
                      <span className="text-[10px] text-gray-400">
                        · {art.readTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/articles"
          className="sm:hidden inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-green-600"
        >
          All articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
