"use client";

import React, { useEffect, useState } from 'react';
import { productService, Product } from '@/lib/products/product-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Star, ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';

export default function TopPicksSidebar({ category }: { category: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productCat = category.replace('-', '_');
                // We use the service directly which works on client if initialized with public key
                const data = await productService.getProducts(productCat);
                setProducts(data.slice(0, 3));
            } catch (error) {
                console.error("Sidebar fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    if (!loading && products.length === 0) return null;

    return (
        <div className="space-y-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Top Picks for You</h3>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                Array.isArray(products) && products.map(p => (
                    <Card key={p.id} className="p-6 md:p-8 border-slate-100 hover:border-primary-200 transition-colors group">
                        <div className="flex gap-4">
                            <img src={p.image_url} alt={p.name} className="w-12 h-12 object-contain bg-slate-50 rounded p-1 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-primary-700 transition-colors">
                                    {p.name}
                                </h4>
                                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    {p.rating} • {p.provider_name}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <Link href={`/go/${p.slug}`} target="_blank">
                                <Button size="sm" variant="ghost" className="w-full text-primary-700 hover:text-primary-800 hover:bg-primary-50 text-xs font-bold justify-between px-2">
                                    View Deal <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))
            )}

            <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl text-white shadow-lg shadow-primary-500/20">
                <h4 className="font-bold mb-2">Not sure?</h4>
                <p className="text-xs text-primary-100 mb-4 leading-relaxed">Try our comparison engine to see products side-by-side.</p>
                <Link href="/products">
                    <Button size="sm" className="w-full bg-white text-primary-700 hover:bg-primary-50 font-bold border-none shadow-none">
                        Compare Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}
