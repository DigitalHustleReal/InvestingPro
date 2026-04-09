"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/common/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Search, Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import SmartImage from "@/components/ui/SmartImage";

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

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch published articles via API (client-safe)
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "public"],
    queryFn: async () => {
      const response = await fetch("/api/articles/public?limit=100");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const result = await response.json();
      return result.articles || [];
    },
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  const articles: Article[] = data || [];

  // Filter articles by search term
  const filteredArticles = (Array.isArray(articles) ? articles : []).filter(
    (article) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        article.title?.toLowerCase().includes(searchLower) ||
        article.excerpt?.toLowerCase().includes(searchLower) ||
        article.category?.toLowerCase().includes(searchLower)
      );
    },
  );

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Categories for filtering
  const categories = Array.from(
    new Set(
      (Array.isArray(articles) ? articles : [])
        .map((a) => a.category)
        .filter(Boolean),
    ),
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoryFilteredArticles =
    selectedCategory === "all"
      ? paginatedArticles
      : paginatedArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Articles | InvestingPro"
        description="Explore our latest articles on investing, personal finance, and financial planning."
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Articles & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Expert insights on investing, personal finance, and financial
            planning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
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
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="rounded-full"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Link key={category} href={`/category/${category}`}>
                  <Button
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className="rounded-full"
                  >
                    {category
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading articles...</div>
          </div>
        ) : categoryFilteredArticles.length === 0 ? (
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
              {categoryFilteredArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {article.featured_image && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <SmartImage
                          src={article.featured_image}
                          category={article.category}
                          alt={article.title}
                          className="w-full h-full"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {article.category?.replace(/-/g, " ")}
                        </Badge>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {article.read_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.read_time} min
                            </span>
                          )}
                          {article.published_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                article.published_date,
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
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
      </div>
    </div>
  );
}
