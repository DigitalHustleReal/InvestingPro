'use client';

import { useCompare } from '@/contexts/CompareContext';
import { X, ArrowRight, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompareBar() {
  const { selectedProducts, removeProduct, clearAll } = useCompare();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (selectedProducts.length === 0) {
    return null;
  }

  // Generate comparison URL
  const compareUrl = `/compare?products=${selectedProducts.map(p => p.slug).join(',')}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed bottom-0 sm:bottom-6 left-0 sm:left-1/2 sm:-translate-x-1/2
          right-0 sm:right-auto sm:max-w-4xl
          z-50 
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur-2xl
          border-t-2 sm:border-2 border-primary-500
          sm:rounded-3xl
          shadow-2xl shadow-black/10
          ring-1 ring-white/20
          transition-all duration-300
          ${isCollapsed ? 'h-16' : 'h-auto'}
        `}
      >
        {/* Collapse/Expand Button (Mobile) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -top-10 right-4 sm:hidden p-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-t-xl shadow-lg hover:from-primary-700 hover:to-secondary-700 transition-all"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Status Text with Icon */}
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  Comparing
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {selectedProducts.length}/{4} Products
              </span>
            </div>

            {/* Product Chips (Horizontal Scroll on Mobile) */}
            <div className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide py-1">
              <AnimatePresence mode="popLayout">
                {selectedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200, delay: index * 0.05 }}
                    className="
                      flex-shrink-0 relative group
                      flex items-center gap-2 sm:gap-3
                      px-3 sm:px-4 py-2 sm:py-3
                      bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900
                      rounded-xl sm:rounded-2xl 
                      border-2 border-slate-200 dark:border-slate-700
                      hover:border-primary-500 dark:hover:border-primary-400
                      hover:shadow-lg hover:shadow-primary-500/20
                      transition-all duration-300
                      min-w-[140px] sm:min-w-[180px]
                    "
                  >
                    {/* Product Image with Glow */}
                    {product.image_url && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-lg blur-md group-hover:bg-primary-500/40 transition-all" />
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white shadow-inner ring-2 ring-white/50 flex-shrink-0">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400">⭐</span>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {product.rating.overall.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button with Hover Effect */}
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="
                        flex-shrink-0 p-1.5
                        hover:bg-red-100 dark:hover:bg-red-900/30
                        rounded-full transition-all duration-200
                        group/remove
                        hover:scale-110
                      "
                      aria-label="Remove"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover/remove:text-red-500 group-hover/remove:rotate-90 transition-all" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Clear All (Desktop) */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="hidden sm:flex text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
              >
                Clear All
              </Button>

              {/* Compare Button with Shimmer Effect */}
              <Button
                className={`
                  relative overflow-hidden
                  bg-gradient-to-r from-primary-600 to-secondary-600
                  hover:from-primary-700 hover:to-secondary-700
                  text-white font-bold
                  shadow-lg shadow-primary-500/30
                  hover:shadow-xl hover:shadow-primary-500/50
                  transition-all duration-300
                  hover:scale-105
                  ${selectedProducts.length >= 2 ? 'animate-pulse-slow' : ''}
                `}
                size={isCollapsed ? 'sm' : 'default'}
                asChild
              >
                <Link href={compareUrl}>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">Compare</span>
                  {!isCollapsed && (
                    <ArrowRight className="relative z-10 ml-2 w-4 h-4" />
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Keyframes for animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.85;
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
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
      </motion.div>
    </AnimatePresence>
  );
}
