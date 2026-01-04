"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    TrendingUp,
    CreditCard,
    Calculator,
    FileText,
    Users,
    Shield,
    Zap,
    Target,
    Award,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Building2,
    Wallet,
    Clock,
    BarChart3,
    Rocket,
    Lightbulb,
    IndianRupee
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";

export default function SmallBusinessPage() {
    const [businessStage, setBusinessStage] = useState<'idea' | 'startup' | 'growing' | 'established'>('startup');

    const businessLoans = [
        {
            type: 'Working Capital Loan',
            icon: Wallet,
            amount: '₹1L - ₹50L',
            tenure: '12-36 months',
            rate: '12% - 24%',
            features: ['Quick approval', 'Minimal documentation', 'Flexible repayment'],
            bestFor: 'Managing day-to-day expenses',
            color: 'emerald'
        },
        {
            type: 'Business Line of Credit',
            icon: CreditCard,
            amount: '₹5L - ₹1Cr',
            tenure: 'Revolving',
            rate: '14% - 22%',
            features: ['Pay interest on used amount', 'Reusable credit', 'No collateral'],
            bestFor: 'Cash flow management',
            color: 'blue'
        },
        {
            type: 'Equipment/Machinery Loan',
            icon: Building2,
            amount: '₹10L - ₹5Cr',
            tenure: '24-60 months',
            rate: '10% - 18%',
            features: ['Up to 80% financing', 'Tax benefits', 'Long tenure'],
            bestFor: 'Purchasing business assets',
            color: 'purple'
        },
        {
            type: 'MSME/Mudra Loan',
            icon: Target,
            amount: '₹50k - ₹10L',
            tenure: '12-60 months',
            rate: '8% - 12%',
            features: ['Government backed', 'Low interest', 'For MSMEs'],
            bestFor: 'Small business expansion',
            color: 'amber'
        },
    ];

    const businessCreditCards = [
        {
            name: 'HDFC Business MoneyBack',
            annualFee: '₹1,000',
            rewards: '2% cashback',
            features: ['Airport lounge', 'Fuel surcharge waiver', 'Zero liability protection'],
            bestFor: 'Regular business expenses'
        },
        {
            name: 'American Express Business Gold',
            annualFee: '₹10,000',
            rewards: '2X points on all spends',
            features: ['Concierge service', 'Global acceptance', 'Business management tools'],
            bestFor: 'High-spending businesses'
        },
        {
            name: 'SBI Business Advantage',
            annualFee: '₹499',
            rewards: '1% cashback',
            features: ['Expense tracking', 'Employee cards', 'GST invoice support'],
            bestFor: 'Budget-conscious SMEs'
        },
    ];

    const digitalTools = [
        {
            category: 'Accounting & Invoicing',
            tools: [
                { name: 'Zoho Books', pricing: '₹1,500/mo', features: 'GST billing, inventory, expenses' },
                { name: 'Tally Prime', pricing: '₹18,000/yr', features: 'Accounting, GST, payroll' },
                { name: 'QuickBooks', pricing: '₹2,500/mo', features: 'Invoice, expenses, reports' },
            ],
            icon: Calculator,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            category: 'Payment Gateways',
            tools: [
                { name: 'Razorpay', pricing: '2% + GST per transaction', features: 'UPI, cards, netbanking' },
                { name: 'Paytm Business', pricing: '1.99% onwards', features: 'QR code, POS, online' },
                { name: 'PhonePe', pricing: '1.5% + GST', features: 'Low fees, instant settlement' },
            ],
            icon: CreditCard,
            color: 'from-emerald-500 to-teal-600'
        },
        {
            category: 'GST & Compliance',
            tools: [
                { name: 'ClearTax', pricing: '₹999/mo', features: 'GST filing, e-invoicing, ITR' },
                { name: 'Zoho GST', pricing: '₹499/mo', features: 'Auto GST reports, filing' },
                { name: 'MyBillBook', pricing: 'Free', features: 'Basic GST billing' },
            ],
            icon: FileText,
            color: 'from-purple-500 to-pink-600'
        },
    ];

    const governmentSchemes = [
        {
            scheme: 'PMEGP (Prime Minister Employment Generation)',
            benefit: 'Subsidy: 15-35% of project cost',
            eligibility: 'New enterprises, manufacturing/service sector',
            icon: Award
        },
        {
            scheme: 'Startup India',
            benefit: 'Tax exemption for 3 years + funding access',
            eligibility: 'DPIIT-recognized startups',
            icon: Rocket
        },
        {
            scheme: 'Credit Guarantee Scheme (CGTMSE)',
            benefit: 'Collateral-free loans up to ₹2 crore',
            eligibility: 'MSMEs, manufacturing & services',
            icon: Shield
        },
        {
            scheme: 'Stand-Up India',
            benefit: 'Loans ₹10L-₹1Cr for SC/ST/Women',
            eligibility: 'Women & SC/ST entrepreneurs',
            icon: Users
        },
    ];

    const stageBasedRecommendations = {
        idea: {
            title: 'Business Idea Stage',
            color: 'from-blue-500 to-indigo-600',
            recommendations: [
                'Validate your business idea with market research',
                'Create a detailed business plan',
                'Explore government startup schemes',
                'Consider low-cost MVP development'
            ]
        },
        startup: {
            title: 'Early-Stage Startup',
            color: 'from-purple-500 to-pink-600',
            recommendations: [
                'Register your business (Pvt Ltd/LLP/Sole Proprietor)',
                'Open a dedicated business bank account',
                'Apply for MSME/Mudra loan for initial capital',
                'Set up basic accounting with Zoho/Tally'
            ]
        },
        growing: {
            title: 'Growing Business',
            color: 'from-emerald-500 to-teal-600',
            recommendations: [
                'Secure working capital loan for expansion',
                'Get a business credit card for expenses',
                'Invest in digital tools (CRM, accounting)',
                'Hire a CA for tax planning & compliance'
            ]
        },
        established: {
            title: 'Established Business',
            color: 'from-amber-500 to-orange-600',
            recommendations: [
                'Explore equipment loans for asset purchase',
                'Consider business line of credit for flexibility',
                'Implement advanced ERP systems',
                'Plan for business insurance & risk management'
            ]
        },
    };

    const currentStage = stageBasedRecommendations[businessStage];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "Small Business Finance Hub - InvestingPro",
        "description": "Business loans, credit cards, digital tools, and government schemes for MSMEs, startups, and entrepreneurs in India.",
    };

    return (
        <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
            <SEOHead
                title="Small Business Finance Hub 2026 | Loans, Tools & Schemes | InvestingPro"
                description="Complete guide to business loans, credit cards, accounting software, payment gateways, and government schemes for Indian MSMEs, startups, and entrepreneurs."
                structuredData={structuredData}
            />

            {/* HERO SECTION - Business Finance Toolkit */}
            <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Top Badge */}
                    <div className="flex justify-center mb-6">
                        <Badge className="px-4 py-2 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-indigo-500/20 font-bold uppercase tracking-wide text-xs inline-flex items-center gap-2 rounded-full shadow-lg">
                            <Briefcase className="w-4 h-4"/>
                            Complete Business Finance Toolkit
                        </Badge>
                    </div>

                    {/* Main Headline */}
                    <div className="text-center mb-8 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                            Grow Your Business with{' '}
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Smart Financing
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Comprehensive financial solutions for MSMEs, startups, and entrepreneurs - Loans, credit cards, digital tools, and government schemes.
                        </p>
                    </div>

                    {/* Business Stage Selector */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            {(['idea', 'startup', 'growing', 'established'] as const).map((stage) => (
                                <button
                                    key={stage}
                                    onClick={() => setBusinessStage(stage)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                        businessStage === stage
                                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stage-Based Recommendations Card */}
                    <Card className="max-w-4xl mx-auto border-2 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
                        <div className={`p-6 bg-gradient-to-r ${currentStage.color}`}>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <Lightbulb className="w-6 h-6" />
                                {currentStage.title}
                            </h2>
                            <p className="text-white/90 text-sm">
                                Personalized recommendations for your current stage
                            </p>
                        </div>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-4">
                                {currentStage.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{rec}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* SECTION 2: Business Loans */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Business Loan Options
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Choose the right financing option for your business needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {businessLoans.map((loan, idx) => {
                            const Icon = loan.icon;
                            return (
                                <Card key={idx} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <CardContent className="p-6">
                                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-${loan.color}-100 dark:bg-${loan.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-7 h-7 text-${loan.color}-600 dark:text-${loan.color}-400`} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 text-center">
                                            {loan.type}
                                        </h3>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{loan.amount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Tenure:</span>
                                                <span className="font-semibold text-slate-900 dark:text-white">{loan.tenure}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Rate:</span>
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{loan.rate}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                            {loan.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                            Best for: <strong className="text-slate-900 dark:text-white">{loan.bestFor}</strong>
                                        </div>
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                                            Check Eligibility
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 3: Business Credit Cards */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Business Credit Cards
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Manage expenses with dedicated business credit cards
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {businessCreditCards.map((card, idx) => (
                            <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {card.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Annual Fee</div>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white">{card.annualFee}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Rewards</div>
                                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{card.rewards}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {card.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                        <strong className="text-slate-900 dark:text-white">{card.bestFor}</strong>
                                    </div>
                                    <Button variant="outline" className="w-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                        Compare Details
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Digital Tools */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Essential Digital Tools
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Software & platforms to streamline your business operations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {digitalTools.map((category, idx) => {
                            const Icon = category.icon;
                            return (
                                <Card key={idx} className="border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                                    <CardContent className="p-6">
                                        <Icon className="w-10 h-10 text-slate-700 dark:text-slate-300 mb-4" />
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                            {category.category}
                                        </h3>
                                        <div className="space-y-4">
                                            {category.tools.map((tool, i) => (
                                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{tool.name}</h4>
                                                        <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-xs">
                                                            {tool.pricing}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{tool.features}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 5: Government Schemes */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Government Schemes for MSMEs
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Take advantage of subsidies, tax benefits, and funding programs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {governmentSchemes.map((scheme, idx) => {
                            const Icon = scheme.icon;
                            return (
                                <Card key={idx} className="border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                    {scheme.scheme}
                                                </h3>
                                                <div className="mb-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                                        {scheme.benefit}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    <strong>Eligibility:</strong> {scheme.eligibility}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
