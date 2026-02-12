"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Info, TrendingUp, ShieldCheck, Calculator, ArrowRight } from "lucide-react";
import Link from 'next/link';

import { seoContent } from "@/lib/content/calculator-content";

interface SEOContentProps {
    calculatorType: 'sip' | 'swp' | 'lumpsum' | 'fd' | 'emi' | 'tax' | 'retirement' | 'inflation' | 'ppf' | 'nps' | 'goal';
}

export function SEOContent({ calculatorType }: SEOContentProps) {
    const content = seoContent[calculatorType];

    return (
        <div className="space-y-8 mt-12">
            {/* SEO-Optimized Introduction */}
            <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-slate-50 dark:from-slate-900 to-white dark:to-slate-800">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{content.h1}</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-600 leading-relaxed mb-6">{content.intro}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <p className="text-slate-700 dark:text-slate-300 font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* How It Works Section */}
            {'howItWorks' in content && content.howItWorks && (
                <Card className="border-0 shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">How to Use {content.title.split(' - ')[0]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {content.howItWorks.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-2 top-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-">
                                        {step.step}
                                    </div>
                                    <div className="pl-6">
                                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* FAQ Section */}
            {'faqs' in content && content.faqs && (
                <Card className="border-0 shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-6 md:p-8">
                            <Info className="w-6 h-6 text-primary-600" />
                            Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {content.faqs.map((faq, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-200 dark:border-slate-700">
                                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-600">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-600 leading-relaxed pt-2">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            {/* Related Calculators */}
            <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-primary-50 dark:from-primary-900/20 to-success-50 dark:to-success-900/20">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Related Calculators</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['EMI Calculator', 'FD Calculator', 'Tax Calculator', 'Retirement Calculator'].map((calc) => (
                            <Link
                                key={calc}
                                href={`/calculators?type=${calc.toLowerCase().replace(' ', '-')}`}
                                className="p-4 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                                    <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600">{calc}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SEO Keywords Meta (Hidden but for SEO) */}
            <div className="hidden">
                <p>{content.keywords}</p>
            </div>
        </div>
    );
}

