'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompare } from '@/contexts/CompareContext';
import { RichProduct } from '@/types/rich-product';
import SEOHead from '@/components/common/SEOHead';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { ProductSelector } from '@/components/compare/ProductSelector';
import { 
    X, 
    Check, 
    Minus, 
    ArrowLeft, 
    Share2, 
    Sparkles, 
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ComparisonPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { selectedProducts, addProduct, removeProduct, clearAll } = useCompare();
    const [products, setProducts] = useState<RichProduct[]>([]);
    const [loading, setLoading] = useState(true);
    
    const MAX_PRODUCTS = 4;
    const showAddButton = products.length < MAX_PRODUCTS;

    // Feature differences highlighting toggle
    const [highlightDiff, setHighlightDiff] = useState(true);
    const [hideIdentical, setHideIdentical] = useState(false);

    // Initialize products from URL or Context
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const slugs = searchParams.get('products')?.split(',') || [];
            
            // If URL has slugs, fetch them (shareable link scenario)
            if (slugs.length > 0) {
                try {
                    // Fallback: If context has products, use them to avoid refetching
                    if (selectedProducts.length > 0 && selectedProducts.every(p => slugs.includes(p.slug))) {
                         setProducts(selectedProducts);
                    } else {
                         if (selectedProducts.length === 0) {
                             // Placeholder for empty context but URL params present
                         } else {
                             setProducts(selectedProducts);
                         }
                    }
                } catch (error) {
                    console.error("Failed to load products", error);
                }
            } else if (selectedProducts.length > 0) {
                // If no URL params but context has products, update URL
                const newSlugs = selectedProducts.map(p => p.slug).join(',');
                router.replace(`/compare?products=${newSlugs}`);
                setProducts(selectedProducts);
            }
            setLoading(false);
        };

        loadProducts();
    }, [searchParams, selectedProducts, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-12 px-4 text-center">
                 <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Products Selected</h1>
                    <p className="text-slate-500 mb-8">Select products from any category to start comparing them side-by-side.</p>
                    <Link href="/credit-cards">
                        <Button className="bg-primary-600 hover:bg-secondary-600 text-white rounded-xl">
                            Browse Products
                        </Button>
                    </Link>
                 </div>
            </div>
        );
    }

    // Determine Comparison Config based on Category of first product
    const category = products[0]?.category || 'product';
    const config = getComparisonConfig(category);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead 
                title={`Compare ${products.length} Products | InvestingPro`} 
                description="Side-by-side spec comparison" 
            />

            {/* Header Actions */}
            <div className="sticky top-[72px] z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Compare {products.length} Items 
                            <span className="text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-full capitalize">
                                {category.replace('_', ' ')}
                            </span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* View Options */}
                         <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                            <button 
                                onClick={() => setHighlightDiff(!highlightDiff)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${highlightDiff ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600' : 'text-slate-500'}`}
                            >
                                Highlight Diffs
                            </button>
                            <button 
                                onClick={() => setHideIdentical(!hideIdentical)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${hideIdentical ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600' : 'text-slate-500'}`}
                            >
                                Hide Identical
                            </button>
                         </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

                        <Button variant="outline" size="sm" onClick={clearAll} className="h-9 text-xs">
                             <X className="w-3.5 h-3.5 mr-1.5" /> Clear
                        </Button>
                        <Button className="h-9 text-xs bg-primary-600 hover:bg-secondary-600 text-white">
                             <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                
                {/* 1. Mobile/Tablet "Card-Flipped" View (Stacked logic for small screens) */}
                <div className="lg:hidden space-y-8">
                    {/* Sticky Product Cards for reference */}
                    <div className="sticky top-[132px] z-20 flex gap-2 overflow-x-auto pb-4 pt-2 -mx-4 px-4 bg-slate-50 dark:bg-slate-950 shadow-sm scrollbar-hide">
                        {products.map(product => (
                            <div key={product.id} className="min-w-[140px] p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                                <div className="h-10 w-full relative mb-2">
                                    <Image 
                                        src={product.image_url || '/images/placeholder.png'} 
                                        alt={product.name} 
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h4 className="text-[10px] font-bold text-slate-900 dark:text-white line-clamp-1 text-center">{product.name}</h4>
                            </div>
                        ))}
                    </div>

                    {config.sections.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-950/30 px-3 py-1 rounded-full inline-block">{section.title}</h3>
                            <div className="space-y-4">
                                {section.fields.map(field => {
                                    const values = products.map(p => getFieldValue(p, field.key));
                                    const isIdentical = values.length > 1 && values.every(v => v === values[0]);
                                    if (hideIdentical && isIdentical) return null;

                                    return (
                                        <div key={field.key} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{field.label}</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {products.map((product, pIdx) => {
                                                    const value = getFieldValue(product, field.key);
                                                    return (
                                                        <div key={product.id} className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{product.provider_name}</span>
                                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {renderCell(value, field.type, false)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Desktop Standard Comparison Table */}
                <div className="hidden lg:block overflow-x-auto pb-12">
                    <table className="w-full min-w-[800px] border-collapse">
                        {/* thead remains as updated previously */}
                        {/* 1. Product Headers (Sticky) */}
                        <thead className="sticky top-[132px] z-30 bg-slate-50 dark:bg-slate-950 shadow-sm">
                            <tr>
                                <th className="w-[200px] p-4 text-left align-bottom bg-slate-50 dark:bg-slate-950 sticky left-0 z-40 border-b border-slate-200 dark:border-slate-800">
                                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Features</span>
                                </th>
                                {products.map(product => (
                                    <th key={product.id} className="w-[280px] p-4 align-top bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                        <div className="relative group">
                                            <button 
                                                onClick={() => {
                                                    removeProduct(product.id);
                                                    const newProds = products.filter(p => p.id !== product.id);
                                                    setProducts(newProds);
                                                    if (newProds.length === 0) {
                                                        router.replace('/compare');
                                                    } else {
                                                        const slugs = newProds.map(p => p.slug).join(',');
                                                        router.replace(`/compare?products=${slugs}`);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                            </button>

                                            <div className="h-32 flex items-center justify-center mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                                <Image 
                                                    src={product.image_url || '/images/placeholder.png'} 
                                                    alt={product.name} 
                                                    width={100} 
                                                    height={100} 
                                                    className="object-contain max-h-full"
                                                />
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 min-h-[3rem]">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-1 mb-4">
                                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 hover:bg-primary-50 border-0 text-[10px]">
                                                    {product.rating.overall} â˜…
                                                </Badge>
                                                <span className="text-xs text-slate-500">{product.provider_name}</span>
                                            </div>
                                            <Link href={product.affiliate_link ||  product.official_link || '#'}>
                                                <Button size="sm" className="w-full bg-primary-600 hover:bg-secondary-600 text-white rounded-lg">
                                                    Apply Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                                {/* Add Button Column */}
                                {showAddButton && (
                                    <th className="w-[280px] p-4 align-top bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                        <ProductSelector 
                                            category={products[0]?.category}
                                            excludeIds={products.map(p => p.id)}
                                            onSelect={(product) => {
                                                addProduct(product);
                                                const newProds = [...products, product];
                                                setProducts(newProds);
                                                const slugs = newProds.map(p => p.slug).join(',');
                                                router.replace(`/compare?products=${slugs}`);
                                            }}
                                        />
                                    </th>
                                )}
                            </tr>
                        </thead>

                        {/* 2. Feature Rows */}
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {config.sections.map((section) => (
                                <React.Fragment key={section.title}>
                                    <tr className="bg-slate-100/50 dark:bg-slate-900/50">
                                        <td colSpan={products.length + (showAddButton ? 2 : 1)} className="p-3 text-xs font-bold uppercase tracking-wider text-slate-500 sticky left-0">
                                            {section.title}
                                        </td>
                                    </tr>
                                    {section.fields.map(field => {
                                        // Check for differences
                                        const values = products.map(p => getFieldValue(p, field.key));
                                        const isIdentical = values.length > 1 && values.every(v => v === values[0]);
                                        
                                        if (hideIdentical && isIdentical) return null;

                                        return (
                                            <tr key={field.key} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                                <td className="p-4 py-6 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 sticky left-0 z-10 border-r border-slate-100 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-900/30">
                                                    {field.label}
                                                    {field.help && <AlertCircle className="w-3 h-3 inline ml-1 text-slate-300" />}
                                                </td>
                                                {products.map((product) => {
                                                    const value = getFieldValue(product, field.key);
                                                    const isBest = highlightDiff && !isIdentical && field.highlight === 'high' 
                                                        ? isHighestValue(value, values) 
                                                        : highlightDiff && !isIdentical && field.highlight === 'low'
                                                            ? isLowestValue(value, values)
                                                            : false;

                                                    return (
                                                        <td key={`${product.id}-${field.key}`} className={`p-4 align-top text-sm border-r border-slate-50 dark:border-slate-900 text-center ${isBest ? 'bg-success-50/50 dark:bg-success-900/10' : ''}`}>
                                                            {renderCell(value, field.type, isBest)}
                                                        </td>
                                                    );
                                                })}
                                                {/* Empty cell for Add column */}
                                                {showAddButton && <td className="p-4 border-r border-slate-50 dark:border-slate-900"></td>}
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Helper Types & Functions ---

type FieldType = 'text' | 'currency' | 'percent' | 'boolean' | 'list';
type HighlightType = 'high' | 'low' | 'none';

interface ComparisonField {
    key: string;
    label: string;
    type: FieldType;
    highlight?: HighlightType;
    help?: string;
}

interface Section {
    title: string;
    fields: ComparisonField[];
}

interface Config {
    sections: Section[];
}

// Accessor Logic
// Accessor Logic
function getFieldValue(product: RichProduct | any, key: string): any {
    // Check direct property first
    if ((product as any)[key] !== undefined) return (product as any)[key];
    // Check features object
    if (product.features && (product.features as any)[key] !== undefined) return (product.features as any)[key];
    // Check key_features array
    const kf = product.key_features?.find((f: any) => f.label === key);
    if (kf) return kf.value;
    
    return '--';
}

function renderCell(value: any, type: FieldType, isBest: boolean) {
    if (value === '--' || value === null || value === undefined) 
        return <span className="text-slate-300">-</span>;

    const content = () => {
        switch (type) {
            case 'boolean':
                return value === true || value === 'Yes' ? <Check className="w-5 h-5 text-success-500 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
            case 'list':
                if (Array.isArray(value)) return <ul className="text-left list-disc list-inside text-xs space-y-1">{value.map((v: any, i: number) => <li key={i}>{v}</li>)}</ul>;
                return <span className="text-sm">{String(value)}</span>;
            case 'currency':
                return <span className="font-semibold">{String(value)}</span>; // TODO: format currency
            default:
                return <span className="text-slate-700 dark:text-slate-300 leading-relaxed block max-w-[250px] mx-auto">{String(value)}</span>;
        }
    };

    return (
        <div className={`relative ${isBest ? 'text-success-700 dark:text-success-400 font-medium' : ''}`}>
            {content()}
            {isBest && <Badge className="absolute -top-3 -right-2 scale-[0.7] bg-success-100 text-success-700 border-0">Winner</Badge>}
        </div>
    );
}

// Simple winner logic (can be expanded)
function isHighestValue(val: any, allVals: any[]): boolean {
    // Attempt parse float
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return false;
    const allNums = allVals.map(v => parseFloat(String(v).replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
    return num === Math.max(...allNums) && allNums.length > 1 && new Set(allNums).size > 1;
}

function isLowestValue(val: any, allVals: any[]): boolean {
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return false;
    const allNums = allVals.map(v => parseFloat(String(v).replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
    return num === Math.min(...allNums) && allNums.length > 1 && new Set(allNums).size > 1;
}

// Configurations per category
function getComparisonConfig(category: string): Config {
    // Default fallback
    const defaults = {
        sections: [
            {
                title: 'Overview',
                fields: [
                    { key: 'annual_fee', label: 'Annual Fee', type: 'text', highlight: 'low' },
                    { key: 'joining_fee', label: 'Joining Fee', type: 'text', highlight: 'low' },
                ] as ComparisonField[]
            }
        ]
    };

    if (category === 'credit_card') {
        return {
            sections: [
                {
                    title: 'Fees & Charges',
                    fields: [
                        { key: 'Annual Fee', label: 'Annual Fee', type: 'text', highlight: 'low' },
                        { key: 'Joining Fee', label: 'Joining Fee', type: 'text', highlight: 'low' },
                        { key: 'Forex Markup', label: 'Forex Markup', type: 'percent', highlight: 'low' },
                    ]
                },
                {
                    title: 'Rewards',
                    fields: [
                        { key: 'Reward Rate', label: 'Reward Rate', type: 'percent', highlight: 'high' },
                        { key: 'welcome_benefits', label: 'Welcome Bonus', type: 'text' },
                    ]
                }
            ]
        };
    }
    
    if (category === 'loan') {
        return {
            sections: [
                {
                    title: 'Loan Details',
                    fields: [
                        { key: 'interest_rate', label: 'Interest Rate', type: 'percent', highlight: 'low' },
                        { key: 'processing_fee', label: 'Processing Fee', type: 'text', highlight: 'low' },
                        { key: 'max_loan_amount', label: 'Max Amount', type: 'currency', highlight: 'high' },
                        { key: 'tenure', label: 'Max Tenure', type: 'text', highlight: 'high' },
                    ]
                }
            ]
        };
    }

    if (category === 'insurance') {
        return {
            sections: [
                {
                    title: 'Policy Features',
                    fields: [
                         { key: 'premium', label: 'Monthly Premium', type: 'text', highlight: 'low' },
                        { key: 'coverage', label: 'Coverage Amount', type: 'currency', highlight: 'high' },
                        { key: 'claim_settlement_ratio', label: 'Claim Settlement', type: 'percent', highlight: 'high' },
                        { key: 'waiting_period', label: 'Waiting Period', type: 'text', highlight: 'low' },
                    ]
                }
            ]
        };
    }

    return defaults;
}
