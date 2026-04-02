"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Deadline {
    label: string;
    date: Date;
    description: string;
}

export default function TaxCountdown() {
    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number}>({ days: 0, hours: 0 });
    const [target, setTarget] = useState<Deadline | null>(null);

    useEffect(() => {
        // Indian Financial Deadlines Logic
        const now = new Date();
        const year = now.getFullYear();
        
        const deadlines: Deadline[] = [
            { label: "Advance Tax (Q4)", date: new Date(year, 2, 15), description: "Pay 100% of tax liability" }, // Mar 15
            { label: "ITR Filing (Individuals)", date: new Date(year, 6, 31), description: "Avoid late fee penalty" }, // Jul 31
            { label: "Advance Tax (Q1)", date: new Date(year, 5, 15), description: "15% of liability" }, // Jun 15
            { label: "Advance Tax (Q2)", date: new Date(year, 8, 15), description: "45% of liability" }, // Sep 15
            { label: "Advance Tax (Q3)", date: new Date(year, 11, 15), description: "75% of liability" }, // Dec 15
        ];

        // Find next deadline
        const nextDeadline = deadlines
            .map(d => {
                if (d.date < now) d.date.setFullYear(year + 1); // If passed, move to next year
                return d;
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

        setTarget(nextDeadline);

        // Calculate initial time left
        const calculateTimeLeft = () => {
            const diff = nextDeadline.date.getTime() - new Date().getTime();
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeLeft({ days, hours });
            }
        };
        
        // Calculate immediately
        calculateTimeLeft();
        
        // Update once per hour (days don't change every second)
        // 60 minutes * 60 seconds * 1000 ms = 3,600,000 ms
        const timer = setInterval(calculateTimeLeft, 3600000);

        return () => clearInterval(timer);
    }, []);

    if (!target) return null;

    return (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-accent-400" />
                    Tax Deadline Tracker
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-lg leading-tight mb-1">{target.label}</h4>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {target.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm min-w-[80px]">
                        <span className="block text-2xl font-black text-white">{timeLeft.days}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-600">Days Left</span>
                    </div>
                </div>
                <div className="mt-3 text-[10px] text-accent-300 bg-accent-500/10 px-2 py-1 rounded border border-accent-500/20 inline-block">
                    Tip: {target.description}
                </div>
            </CardContent>
        </Card>
    );
}
