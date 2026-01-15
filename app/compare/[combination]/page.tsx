import React from 'react';
import { productService } from '@/lib/products/product-service';
import { getComparisonVerdict } from '@/lib/products/comparison-service';
import { createServiceClient } from '@/lib/supabase/service';
import SEOHead from '@/components/common/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, ShieldCheck, ArrowLeftRight, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ComparisonPDFButton from '@/components/products/ComparisonPDFButton';

export default async function VersusPage({ 
    params 
}: { 
    params: Promise<{ combination: string }> 
}) {
    const { combination } = await params;
    
    // 1. Parse URL Segment (e.g. hdfc-regalia-vs-axis-magnus)
    const parts = combination.split('-vs-');
    if (parts.length !== 2) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                <h1 className="text-xl font-bold mb-2">Invalid Comparison</h1>
                <p className="text-slate-500 mb-6">Please use the format: /compare/product-a-vs-product-b</p>
                <Link href="/products"><Button>Browse Products</Button></Link>
            </div>
        );
    }

    // 2. Check if we have pre-generated content (Programmatic SEO)
    const supabase = createServiceClient();
    const { data: versusPage } = await supabase
        .from('versus_pages')
        .select('*')
        .eq('slug', combination)
        .single();

    let verdict = '';
    let p1: any, p2: any;
    let isProgrammatic = false;

    if (versusPage) {
        // Use pre-generated content
        isProgrammatic = true;
        verdict = versusPage.verdict;
        
        // Fetch products
        [p1, p2] = await Promise.all([
            productService.getProductBySlug(versusPage.product1_id),
            productService.getProductBySlug(versusPage.product2_id)
        ]);
        
        // Update view count
        await supabase
            .from('versus_pages')
            .update({ 
                view_count: (versusPage.view_count || 0) + 1,
                last_viewed_at: new Date().toISOString()
            })
            .eq('id', versusPage.id);
    } else {
        // Generate on-the-fly (fallback)
        [p1, p2] = await Promise.all([
            productService.getProductBySlug(parts[0]),
            productService.getProductBySlug(parts[1])
        ]);

        if (!p1 || !p2) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <X className="w-12 h-12 text-danger-300 mb-4" />
                    <h1 className="text-xl font-bold mb-2">Product Not Found</h1>
                    <p className="text-slate-500 mb-6">One or both products don't exist in our database.</p>
                    <Link href="/products"><Button>Go Back</Button></Link>
                </div>
            );
        }

        // Category safety check
        if (p1.category !== p2.category) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
                    <h1 className="text-xl font-bold mb-2">Incompatible Comparison</h1>
                    <p className="text-slate-500 mb-6">
                        Comparing a <strong>{p1.category.replace('_', ' ')}</strong> with a <strong>{p2.category.replace('_', ' ')}</strong> isn't helpful.
                    </p>
                    <Link href="/products"><Button variant="outline">Browse {p1.category.replace('_', ' ')}s</Button></Link>
                </div>
            );
        }

        // Generate AI verdict on-the-fly
        verdict = await getComparisonVerdict(p1, p2);
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <SEOHead 
                title={versusPage?.title || `${p1.name} vs ${p2.name} Comparison (2026): Which is better?`}
                description={versusPage?.meta_description || `Side-by-side comparison of ${p1.name} and ${p2.name}. Features, fees, rewards, and expert verdict.`}
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 sm:gap-12 mb-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-center">
                                <img src={p1.image_url} alt={p1.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className="font-bold text-sm text-slate-700">{p1.name}</span>
                        </div>
                        
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center shadow-inner">
                            <ArrowLeftRight className="w-5 h-5 text-slate-500" />
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-center">
                                <img src={p2.image_url} alt={p2.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className="font-bold text-sm text-slate-700">{p2.name}</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                        {p1.name} vs {p2.name}
                    </h1>
                    <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                         <Badge className="bg-teal-50 text-teal-700 border-teal-100 px-3">
                            Category: {p1.category.replace('_', ' ')}
                         </Badge>
                         {isProgrammatic && (
                            <Badge className="bg-primary-50 text-primary-700 border-primary-100 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Programmatic SEO
                            </Badge>
                         )}
                         <Badge variant="outline" className="text-slate-400">
                            Updated {new Date().toLocaleDateString()}
                         </Badge>
                         <ComparisonPDFButton 
                            targetId="versus-report" 
                            productNames={[p1.name, p2.name]} 
                         />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="versus-report">
                    {/* Verdict Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-8 h-8 text-teal-600 p-1 bg-teal-50 rounded-lg" />
                                <h2 className="text-2xl font-bold text-slate-900">The InvestingPro Verdict</h2>
                            </div>
                            <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-strong:text-teal-700 leading-relaxed">
                                <ReactMarkdown>{verdict}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Mobile Specs */}
                        <div className="lg:hidden space-y-6">
                            <ProductSpecs p={p1} />
                            <ProductSpecs p={p2} />
                        </div>
                    </div>

                    {/* Sidebar Specs (Desktop) */}
                    <div className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">
                        <ProductSpecs p={p1} />
                        <ProductSpecs p={p2} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductSpecs({ p }: { p: any }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" /> {p.name}
            </h3>
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(p.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold">{p.rating}/5</span>
                </div>
                
                {Object.entries(p.features || {}).slice(0, 6).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-sm text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold">{val as string}</span>
                    </div>
                ))}
                
                <div className="pt-4">
                    <Link href={p.official_link || '#'} target="_blank">
                        <Button className="w-full bg-teal-600">Apply for {p.provider_name}</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
