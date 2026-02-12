"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowRight, TrendingUp, Shield, Calculator, CreditCard, Landmark, BookOpen, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { STAT_STRINGS } from "@/lib/constants/platform-stats";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, BreathingBlob } from "@/components/ui/motion";

import HeroVisuals from "./HeroVisuals";
import { useNavigation } from "@/contexts/NavigationContext";
import DecisionCTA from '@/components/common/DecisionCTA';

// ... (HERO_SLIDES constant remains unchanged) ...

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
            {/* Light Premium Background Effects (Breathing) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <BreathingBlob className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[120px]" />
                <BreathingBlob className="absolute top-60 -left-20 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-[100px]" />
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
                                className="flex flex-col items-start"
                                // Use StaggerContainer logic via motion props manually since AnimatePresence needs direct child
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                                    exit: { opacity: 0, transition: { duration: 0.2 } }
                                }}
                            >
                                {/* Trust Badge */}
                                <StaggerItem>
                                    <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-2 mb-8">
                                        <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                        <span className="text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-widest">
                                            {slide.badge}
                                        </span>
                                    </div>
                                </StaggerItem>

                                {/* Headline */}
                                <StaggerItem>
                                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                                        {slide.headline} <br />
                                        <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                                            {slide.highlight}
                                        </span>
                                    </h1>
                                </StaggerItem>

                                {/* Description */}
                                <StaggerItem>
                                    <p className="text-xl text-slate-600 dark:text-slate-600 mb-10 max-w-2xl leading-relaxed">
                                        {slide.desc}
                                    </p>
                                </StaggerItem>

                                {/* Search Bar (Static) - Only show on first slide or always? Keeping it always visible but below text for consistency or maybe remove search for cleaner carousel? 
                                    Let's keep the Search Input separate BELOW the carousel text essentially? 
                                    Actually, the user asked for "sliders in hero banner". 
                                    If we slide the search bar it might be jarring. 
                                    Let's slide the CTAs.
                                */}

                                {/* Decision-Focused CTAs */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                    <DecisionCTA
                                        text={slide.primaryCta.text}
                                        href={slide.primaryCta.href}
                                        variant="primary"
                                        size="lg"
                                        className="h-14 px-8 text-base font-bold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl border-0"
                                        showIcon={true}
                                    />
                                    <DecisionCTA
                                        text={slide.secondaryCta.text}
                                        href={slide.secondaryCta.href}
                                        variant="outline"
                                        size="lg"
                                        className="h-14 px-8 text-base font-bold bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:-translate-y-0.5 transition-all duration-300 rounded-xl shadow-sm"
                                        showIcon={false}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Search Input - Static (Always available to not annoy users) */}
                        <div className="relative group max-w-xl mb-8">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-primary-700 dark:text-primary-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="What are you looking for? (Cards, Loans, Investments...)"
                                className="w-full h-16 pl-14 pr-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10 transition-all font-medium text-lg shadow-sm hover:shadow-md"
                            />
                        </div>

                        {/* Slider Controls - Indicators + Navigation Arrows (UI/UX Phase 3) */}
                        <div className="flex items-center gap-4 mt-4">
                            {/* Prev Button */}
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                                className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm hover:shadow-md"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            {/* Indicators */}
                            <div className="flex gap-2">
                                {HERO_SLIDES.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setCurrentSlide(idx);
                                            setIsPaused(true);
                                        }}
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            currentSlide === idx 
                                            ? "w-8 bg-primary-600 dark:bg-primary-400" 
                                            : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-primary-300 dark:hover:bg-primary-600"
                                        }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                        aria-current={currentSlide === idx ? 'true' : 'false'}
                                    />
                                ))}
                            </div>
                            
                            {/* Next Button */}
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                                className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm hover:shadow-md"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            
                            {/* Pause/Play indicator */}
                            <span className="text-xs text-slate-600 dark:text-slate-500 ml-2">
                                {isPaused ? '⏸ Paused' : '▶ Auto'}
                            </span>
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
