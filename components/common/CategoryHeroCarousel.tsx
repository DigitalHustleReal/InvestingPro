"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface Slide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image?: string; // Optional image URL
    color: string; // Tailwind color class for background/accents
}

interface CategoryHeroCarouselProps {
    slides: Slide[];
    className?: string;
}

export default function CategoryHeroCarousel({ slides, className }: CategoryHeroCarouselProps) {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    if (!slides || slides.length === 0) return null;

    const slide = slides[current];

    return (
        <div className={cn("relative rounded-xl overflow-hidden bg-gray-900 text-white min-h-[400px] flex items-center", className)}>
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-r opacity-90 transition-colors duration-700", slide.color)} />
            
            {/* Content Container */}
            <div className="relative z-10 container px-8 md:px-12 grid md:grid-cols-2 gap-8 items-center py-10">
                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-500" key={slide.id}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                        <Star className="w-4 h-4 text-accent-300 fill-yellow-300" />
                        {slide.subtitle}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        {slide.title}
                    </h2>
                    <p className="text-lg text-white/90 max-w-md leading-relaxed">
                        {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-bold px-8 h-12 rounded-xl">
                            {slide.ctaText}
                        </Button>
                        <Button variant="outline" className="text-white dark:text-white border-white/30 dark:border-white/30 hover:bg-white/10 dark:hover:bg-white/10 h-12 px-6 rounded-xl">
                            Learn More
                        </Button>
                    </div>
                </div>

                {/* Right Side Visual (Mock ID Card or Illustration) */}
                <div className="hidden md:flex justify-center items-center animate-in zoom-in-50 fade-in duration-700 delay-100" key={`img-${slide.id}`}>
                    <div className="relative w-72 h-44 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl skew-y-3 rotate-3 flex items-center justify-center">
                        <span className="text-white/20 font-bold text-4xl tracking-widest uppercase">
                           {slide.title.split(' ')[0]}
                        </span>
                        {/* Decorative Circles */}
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20" />
                        <div className="absolute bottom-4 left-4 w-12 h-8 rounded bg-white/20" />
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                <button 
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 left-8 flex gap-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={cn("w-2 h-2 rounded-full transition-all", current === idx ? "bg-white w-6" : "bg-white/40 hover:bg-white/60")}
                    />
                ))}
            </div>
        </div>
    );
}
