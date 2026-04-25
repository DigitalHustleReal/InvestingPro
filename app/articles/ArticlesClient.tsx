"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatSlug } from "@/lib/utils";
// Card/Badge replaced with inline bold design elements
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Search, Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import SmartImage from "@/components/ui/SmartImage";
import { articleUrl } from "@/lib/routing/article-url";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  read_time?: number;
  published_at: string;
  published_date?: string;
  featured_image?: string;
  author_name?: string;
}

export default function ArticlesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading } = useQuery({
    queryKey: ["articles", "public"],
    queryFn: async () => {
      const response = await fetch("/api/articles/public?limit=100");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const result = await response.json();
      return result.articles || [];
    },
    staleTime: 60 * 1000,
  });

  const articles: Article[] = data || [];

  // Extract unique categories from article data
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          (Array.isArray(articles) ? articles : [])
            .map((a) => a.category)
            .filter(Boolean),
        ),
      ).sort(),
    [articles],
  );

  // Filter by category, then by search term
  const filteredArticles = useMemo(() => {
    let filtered = Array.isArray(articles) ? articles : [];
    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [articles, selectedCategory, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <>
      {/* Search + Category Filters */}
      <div className="mb-8">
        <div className="relative max-w-md mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-60 w-4 h-4" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-full ${
                selectedCategory === "all"
                  ? "bg-authority-green text-white"
                  : "bg-gray-100 text-ink-60 hover:bg-gray-200 hover:text-ink"
              }`}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-full ${
                  selectedCategory === category
                    ? "bg-authority-green text-white"
                    : "bg-gray-100 text-ink-60 hover:bg-gray-200 hover:text-ink"
                }`}
              >
                {formatSlug(category)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article count */}
      {!isLoading && filteredArticles.length > 0 && (
        <p className="text-sm text-ink-60 mb-4">
          {filteredArticles.length} article
          {filteredArticles.length !== 1 ? "s" : ""}
          {selectedCategory !== "all" && (
            <>
              {" "}
              in{" "}
              <span className="font-medium text-gray-700">
                {formatSlug(selectedCategory)}
              </span>
            </>
          )}
        </p>
      )}

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-200 rounded-t-xl" />
              <div className="p-6 bg-white border border-t-0 border-gray-200 rounded-b-xl">
                <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedArticles.length === 0 ? (
        <EmptyState
          title="No articles found"
          description={
            searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filters."
              : "No published articles available yet."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedArticles.map((article) => (
              <Link key={article.id} href={articleUrl(article)}>
                <div className="h-full bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer overflow-hidden group">
                  <div className="aspect-video w-full overflow-hidden relative bg-gray-100 rounded-t-xl">
                    <SmartImage
                      src={article.featured_image || null}
                      category={article.category}
                      alt={article.title}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-xs text-authority-green bg-green-50 px-2.5 py-0.5 rounded-full font-medium">
                        {formatSlug(article.category || "")}
                      </span>
                    </div>
                    <h2 className="text-lg font-display font-bold text-ink mb-2 line-clamp-2 leading-snug group-hover:text-authority-green transition-colors">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-ink-60 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-ink-60 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {article.read_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.read_time} min
                          </span>
                        )}
                        {(article.published_date || article.published_at) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              article.published_date || article.published_at,
                            ).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-ink-60 px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
