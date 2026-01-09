
"use client";

import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompare } from '@/contexts/CompareContext';

interface ResponsiveFilterContainerProps {
    children: React.ReactNode;
    activeFiltersCount?: number;
    className?: string;
}

export function ResponsiveFilterContainer({ 
    children, 
    activeFiltersCount = 0,
    className 
}: ResponsiveFilterContainerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { selectedProducts } = useCompare();
    const isCompareBarOpen = selectedProducts.length > 0;

    return (
        <div className={cn("w-full lg:w-[300px] shrink-0", className)}>
            {/* Desktop View: Static Sidebar */}
            <div className="hidden lg:block">
                {children}
            </div>

            {/* Mobile View: Floating Action Button + Sheet */}
            <div 
                className="lg:hidden fixed right-6 z-40 transition-all duration-500 ease-in-out"
                style={{ bottom: isCompareBarOpen ? '180px' : '24px' }}
            >
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button 
                            className="h-14 px-6 rounded-2xl bg-slate-900 border border-white/10 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="font-bold">Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-slate-950 text-[10px] font-black">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-[2.5rem] bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Filter className="w-5 h-5 text-primary-500" />
                                Refine Results
                            </h2>
                        </div>
                        <div className="overflow-y-auto h-full pb-24 p-4">
                            {/* We clone the children but want to remove sticky positioning for mobile */}
                            <div className="mobile-filter-content">
                                {children}
                            </div>
                        </div>
                        {/* Mobile Footer for Applying Filters */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex gap-4">
                            <Button 
                                className="flex-1 h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
                                onClick={() => setIsOpen(false)}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
