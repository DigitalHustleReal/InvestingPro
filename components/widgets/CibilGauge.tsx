"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CibilGauge() {
    // Mock score animation on load
    const [score, setScore] = useState(300);
    const targetScore = 785; // Demo score

    useEffect(() => {
        const timer = setTimeout(() => {
            setScore(targetScore);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Calculate rotation: 300 = -90deg, 900 = 90deg
    const min = 300;
    const max = 900;
    const percentage = (score - min) / (max - min);
    const rotation = -90 + (percentage * 180);

    const getColor = (s: number) => {
        if (s >= 750) return "text-success-500 stroke-success-500";
        if (s >= 650) return "text-accent-500 stroke-accent-500";
        return "text-danger-500 stroke-danger-500";
    };

    const getLabel = (s: number) => {
        if (s >= 750) return "Excellent";
        if (s >= 650) return "Good";
        return "Needs Work";
    };

    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <CardContent className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-24 mb-4 overflow-hidden">
                    {/* Gauge Background */}
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                        
                        {/* Gauge Progress */}
                        <path 
                            d="M 20 100 A 80 80 0 0 1 180 100" 
                            fill="none" 
                            className={cn("transition-all duration-1000 ease-out", getColor(score))}
                            strokeWidth="20" 
                            strokeDasharray="251" // Circumference of semi-circle (PI * r) -> 3.14 * 80 ~= 251
                            strokeDashoffset={251 - (251 * percentage)}
                        />
                    </svg>
                    
                    {/* Score Text */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <span className={cn("text-3xl font-black transition-colors duration-500", getColor(score).replace('stroke-', ''))}>
                            {score}
                        </span>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">CIBIL Score</p>
                    <p className={cn("font-bold text-lg", getColor(score).replace('stroke-', ''))}>
                        {getLabel(score)}
                    </p>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs font-bold gap-1 rounded-xl">
                    Check Yours Free <ArrowUpRight className="w-3 h-3" />
                </Button>
            </CardContent>
        </Card>
    );
}
