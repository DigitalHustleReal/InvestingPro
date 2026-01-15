"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import { 
    Package, 
    Plus, 
    Search, 
    RefreshCcw, 
    ExternalLink, 
    Edit, 
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Eye,
    EyeOff,
    TrendingUp,
    ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { AdminPageHeader, ContentSection, StatCard, ActionButton } from '@/components/admin/AdminUIKit';

const CATEGORIES = [
    { value: 'all', label: 'All Products' },
    { value: 'credit_card', label: 'Credit Cards' },
    { value: 'mutual_fund', label: 'Mutual Funds' },
    { value: 'loan', label: 'Loans' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'broker', label: 'Brokers' },
];

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const queryClient = useQueryClient();

    const { data: products = [], isLoading, refetch } = useQuery({
        queryKey: ['admin-products', selectedCategory],
        queryFn: () => productService.getProducts({ 
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            includeInactive: true 
        })
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
            productService.updateProduct(id, { is_active: isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success('Product status updated');
        },
        onError: (error: any) => toast.error(error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success('Product deleted');
        },
        onError: (error: any) => toast.error(error.message)
    });

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.provider_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Delete "${name}"?`)) deleteMutation.mutate(id);
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Product Catalog"
                    subtitle="Manage affiliate products and verification status"
                    icon={ShoppingBag}
                    iconColor="rose"
                    actions={
                        <div className="flex gap-3">
                            <button onClick={() => refetch()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm flex items-center gap-2">
                                <RefreshCcw className="w-4 h-4" /> Refresh
                            </button>
                            <Link href="/admin/products/new">
                                <ActionButton icon={Plus}>Add Product</ActionButton>
                            </Link>
                        </div>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Products" value={products.length} icon={Package} color="rose" />
                    <StatCard label="Active" value={products.filter(p => p.is_active).length} icon={Eye} color="teal" />
                    <StatCard label="Verified" value={products.filter(p => p.verification_status === 'verified').length} icon={CheckCircle2} color="blue" />
                    <StatCard label="Needs Review" value={products.filter(p => p.verification_status === 'discrepancy').length} icon={AlertTriangle} color="amber" />
                </div>

                {/* Filters */}
                <ContentSection>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-danger-500/50"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedCategory === cat.value
                                            ? 'bg-danger-500 text-white shadow-lg shadow-danger-500/25'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </ContentSection>

                {/* Table */}
                <ContentSection>
                    <div className="overflow-x-auto -mx-6">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase">Trust Score</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase">Active</th>
                                    <th className="px-4 py-4 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-16 text-center">
                                        <div className="w-10 h-10 border-4 border-danger-500/30 border-t-danger-500 rounded-full animate-spin mx-auto" />
                                    </td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan={6} className="p-16 text-center text-slate-500">No products found</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} className={`group hover:bg-white/5 transition-colors ${!product.is_active ? 'opacity-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-danger-500/20 to-danger-500/20 border border-danger-500/30 flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-danger-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{product.name}</div>
                                                        <div className="text-xs text-slate-500">{product.provider_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-400 border border-white/10 capitalize">
                                                    {product.category.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-primary-400" />
                                                    <span className="font-medium text-white">{product.trust_score || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {product.verification_status === 'verified' ? (
                                                        <><CheckCircle2 className="w-4 h-4 text-primary-400" /><span className="text-primary-400 text-sm">Verified</span></>
                                                    ) : product.verification_status === 'discrepancy' ? (
                                                        <><AlertTriangle className="w-4 h-4 text-accent-400" /><span className="text-accent-400 text-sm">Review</span></>
                                                    ) : (
                                                        <><RefreshCcw className="w-4 h-4 text-slate-500" /><span className="text-slate-500 text-sm">Pending</span></>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleMutation.mutate({ id: product.id, isActive: !product.is_active })}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        product.is_active 
                                                            ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30' 
                                                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                                    }`}
                                                >
                                                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    {(product as any).canonical_url && (
                                                        <a href={(product as any).canonical_url} target="_blank" rel="noopener noreferrer">
                                                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </button>
                                                        </a>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 hover:bg-danger-500/20 rounded-lg text-slate-400 hover:text-danger-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </ContentSection>
            </div>
        </AdminLayout>
    );
}
