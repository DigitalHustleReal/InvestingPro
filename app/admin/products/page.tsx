"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

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
            productService.toggleProductActive(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success('Product status updated');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update product');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success('Product deleted');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete product');
        }
    });

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.provider_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'discrepancy': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            default: return <RefreshCcw className="w-4 h-4 text-slate-300" />;
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Product Database</h1>
                        <p className="text-slate-500">Manage affiliate products and verification status</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => refetch()}>
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Link href="/admin/products/new">
                            <Button className="bg-teal-600 hover:bg-teal-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <Button
                            key={cat.value}
                            variant={selectedCategory === cat.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.value)}
                            className={selectedCategory === cat.value ? "bg-teal-600" : ""}
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        className="w-full pl-10 pr-4 py-2 border rounded-xl"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-slate-900">{products.length}</div>
                        <div className="text-sm text-slate-500">Total Products</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-green-600">{products.filter(p => p.is_active).length}</div>
                        <div className="text-sm text-slate-500">Active</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{products.filter(p => p.verification_status === 'verified').length}</div>
                        <div className="text-sm text-slate-500">Verified</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-amber-600">{products.filter(p => p.verification_status === 'discrepancy').length}</div>
                        <div className="text-sm text-slate-500">Needs Review</div>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Trust Score</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Active</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-10 text-center text-slate-400">Loading products...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan={6} className="p-10 text-center text-slate-400">No products found</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} className={`hover:bg-slate-50 ${!product.is_active ? 'opacity-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{product.name}</div>
                                                        <div className="text-xs text-slate-500">{product.provider_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="capitalize">
                                                    {product.category.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4 text-teal-500" />
                                                    <span className="font-medium">{product.trust_score || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(product.verification_status || 'pending')}
                                                    <span className="text-sm capitalize">{product.verification_status || 'Pending'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleMutation.mutate({ id: product.id, isActive: !product.is_active })}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        product.is_active 
                                                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    {product.canonical_url && (
                                                        <a href={product.canonical_url} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="ghost" size="sm">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}

