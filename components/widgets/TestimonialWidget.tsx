
"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Placeholder data - In production this would come from a testimonials table
const TESTIMONIALS = [
    {
        id: 1,
        name: "Sneha G.",
        location: "Mumbai",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop",
        quote: "I finally cleared my dad's ₹5L debt using the consolidation loan recommended here. Life saver!",
        product: "Personal Loan"
    },
    {
        id: 2,
        name: "Arjun K.",
        location: "Bangalore",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop",
        quote: "Found a credit card that gives me 5% cashback on flights. Saved ₹20k on my last trip!",
        product: "Travel Credit Card"
    },
    {
        id: 3,
        name: "Meera R.",
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&h=200&auto=format&fit=crop",
        quote: "The SIP calculator showed me I could retire 5 years early. Started my investment today.",
        product: "Mutual Funds"
    }
];

export default function TestimonialWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Rotate every 8 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const testimonial = TESTIMONIALS[currentIndex];

    return (
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden mt-6">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                <Quote size={120} />
            </div>

            <div className="relative z-10">
                <h3 className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-4 border-b border-primary-700/50 pb-2 inline-block">
                    Real Stories
                </h3>

                <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-lg font-medium leading-relaxed mb-6 font-serif opacity-90">
                        "{testimonial.quote}"
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-400">
                            <Image 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                {testimonial.name}
                            </p>
                            <p className="text-xs text-primary-300">
                                {testimonial.location} • {testimonial.product}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
