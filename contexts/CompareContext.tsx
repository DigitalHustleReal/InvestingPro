'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { RichProduct } from '@/types/rich-product';
import { toast } from 'sonner';

interface CompareContextType {
  selectedProducts: RichProduct[];
  addProduct: (product: RichProduct) => boolean;
  removeProduct: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  canAddMore: boolean;
  maxProducts: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_PRODUCTS = 4;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<RichProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('comparison-storage');
    if (saved) {
      try {
        setSelectedProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse comparison storage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('comparison-storage', JSON.stringify(selectedProducts));
    }
  }, [selectedProducts, isInitialized]);

  const addProduct = useCallback((product: RichProduct): boolean => {
    // Check max limit
    if (selectedProducts.length >= MAX_PRODUCTS) {
      toast.error(`You can compare up to ${MAX_PRODUCTS} products only.`);
      return false;
    }
    
    // Check if already added
    if (selectedProducts.some(p => p.id === product.id)) {
      toast.info(`${product.name} is already in comparison.`);
      return false;
    }

    // Category validation - ensure all products are from same category
    if (selectedProducts.length > 0) {
      const firstCategory = selectedProducts[0].category;
      if (product.category !== firstCategory) {
        const categoryName = firstCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        toast.error(`You can only compare ${categoryName}s together. Please clear the comparison or select a ${categoryName}.`);
        return false;
      }
    }

    setSelectedProducts(prev => [...prev, product]);
    toast.success(`Added ${product.name} to comparison`);
    return true;
  }, [selectedProducts]);

  const removeProduct = useCallback((id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const isSelected = useCallback((id: string): boolean => {
    return selectedProducts.some(p => p.id === id);
  }, [selectedProducts]);

  const canAddMore = selectedProducts.length < MAX_PRODUCTS;

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct,
        clearAll,
        isSelected,
        canAddMore,
        maxProducts: MAX_PRODUCTS
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
