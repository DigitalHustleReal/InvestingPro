"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationContextType {
    activeCategory: string | null;
    setActiveCategory: (category: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [activeCategory, setActiveCategoryState] = useState<string | null>(null);

    const setActiveCategory = useCallback((category: string | null) => {
        setActiveCategoryState(category);
    }, []);

    return (
        <NavigationContext.Provider value={{ activeCategory, setActiveCategory }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}
