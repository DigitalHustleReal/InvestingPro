"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_CATEGORIES } from '@/lib/navigation/categories';

const CATEGORIES = [
    { id: 'all', label: 'All Products', icon: null },
    ...NAVIGATION_CATEGORIES.map(cat => ({
        id: cat.slug === 'credit-cards' ? 'credit_card' : 
            cat.slug === 'investing' ? 'mutual_fund' : 
            cat.slug === 'loans' ? 'loan' : 
            cat.slug === 'insurance' ? 'insurance' : cat.slug,
        label: cat.name,
        icon: null
    }))
];

export default function ProductCategoryTabs() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams?.get('category') || 'all';

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => {
                const isActive = currentCategory === cat.id;
                const Icon = cat.icon;
                
                return (
                    <Link 
                        key={cat.id} 
                        href={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
                        scroll={false}
                    >
                        <Button
                            variant={isActive ? 'default' : 'outline'}
                            className={`rounded-full gap-2 ${isActive ? 'bg-teal-600 hover:bg-teal-700' : 'bg-white'}`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {cat.label}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}
