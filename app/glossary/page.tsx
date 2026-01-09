"use client";

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRight, Loader2, TrendingUp, Shield, Landmark, CreditCard, PieChart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from "framer-motion";

interface GlossaryTerm {
    term: string;
    category: string;
    definition: string;
}

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

export default function GlossaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [loading, setLoading] = useState(true);
    const [featuredTerm, setFeaturedTerm] = useState<GlossaryTerm | null>(null);

    useEffect(() => {
        const fetchTerms = async () => {
             setLoading(true);
             try {
                const data = await api.entities.Glossary.list();
                if (data && data.length > 0) {
                    setTerms(data);
                    // Pick a random term as "Term of the Day"
                    setFeaturedTerm(data[Math.floor(Math.random() * data.length)]);
                } else {
                     // Fallback for empty DB
                     setTerms([
                        { term: "APR (Annual Percentage Rate)", category: "Loans", definition: "The yearly interest rate you'll be charged for borrowing money, including fees." },
                        { term: "CIBIL Score", category: "Credit Cards", definition: "A 3-digit number (300-900) representing your creditworthiness. 750+ is considered good." }
                     ]);
                }
             } catch (error) {
                 console.error("Failed to fetch glossary terms", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchTerms();
    }, []);

    const filteredTerms = terms.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    }).sort((a,b) => a.term.localeCompare(b.term));

    const categories = ["All", ...Array.from(new Set(terms.map(t => t.category)))].sort();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans transition-colors duration-300">
             <SEOHead
                title="Financial Knowledge Hub | InvestingPro"
                description="Master financial concepts with our comprehensive, expert-verified glossary. From Mutual Funds to Taxation, we decode it all."
            />

            {/* Premium Hero with Term of the Day */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-32 pb-16 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                 
                 <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 bg-primary-50 text-primary-700 border-primary-100 uppercase tracking-widest px-4 py-1.5">InvestingPro Encyclopaedia</Badge>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                                Decode the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Financial World</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0">
                                Stop guessing. Start understanding. Expert definitions for every financial term you'll ever encounter.
                            </p>

                            <div className="relative max-w-xl mx-auto lg:mx-0">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <Input
                                    placeholder="Search 100+ financial terms..."
                                    className="w-full h-14 pl-14 pr-6 rounded-2xl text-lg bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary-500 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Term of the Day Card */}
                        <div className="flex-1 w-full max-w-md">
                            {featuredTerm && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-800"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <Badge className="bg-white/10 text-white border-0 backdrop-blur-md">Concept of the Day</Badge>
                                            <Link href={CATEGORY_CONFIG[featuredTerm.category]?.toolLink || '#'} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">{featuredTerm.term}</h2>
                                        <p className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
                                            {featuredTerm.definition}
                                        </p>
                                        <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                                            <div className={`p-2 rounded-lg ${CATEGORY_CONFIG[featuredTerm.category]?.color.split(' ')[1] || 'bg-slate-800'}`}>
                                                {(() => {
                                                    const Icon = CATEGORY_CONFIG[featuredTerm.category]?.icon || BookOpen;
                                                    return <Icon className="w-5 h-5 text-white" />
                                                })()}
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-wider text-slate-400">{featuredTerm.category}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                 </div>
            </div>

            {/* Category Navigation */}
            <div className="sticky top-20 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-lg border-y border-slate-200 dark:border-slate-800 mb-12">
                <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-3 min-w-max">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                    activeCategory === cat
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {cat !== "All" && (() => {
                                    const Icon = CATEGORY_CONFIG[cat]?.icon || BookOpen;
                                    return <Icon className={`w-4 h-4 ${activeCategory === cat ? 'text-current' : 'text-slate-400'}`} />
                                })()}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Terms Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        <p className="text-slate-500 text-sm">Loading knowledge base...</p>
                    </div>
                ) : filteredTerms.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTerms.map((item, i) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                key={item.term} 
                                className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-xl hover:shadow-primary-900/5 dark:hover:shadow-primary-900/20 transition-all group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_CONFIG[item.category]?.color}`}>
                                        {item.category}
                                    </div>
                                    {CATEGORY_CONFIG[item.category]?.icon && (
                                        <div className="text-slate-300 group-hover:text-primary-500 transition-colors">
                                            {React.createElement(CATEGORY_CONFIG[item.category].icon, { size: 20 })}
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {item.term}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                                    {item.definition}
                                </p>

                                {/* Smart Contextual Link */}
                                {CATEGORY_CONFIG[item.category]?.toolLink ? (
                                    <div className="pt-6 mt-auto border-t border-slate-50 dark:border-slate-800">
                                        <Link 
                                            href={CATEGORY_CONFIG[item.category].toolLink!} 
                                            className="flex items-center justify-between text-sm font-bold text-slate-500 group-hover:text-primary-600 transition-colors"
                                        >
                                            {CATEGORY_CONFIG[item.category].toolLabel}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="pt-6 mt-auto border-t border-slate-50 dark:border-slate-800">
                                         <span className="flex items-center text-sm font-bold text-slate-300 cursor-not-allowed">
                                            Quick Guide Coming Soon
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No terms found</h3>
                        <p className="text-slate-500">Try adjusting your search for "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* Visual CTA */}
             <div className="max-w-7xl mx-auto px-6 mt-24 mb-12">
                 <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                     {/* Abstract Shapes */}
                     <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
                     <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2" />
                     
                     <div className="relative z-10 max-w-2xl mx-auto">
                         <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Become a Smarter Investor</h2>
                         <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                             Knowledge is your best asset. Use our free calculators to put these concepts into practice and grow your wealth.
                         </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/calculators">
                                <Button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-white/5">
                                    Open Calculators
                                </Button>
                            </Link>
                            <Link href="/investing">
                                <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold text-lg">
                                    Start Investing
                                </Button>
                            </Link>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
}
