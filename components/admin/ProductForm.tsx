"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Save, 
    X, 
    Plus, 
    Trash2, 
    ExternalLink,
    Image as ImageIcon,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { productService, Product, ProductCategory, ProductInput } from '@/lib/products/product-service';

interface ProductFormProps {
    product?: Product; // If provided, we're editing
    onSuccess?: (product: Product) => void;
    onCancel?: () => void;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
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
        category: product?.category || 'credit_card' as ProductCategory,
        provider_name: product?.provider_name || '',
        description: product?.description || '',
        image_url: product?.image_url || '',
        rating: product?.rating || 4.0,
        affiliate_link: product?.affiliate_link || '',
        official_link: product?.official_link || '',
        is_active: product?.is_active ?? true,
        trust_score: product?.trust_score || 0,
    });

    const [pros, setPros] = useState<string[]>(product?.pros || []);
    const [cons, setCons] = useState<string[]>(product?.cons || []);
    const [features, setFeatures] = useState<Record<string, string>>(
        product?.features as Record<string, string> || {}
    );
    const [newPro, setNewPro] = useState('');
    const [newCon, setNewCon] = useState('');
    const [newFeatureKey, setNewFeatureKey] = useState('');
    const [newFeatureValue, setNewFeatureValue] = useState('');
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

    const addPro = () => {
        if (newPro.trim()) {
            setPros([...pros, newPro.trim()]);
            setNewPro('');
        }
    };

    const addCon = () => {
        if (newCon.trim()) {
            setCons([...cons, newCon.trim()]);
            setNewCon('');
        }
    };

    const addFeature = () => {
        if (newFeatureKey.trim() && newFeatureValue.trim()) {
            setFeatures({ ...features, [newFeatureKey.trim()]: newFeatureValue.trim() });
            setNewFeatureKey('');
            setNewFeatureValue('');
        }
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!formData.name) errs.name = 'Name is required';
        if (!formData.slug) errs.slug = 'Slug is required';
        if (!formData.provider_name) errs.provider_name = 'Provider is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const input: ProductInput = {
                ...formData,
                pros,
                cons,
                features,
            };

            let result: Product;
            if (isEditing && product?.id) {
                result = await productService.updateProduct(product.id, input);
                toast.success('Product updated successfully');
            } else {
                result = await productService.createProduct(input);
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
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
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
                                onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
                                placeholder="e.g., HDFC Bank"
                                className={errors.provider_name ? 'border-red-500' : ''}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the product..."
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <ImageIcon className="w-4 h-4 inline mr-1" /> Image URL
                            </label>
                            <Input
                                value={formData.image_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Rating (1-5)
                            </label>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                step={0.1}
                                value={formData.rating}
                                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Links */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ExternalLink className="w-5 h-5" /> Links & Monetization
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Affiliate Link
                            </label>
                            <Input
                                value={formData.affiliate_link}
                                onChange={(e) => setFormData(prev => ({ ...prev, affiliate_link: e.target.value }))}
                                placeholder="https://affiliate.example.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Official Link
                            </label>
                            <Input
                                value={formData.official_link}
                                onChange={(e) => setFormData(prev => ({ ...prev, official_link: e.target.value }))}
                                placeholder="https://provider.com/product"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Trust Score (0-100)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={formData.trust_score}
                                onChange={(e) => setFormData(prev => ({ ...prev, trust_score: parseInt(e.target.value) }))}
                            />
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
                </CardContent>
            </Card>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Features (Key-Value)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(features).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="px-3 py-1.5 text-sm">
                                <span className="font-bold text-slate-700">{key}:</span>
                                <span className="ml-1">{value}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFeatures = { ...features };
                                        delete newFeatures[key];
                                        setFeatures(newFeatures);
                                    }}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <Input
                            value={newFeatureKey}
                            onChange={(e) => setNewFeatureKey(e.target.value)}
                            placeholder="Key (e.g., annual_fee)"
                            className="flex-1"
                        />
                        <Input
                            value={newFeatureValue}
                            onChange={(e) => setNewFeatureValue(e.target.value)}
                            placeholder="Value (e.g., ₹999)"
                            className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={addFeature}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-green-600">Pros ✓</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2">
                            {pros.map((pro, i) => (
                                <li key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                    <span className="flex-1 text-sm">{pro}</span>
                                    <button 
                                        type="button"
                                        onClick={() => setPros(pros.filter((_, idx) => idx !== i))}
                                        className="text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-2">
                            <Input
                                value={newPro}
                                onChange={(e) => setNewPro(e.target.value)}
                                placeholder="Add a pro..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                            />
                            <Button type="button" variant="outline" onClick={addPro}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-red-600">Cons ✗</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2">
                            {cons.map((con, i) => (
                                <li key={i} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                                    <span className="flex-1 text-sm">{con}</span>
                                    <button 
                                        type="button"
                                        onClick={() => setCons(cons.filter((_, idx) => idx !== i))}
                                        className="text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-2">
                            <Input
                                value={newCon}
                                onChange={(e) => setNewCon(e.target.value)}
                                placeholder="Add a con..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                            />
                            <Button type="button" variant="outline" onClick={addCon}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onCancel?.() || router.push('/admin/products')}
                >
                    Cancel
                </Button>
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
