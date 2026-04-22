"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Search, Loader2, Plus, CreditCard, Banknote, Shield } from "lucide-react";
import { apiClient as api } from "@/lib/api-client";
import Image from "next/image";

interface ProductSelectorProps {
    category?: string;
    excludeIds?: string[];
    onSelect: (product: any) => void;
    trigger?: React.ReactNode;
}

export function ProductSelector({ category, excludeIds = [], onSelect, trigger }: ProductSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Simple debounce implementation if hook doesn't exist
    useEffect(() => {
        const timer = setTimeout(() => {
            if (open) fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, open]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // If category is specific (e.g. 'credit_card'), use specific entity list for richer data
            // Otherwise use generic assets search
            let data = [];
            
            if (category === 'credit_card') {
                const cards = await api.entities.CreditCard.list();
                 data = cards.filter((c: any) => 
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    c.provider_name?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (category === 'mutual_fund') {
                 // For MFs, we might want to use the search endpoint specifically because list is huge
                 // But for now, let's use the list method if it supports search or fetch all
                 const { data: mfs } = await api.entities.MutualFund.list({ searchTerm: searchTerm, limit: 20 });
                 data = mfs;
            } else if (category === 'loan') {
                const loans = await api.entities.Loan.list();
                data = loans.filter((l: any) => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
            } else {
                // Generic fallback - no specific API, return empty
                // In the future, a generic search endpoint could be added
                data = [];
            }

            // Exclude already selected
            const filtered = data.filter((item: any) => !excludeIds.includes(item.id));
            setResults(filtered.slice(0, 10));
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (cat: string) => {
        switch(cat) {
            case 'credit_card': return <CreditCard className="w-4 h-4" />;
            case 'loan': return <Banknote className="w-4 h-4" />;
            case 'insurance': return <Shield className="w-4 h-4" />;
            default: return <Search className="w-4 h-4" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="h-full min-h-[120px] w-full border-dashed border-2 flex flex-col gap-2 hover:border-ink hover:bg-indian-gold/10 text-ink-60 hover:text-indian-gold">
                        <div className="w-10 h-10 rounded-sm bg-ink/5 dark:bg-gray-800 flex items-center justify-center">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-semibold">Add Product</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add to Comparison</DialogTitle>
                </DialogHeader>
                
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-ink-60" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-2 mt-2">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin text-action-green" />
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center p-4 text-ink-60 text-sm">
                            {searchTerm ? "No products found." : "Start typing to search..."}
                        </div>
                    ) : (
                        results.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => {
                                    onSelect(product);
                                    setOpen(false);
                                }}
                                className="w-full text-left p-3 rounded-sm hover:bg-ink/5 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors border border-transparent hover:border-ink/10"
                            >
                                <div className="w-10 h-10 rounded-sm bg-white p-1 border border-ink/5 shadow-sm flex-shrink-0">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-canvas text-ink-60">
                                            {product.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-ink dark:text-white truncate">
                                        {product.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-ink-60">
                                        <span className="flex items-center gap-1">
                                            {getIcon(product.category)}
                                            {product.provider_name || product.provider}
                                        </span>
                                        {product.rating && (
                                            <span className="px-1.5 py-0.5 rounded-sm bg-accent-50 text-accent-700 font-medium text-[10px]">
                                                {typeof product.rating === 'object' ? product.rating.overall : product.rating} ★
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Plus className="w-4 h-4 text-ink-60" />
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
