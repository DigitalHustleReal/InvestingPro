"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '@/lib/products/product-service';

interface CompareContextType {
    selectedProducts: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    isInCompare: (productId: string) => boolean;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('compare_products');
        if (saved) {
            try {
                setSelectedProducts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse compare state", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('compare_products', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const addToCompare = (product: Product) => {
        if (selectedProducts.length >= 4) {
            toast.error("You can compare up to 4 products only.");
            return;
        }
        if (selectedProducts.some(p => p.id === product.id)) return;
        
        // Ensure category matches (optional constraint)
        if (selectedProducts.length > 0 && selectedProducts[0].category !== product.category) {
            toast.error(`Compare only ${selectedProducts[0].category.replace('_', ' ')}s together.`);
            return;
        }

        setSelectedProducts([...selectedProducts, product]);
        toast.success(`Added ${product.name} to comparison`);
    };

    const removeFromCompare = (productId: string) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const isInCompare = (productId: string) => {
        return selectedProducts.some(p => p.id === productId);
    };

    const clearCompare = () => {
        setSelectedProducts([]);
    };

    return (
        <CompareContext.Provider value={{ selectedProducts, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
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
