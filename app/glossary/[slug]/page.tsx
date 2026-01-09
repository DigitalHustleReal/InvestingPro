"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { slugifyTerm } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { 
    BookOpen, 
    ArrowLeft, 
    Share2, 
    Printer, 
    TrendingUp, 
    PieChart, 
    Shield, 
    Landmark, 
    CreditCard, 
    Zap 
} from 'lucide-react';

// Re-using the config from main page (ideally would be shared constant)
const CATEGORY_CONFIG: Record<string, { icon: any, color: string, toolLink?: string, toolLabel?: string }> = {
    'Investing': { icon: TrendingUp, color: 'text-green-600 bg-green-50 dark:bg-green-900/20', toolLink: '/investing', toolLabel: 'Start Investing' },
    'Mutual Funds': { icon: PieChart, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20', toolLink: '/calculators', toolLabel: 'SIP Calculator' },
    'Insurance': { icon: Shield, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20', toolLink: '/insurance', toolLabel: 'Compare Plans' },
    'Loans': { icon: Landmark, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', toolLink: '/loans', toolLabel: 'Check Eligibility' },
    'Credit Cards': { icon: CreditCard, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', toolLink: '/credit-cards', toolLabel: 'Find Cards' },
    'Economy': { icon: Zap, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
    'Banking': { icon: Landmark, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
    'Taxation': { icon: BookOpen, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20', toolLink: '/calculators', toolLabel: 'Tax Calculator' }
};

interface GlossaryTerm {
    term: string;
    category: string;
    definition: string;
}

export default function GlossaryArticlePage({ params }: { params: { slug: string } }) {
    const [termData, setTermData] = useState<GlossaryTerm | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerm = async () => {
            setLoading(true);
            try {
                // Since we don't have a getBySlug endpoint yet, we list all and filter.
                // For <1000 terms this is negligible. 
                const allTerms: GlossaryTerm[] = await api.entities.Glossary.list();
                const matched = allTerms.find(t => slugifyTerm(t.term) === params.slug);
                
                if (matched) {
                    setTermData(matched);
                } else {
                    // Handle 404 state gracefully
                    setTermData(null);
                }
            } catch (e) {
                console.error("Failed to load term", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTerm();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!termData) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Term Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">The term you are looking for doesn't exist in our glossary.</p>
                <Link href="/glossary">
                    <Button>Return to Glossary</Button>
                </Link>
            </div>
        );
    }

    const categoryStyle = CATEGORY_CONFIG[termData.category] || { icon: BookOpen, color: 'text-slate-600 bg-slate-100' };
    const Icon = categoryStyle.icon;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
             {/* Progress Bar (Visual Only) */}
             <div className="h-1 bg-slate-100 dark:bg-slate-900 w-full fixed top-0 z-50">
                <div className="h-full bg-primary-500 w-1/3" /> 
             </div>

             <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link href="/glossary" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Knowledge Hub
                    </Link>
                </div>

                {/* Hero Header */}
                <header className="mb-12">
                    <div className="flex flex-wrap gap-3 items-center mb-6">
                        <Badge className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider ${categoryStyle.color}`}>
                            <Icon className="w-3.5 h-3.5 mr-1.5 inline-block" />
                            {termData.category}
                        </Badge>
                        <span className="text-slate-400 text-sm font-medium">Updated Jan 2026</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                        {termData.term}
                    </h1>

                    <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary-600">
                             <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                         <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary-600">
                             <Printer className="w-4 h-4 mr-2" /> Print
                        </Button>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Main Content */}
                    <main className="lg:col-span-2 space-y-12">
                        {/* Definition Box */}
                        <div className="text-xl md:text-2xl font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                            {termData.definition}
                        </div>

                        {/* Key Takeaways (Mocked for now) */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Zap className="w-5 h-5 text-amber-500 mr-2" />
                                Key Takeaways
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2.5 flex-shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Understanding <strong>{termData.term}</strong> is crucial for making informed financial decisions in the {termData.category} sector.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2.5 flex-shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        It directly impacts how you evaluate risk and potential returns.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2.5 flex-shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Always consult with a financial advisor to see how this applies to your specific portfolio.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Detailed Explanation Placeholder */}
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-4">Understanding {termData.term}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-7">
                                In the world of finance, {termData.term.toLowerCase()} plays a pivotal role. Whether you are a beginner looking to start your journey or an experienced investor, grasping this concept can significantly enhance your financial literacy.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 leading-7 mt-4">
                                Keep exploring our tools to see practical applications of {termData.term}. The more you understand the mechanics of {termData.category}, the better equipped you'll be to build long-term wealth.
                            </p>
                        </div>
                    </main>

                    {/* Sidebar / Tools */}
                    <aside className="space-y-8">
                        {/* Related Tool Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2" />
                            
                            <h3 className="text-xl font-bold mb-2">Put it into Practice</h3>
                            <p className="text-slate-300 text-sm mb-6">
                                Use our verified calculators to see how {termData.term} affects your money.
                            </p>

                            <Link href={categoryStyle.toolLink || '/calculators'}>
                                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold">
                                    {categoryStyle.toolLabel || 'Open Calculator'}
                                </Button>
                            </Link>
                        </div>

                        {/* More in Category */}
                        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">More in {termData.category}</h4>
                            <div className="space-y-3">
                                <Link href="/glossary" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors border-b border-slate-100 dark:border-slate-800 pb-2">
                                    Browse all definitions
                                </Link>
                                <Link href="/guides" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors border-b border-slate-100 dark:border-slate-800 pb-2">
                                    Read Expert Guides
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
             </div>
        </div>
    );
}
