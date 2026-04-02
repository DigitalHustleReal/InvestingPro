
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Placeholder data for experts - In production this would come from the authors table
const EXPERTS = [
    {
        id: 0, // Top priority
        name: "Shiv P.", // User's name (inferred)
        role: "Founder & Editor",
        // Using a professional placeholder for now, user can replace with actual URL
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop", 
        bio: "Building India's most trusted financial platform. Here to help you make better decisions.",
        specialty: "Strategy"
    },
    {
        id: 1,
        name: "Rahul Sharma",
        role: "Senior Financial Analyst",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Analyzing credit markets for 10+ years. I help you find hidden rewards.",
        specialty: "Credit Cards"
    },
    {
        id: 2,
        name: "Priya Patel",
        role: "Investment Advisor",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Former banker turned educator. Simplifying mutual funds for everyone.",
        specialty: "Investments"
    },
    {
        id: 3,
        name: "Amit Verma",
        role: "Loan Specialist",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
        bio: "Helped 500+ families get their dream home. Ask me about EMI hacks.",
        specialty: "Loans"
    }
];

export default function ExpertBylineWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Rotate every 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % EXPERTS.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    if (!isMounted) return null;

    const expert = EXPERTS[currentIndex];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-lg">
                    <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Expert Verified
                </h3>
            </div>

            <div className="relative h-[280px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={expert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center text-center absolute inset-0"
                    >
                <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative z-10">
                        <Image 
                            src={expert.image} 
                            alt={expert.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 rounded-full border border-primary-200 dark:border-primary-800 scale-125 -z-0 animate-pulse-slow" />
                    
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm z-20">
                        <CheckCircle className="w-5 h-5 text-success-500 fill-white dark:fill-gray-900" />
                    </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {expert.name}
                </h4>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-3 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                    {expert.role}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 italic line-clamp-3">
                    "{expert.bio}"
                </p>

                <button 
                    onClick={() => {
                        // Trigger Tawk.to chat
                        if ((window as any).Tawk_API) {
                            (window as any).Tawk_API.maximize();
                        }
                    }}
                    className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 group"
                >
                    <div className="bg-white/20 p-1 rounded-full">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    Chat with Expert
                </button>
            </motion.div>
        </AnimatePresence>
            </div>
        </div>
    );
}
