"use client";

import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export default function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        // Load saved language preference
        const saved = localStorage.getItem('preferred_language');
        if (saved) {
            setCurrentLang(saved);
        }
    }, []);

    const handleLanguageChange = (langCode: string) => {
        setCurrentLang(langCode);
        localStorage.setItem('preferred_language', langCode);
        // You would typically trigger a re-render of content here
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }));
        }
    };

    const currentLabel = languages.find(l => l.code === currentLang)?.nativeName || "English";

    return (
        <Select value={currentLang} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36 border-slate-300">
                <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>{currentLabel}</span>
                </div>
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
