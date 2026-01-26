"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Shield, Users, TrendingUp, Award } from 'lucide-react';

// Animated counter component
function AnimatedCounter({ 
    value, 
    suffix = "", 
    prefix = "",
    duration = 2000 
}: { 
    value: number; 
    suffix?: string; 
    prefix?: string;
    duration?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setDisplayValue(Math.floor(easeOutQuart * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, value, duration]);

    return (
        <span ref={ref}>
            {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
        </span>
    );
}

export default function TrustBar() {
    const stats = [
        {
            label: "Community Members",
            value: 50000,
            displaySuffix: "+",
            displayPrefix: "",
            formattedValue: "50k+",
            icon: Users,
            color: "text-primary-600",
            bg: "bg-primary-50 dark:bg-primary-900/10"
        },
        {
            label: "Credit Value Tracked",
            value: 500,
            displaySuffix: "Cr+",
            displayPrefix: "₹",
            formattedValue: "₹500Cr+",
            icon: TrendingUp,
            color: "text-success-600",
            bg: "bg-success-50 dark:bg-success-900/10"
        },
        {
            label: "Partner Banks",
            value: 50,
            displaySuffix: "+",
            displayPrefix: "",
            formattedValue: "50+",
            icon: Shield,
            color: "text-accent-600",
            bg: "bg-accent-50 dark:bg-accent-900/10"
        },
        {
            label: "Expert Reviews",
            value: 1000,
            displaySuffix: "+",
            displayPrefix: "",
            formattedValue: "1000+",
            icon: Award,
            color: "text-secondary-600",
            bg: "bg-secondary-50 dark:bg-secondary-900/10"
        }
    ];

    return (
        <section className="py-8 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-4 group"
                        >
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">
                                    <AnimatedCounter 
                                        value={stat.value} 
                                        prefix={stat.displayPrefix}
                                        suffix={stat.displaySuffix}
                                    />
                                </h4>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Data Source Attribution - Builds trust through transparency */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            Data from AMFI & RBI
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-500" />
                            Independent Research
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            Updated Daily
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
