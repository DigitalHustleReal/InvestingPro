'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompare } from '@/contexts/CompareContext';
import ComparisonTable from '@/components/compare/ComparisonTable';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { RichProduct } from '@/types/rich-product';
import { api } from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedProducts, removeProduct, clearAll } = useCompare();
  const [products, setProducts] = useState<RichProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const productSlugs = searchParams.get('products')?.split(',') || [];
      
      if (productSlugs.length === 0 && selectedProducts.length > 0) {
        // Use products from context if URL params are empty
        setProducts(selectedProducts);
        setLoading(false);
        return;
      }

      if (productSlugs.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch products by slugs
      try {
        // TODO: Implement batch fetch by slugs in API
        // For now, using selectedProducts from context
        setProducts(selectedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(selectedProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams, selectedProducts]);

  const handleRemoveProduct = (id: string) => {
    removeProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    
    // Update URL
    const remaining = products.filter(p => p.id !== id);
    if (remaining.length === 0) {
      router.push('/credit-cards');
    } else {
      const newSlugs = remaining.map(p => p.slug).join(',');
      router.push(`/compare?products=${newSlugs}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-md px-4">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No Products to Compare
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Add products from the listing page to start comparing.
          </p>
          <Link href="/credit-cards">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <SEOHead
        title={`Compare ${products.length} Products | InvestingPro`}
        description={`Side-by-side comparison of ${products.map(p => p.name).join(', ')}`}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/credit-cards">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Browse
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Product Comparison
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Comparing {products.length} products side-by-side
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              clearAll();
              router.push('/credit-cards');
            }}
            className="hidden sm:block"
          >
            Clear All
          </Button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
              🟢 Best
            </div>
            <div className="px-2 py-1 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded text-xs font-semibold">
              🔴 Worst
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
          <ComparisonTable products={products} onRemoveProduct={handleRemoveProduct} />
        </div>

        {/* Add More Products CTA */}
        {products.length < 4 && (
          <div className="mt-8 text-center">
            <Link href="/credit-cards">
              <Button variant="outline">
                + Add More Products (Max {4 - products.length} more)
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
