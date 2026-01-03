"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Save, 
    ArrowLeft,
    AlertCircle,
    Globe,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { productService, Product } from '@/lib/products/product-service';
import Link from 'next/link';

interface ProductFormProps {
    product?: Product;
    onSuccess?: (product: Product) => void;
    onCancel?: () => void;
}

const CATEGORIES = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'mutual_fund', label: 'Mutual Fund' },
    { value: 'loan', label: 'Loan' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'broker', label: 'Broker' },
];

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
    const router = useRouter();
    const isEditing = !!product;

    const [formData, setFormData] = useState({
        name: product?.name || '',
        slug: product?.slug || '',
        category: product?.category || 'credit_card',
        provider_name: product?.provider_name || '',
        provider_slug: product?.provider_slug || '',
        meta_title: product?.meta_title || '',
        meta_description: product?.meta_description || '',
        canonical_url: product?.canonical_url || '',
        launch_date: product?.launch_date || '',
        is_active: product?.is_active ?? true,
        trust_score: product?.trust_score || 0,
        verification_status: product?.verification_status || 'pending',
        verification_notes: product?.verification_notes || '',
    });

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: isEditing ? prev.slug : productService.generateSlug(name)
        }));
    };

    // Auto-generate provider_slug from provider_name
    const handleProviderChange = (provider_name: string) => {
        setFormData(prev => ({
            ...prev,
            provider_name,
            provider_slug: productService.generateSlug(provider_name)
        }));
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!formData.name) errs.name = 'Name is required';
        if (!formData.slug) errs.slug = 'Slug is required';
        if (!formData.provider_name) errs.provider_name = 'Provider is required';
        if (!formData.category) errs.category = 'Category is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            let result: Product;
            if (isEditing && product?.id) {
                result = await productService.updateProduct(product.id, formData);
                toast.success('Product updated successfully');
            } else {
                result = await productService.createProduct(formData);
                toast.success('Product created successfully');
            }

            onSuccess?.(result);
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Name *
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., HDFC Regalia Credit Card"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                URL Slug *
                            </label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="hdfc-regalia-credit-card"
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Provider Name *
                            </label>
                            <Input
                                value={formData.provider_name}
                                onChange={(e) => handleProviderChange(e.target.value)}
                                placeholder="e.g., HDFC Bank"
                                className={errors.provider_name ? 'border-red-500' : ''}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Provider Slug
                            </label>
                            <Input
                                value={formData.provider_slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, provider_slug: e.target.value }))}
                                placeholder="hdfc-bank"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" /> Launch Date
                            </label>
                            <Input
                                type="date"
                                value={formData.launch_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, launch_date: e.target.value }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SEO & Meta */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5" /> SEO & Meta
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Meta Title
                        </label>
                        <Input
                            value={formData.meta_title}
                            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                            placeholder="SEO title for this product page"
                        />
                        <p className="text-xs text-slate-500 mt-1">{formData.meta_title.length}/60 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Meta Description
                        </label>
                        <textarea
                            value={formData.meta_description}
                            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                            placeholder="SEO description for search engines..."
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">{formData.meta_description.length}/160 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Canonical URL
                        </label>
                        <Input
                            value={formData.canonical_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                            placeholder="https://investingpro.in/products/..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Status & Trust */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Status & Trust</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Trust Score (0-100)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={formData.trust_score}
                                onChange={(e) => setFormData(prev => ({ ...prev, trust_score: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Verification Status
                            </label>
                            <select
                                value={formData.verification_status}
                                onChange={(e) => setFormData(prev => ({ ...prev, verification_status: e.target.value as 'pending' | 'verified' | 'discrepancy' | 'outdated' }))}
                                className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="discrepancy">Discrepancy</option>
                                <option value="outdated">Outdated</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 pt-8">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                                Active (visible to public)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Verification Notes
                        </label>
                        <textarea
                            value={formData.verification_notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, verification_notes: e.target.value }))}
                            placeholder="Internal notes about verification..."
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href="/admin/products">
                    <Button type="button" variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                </Link>
                <Button 
                    type="submit" 
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={saving}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
