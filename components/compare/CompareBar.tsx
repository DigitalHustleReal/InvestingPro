'use client';

import { useCompare } from '@/contexts/CompareContext';
import { X, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CompareBar() {
  const { selectedProducts, removeProduct, clearAll } = useCompare();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (selectedProducts.length === 0) {
    return null;
  }

  // Generate comparison URL
  const compareUrl = `/compare?products=${selectedProducts.map(p => p.slug).join(',')}`;

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-white dark:bg-slate-900 
        border-t-2 border-primary-500 
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
        transition-all duration-300
        ${isCollapsed ? 'h-16' : 'h-24 sm:h-28'}
      `}
      style={{ 
        animation: 'slide-up 0.3s ease-out',
      }}
    >
      {/* Collapse/Expand Button (Mobile) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -top-8 right-4 sm:hidden p-2 bg-primary-500 text-white rounded-t-lg shadow-lg"
        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <div className="container mx-auto px-4 h-full flex items-center gap-4">
        {/* Status Text */}
        <div className="hidden sm:flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Comparing
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedProducts.length}/{4} Products
          </span>
        </div>

        {/* Product Chips (Horizontal Scroll on Mobile) */}
        <div className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0 relative
                flex items-center gap-2 sm:gap-3
                px-3 sm:px-4 py-2 sm:py-3
                bg-slate-50 dark:bg-slate-800
                rounded-xl border border-slate-200 dark:border-slate-700
                min-w-[140px] sm:min-w-[180px]
              "
            >
              {/* Product Image */}
              {product.image_url && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
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
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                  ⭐ {product.rating.overall}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeProduct(product.id)}
                className="
                  flex-shrink-0 p-1 
                  hover:bg-red-100 dark:hover:bg-red-900/20 
                  rounded-full transition-colors
                  group
                "
                aria-label="Remove"
              >
                <X className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Clear All (Desktop) */}
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="hidden sm:flex text-xs"
          >
            Clear All
          </Button>

          {/* Compare Button */}
          <Button
            className={`
              bg-primary-600 hover:bg-primary-700 
              text-white font-bold
              shadow-lg hover:shadow-xl
              transition-all
              ${selectedProducts.length >= 2 ? 'animate-pulse-slow' : ''}
            `}
            size={isCollapsed ? 'sm' : 'default'}
            asChild
          >
            <Link href={compareUrl}>
              Compare
              {!isCollapsed && (
                <ArrowRight className="ml-2 w-4 h-4" />
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Keyframes for animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
