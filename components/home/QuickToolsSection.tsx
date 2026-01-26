"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
    Calculator, TrendingUp, Wallet, FileText, ArrowRight, Sparkles, Star, 
    Users, Shield, Lock, PiggyBank, Target, Home, GraduationCap, 
    IndianRupee, ChevronRight, Zap, HelpCircle
} from "lucide-react";
import { DotPattern } from "@/components/common/Patterns";
import { cn } from "@/lib/utils";

// Animated number component
function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
    const [displayValue, setDisplayValue] = useState(format(value));

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            const current = start + (end - start) * ease;
            setDisplayValue(format(Math.round(current)));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, format]);

    return <span>{displayValue}</span>;
}

// Calculator Data
const calculators = [
    { id: "emi", icon: Calculator, title: "EMI Calculator", shortTitle: "EMI", description: "Plan loan repayments", href: "/calculators/emi", color: "blue" },
    { id: "tax", icon: FileText, title: "Tax Calculator", shortTitle: "Tax", description: "Optimize your taxes", href: "/calculators/tax", color: "orange" },
    { id: "fd", icon: PiggyBank, title: "FD Calculator", shortTitle: "FD", description: "Fixed deposit returns", href: "/calculators/fd", color: "violet" },
    { id: "ppf", icon: Shield, title: "PPF Calculator", shortTitle: "PPF", description: "Long-term savings", href: "/calculators/ppf", color: "rose" },
    { id: "home", icon: Home, title: "Home Loan", shortTitle: "Home Loan", description: "Buy your dream home", href: "/calculators/home-loan", color: "sky" },
    { id: "goal", icon: Target, title: "Goal Planner", shortTitle: "Goals", description: "Reach financial milestones", href: "/calculators/goal", color: "indigo" },
];

const quickLinks = [
    { name: "NPS", icon: GraduationCap, href: "/calculators/nps" },
    { name: "SSY", icon: Star, href: "/calculators/ssy" },
    { name: "Gratuity", icon: Wallet, href: "/calculators/gratuity" },
    { name: "HRA", icon: Home, href: "/calculators/hra" },
];

// Hero SIP Calculator
function HeroSIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(10);

    const result = useMemo(() => {
        const i = returnRate / 100 / 12;
        const n = years * 12;
        const fv = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const invested = monthlyInvestment * n;
        return {
            total: Math.round(fv),
            invested: Math.round(invested),
            gains: Math.round(fv - invested)
        };
    }, [monthlyInvestment, returnRate, years]);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 lg:p-8 h-full flex flex-col">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                            Most Popular
                        </Badge>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                                    <p className="w-48 text-xs">SIP (Systematic Investment Plan) lets you invest small amounts regularly in mutual funds.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <h3 className="text-2xl font-bold text-white">SIP Calculator</h3>
                    <p className="text-slate-400 text-sm">See how small investments grow huge.</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <TrendingUp className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="space-y-6 flex-1 relative z-10">
                {/* Inputs */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Monthly Investment</span>
                            <span className="font-bold text-emerald-400">₹{monthlyInvestment.toLocaleString()}</span>
                        </div>
                        <Slider 
                            value={[monthlyInvestment]} 
                            min={500} max={100000} step={500} 
                            onValueChange={([v]) => setMonthlyInvestment(v)}
                            className="py-1"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Expected Return</span>
                            <span className="font-bold text-emerald-400">{returnRate}%</span>
                        </div>
                        <Slider 
                            value={[returnRate]} 
                            min={5} max={30} step={0.5} 
                            onValueChange={([v]) => setReturnRate(v)}
                            className="py-1"
                        />
                    </div>
                </div>

                {/* Big Result */}
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mt-auto">
                    <div className="text-xs text-slate-400 mb-1">Projected Value in {years} Years</div>
                    <div className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                        <AnimatedNumber value={result.total} format={(n) => `₹${(n/100000).toFixed(2)} Lakh`} />
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-emerald-400">Gain: ₹{(result.gains/100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                            <span className="text-slate-400">Invested: ₹{(result.invested/100000).toFixed(1)}L</span>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link href="/calculators/sip" className="block">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-12 rounded-xl shadow-lg shadow-emerald-900/20 group relative overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Start Your Wealth Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <motion.div 
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                        />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// Preview Card (Graph visuals)
function PreviewCard({ title, icon: Icon, color, href, description }: any) {
    const colorStyles = {
        blue: "bg-blue-500 text-blue-500",
        orange: "bg-orange-500 text-orange-500",
        violet: "bg-violet-500 text-violet-500",
        rose: "bg-rose-500 text-rose-500",
        sky: "bg-sky-500 text-sky-500",
        indigo: "bg-indigo-500 text-indigo-500",
    };
    
    // Derived classes
    const bgClass = colorStyles[color as keyof typeof colorStyles].split(' ')[0];
    const textClass = colorStyles[color as keyof typeof colorStyles].split(' ')[1];

    return (
        <Link href={href} className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md", bgClass)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn("w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", textClass)}>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
            
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>
            
            {/* Visual Preview (Static Graph) */}
            <div className="mt-auto h-16 flex items-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                    <div 
                        key={i} 
                        className={cn("flex-1 rounded-t-sm transition-all duration-500", bgClass)}
                        style={{ height: `${h}%`, opacity: 0.3 + (i * 0.1) }} 
                    />
                ))}
            </div>
        </Link>
    );
}

export default function QuickToolsSection() {
    return (
        <section className="relative py-20 lg:py-24 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
            {/* Background */}
            <DotPattern className="absolute inset-0 text-slate-200/50 dark:text-slate-800/30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Financial Toolkit
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Financial Future</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Powerful tools to help you plan, save, and grow your wealth.
                    </p>
                </div>

                {/* Simplified Layout: Hero SIP + 3 Main Calculators */}
                <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
                    {/* Hero SIP Calculator - Takes full width on mobile, half on desktop */}
                    <div className="lg:col-span-1 min-h-[400px]">
                        <HeroSIPCalculator />
                    </div>

                    {/* Top 3 Calculators Grid */}
                    <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        {calculators.slice(0, 3).map((calc) => (
                            <PreviewCard key={calc.id} {...calc} />
                        ))}
                    </div>
                </div>

                {/* Quick Links - Horizontal Scroll */}
                <div className="mt-8">
                   <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-2">
                       <h3 className="font-bold text-slate-900 dark:text-white text-lg">More Calculators</h3>
                       <Link href="/calculators" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center">
                            View All 15+ Tools <ChevronRight className="w-4 h-4 ml-1" />
                       </Link>
                   </div>
                   
                   <div className="flex gap-4 overflow-x-auto pb-6 snap-x px-2 scrollbar-hide">
                       {calculators.slice(3).concat(quickLinks.map((link, i) => ({
                           id: `quick-${i}`,
                           icon: link.icon,
                           title: link.name,
                           shortTitle: link.name,
                           description: '',
                           href: link.href,
                           color: 'slate'
                       }))).map((calc) => {
                           const colorMap: Record<string, string> = {
                               blue: 'bg-blue-500',
                               orange: 'bg-orange-500',
                               violet: 'bg-violet-500',
                               rose: 'bg-rose-500',
                               sky: 'bg-sky-500',
                               indigo: 'bg-indigo-500',
                               slate: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                           };
                           const iconBgClass = calc.color === 'slate' 
                               ? colorMap.slate 
                               : `${colorMap[calc.color] || 'bg-slate-500'} text-white`;
                           
                           return (
                               <Link 
                                    key={calc.id} 
                                    href={calc.href}
                                    className="min-w-[140px] snap-start flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg transition-all"
                               >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md ${iconBgClass}`}>
                                         <calc.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white text-sm text-center">{calc.shortTitle}</span>
                               </Link>
                           );
                       })}
                   </div>
                </div>

                {/* Trust Footer */}
                <div className="mt-8 flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-8">
                     <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> 100% Private</span>
                     <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Verified Accuracy</span>
                     <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 2M+ Users</span>
                </div>
            </div>
        </section>
    );
}
