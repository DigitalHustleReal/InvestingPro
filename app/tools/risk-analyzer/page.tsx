"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import RiskQuestionnaire from "@/components/calculators/RiskQuestionnaire";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from 'lucide-react';

export default function RiskAnalyzerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Investment Risk Profile Analyzer | Free Financial Tools"
                description="Discover your investment risk profile with our free 2-minute quiz. Get personalized asset allocation recommendations."
                keywords={["risk analyzer", "investment profile", "asset allocation calculator", "risk tolerance quiz"]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Breadcrumb 
                    items={[
                        { label: "Tools", href: "/tools" },
                        { label: "Risk Analyzer" }
                    ]} 
                />

                <div className="text-center mb-12">
                     <Badge className="mb-4 bg-primary-100 text-primary-700 border-primary-200 px-3 py-1 uppercase tracking-widest text-xs font-bold inline-flex items-center gap-2">
                        <BrainCircuit className="w-3 h-3" />
                         AI Powered Analysis
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        What's Your Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">DNA?</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-600 max-w-2xl mx-auto">
                        Take our 2-minute psychometric test to discover your true risk tolerance and get a personalized portfolio mix.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <RiskQuestionnaire />
                </div>
            </div>
        </div>
    );
}
