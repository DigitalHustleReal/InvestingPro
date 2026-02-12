"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient as api } from '@/lib/api-client';
import { getRecommendations, UserPreferences, RecommendationResult } from "@/lib/ranking/recommendation-engine";
import { ProductCard } from "@/components/ui/ProductCard";
import { Trophy, TrendingUp, DollarSign, Users, Sparkles, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function SmartRecommendationsPage() {
    const [step, setStep] = useState(0);
    const [prefs, setPrefs] = useState<UserPreferences>({
        productType: 'credit_card',
        goal: 'general',
        spendRange: 'medium'
    });

    const { data: allProducts = [] } = useQuery({
        queryKey: ['all-products-for-wizard'],
        queryFn: async () => {
             const [cards, loans, mfs] = await Promise.all([
                 api.entities.CreditCard.list(),
                 api.entities.Loan.list(),
                 api.entities.MutualFund.list()
             ]);
             
             // mfs is { data: MutualFund[], count: number }
             const mfList = Array.isArray(mfs) ? mfs : (mfs as any).data || [];
             
             return [...cards, ...loans, ...mfList] as any[];
        }
    });

    const [results, setResults] = useState<RecommendationResult[]>([]);

    useEffect(() => {
        if (step === 3 && allProducts.length > 0) {
            const recs = getRecommendations(allProducts, prefs);
            setResults(recs);
        }
    }, [step, allProducts, prefs]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);
    const updatePref = (key: keyof UserPreferences, value: any) => {
        setPrefs(p => ({ ...p, [key]: value }));
        // Auto advance for some clicks
        // setStep(s => s + 1); // Optional: makes it feel snappy
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-center mb-8">What are you looking for?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[
                               { id: 'credit_card', label: 'Credit Card', icon: TrendingUp },
                               { id: 'loan', label: 'Loan', icon: DollarSign },
                               { id: 'mutual_fund', label: 'Mutual Fund', icon: Users }
                           ].map((item) => (
                               <Card 
                                key={item.id} 
                                onClick={() => { updatePref('productType', item.id); handleNext(); }}
                                className={`cursor-pointer hover:border-primary-500 hover:shadow-lg transition-all ${prefs.productType === item.id ? 'border-primary-500 bg-primary-50' : ''}`}
                               >
                                   <CardContent className="p-8 flex flex-col items-center text-center">
                                       <item.icon className={`w-12 h-12 mb-4 ${prefs.productType === item.id ? 'text-primary-600' : 'text-slate-600'}`} />
                                       <h3 className="font-bold text-lg">{item.label}</h3>
                                   </CardContent>
                               </Card>
                           ))}
                        </div>
                    </div>
                );
            case 1: 
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-center mb-8">What's your primary goal?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {/* Dynamic Options based on Product Type */}
                           {prefs.productType === 'credit_card' && [
                               { id: 'travel', label: 'Travel & Lounge', icon: Trophy },
                               { id: 'shopping', label: 'Shopping Rewards', icon: DollarSign },
                               { id: 'cashback', label: 'Cashback', icon: TrendingUp },
                           ].map(opt => (
                                <OptionCard 
                                    key={opt.id} 
                                    selected={prefs.goal === opt.id} 
                                    onClick={() => { updatePref('goal', opt.id); handleNext(); }} 
                                    {...opt} 
                                />
                           ))}
                           
                           {prefs.productType === 'loan' && [
                               { id: 'low_interest', label: 'Lowest Interest', icon:  DollarSign },
                               { id: 'flexibility', label: 'Flexible Tenure', icon: TrendingUp },
                           ].map(opt => (
                                <OptionCard 
                                    key={opt.id} 
                                    selected={prefs.goal === opt.id} 
                                    onClick={() => { updatePref('goal', opt.id); handleNext(); }} 
                                    {...opt} 
                                />
                           ))}

                           {/* Keep it simple for MVP */}
                           {prefs.productType === 'mutual_fund' && [
                               { id: 'wealth', label: 'Wealth Creation', icon: TrendingUp },
                               { id: 'tax_saving', label: 'Tax Saving (ELSS)', icon: Trophy },
                               { id: 'safe', label: 'Safe & Steady', icon: CheckCircle2 }
                           ].map(opt => (
                                <OptionCard 
                                    key={opt.id} 
                                    selected={prefs.goal === opt.id} 
                                    onClick={() => { updatePref('goal', opt.id); handleNext(); }} 
                                    {...opt} 
                                />
                           ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-center mb-8">How much do you spend/invest?</h2>
                        <div className="w-full max-w-xl mx-auto space-y-4">
                           {['low', 'medium', 'high'].map(range => (
                               <div 
                                key={range}
                                onClick={() => { updatePref('spendRange', range); handleNext(); }}
                                className={`p-6 rounded-xl border border-slate-200 cursor-pointer hover:bg-primary-50 hover:border-primary-200 flex items-center justify-between ${prefs.spendRange === range ? 'bg-primary-50 border-primary-500' : 'bg-white'}`}
                               >
                                    <div>
                                        <p className="font-bold text-lg capitalize">{range} Tier</p>
                                        <p className="text-sm text-slate-500">
                                            {range === 'low' ? '< ₹20k / month' : range === 'medium' ? '₹20k - ₹50k / month' : '> ₹50k / month'}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                               </div>
                           ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1221] via-secondary-900 to-[#0B1221] text-white pt-12 pb-32 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary-400" />
                        <span className="text-primary-400 font-bold uppercase text-xs tracking-wider">AI Recommendation Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Match</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Tell us what you need in 3 simple steps. We'll find the best product for you.
                    </p>
                </div>
            </section>

            {/* Widget Container */}
            <div className="container mx-auto px-4 sm:px-6 -mt-20 relative z-20">
                
                {step < 3 ? (
                    // WIZARD MODE
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl mx-auto p-8 md:p-12 min-h-[500px] flex flex-col justify-center relative">
                        {step > 0 && (
                            <button onClick={handleBack} className="absolute top-8 left-8 text-slate-600 hover:text-slate-600 flex items-center gap-1 text-sm font-semibold">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        
                        <div className="mb-8 flex justify-center gap-2">
                             {[0, 1, 2].map(i => (
                                 <div key={i} className={`h-1 w-12 rounded-full transition-colors ${i <= step ? 'bg-primary-600' : 'bg-slate-200'}`} />
                             ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    // RESULTS MODE
                    <div className="max-w-5xl mx-auto">
                         <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Your Matches</h2>
                                <p className="text-slate-600">Based on your goal for <span className="font-semibold text-primary-600 capitalize">{prefs.goal.replace('_', ' ')}</span></p>
                            </div>
                            <Button variant="outline" onClick={() => setStep(0)}>Start Over</Button>
                         </div>

                         <div className="space-y-6">
                             {results.length === 0 ? (
                                 <div className="text-center py-20 bg-white rounded-xl">
                                     <p className="text-xl text-slate-500">No specific matches found. Try adjusting your preferences.</p>
                                     <Button className="mt-4" onClick={() => setStep(0)}>Try Again</Button>
                                 </div>
                             ) : (
                                 results.slice(0, 3).map((res, index) => (
                                     <div key={res.product.id} className="relative group">
                                         {/* Match Badge */}
                                         <div className="absolute -left-3 -top-3 z-20 bg-success-600 text-white px-4 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-2">
                                             <Sparkles className="w-4 h-4" /> {res.matchScore}% Match
                                         </div>
                                         
                                         {/* Context Card */}
                                         <div className="mb-[-20px] pt-8 pl-8 pr-8 pb-12 bg-success-50 rounded-t-2xl border border-success-100 relative top-6 z-0 -mx-4">
                                              <p className="text-success-800 font-medium">
                                                  <span className="font-bold">Why it matches:</span> {res.matchReason}
                                              </p>
                                         </div>

                                         <div className="relative z-10 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                             <ProductCard product={res.product} showCompare={true} />
                                         </div>
                                     </div>
                                 ))
                             )}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function OptionCard({ selected, onClick, label, icon: Icon }: any) {
    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer p-6 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-all h-40
                ${selected ? 'bg-primary-50 border-primary-500 shadow-md transform scale-105' : 'bg-white border-slate-200 hover:border-primary-300 hover:bg-slate-50'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? 'text-primary-600' : 'text-slate-500'}`} />
            <span className={`font-bold ${selected ? 'text-primary-900' : 'text-slate-700'}`}>{label}</span>
        </div>
    );
}
