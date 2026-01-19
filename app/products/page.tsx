
import React from 'react';
import { productService } from '@/lib/products/product-service';
import ProductCard from '@/components/products/ProductCard';
import SEOHead from '@/components/common/SEOHead';
import ProductCategoryTabs from '@/components/products/ProductCategoryTabs';
import SuggestedComparisons from '@/components/products/SuggestedComparisons';

export const revalidate = 3600; // Revalidate every hour (product data changes infrequently)

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>
}) {
    // Await searchParams as per Next.js 15+ convention/patterns (though often sync in 13/14, declaring as promise is safer future proofing)
    const params = await searchParams;
    const category = params.category;
    
    let products: any[] = [];
    let error = null;

    try {
        products = await productService.getProducts({ category });
    } catch (e: any) {
        console.error('Failed to fetch products:', e);
        error = e;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead 
                title="Best Financial Products | InvestingPro" 
                description="Compare the best credit cards, brokers, and loans in India." 
            />
            
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Financial Products</h1>
                    <p className="text-xl text-slate-600 max-w-2xl">
                        Handpicked credit cards, brokers, and tools accelerated for your financial growth.
                        Compare side-by-side to choose the best.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ProductCategoryTabs />
                
                {error ? (
                    <div className="p-8 bg-danger-50 border border-danger-200 rounded-lg text-center">
                        <h3 className="text-danger-800 font-bold mb-2">Setup Required</h3>
                        <p className="text-danger-700 mb-4">The products table is missing or inaccessible.</p>
                        <p className="text-sm text-danger-600 font-mono bg-danger-100 p-2 rounded inline-block">
                            Run migration: supabase/migrations/20260102_products_schema.sql
                        </p>
                    </div>
                ) : products.length === 0 ? (
                   <div className="text-center py-20">
                       <p className="text-slate-500 mb-4">No products found.</p>
                       <p className="text-sm text-slate-400">Run: npx tsx scripts/seed-products.ts</p>
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
