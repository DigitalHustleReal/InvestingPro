"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/lib/products/product-service';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
             const res = await fetch(`/api/admin/products?id=${productId}`);
             if (!res.ok) {
                 if (res.status === 404) throw new Error('Product not found');
                 throw new Error('Failed to fetch product');
             }
             return res.json();
        },
        enabled: !!productId
    });

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !product) {
        return (
            <AdminLayout>
                <div className="p-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
                        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
                        <Link href="/admin/products" className="text-primary hover:text-primary/80 font-medium">
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="mb-8">
                    <Link 
                        href="/admin/products" 
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Products
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 border border-secondary-500/30 flex items-center justify-center">
                            <Edit className="w-6 h-6 text-secondary-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
                            <p className="text-muted-foreground">{product.name}</p>
                        </div>
                    </div>
                </div>

                <ProductForm product={product} />
            </div>
        </AdminLayout>
    );
}
