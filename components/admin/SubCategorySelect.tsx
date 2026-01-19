"use client";

import React, { useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { NAVIGATION_CONFIG } from '@/lib/navigation/config';

interface SubCategorySelectProps {
    categorySlug: string;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export default function SubCategorySelect({
    categorySlug,
    value,
    onValueChange,
    className = "",
}: SubCategorySelectProps) {
    
    const subCategories = useMemo(() => {
        const category = NAVIGATION_CONFIG.find(c => c.slug === categorySlug);
        if (!category) return [];

        // Flatten all collections from all intents to find unique "Topics"
        const uniqueSlugs = new Set<string>();
        const options: { name: string; slug: string }[] = [];

        category.intents.forEach(intent => {
            intent.collections.forEach(col => {
                // Heuristic: Use the slug as universal identifier
                // e.g. 'mutual-funds' appears in Best and Compare.
                if (!uniqueSlugs.has(col.slug) && col.slug !== 'all' && col.slug !== 'all-articles') {
                    uniqueSlugs.add(col.slug);
                    options.push({ name: col.name.replace('Best ', '').replace('Compare ', ''), slug: col.slug });
                }
            });
        });

        return options.sort((a, b) => a.name.localeCompare(b.name));
    }, [categorySlug]);

    if (subCategories.length === 0) return null;

    return (
        <div className={className}>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-full bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                    <SelectValue placeholder="Select Topic / Sub-category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-surface-darker border-slate-200 dark:border-border dark:border-border text-slate-900 dark:text-foreground/90 dark:text-foreground/90">
                    {subCategories.map((sub) => (
                        <SelectItem 
                            key={sub.slug} 
                            value={sub.slug}
                            className="text-slate-900 dark:text-foreground/90 dark:text-foreground/90 focus:bg-slate-100 dark:focus:bg-muted dark:bg-muted focus:text-slate-900 dark:focus:text-foreground dark:text-foreground cursor-pointer"
                        >
                            {sub.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
