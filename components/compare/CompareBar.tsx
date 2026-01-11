'use client';

import { useCompare } from '@/contexts/CompareContext';
import { X, ArrowRight, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CompareBar() {
  const { selectedProducts, removeProduct, clearAll } = useCompare();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedProducts.length]);

  if (selectedProducts.length === 0) {
    return null;
  }

  // Generate comparison URL
  const compareUrl = `/compare?products=${selectedProducts.map(p => p.slug).join(',')}`;

  return (
      <div
        className={cn(
          "fixed left-0 sm:left-1/2 sm:-translate-x-1/2 right-0 sm:right-auto sm:max-w-4xl z-50 transition-all duration-500 ease-in-out",
          isVisible ? "bottom-0 sm:bottom-6 opacity-100 translate-y-0" : "bottom-[-100px] opacity-0 translate-y-20",
          isCollapsed ? "h-16" : "h-auto"
        )}
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t-2 sm:border-2 border-primary-500 sm:rounded-3xl shadow-2xl shadow-primary-900/20 ring-1 ring-white/20">
            {/* Collapse/Expand Button (Mobile) */}
            <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -top-8 right-4 sm:hidden p-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-t-lg shadow-lg"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Status Text with Icon */}
                <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Comparing
                    </span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {selectedProducts.length}/4 Products
                </span>
                </div>

                {/* Product Chips (Horizontal Scroll on Mobile) */}
                <div className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide py-1">
                    {selectedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 relative group flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 min-w-[140px] transition-all hover:bg-white dark:hover:bg-slate-800 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md"
                    >
                        {/* Product Image */}
                        {product.image_url && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white p-1 shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {product.name}
                        </p>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-yellow-600 dark:text-yellow-400">★</span>
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {product.rating.overall.toFixed(1)}
                            </span>
                        </div>
                        </div>

                        {/* Remove Button */}
                        <button
                        onClick={() => removeProduct(product.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full group/remove transition-colors"
                        aria-label="Remove"
                        >
                        <X className="w-3.5 h-3.5 text-slate-400 group-hover/remove:text-red-500" />
                        </button>
                    </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="hidden sm:flex text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                    Clear All
                </Button>

                <Link href={compareUrl}>
                    <Button 
                        size={isCollapsed ? 'sm' : 'default'}
                        className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all hover:scale-105 active:scale-95"
                    >
                    <span className="mr-2">Compare</span>
                    <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
                </div>
            </div>
            </div>
      </div>
      </div>
  );
}
