"use client";

import { useState, useEffect, useCallback } from 'react';

export interface SavedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  provider: string;
  image?: string;
  saved_at: string;
}

export function useSavedProducts() {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedProducts = useCallback(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('investingpro_saved_products');
    if (saved) {
      setSavedProducts(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSavedProducts();
  }, [loadSavedProducts]);

  const toggleSaveProduct = (product: Omit<SavedProduct, 'saved_at'>) => {
    const isSaved = savedProducts.some(p => p.id === product.id);
    let newSaved;
    
    if (isSaved) {
      newSaved = savedProducts.filter(p => p.id !== product.id);
    } else {
      newSaved = [...savedProducts, { ...product, saved_at: new Date().toISOString() }];
    }
    
    setSavedProducts(newSaved);
    localStorage.setItem('investingpro_saved_products', JSON.stringify(newSaved));
    
    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new CustomEvent('saved_products_updated', { detail: newSaved }));
  };

  const isProductSaved = (productId: string) => {
    return savedProducts.some(p => p.id === productId);
  };

  return {
    savedProducts,
    loading,
    toggleSaveProduct,
    isProductSaved
  };
}
