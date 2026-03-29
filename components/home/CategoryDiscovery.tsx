"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    CreditCard, 
    Landmark, 
    Shield, 
    Calculator, 
    Building2, 
    PiggyBank,
    Receipt,
    Briefcase,
    TrendingUp,
    ChevronRight,
    Sparkles,
    ArrowRight,
    Star,
    BookOpen,
    FileText,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// Enhanced category data with gradients, stats, and quick links
const categories = [
    {
        slug: 'credit-cards',
        title: 'Credit Cards',
        shortDesc: 'Best cards, ranked honestly',
        icon: CreditCard,
        gradient: 'from-blue-500 to-indigo-500',
        lightBg: 'bg-blue-50 dark:bg-blue-900/20',
        stats: { guides: 120, tools: 5 },
        badge: 'Popular',
        quickLinks: [
            { name: 'Best Rewards Cards', href: '/credit-cards/best/rewards' },
            { name: 'Travel Cards', href: '/credit-cards/best/travel' },
            { name: 'Cashback Cards', href: '/credit-cards/best/cashback' },
        ],
        href: '/credit-cards'
    },
    {
        slug: 'loans',
        title: 'Loans',
        shortDesc: 'Home, Car, Personal',
        icon: Landmark,
        gradient: 'from-emerald-500 to-green-600',
        lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        stats: { guides: 85, tools: 8 },
        badge: null,
        quickLinks: [
            { name: 'Home Loan EMI', href: '/calculators/home-loan' },
            { name: 'Personal Loan', href: '/loans/personal' },
            { name: 'Car Loan', href: '/loans/car' },
        ],
        href: '/loans'
    },
    {
        slug: 'insurance',
        title: 'Insurance',
        shortDesc: 'Life, Health, Term',
        icon: Shield,
        gradient: 'from-violet-500 to-purple-500',
        lightBg: 'bg-violet-50 dark:bg-violet-900/20',
        stats: { guides: 95, tools: 4 },
        badge: null,
        quickLinks: [
            { name: 'Term Insurance', href: '/insurance/term' },
            { name: 'Health Insurance', href: '/insurance/health' },
            { name: 'Car Insurance', href: '/insurance/car' },
        ],
        href: '/insurance'
    },
    {
        slug: 'calculators',
        title: 'Calculators',
        shortDesc: '15+ free tools',
        icon: Calculator,
        gradient: 'from-amber-500 to-orange-500',
        lightBg: 'bg-amber-50 dark:bg-amber-900/20',
        stats: { guides: 30, tools: 15 },
        badge: 'Popular',
        quickLinks: [
            { name: 'SIP Calculator', href: '/calculators/sip' },
            { name: 'EMI Calculator', href: '/calculators/emi' },
            { name: 'Tax Calculator', href: '/calculators/tax' },
        ],
        href: '/calculators'
    },
    {
        slug: 'mutual-funds',
        title: 'Mutual Funds',
        shortDesc: 'SIP & Lumpsum',
        icon: TrendingUp,
        gradient: 'from-green-500 to-emerald-600',
        lightBg: 'bg-green-50 dark:bg-green-900/20',
        stats: { guides: 110, tools: 6 },
        badge: 'Trending',
        quickLinks: [
            { name: 'Best SIP Funds', href: '/mutual-funds/best-sip' },
            { name: 'Index Funds', href: '/mutual-funds/index' },
            { name: 'ELSS Funds', href: '/mutual-funds/elss' },
        ],
        href: '/mutual-funds'
    },
    {
        slug: 'banking',
        title: 'Banking',
        shortDesc: 'FD, RD, Savings',
        icon: Building2,
        gradient: 'from-blue-500 to-indigo-500',
        lightBg: 'bg-blue-50 dark:bg-blue-900/20',
        stats: { guides: 65, tools: 4 },
        badge: null,
        quickLinks: [
            { name: 'Best FD Rates', href: '/banking/fixed-deposits' },
            { name: 'Savings Account', href: '/banking/savings' },
            { name: 'RD Calculator', href: '/calculators/rd' },
        ],
        href: '/banking'
    },
    {
        slug: 'taxes',
        title: 'Taxes',
        shortDesc: 'ITR, GST, TDS',
        icon: Receipt,
        gradient: 'from-rose-500 to-pink-500',
        lightBg: 'bg-rose-50 dark:bg-rose-900/20',
        stats: { guides: 75, tools: 5 },
        badge: null,
        quickLinks: [
            { name: 'Tax Calculator', href: '/calculators/tax' },
            { name: 'ITR Filing Guide', href: '/taxes/itr-filing' },
            { name: '80C Deductions', href: '/taxes/80c' },
        ],
        href: '/taxes'
    },
    {
        slug: 'small-business',
        title: 'Small Business',
        shortDesc: 'Loans, Cards, GST',
        icon: Briefcase,
        gradient: 'from-indigo-500 to-violet-500',
        lightBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        stats: { guides: 45, tools: 3 },
        badge: 'New',
        quickLinks: [
            { name: 'Business Loans', href: '/small-business/loans' },
            { name: 'Business Cards', href: '/small-business/credit-cards' },
            { name: 'GST Calculator', href: '/calculators/gst' },
        ],
        href: '/small-business'
    },
];

// Category Card Component
function CategoryCard({ category, isHovered, onHover }: { 
    category: typeof categories[0]; 
    isHovered: boolean;
    onHover: (slug: string | null) => void;
}) {
    const Icon = category.icon;
    
    return (
        <div
            className="relative group"
            onMouseEnter={() => onHover(category.slug)}
            onMouseLeave={() => onHover(null)}
        >
            <Link href={category.href}>
                <div className={cn(
                    "relative p-5 rounded-2xl border-2 transition-all duration-300 h-full",
                    "bg-white dark:bg-slate-900",
                    "border-slate-100 dark:border-slate-800",
                    "hover:border-slate-200 dark:hover:border-slate-700",
                    "hover:shadow-xl hover:-translate-y-1",
                    isHovered && "shadow-xl -translate-y-1 border-slate-200 dark:border-slate-700"
                )}>
                    {/* Badge */}
                    {category.badge && (
                        <div className={cn(
                            "absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg",
                            category.badge === 'Popular' && "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
                            category.badge === 'Trending' && "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
                            category.badge === 'New' && "bg-gradient-to-r from-violet-400 to-purple-400 text-white"
                        )}>
                            {category.badge}
                        </div>
                    )}

                    {/* Icon */}
                    <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                        "bg-gradient-to-br shadow-lg",
                        category.gradient,
                        "group-hover:scale-110 group-hover:shadow-xl"
                    )}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-600 mb-3">
                        {category.shortDesc}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {category.stats.guides}+ guides
                        </span>
                        <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {category.stats.tools} tools
                        </span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="absolute bottom-5 right-5 w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Hover Dropdown - Quick Links with Animation */}
            <motion.div 
                className="absolute left-0 right-0 top-full mt-2 z-20"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={isHovered ? { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25,
                        staggerChildren: 0.05
                    }
                } : { 
                    opacity: 0, 
                    y: 10, 
                    scale: 0.95,
                    transition: { duration: 0.15 }
                }}
                style={{ 
                    pointerEvents: isHovered ? 'auto' : 'none',
                    visibility: isHovered ? 'visible' : 'hidden'
                }}
            >
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-3 space-y-1 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-500 font-semibold px-2 mb-2">
                        Quick Links
                    </p>
                    {category.quickLinks.map((link, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isHovered ? { 
                                opacity: 1, 
                                x: 0,
                                transition: { delay: i * 0.05 }
                            } : { opacity: 0, x: -10 }}
                        >
                            <Link 
                                href={link.href}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", category.gradient)} />
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={isHovered ? { 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: category.quickLinks.length * 0.05 }
                        } : { opacity: 0, x: -10 }}
                    >
                        <Link 
                            href={category.href}
                            className="flex items-center justify-between px-3 py-2 mt-2 rounded-lg text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default function CategoryDiscovery() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    
    return (
        <section className="relative py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl -translate-x-1/2" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Browse Topics</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Explore by Category
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Everything you need to manage your wealth — guides, calculators, and comparisons
                    </p>
                </motion.div>

                {/* Category Grid - 4 columns on large, 2 on mobile */}
                <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {categories.slice(0, 8).map((category) => (
                        <motion.div key={category.slug} variants={itemVariants}>
                            <CategoryCard 
                                category={category}
                                isHovered={hoveredCategory === category.slug}
                                onHover={setHoveredCategory}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-6 px-8 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span><strong className="text-slate-900 dark:text-white">500+</strong> Guides</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Calculator className="w-4 h-4 text-emerald-500" />
                            <span><strong className="text-slate-900 dark:text-white">15+</strong> Calculators</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span><strong className="text-slate-900 dark:text-white">4.8</strong> Rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
