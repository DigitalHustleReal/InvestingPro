"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowRight, TrendingUp, Shield, Calculator, CreditCard, Landmark, BookOpen } from "lucide-react";
import Link from "next/link";
import { STAT_STRINGS } from "@/lib/constants/platform-stats";
import { motion, AnimatePresence } from "framer-motion";

import HeroVisuals from "./HeroVisuals";
import { useNavigation } from "@/contexts/NavigationContext";

// Carousel Data
const HERO_SLIDES = [
    {
        id: "all",
        badge: "Independent • Unbiased • Fact-Checked",
        headline: "Find Your Perfect Financial Product",
        highlight: "In 30 Seconds",
        desc: `Stop overpaying on fees and interest. We analyze ${STAT_STRINGS.coverage} to find the best match for YOUR financial situation.`,
        gradient: "from-primary-600 via-primary-500 to-secondary-500",
        primaryCta: { text: "Compare Credit Cards", href: "/credit-cards", icon: CreditCard },
        secondaryCta: { text: "Financial Calculators", href: "/calculators", icon: Calculator }
    },
    {
        id: "credit-cards",
        badge: "Rewards • Cashback • Lounge Access",
        headline: "Maximize Your Spends",
        highlight: "With Best Cards",
        desc: "Compare 100+ credit cards instantly. Find lifetime free cards, maximum cashback, and exclusive travel perks.",
        gradient: "from-secondary-600 via-secondary-500 to-primary-500",
        primaryCta: { text: "Compare Cards", href: "/credit-cards", icon: CreditCard },
        secondaryCta: { text: "Check Eligibility", href: "/credit-cards/check-eligibility", icon: Shield }
    },
    {
        id: "insurance",
        badge: "Term Life • Health • Motor",
        headline: "Protect Your Family",
        highlight: "For Less",
        desc: "Don't leave your future to chance. Compare premium vs coverage across 25+ insurers to find the policy that actually pays out when you need it.",
        gradient: "from-primary-600 via-primary-500 to-success-500",
        primaryCta: { text: "Compare Insurance", href: "/insurance", icon: Shield },
        secondaryCta: { text: "Insurance Guides", href: "/guides/insurance", icon: BookOpen }
    },
    {
        id: "loans",
        badge: "Lowest Interest Rates • Instant Approval",
        headline: "Dream Home, Dream Car",
        highlight: "Made Affordable",
        desc: "Compare interest rates from 50+ banks instantly. Get the lowest EMI for your home and personal loans with our advanced eligibility checker.",
        gradient: "from-primary-600 via-primary-500 to-secondary-500",
        primaryCta: { text: "Compare Loans", href: "/loans", icon: Landmark },
        secondaryCta: { text: "Check Eligibility", href: "/loans/eligibility", icon: Shield }
    },
    {
        id: "investing",
        badge: "Mutual Funds • FDs • SIPs",
        headline: "Grow Your Wealth",
        highlight: "Smartly",
        desc: "Zero commission direct mutual funds, high-yield FDs, and disciplined SIPs. Build a portfolio that beats inflation.",
        gradient: "from-secondary-600 via-secondary-500 to-secondary-400",
        primaryCta: { text: "Start Investing", href: "/mutual-funds", icon: TrendingUp },
        secondaryCta: { text: "SIP Calculator", href: "/calculators/sip", icon: Calculator }
    },
    {
        id: "tools",
        badge: "SIP • EMI • Income Tax • PPF",
        headline: "Plan Your Finances",
        highlight: "With Precision",
        desc: "Use our 50+ free financial calculators to plan your investments, loans, and taxes. Accurate, instant, and easy to use.",
        gradient: "from-primary-600 via-primary-500 to-success-500",
        primaryCta: { text: "All Calculators", href: "/calculators", icon: Calculator },
        secondaryCta: { text: "Tax Planner", href: "/calculators/income-tax", icon: Calculator }
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { activeCategory } = useNavigation();

    // Sync with navbar category selection
    useEffect(() => {
        if (activeCategory) {
            const slideIndex = HERO_SLIDES.findIndex(slide => slide.id === activeCategory);
            if (slideIndex !== -1) {
                setCurrentSlide(slideIndex);
                setIsPaused(true); // Pause auto-rotation when user selects category
            }
        }
    }, [activeCategory]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    const slide = HERO_SLIDES[currentSlide];

    return (
        <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-24 pb-32 transition-colors">
            {/* Light Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-60 -left-20 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Column: Carousel Content */}
                    <div 
                        className="lg:w-3/5 text-left relative min-h-[500px] flex flex-col justify-center"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col items-start"
                            >
                                {/* Trust Badge */}
                                <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-2 mb-8">
                                    <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    <span className="text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-widest">
                                        {slide.badge}
                                    </span>
                                </div>

                                {/* Headline */}
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                                    {slide.headline} <br />
                                    <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                                        {slide.highlight}
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="text-xl text-stone-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed">
                                    {slide.desc}
                                </p>

                                {/* Search Bar (Static) - Only show on first slide or always? Keeping it always visible but below text for consistency or maybe remove search for cleaner carousel? 
                                    Let's keep the Search Input separate BELOW the carousel text essentially? 
                                    Actually, the user asked for "sliders in hero banner". 
                                    If we slide the search bar it might be jarring. 
                                    Let's slide the CTAs.
                                */}

                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                    <Link href={slide.primaryCta.href}>
                                        <Button size="lg" className="h-14 px-8 text-base font-bold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl border-0">
                                            {slide.primaryCta.text}
                                            {React.createElement(slide.primaryCta.icon, { className: "ml-2 w-5 h-5" })}
                                        </Button>
                                    </Link>
                                    <Link href={slide.secondaryCta.href}>
                                        <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:-translate-y-0.5 transition-all duration-300 rounded-xl shadow-sm">
                                            {slide.secondaryCta.text}
                                            {/* {React.createElement(slide.secondaryCta.icon, { className: "ml-2 w-5 h-5 opacity-50" })} */}
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Search Input - Static (Always available to not annoy users) */}
                        <div className="relative group max-w-xl mb-8">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <ArrowRight className="h-5 w-5 text-primary-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="What are you looking for? (Cards, Loans, Investments...)"
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10 transition-all font-medium text-lg shadow-sm hover:shadow-md"
                            />
                        </div>

                        {/* Slider Indicators */}
                        <div className="flex gap-2 mt-4 ml-1">
                            {HERO_SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        currentSlide === idx 
                                        ? "w-8 bg-primary-600 dark:bg-primary-400" 
                                        : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-primary-300"
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Dynamic Visuals */}
                    <div className="lg:w-2/5 w-full">
                        <HeroVisuals currentSlide={HERO_SLIDES[currentSlide].id} />
                    </div>
                </div>
            </div>
        </section>
    );
}
