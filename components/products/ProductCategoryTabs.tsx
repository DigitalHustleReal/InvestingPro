"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CreditCard, TrendingUp, Shield, Landmark } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All Products', icon: null },
    { id: 'credit_card', label: 'Credit Cards', icon: CreditCard },
    { id: 'broker', label: 'Brokers', icon: TrendingUp },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'loan', label: 'Loans', icon: Landmark },
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
