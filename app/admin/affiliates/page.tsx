"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, DollarSign, TrendingUp, MousePointerClick } from 'lucide-react';
import Link from 'next/link';

export default function AffiliatesPage() {
    const { data: affiliateProducts = [], isLoading } = useQuery({
        queryKey: ['affiliateProducts'],
        queryFn: () => api.entities.AffiliateProduct.list(),
        initialData: []
    });

    const totalClicks = affiliateProducts.reduce((sum: number, p: any) => sum + (p.clicks || 0), 0);
    const totalConversions = affiliateProducts.reduce((sum: number, p: any) => sum + (p.conversions || 0), 0);
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Affiliate Products</h1>
                            <p className="text-sm text-slate-600 mt-1">Manage monetizable affiliate products</p>
                        </div>
                        <Button className="bg-teal-600 hover:bg-teal-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Total Products</p>
                                        <p className="text-2xl font-bold text-slate-900">{affiliateProducts.length}</p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-emerald-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Total Clicks</p>
                                        <p className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</p>
                                    </div>
                                    <MousePointerClick className="w-8 h-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Conversion Rate</p>
                                        <p className="text-2xl font-bold text-slate-900">{conversionRate}%</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products List */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading...</p>
                        </div>
                    ) : affiliateProducts.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No affiliate products</h3>
                                <p className="text-slate-600 mb-4">Get started by adding your first affiliate product</p>
                                <Button className="bg-teal-600 hover:bg-teal-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {affiliateProducts.map((product: any) => (
                                <Card key={product.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                                                    <Badge className={
                                                        product.status === 'active' 
                                                            ? 'bg-emerald-100 text-emerald-700' 
                                                            : 'bg-slate-100 text-slate-700'
                                                    }>
                                                        {product.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">{product.company}</p>
                                                <div className="flex items-center gap-6 text-sm">
                                                    <span className="text-slate-600">
                                                        <span className="font-medium">{product.clicks || 0}</span> clicks
                                                    </span>
                                                    <span className="text-slate-600">
                                                        <span className="font-medium">{product.conversions || 0}</span> conversions
                                                    </span>
                                                    <span className="text-slate-600">
                                                        Type: <span className="font-medium">{product.type}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
