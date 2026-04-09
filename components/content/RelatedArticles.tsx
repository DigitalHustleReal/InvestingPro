import React from "react";
import { ArrowRight, BookOpen, TrendingUp, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";

interface RelatedArticlesProps {
  currentSlug?: string;
  category?: string;
  limit?: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "credit-cards": <CreditCard className="w-4 h-4 text-blue-500" />,
  "mutual-funds": <TrendingUp className="w-4 h-4 text-green-500" />,
  investing: <TrendingUp className="w-4 h-4 text-green-500" />,
  loans: <BookOpen className="w-4 h-4 text-orange-500" />,
  tax: <BookOpen className="w-4 h-4 text-purple-500" />,
};

async function fetchRelated(
  currentSlug?: string,
  category?: string,
  limit = 3,
) {
  try {
    const supabase = createClient();
    let query = supabase
      .from("articles")
      .select("title, slug, category, read_time")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit + 1);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    // Filter out the current article
    return data.filter((a) => a.slug !== currentSlug).slice(0, limit);
  } catch (err) {
    logger.error(
      "[RelatedArticles] fetch failed",
      err instanceof Error ? err : undefined,
    );
    return [];
  }
}

export default async function RelatedArticles({
  currentSlug,
  category,
  limit = 3,
}: RelatedArticlesProps) {
  const articles = await fetchRelated(currentSlug, category, limit);

  if (articles.length === 0) return null;

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm mt-8">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          Related Guides & Comparisons
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                {CATEGORY_ICONS[article.category] || (
                  <BookOpen className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-200 text-sm group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {article.category
                      ?.replace(/-/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                      "Article"}
                  </span>
                  {article.read_time && (
                    <>
                      <span className="text-[10px] text-gray-600">
                        &middot;
                      </span>
                      <span className="text-xs text-gray-600">
                        {article.read_time} min read
                      </span>
                    </>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-center">
          <Link href="/articles">
            <Button
              variant="link"
              className="text-primary-600 h-auto p-0 text-sm font-semibold"
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
