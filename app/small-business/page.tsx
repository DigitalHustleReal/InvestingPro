"use client";

import React from 'react';
import { 
    Briefcase, 
    ArrowRight, 
    Building2, 
    CreditCard, 
    Ship, 
    Wrench, 
    Zap, 
    Globe, 
    ShieldCheck, 
    ChevronRight,
    Search,
    IndianRupee,
    BarChart3,
    Handshake,
    CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const BusinessTool = ({ icon: Icon, title, desc, href }: { icon: any, title: string, desc: string, href: string }) => (
    <Link href={href} className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-500/50 hover:shadow-xl transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{desc}</p>
        <div className="flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Explore <ArrowRight className="w-3 h-3" />
        </div>
    </Link>
);

export default function SmallBusinessPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* 1. Hero Section - "Finance Toolkit Hub" */}
            <section className="relative pt-20 pb-32 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <Badge className="mb-6 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-500/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                        The MSME Command Center
                    </Badge>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1.1]">
                        Finance Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-600">Business Growth.</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        From Seed to Scale—get access to machinery loans, GST tools, business credit cards, and expert compliance guides for your startup or enterprise.
                    </p>

                    {/* Quick Toolkit Hub */}
                    <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <BusinessTool 
                            icon={IndianRupee} 
                            title="MSME Loans" 
                            desc="PMEGP & CGTMSE Schemes"
                            href="/loans/business-loan"
                        />
                        <BusinessTool 
                            icon={CreditCard} 
                            title="Business Cards" 
                            desc="Low interest with high limits"
                            href="/credit-cards/business"
                        />
                        <BusinessTool 
                            icon={BarChart3} 
                            title="GST Compliance" 
                            desc="Filing tools & calculator"
                            href="/taxes"
                        />
                        <BusinessTool 
                            icon={Wrench} 
                            title="Toolkit Hub" 
                            desc="Invoicing & Tally support"
                            href="/tools"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Business Loans Grid */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center md:text-left">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Tailored Capital Solutions</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400">One size doesn't fit all. Choose the funding that matches your machinery, inventory, or payroll needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { 
                                type: 'Working Capital', 
                                icon: Zap, 
                                rate: '9.5%', 
                                bestFor: 'Daily operations & payroll',
                                features: ['No Collateral up to 2Cr', 'Quick disbursal', 'Flexible repayment']
                            },
                            { 
                                type: 'Machinery Loan', 
                                icon: Wrench, 
                                rate: '8.75%', 
                                bestFor: 'Manufacturing & upgrades',
                                features: ['90% Funding available', 'Low processing fees', 'Extended tenure']
                            },
                            { 
                                type: 'Startup Funding', 
                                icon: Globe, 
                                rate: 'Equity/Debt', 
                                bestFor: 'Tech-enabled startups',
                                features: ['Investor matching', 'Pitch assistance', 'Regulatory compliance']
                            }
                        ].map((loan, idx) => (
                            <div key={idx} className="group bg-slate-50 dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100" />
                                
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm relative z-10">
                                    <loan.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">{loan.type}</h3>
                                <div className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-6 relative z-10">Rates from {loan.rate} p.a.</div>
                                
                                <ul className="space-y-3 mb-8 relative z-10">
                                    {loan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Button className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl group-hover:translate-y-1 transition-transform relative z-10">
                                    Check Eligibility
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Government Schemes Slider/Grid */}
            <section className="py-24 bg-primary-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-700/50 skew-y-3 -translate-y-20 origin-left scale-110" />
                <div className="absolute -right-20 top-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-1 backdrop-blur-sm">Govt. of India Initiatives</Badge>
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">Mudra to MSME: <br />Subsidies You Must Know.</h2>
                            <p className="text-xl text-primary-100 mb-10 font-light leading-relaxed">
                                Leverage government-backed schemes with lower interest rates and credit guarantees. Our experts help you navigate the paperwork.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="text-4xl font-bold text-white mb-1">95%</div>
                                    <div className="text-xs text-primary-100 uppercase font-bold tracking-widest opacity-80">Success Rate</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="text-4xl font-bold text-white mb-1">₹50L</div>
                                    <div className="text-xs text-primary-100 uppercase font-bold tracking-widest opacity-80">Avg. Subsidy</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'PMEGP Scheme', desc: 'Up to 35% subsidy for new enterprises.' },
                                { name: 'Stand-Up India', desc: 'Loans for SC/ST and women entrepreneurs.' },
                                { name: 'CLCSS Scheme', desc: 'Financial support for technological upgradation.' },
                            ].map((scheme, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-white flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform shadow-lg shadow-black/5">
                                    <div>
                                        <div className="font-bold text-slate-900 text-lg">{scheme.name}</div>
                                        <div className="text-sm text-slate-500">{scheme.desc}</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all bg-slate-50">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Digital Business Tools */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">MSME Digital Toolkit</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400">Essential software and services to automate your business operations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Razorpay', type: 'Payments', logo: '💳' },
                            { name: 'Zoho Books', type: 'Accounting', logo: '🧾' },
                            { name: 'ClearTax', type: 'GST Filing', logo: '📂' },
                            { name: 'Tally Prime', type: 'ERP', logo: '📊' }
                        ].map((tool, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 group">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{tool.logo}</div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{tool.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">{tool.type}</p>
                                <Button variant="link" className="text-primary-600 dark:text-primary-400 font-bold p-0 group-hover:underline">
                                    Get Partner Offer
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Trust Section */}
            <section className="py-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 flex flex-col items-center text-center">
                    <Handshake className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-8" />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Trusted by 10,000+ Indian Small Businesses</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-12">
                        We don't just list products; we help you interpret them. Our experts are available for personalized financial consultations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-all duration-500 grayscale">
                        {/* Partner logos placeholder */}
                        <div className="font-bold text-3xl text-slate-400 dark:text-slate-600">SBI</div>
                        <div className="font-bold text-3xl text-slate-400 dark:text-slate-600">SIDBI</div>
                        <div className="font-bold text-3xl text-slate-400 dark:text-slate-600">NSIC</div>
                        <div className="font-bold text-3xl text-slate-400 dark:text-slate-600">NABARD</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
