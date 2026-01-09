import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface ProductData {
    id: string;
    name: string; // e.g., "HDFC Regalia Gold"
    image: string;
    rating: number;
    points: {
        label: string;
        value: string | boolean; // "₹2,500" or true/false
        isFeature?: boolean; // Checks/X support
    }[];
    ctaLink: string;
}

interface ComparisonTableProps {
    title?: string;
    products: ProductData[];
}

export default function ComparisonTable({ title = "Side-by-Side Comparison", products }: ComparisonTableProps) {
    // Extract unique labels in order
    const labels = products[0]?.points.map(p => p.label) || [];

    return (
        <div className="my-10 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {title && (
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                </div>
            )}
            
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-slate-100 bg-white w-1/4 min-w-[150px]"></th>
                            {products.map((product) => (
                                <th key={product.id} className="p-4 border-b border-slate-100 bg-white w-1/3 min-w-[200px] text-center align-bottom">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative w-24 h-16">
                                            <Image 
                                                src={product.image} 
                                                alt={product.name} 
                                                fill 
                                                className="object-contain" 
                                            />
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 leading-tight px-2">
                                            {product.name}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-bold bg-secondary-100 text-secondary-700 px-1.5 py-0.5 rounded">
                                                {product.rating}/10
                                            </span>
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {labels.map((label, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                <td className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                                    {label}
                                </td>
                                {products.map((product) => {
                                    const point = product.points.find(p => p.label === label);
                                    if (!point) return <td key={product.id} className="border-b border-slate-100" />;

                                    return (
                                        <td key={product.id} className="p-4 border-b border-slate-100 text-center text-sm font-medium text-slate-900">
                                            {typeof point.value === 'boolean' ? (
                                                point.value ? (
                                                    <Check className="w-5 h-5 text-primary-500 mx-auto" />
                                                ) : (
                                                    <Minus className="w-5 h-5 text-slate-300 mx-auto" />
                                                )
                                            ) : (
                                                <span>{point.value}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {/* CTA Row */}
                        <tr>
                            <td className="p-4 bg-white border-none"></td>
                            {products.map((product) => (
                                <td key={product.id} className="p-4 bg-white border-none text-center pb-6">
                                    <Button size="sm" className="w-full bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm">
                                        Check Eligibility
                                    </Button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
