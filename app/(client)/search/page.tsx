"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  TrendingUp,
  FileText,
  Calendar,
  Eye,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { articleUrl } from "@/lib/routing/article-url";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  published_at: string;
  featured_image?: string;
  relevance: number;
}

const categories = [
  { value: "", label: "All Categories" },
  { value: "mutual-funds", label: "Mutual Funds" },
  { value: "stocks", label: "Stocks" },
  { value: "insurance", label: "Insurance" },
  { value: "loans", label: "Loans" },
  { value: "credit-cards", label: "Credit Cards" },
  { value: "tax-planning", label: "Tax Planning" },
  { value: "retirement", label: "Retirement" },
  { value: "investing-basics", label: "Investing Basics" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [trending, setTrending] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [query, category]);

  const fetchTrending = async () => {
    try {
      const response = await fetch("/api/search?type=trending&limit=6");
      const data = await response.json();
      setTrending(data.results || []);
    } catch (error) {
      console.error("Failed to fetch trending", error);
    }
  };

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: "20",
        ...(category && { category }),
      });
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data.results || []);
      setTotalResults(data.total || 0);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Search */}
      <div className="bg-gradient-to-b from-primary-500/10 to-transparent py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Search Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Find guides, tutorials, and insights on personal finance
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <Input
              type="text"
              placeholder="Search for mutual funds, stocks, tax saving..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg h-14 bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 rounded-xl shadow-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant="ghost"
                size="sm"
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "rounded-full text-sm",
                  category === cat.value
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10",
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {query.length >= 2 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isLoading
                  ? "Searching..."
                  : `${totalResults} results for "${query}"`}
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Link key={result.id} href={articleUrl(result)}>
                    <Card className="bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/5 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all group">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {result.featured_image ? (
                            <img
                              src={result.featured_image}
                              alt={result.title}
                              className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-primary-500/20 to-success-500/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-8 h-8 text-primary-500/50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Badge className="mb-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 border-0 text-[10px] font-bold uppercase tracking-wider">
                              {result.category?.replace(/-/g, " ")}
                            </Badge>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(result.published_at)}
                              </span>
                              {result.tags?.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="flex items-center gap-1"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find anything matching your search. Try
                  different keywords or explore popular pages.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="/credit-cards"
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-colors"
                  >
                    Credit Cards
                  </a>
                  <a
                    href="/mutual-funds"
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-colors"
                  >
                    Mutual Funds
                  </a>
                  <a
                    href="/calculators"
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-colors"
                  >
                    Calculators
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Trending Topics
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((article) => (
                <Link key={article.id} href={articleUrl(article)}>
                  <Card className="h-full bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/5 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all group">
                    <CardContent className="p-6">
                      <Badge className="mb-3 bg-primary-500/10 text-primary-600 dark:text-primary-400 border-0 text-[10px] font-bold uppercase tracking-wider">
                        {article.category?.replace(/-/g, " ")}
                      </Badge>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-600 line-clamp-2 mt-2">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
