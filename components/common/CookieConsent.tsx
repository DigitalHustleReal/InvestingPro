"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setTimeout(() => setShow(true), 2000);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShow(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'false');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        We use minimal cookies to personalize your research experience and optimize our asset models.
                    </p>
                    <button onClick={() => setShow(false)} className="text-slate-500 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex gap-3">
                    <Button
                        size="sm"
                        onClick={acceptCookies}
                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl h-10 border-0"
                    >
                        Got it
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={declineCookies}
                        className="flex-1 border-slate-700 text-slate-600 hover:bg-slate-800 rounded-xl h-10"
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
}
