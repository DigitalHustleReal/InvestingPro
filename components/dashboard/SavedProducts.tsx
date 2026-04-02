"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useSavedProducts } from '@/lib/hooks/useSavedProducts';
import { Bookmark, ExternalLink, Trash2, CreditCard, Landmark, Coins } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SavedProducts() {
  const { savedProducts, loading, toggleSaveProduct } = useSavedProducts();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (savedProducts.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-600 mb-4">
            <Bookmark size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No saved products yet</h3>
          <p className="text-gray-500 dark:text-gray-600 mb-6 max-w-sm mx-auto">
            Pin the credit cards or loans you're interested in to compare them here later.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/credit-cards">
              <Button variant="outline" size="sm">Browse Cards</Button>
            </Link>
            <Link href="/loans">
              <Button variant="outline" size="sm">Browse Loans</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {savedProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all group">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative w-20 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    {product.category === 'credit_card' ? <CreditCard size={20} /> : 
                     product.category === 'loan' ? <Landmark size={20} /> : <Coins size={20} />}
                  </div>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-600 font-medium uppercase tracking-wider">
                      {product.provider}
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleSaveProduct(product)}
                    className="text-gray-300 hover:text-danger-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[9px] font-bold text-gray-500 uppercase">
                      {product.category.replace('_', ' ')}
                    </span>
                  </div>
                  <Link href={`/${product.category.replace('_', '-')}s/${product.slug}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary-600 hover:text-primary-700 p-0 hover:bg-transparent">
                      View Details <ExternalLink size={10} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
