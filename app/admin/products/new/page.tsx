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
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 dark:text-muted-foreground/70 hover:text-slate-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Products
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                            <Plus className="w-6 h-6 text-foreground dark:text-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
                            <p className="text-muted-foreground/70 dark:text-muted-foreground/70">Create a new affiliate product listing</p>
                        </div>
                    </div>
                </div>

                <ProductForm />
            </div>
        </AdminLayout>
    );
}
