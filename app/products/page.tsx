import React from "react";
import { logger } from "@/lib/logger";
import { productService } from "@/lib/products/product-service";
import ProductCard from "@/components/products/ProductCard";
import SEOHead from "@/components/common/SEOHead";
import ProductCategoryTabs from "@/components/products/ProductCategoryTabs";
import SuggestedComparisons from "@/components/products/SuggestedComparisons";

export const revalidate = 3600; // Revalidate every hour (product data changes infrequently)

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  // Await searchParams as per Next.js 15+ convention/patterns (though often sync in 13/14, declaring as promise is safer future proofing)
  const params = await searchParams;
  const category = params.category;

  let products: any[] = [];
  let error = null;

  try {
    products = await productService.getProducts({ category });
  } catch (e: any) {
    logger.error(
      "Failed to fetch products",
      e instanceof Error ? e : undefined,
    );
    error = e;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="Best Financial Products | InvestingPro"
        description="Compare the best credit cards, brokers, and loans in India."
      />

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Handpicked credit cards, brokers, and tools accelerated for your
            financial growth. Compare side-by-side to choose the best.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductCategoryTabs />

        {error ? (
          <div className="p-8 bg-danger-50 border border-danger-200 rounded-lg text-center">
            <h3 className="text-danger-800 font-bold mb-2">Setup Required</h3>
            <p className="text-danger-700 mb-4">
              The products table is missing or inaccessible.
            </p>
            <p className="text-sm text-danger-600 font-mono bg-danger-100 p-2 rounded inline-block">
              Run migration: supabase/migrations/20260102_products_schema.sql
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No products available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Products are being added. Check back soon or explore our
              categories.
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
                href="/loans"
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-colors"
              >
                Loans
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <SuggestedComparisons />
      </div>
    </div>
  );
}
