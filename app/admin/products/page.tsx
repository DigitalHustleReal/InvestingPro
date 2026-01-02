"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Package, 
    Plus, 
    Search, 
    RefreshCcw, 
    ExternalLink, 
    MoreVertical, 
    Edit, 
    Trash2,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: () => productService.getProducts()
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

    return (
        <AdminLayout>
            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Product Database</h1>
                        <p className="text-slate-500">Manage affiliate products and verification status</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => toast.info("Run 'npx tsx scripts/fact-check-products.ts' to update status")}>
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Run Audit
                        </Button>
                        <Button className="bg-teal-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        className="w-full pl-10 pr-4 py-2 border rounded-xl"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Last Verified</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">Loading products...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">No products found</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image_url} className="w-10 h-10 object-contain rounded border p-1" />
                                                    <div>
                                                        <div className="font-bold text-slate-900">{product.name}</div>
                                                        <div className="text-xs text-slate-500">{product.provider_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary">{product.category.replace('_', ' ')}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(product.verification_status || 'pending')}
                                                    <span className="text-sm capitalize">{product.verification_status || 'Pending'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {product.last_verified_at ? formatDistanceToNow(new Date(product.last_verified_at), { addSuffix: true }) : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
