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
        queryFn: () => productService.getProductById(productId),
        enabled: !!productId
    });

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !product) {
        return (
            <AdminLayout>
                <div className="p-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
                        <p className="text-slate-500 mb-6">The product you're looking for doesn't exist.</p>
                        <Link href="/admin/products" className="text-teal-600 hover:text-teal-700 font-medium">
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
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Products
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <Edit className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
                            <p className="text-slate-500">{product.name}</p>
                        </div>
                    </div>
                </div>

                <ProductForm product={product} />
            </div>
        </AdminLayout>
    );
}
