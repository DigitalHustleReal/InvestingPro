
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
    Save, 
    ArrowLeft,
    AlertCircle,
    Globe,
    Calendar,
    Plus,
    Trash2,
    Link as LinkIcon,
    List,
    Star
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
        rating: product?.rating || 4.5,
        affiliate_link: product?.affiliate_link || '',
        official_link: product?.official_link || '',
        pros: product?.pros || [''],
        cons: product?.cons || [''],
        features: product?.features || {}
    });

    // Local state for Features Key-Value editor
    const [featureList, setFeatureList] = useState<{key: string, value: string}[]>(
        Object.entries(product?.features || {}).map(([key, value]) => ({ key, value: String(value) }))
    );
    if (featureList.length === 0) setFeatureList([{ key: '', value: '' }]);

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-generate slug
    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: isEditing ? prev.slug : productService.generateSlug(name)
        }));
    };

    const handleProviderChange = (provider_name: string) => {
        setFormData(prev => ({
            ...prev,
            provider_name,
            provider_slug: productService.generateSlug(provider_name)
        }));
    };

    // Pros/Cons Handlers
    const updateListItem = (field: 'pros' | 'cons', index: number, value: string) => {
        const newList = [...formData[field]];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field: 'pros' | 'cons') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeListItem = (field: 'pros' | 'cons', index: number) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    // Features Handlers
    const updateFeature = (index: number, field: 'key' | 'value', val: string) => {
        const newList = [...featureList];
        newList[index][field] = val;
        setFeatureList(newList);
    };

    const addFeature = () => {
        setFeatureList(prev => [...prev, { key: '', value: '' }]);
    };

    const removeFeature = (index: number) => {
        setFeatureList(prev => prev.filter((_, i) => i !== index));
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
            // Convert featureList back to object
            const featuresObj: Record<string, string> = {};
            featureList.forEach(item => {
                if (item.key.trim()) featuresObj[item.key.trim()] = item.value;
            });

            // Filter empty pros/cons
            const cleanData = {
                ...formData,
                pros: formData.pros.filter(p => p.trim()),
                cons: formData.cons.filter(c => c.trim()),
                features: featuresObj
            };

            let result: Product;
            if (isEditing && product?.id) {
                result = await productService.updateProduct(product.id, cleanData);
                toast.success('Product updated successfully');
            } else {
                result = await productService.createProduct(cleanData);
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
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4 bg-slate-100 p-1">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details & Features</TabsTrigger>
                    <TabsTrigger value="links">Links & Affiliate</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Core Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
                                    <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className={errors.name ? 'border-danger-500' : ''} />
                                    {errors.name && <p className="text-danger-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">URL Slug *</label>
                                    <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} className={errors.slug ? 'border-danger-500' : ''} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                                    <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg">
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Provider Name *</label>
                                    <Input value={formData.provider_name} onChange={(e) => handleProviderChange(e.target.value)} className={errors.provider_name ? 'border-danger-500' : ''} />
                                </div>
                            </div>
                            
                            <div className="border-t pt-6 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Trust Score (0-100)</label>
                                    <Input type="number" min="0" max="100" value={formData.trust_score} onChange={(e) => setFormData(prev => ({ ...prev, trust_score: parseInt(e.target.value) || 0 }))} />
                                </div>
                                <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Verification Status</label>
                                     <select value={formData.verification_status} onChange={(e) => setFormData(prev => ({ ...prev, verification_status: e.target.value as any }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg">
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="discrepancy">Discrepancy</option>
                                        <option value="outdated">Outdated</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-8">
                                    <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                    <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active (Visible)</label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DETAILS & FEATURES */}
                <TabsContent value="details">
                     <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Star className="w-5 h-5 text-accent-500"/> Ratings & Pros/Cons</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Overall Rating (0-5)</label>
                                     <Input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))} className="max-w-[150px]" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-sm font-medium text-slate-700">Pros</label>
                                            <Button type="button" size="xs" variant="ghost" onClick={() => addListItem('pros')}><Plus className="w-3 h-3 mr-1"/> Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.pros.map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Input value={item} onChange={(e) => updateListItem('pros', idx, e.target.value)} placeholder="e.g. Low fees" />
                                                    <Button type="button" size="icon" variant="ghost" className="text-danger-500" onClick={() => removeListItem('pros', idx)}><Trash2 className="w-4 h-4"/></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-sm font-medium text-slate-700">Cons</label>
                                            <Button type="button" size="xs" variant="ghost" onClick={() => addListItem('cons')}><Plus className="w-3 h-3 mr-1"/> Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.cons.map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Input value={item} onChange={(e) => updateListItem('cons', idx, e.target.value)} placeholder="e.g. High penalty" />
                                                    <Button type="button" size="icon" variant="ghost" className="text-danger-500" onClick={() => removeListItem('cons', idx)}><Trash2 className="w-4 h-4"/></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                             <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><List className="w-5 h-5 text-primary-600"/> Key Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between mb-2">
                                        <p className="text-sm text-slate-500">Add key-value pairs for the feature grid (e.g. "Annual Fee": "₹500")</p>
                                        <Button type="button" size="sm" variant="outline" onClick={addFeature}><Plus className="w-3 h-3 mr-1"/> Add Feature</Button>
                                    </div>
                                    {featureList.map((feature, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <Input placeholder="Label (e.g. Returns)" value={feature.key} onChange={(e) => updateFeature(idx, 'key', e.target.value)} className="flex-1" />
                                            <Input placeholder="Value (e.g. 12% p.a.)" value={feature.value} onChange={(e) => updateFeature(idx, 'value', e.target.value)} className="flex-1" />
                                            <Button type="button" size="icon" variant="ghost" className="text-danger-500" onClick={() => removeFeature(idx)}><Trash2 className="w-4 h-4"/></Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* LINKS */}
                <TabsContent value="links">
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Affiliate & Official Links</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Affiliate Link (Tracking)</label>
                                <Input value={formData.affiliate_link} onChange={(e) => setFormData(prev => ({ ...prev, affiliate_link: e.target.value }))} placeholder="https://..." />
                                <p className="text-xs text-slate-500 mt-1">This is the monetization link users will click.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Official Page URL (Non-Affiliate)</label>
                                <Input value={formData.official_link} onChange={(e) => setFormData(prev => ({ ...prev, official_link: e.target.value }))} placeholder="https://..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO */}
                <TabsContent value="seo">
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="w-5 h-5"/> SEO & Meta</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title</label>
                                <Input value={formData.meta_title} onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))} />
                                <p className="text-xs text-slate-500 mt-1">{formData.meta_title.length}/60</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
                                <textarea value={formData.meta_description} onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg" rows={3}/>
                                <p className="text-xs text-slate-500 mt-1">{formData.meta_description.length}/160</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Canonical URL</label>
                                <Input value={formData.canonical_url} onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t sticky bottom-0 bg-white/80 backdrop-blur p-4 z-10">
                <Link href="/admin/products">
                    <Button type="button" variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Cancel</Button>
                </Link>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
