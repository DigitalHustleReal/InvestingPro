"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
                            <p className="text-muted-foreground">Create a new affiliate product listing</p>
                        </div>
                    </div>
                </div>

                <ProductForm />
            </div>
        </AdminLayout>
    );
}
