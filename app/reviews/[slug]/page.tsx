
import React from 'react';
import { productService } from '@/lib/products/product-service';
import SEOHead from '@/components/common/SEOHead';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug }  = await params;
    const product = await productService.getProductBySlug(slug);
    if (!product) return {};
    return {
        title: `${product.name} Review 2026 | InvestingPro`,
        description: product.description
    };
}

export default async function ProductReviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-400">Product Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead title={`${product.name} Review`} description={product.description} />
            
            {/* Hero */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                     <div className="flex flex-col md:flex-row items-start gap-8">
                         <div className="shrink-0 w-48 h-32 bg-slate-50 rounded-lg p-4 flex items-center justify-center border border-slate-100">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain" />
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                 <Badge>{product.category.replace('_', ' ')}</Badge>
                                 <Badge variant="secondary">{product.provider_name}</Badge>
                             </div>
                             <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name} Review</h1>
                             <p className="text-lg text-slate-600 mb-4">{product.description}</p>
                             <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold">
                                     <Star className="w-4 h-4 fill-current" />
                                     {product.rating}/5
                                 </div>
                                 <Link href={product.affiliate_link || '#'}>
                                     <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
                                         Visit Site <ExternalLink className="w-4 h-4" />
                                     </Button>
                                 </Link>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Pros & Cons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-lg mb-4 text-teal-700 flex items-center gap-2">
                                    <Check className="w-5 h-5 bg-teal-100 rounded-full p-1" /> Pros
                                </h3>
                                <ul className="space-y-3">
                                    {product.pros.map(pro => (
                                        <li key={pro} className="text-slate-700 text-sm flex gap-2">
                                            <span className="text-teal-500">•</span> {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-lg mb-4 text-rose-700 flex items-center gap-2">
                                    <X className="w-5 h-5 bg-rose-100 rounded-full p-1" /> Cons
                                </h3>
                                <ul className="space-y-3">
                                    {product.cons.map(con => (
                                        <li key={con} className="text-slate-700 text-sm flex gap-2">
                                            <span className="text-rose-500">•</span> {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Features Table */}
                        <div className="bg-white p-8 rounded-xl border border-slate-200">
                            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {Object.entries(product.features).map(([key, value]) => (
                                    <div key={key} className="border-b border-slate-100 pb-2">
                                        <p className="text-sm text-slate-500 capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                                        <p className="font-semibold text-slate-800">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-xl p-6 text-white text-center">
                            <h3 className="font-bold text-xl mb-2">Ready to Apply?</h3>
                            <p className="text-teal-100 mb-6 text-sm">Get exclusive benefits when you apply through InvestingPro.</p>
                            <Link href={product.affiliate_link || '#'}>
                                <Button size="lg" className="w-full bg-white text-teal-700 hover:bg-teal-50">
                                    Apply Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
